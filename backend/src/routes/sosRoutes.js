'use strict';

const express = require('express');
const sosController = require('../controllers/sosController');
const auth = require('../middleware/auth');

const router = express.Router();

router.post('/', auth({ optional: true }), sosController.triggerAlert);
router.get('/active', sosController.getActiveAlerts);
router.get('/', sosController.listAlerts);
router.patch('/:id/claim', auth({ roles: ['ADMIN', 'CAPTAIN'] }), sosController.claimAlert);
router.patch('/:id/resolve', auth({ roles: ['ADMIN', 'CAPTAIN'] }), sosController.resolveAlert);

router.get('/locations', sosController.getLocations);
router.get('/analytics', auth({ roles: ['ADMIN'] }), sosController.getAnalytics);

module.exports = router;
