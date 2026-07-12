'use strict';

const { logger } = require('../utils/logger');

/**
 * Logs each incoming HTTP request with method, URL, and response time.
 * Complements morgan (which logs the request line), but this one
 * logs at the application level via winston.
 */
function requestLogger(req, _res, next) {
  logger.http(`→ ${req.method} ${req.originalUrl}`);
  next();
}

module.exports = { requestLogger };
