'use strict';

/**
 * Wraps an async route handler so that any thrown error
 * is forwarded to Express's next() → global errorHandler.
 *
 * Usage:
 *   router.get('/path', wrap(async (req, res) => { ... }))
 */
const wrap = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = { wrap };
