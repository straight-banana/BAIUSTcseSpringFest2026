'use strict';

const express = require('express');
const trustController = require('../controllers/trustController');
const auth = require('../middleware/auth');

const router = express.Router();

// Admin-wide aggregate views
router.get('/dashboard', auth({ roles: ['ADMIN'] }), trustController.getDashboard);
router.get('/flags', auth({ roles: ['ADMIN'] }), trustController.getAllFlags);

// Publicly viewable graph properties (safe abstraction)
router.get('/:userId/score', trustController.getTrustScore);
router.get('/:userId/flags', trustController.getUnresolvedFlags);

// Flag management
router.post('/:userId/flags', auth({ roles: ['ADMIN', 'CAPTAIN'] }), trustController.createFlag);
router.patch('/flags/:flagId/resolve', auth({ roles: ['ADMIN'] }), trustController.resolveFlag);

module.exports = router;
