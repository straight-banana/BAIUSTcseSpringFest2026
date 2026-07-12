'use strict';

const { body } = require('express-validator');

const addTrackerValidator = [
  body('type')
    .notEmpty().withMessage('Type is required')
    .isIn(['WASHROOM_TAX', 'STOLEN_FOOD'])
    .withMessage('Type must be WASHROOM_TAX or STOLEN_FOOD'),

  body('amount')
    .isFloat({ min: 0.01 }).withMessage('Amount must be a positive number'),

  body('description')
    .trim()
    .notEmpty().withMessage('Description is required')
    .isLength({ max: 500 }).withMessage('Description too long'),

  body('date')
    .optional()
    .isISO8601().withMessage('Date must be a valid ISO 8601 date'),
];

module.exports = { addTrackerValidator };
