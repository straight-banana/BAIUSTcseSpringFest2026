// Direct client to the Anti-Kuddus AI service on Railway.
// Endpoints are fixed by the provider — don't invent new ones here.
// Env override: VITE_AKP_API_URL (no trailing slash).

const RAW_BASE =
  import.meta.env.VITE_AKP_API_URL || 'https://skibidikudus.up.railway.app';
export const AKP_API_BASE = RAW_BASE.replace(/\/$/, '');

// Defaults — tuned for a Railway-hosted FastAPI cold-start.
const DEFAULT_TIMEOUT_MS = 45_000;
const DEFAULT_RETRIES = 2;         // total attempts = retries + 1
const RETRY_BASE_DELAY_MS = 600;   // exponential backoff base
const RETRY_STATUS = new Set([408, 425, 429, 500, 502, 503, 504]);

export class AkpApiError extends Error {
  constructor(message, { status = 0, code = 'error', fieldErrors = null, raw = null, cause = null } = {}) {
    super(message);
    this.name = 'AkpApiError';
    this.status = status;
    this.code = code;              // 'network' | 'timeout' | 'validation' | 'server' | 'client' | 'parse' | 'unknown'
    this.fieldErrors = fieldErrors;
    this.raw = raw;
    if (cause) this.cause = cause;
  }
  // Concise, user-facing message safe to surface in a toast.
  toUserMessage() {
    switch (this.code) {
      case 'network': return 'Could not reach the AI service. Check your connection and try again.';
      case 'timeout': return 'The AI service took too long to respond. Please retry.';
      case 'validation': return this.message || 'Please fix the highlighted fields.';
      case 'server': return 'The AI service is having trouble right now. Please retry shortly.';
      case 'client': return this.message || 'Request rejected by the AI service.';
      case 'parse': return 'Received an unexpected response from the AI service.';
      default: return this.message || 'Something went wrong.';
    }
  }
}

// FastAPI 422 shape: { detail: [{ loc, msg, type, ... }] }
function parseValidationError(payload) {
  const items = Array.isArray(payload?.detail) ? payload.detail : [];
  const fieldErrors = {};
  const messages = [];
  for (const item of items) {
    const loc = Array.isArray(item?.loc) ? item.loc : [];
    const field = loc.filter((p) => p !== 'body' && p !== 'query').join('.') || 'input';
    const msg = item?.msg || 'Invalid value';
    fieldErrors[field] = msg;
    messages.push(`${field}: ${msg}`);
  }
  return { message: messages.join(' · ') || 'Validation failed', fieldErrors };
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// Merge caller AbortSignal with our internal (per-attempt) controller.
// Returns an unlink function so we don't leak listeners across retries.
function linkSignals(external, internal) {
  if (!external) return () => {};
  if (external.aborted) { internal.abort(external.reason); return () => {}; }
  const onAbort = () => internal.abort(external.reason);
  external.addEventListener('abort', onAbort);
  return () => external.removeEventListener('abort', onAbort);
}

export async function akpFetch(
  path,
  { method = 'GET', body, signal, headers = {}, timeoutMs = DEFAULT_TIMEOUT_MS, retries = DEFAULT_RETRIES } = {}
) {
  const url = `${AKP_API_BASE}${path}`;
  const isRetriable = method === 'GET' || method === 'POST'; // our endpoints are idempotent for retries

  let attempt = 0;
  let lastError;

  while (attempt <= retries) {
    // Per-attempt controller so timeouts don't poison later retries.
    const controller = new AbortController();
    const unlink = linkSignals(signal, controller);
    const timer = setTimeout(() => {
      controller.abort(new DOMException('Timeout', 'TimeoutError'));
    }, timeoutMs);

    try {
      let res;
      try {
        res = await fetch(url, {
          method,
          headers: { 'Content-Type': 'application/json', Accept: 'application/json', ...headers },
          body: body != null ? JSON.stringify(body) : undefined,
          signal: controller.signal,
        });
      } catch (e) {
        // Caller-driven abort: bubble up untouched.
        if (signal?.aborted) throw e;
        // Our own timeout.
        if (e?.name === 'AbortError' || e?.name === 'TimeoutError') {
          throw new AkpApiError('The AI service timed out.', { code: 'timeout', cause: e });
        }
        throw new AkpApiError('Network error — could not reach AI service.', { code: 'network', cause: e });
      }

      let payload = null;
      try { payload = await res.json(); } catch { /* non-json */ }

      if (res.ok) return payload;

      if (res.status === 422) {
        const { message, fieldErrors } = parseValidationError(payload);
        throw new AkpApiError(message, { status: 422, code: 'validation', fieldErrors, raw: payload });
      }

      const msg =
        (typeof payload?.detail === 'string' && payload.detail) ||
        payload?.message ||
        `Request failed (${res.status})`;

      const category = res.status >= 500 ? 'server' : 'client';
      const err = new AkpApiError(msg, { status: res.status, code: category, raw: payload });

      // Retry transient upstream failures.
      if (isRetriable && RETRY_STATUS.has(res.status) && attempt < retries) {
        lastError = err;
      } else {
        throw err;
      }
    } catch (e) {
      // Caller aborted the request — bubble the AbortError up unchanged.
      if (signal?.aborted) throw e;
      if (e instanceof AkpApiError) {
        if (e.code === 'validation' || e.code === 'client') throw e;
        // network/timeout/server — retry if attempts remain.
        if (!isRetriable || attempt >= retries) throw e;
        lastError = e;
      } else {
        if (attempt >= retries) throw e;
        lastError = e;
      }
    } finally {
      clearTimeout(timer);
      unlink();
    }

    // Backoff before next attempt.
    const delay = RETRY_BASE_DELAY_MS * Math.pow(2, attempt) + Math.random() * 200;
    await sleep(delay);
    attempt += 1;
  }

  // Should never reach here, but stay defensive.
  throw lastError || new AkpApiError('Unknown error', { code: 'unknown' });
}
