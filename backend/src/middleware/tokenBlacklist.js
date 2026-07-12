'use strict';

/**
 * In-memory token blacklist for logged-out tokens.
 * Tokens auto-expire when their JWT exp is reached.
 */
const blacklist = new Set();

/** Add a token to the blacklist. */
function revokeToken(token, expiresAt) {
  blacklist.add(token);
  // Auto-remove when the token would have naturally expired
  const ttlMs = expiresAt ? (expiresAt * 1000 - Date.now()) : 7 * 24 * 60 * 60 * 1000;
  if (ttlMs > 0) {
    setTimeout(() => blacklist.delete(token), ttlMs);
  }
}

/** Check if a token is blacklisted. */
function isRevoked(token) {
  return blacklist.has(token);
}

module.exports = { blacklist, revokeToken, isRevoked };
