'use strict';

/**
 * Standard API response envelopes.
 * Every endpoint returns { success, message, data } or { success, message }.
 */

function successResponse(data, message = 'Success') {
  return { success: true, message, data };
}

function errorResponse(message = 'An error occurred', statusCode = 500) {
  return { success: false, message, statusCode };
}

module.exports = { successResponse, errorResponse };
