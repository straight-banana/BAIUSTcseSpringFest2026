'use strict';

const { body } = require('express-validator');

const registerValidator = [
  body('rollNumber')
    .trim()
    .notEmpty().withMessage('Roll number is required')
    .isLength({ max: 20 }).withMessage('Roll number too long'),

  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2, max: 100 }).withMessage('Name must be 2-100 characters'),

  body('password')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),

  body('role')
    .optional()
    .isIn(['STUDENT', 'ADMIN']).withMessage('Role must be STUDENT or ADMIN'),
];

const loginValidator = [
  body('rollNumber')
    .trim()
    .notEmpty().withMessage('Roll number is required'),

  body('password')
    .notEmpty().withMessage('Password is required'),
];

module.exports = { registerValidator, loginValidator };
