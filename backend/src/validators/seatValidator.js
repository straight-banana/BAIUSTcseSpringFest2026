'use strict';

const { body } = require('express-validator');

const seatPlanValidator = [
  body('students')
    .isArray({ min: 1 }).withMessage('students must be a non-empty array'),

  body('students.*.name')
    .trim()
    .notEmpty().withMessage('Each student must have a name'),

  body('students.*.rollNumber')
    .trim()
    .notEmpty().withMessage('Each student must have a rollNumber'),

  body('students.*.height')
    .isFloat({ min: 50, max: 250 })
    .withMessage('Height must be a number between 50 and 250 (cm)'),

  body('gridCols')
    .optional()
    .isInt({ min: 2, max: 10 })
    .withMessage('gridCols must be between 2 and 10'),

  body('planName')
    .optional()
    .trim()
    .isLength({ max: 100 }).withMessage('Plan name too long'),
];

module.exports = { seatPlanValidator };
