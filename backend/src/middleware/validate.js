'use strict';

const { validationResult } = require('express-validator');
const { errorResponse } = require('../utils/apiResponse');

/**
 * Runs express-validator checks. If validation fails, returns 422.
 * Place AFTER the validator chain array in a route definition:
 *
 *   router.post('/path', [...validatorChain], validate, handler)
 */
function validate(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const messages = errors.array().map((e) => ({
      field: e.path,
      message: e.msg,
    }));
    return res.status(422).json({
      ...errorResponse('Validation failed', 422),
      errors: messages,
    });
  }
  next();
}

module.exports = { validate };
