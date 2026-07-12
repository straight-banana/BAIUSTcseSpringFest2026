'use strict';

const express = require('express');
const authController = require('../controllers/authController');
const { validateSchema } = require('../middleware/validator');
const Joi = require('joi');
const auth = require('../middleware/auth');

const router = express.Router();

const registerSchema = Joi.object({
  rollNumber: Joi.string().required(),
  name: Joi.string().required(),
  password: Joi.string().min(6).required(),
  // Captaincy is not a signup-time role — it's an isCaptain flag an admin sets later
  // via PATCH /candidates/roster/:studentId/captain. STUDENT/ADMIN are the only
  // valid values in the Role enum (see db/schema.prisma).
  role: Joi.string().valid('STUDENT', 'ADMIN', 'CAPTAIN').insensitive().optional(),
  class: Joi.string().optional(),
  className: Joi.string().optional(),
  section: Joi.string().optional(),
  height: Joi.number().optional(),
  dateOfBirth: Joi.date().iso().optional(),
  dob: Joi.date().iso().optional(),
  hasVisionProblem: Joi.boolean().optional(),
  hasHearingProblem: Joi.boolean().optional(),
  vision: Joi.string().optional(),
  hearing: Joi.string().optional(),
});

const loginSchema = Joi.object({
  rollNumber: Joi.string().required(),
  password: Joi.string().required(),
});

const refreshSchema = Joi.object({
  refreshToken: Joi.string().required(),
});

const updateProfileSchema = Joi.object({
  name: Joi.string().optional(),
  class: Joi.string().optional(),
  section: Joi.string().optional(),
  height: Joi.number().optional(),
  dateOfBirth: Joi.date().iso().optional(),
  hasVisionProblem: Joi.boolean().optional(),
  hasHearingProblem: Joi.boolean().optional(),
});

router.post('/register', validateSchema(registerSchema), authController.register);
router.post('/login', validateSchema(loginSchema), authController.login);
router.post('/refresh', validateSchema(refreshSchema), authController.refreshToken);
router.post('/logout', auth(), authController.logout);

router.get('/me', auth(), authController.getMe);
router.get('/profile/:id', auth(), authController.getProfile);
router.put('/profile/:id', auth(), validateSchema(updateProfileSchema), authController.updateProfile);

module.exports = router;
