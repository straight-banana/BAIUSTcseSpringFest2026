// Central API client — talks to the Express backend.
// All responses follow { success, message, data } envelope.

const BASE_URL =
  import.meta.env.VITE_API_URL ||
  import.meta.env.VITE_API_BASE_URL ||
  'http://localhost:5000/api/v1';

export const API_BASE_URL = BASE_URL;
const TOKEN_KEY = 'token';

export function getToken() {
  try { return localStorage.getItem(TOKEN_KEY); } catch { return null; }
}
export function setToken(t) {
  try { t ? localStorage.setItem(TOKEN_KEY, t) : localStorage.removeItem(TOKEN_KEY); } catch { /* noop */ }
}
export function clearToken() { setToken(null); }

export class ApiError extends Error {
  constructor(message, status, payload) {
    super(message);
    this.status = status;
    this.payload = payload;
  }
}

async function request(path, { method = 'GET', body, headers = {}, isForm = false, ...rest } = {}) {
  const token = getToken();
  const finalHeaders = {
    ...(isForm ? {} : { 'Content-Type': 'application/json' }),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...headers,
  };
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: finalHeaders,
    body: isForm ? body : body != null ? JSON.stringify(body) : undefined,
    ...rest,
  });

  let data = null;
  try { data = await res.json(); } catch { /* non-json */ }

  if (!res.ok || (data && data.success === false)) {
    const msg = (data && (data.message || data.error)) || `Request failed (${res.status})`;
    throw new ApiError(msg, res.status, data);
  }
  return data ?? { success: true, data: null };
}

const api = {
  get: (path, opts) => request(path, { ...opts, method: 'GET' }),
  post: (path, body, opts) => request(path, { ...opts, method: 'POST', body }),
  patch: (path, body, opts) => request(path, { ...opts, method: 'PATCH', body }),
  put: (path, body, opts) => request(path, { ...opts, method: 'PUT', body }),
  del: (path, opts) => request(path, { ...opts, method: 'DELETE' }),
  upload: (path, formData, opts) =>
    request(path, { ...opts, method: 'POST', body: formData, isForm: true }),
};

export default api;
