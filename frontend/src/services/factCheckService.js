import { akpFetch } from './aiApi.js';

// POST /api/v1/fact-check/search — free-text query against the rulebook index.
// The API has NO server-side filter field; filter by chapter client-side.
export async function searchRules(query, { signal } = {}) {
  return akpFetch('/api/v1/fact-check/search', {
    method: 'POST',
    body: { query: String(query ?? '').trim() },
    signal,
  });
}

// POST /api/v1/fact-check/verify — returns a verdict for a single claim.
// Contract note: response.status is the literal string '[TRUE]' or '[FALSE]'
// (bracketed). matched_rules may be missing — guard for undefined.
export async function verifyClaim(claim, { signal } = {}) {
  return akpFetch('/api/v1/fact-check/verify', {
    method: 'POST',
    body: { claim: String(claim ?? '').trim() },
    signal,
  });
}

export const VERDICT = { TRUE: '[TRUE]', FALSE: '[FALSE]' };
export const isTrueVerdict = (status) => status === VERDICT.TRUE;
export const isFalseVerdict = (status) => status === VERDICT.FALSE;
