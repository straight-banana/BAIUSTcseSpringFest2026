'use strict';

const { body } = require('express-validator');

const createComplaintValidator = [
  body('category')
    .notEmpty().withMessage('Category is required')
    .isIn(['TIFFIN_THEFT', 'BRIBE', 'LARGE_SYLLABUS', 'OTHER'])
    .withMessage('Invalid category'),

  body('description')
    .trim()
    .notEmpty().withMessage('Description is required')
    .isLength({ min: 10, max: 2000 })
    .withMessage('Description must be 10-2000 characters'),

  body('anonymous')
    .optional()
    .isBoolean().withMessage('anonymous must be true or false'),
];

const updateStatusValidator = [
  body('status')
    .notEmpty().withMessage('Status is required')
    .isIn(['PENDING', 'UNDER_REVIEW', 'INVESTIGATING', 'RESOLVED', 'REJECTED'])
    .withMessage('Invalid status'),
];

module.exports = { createComplaintValidator, updateStatusValidator };
