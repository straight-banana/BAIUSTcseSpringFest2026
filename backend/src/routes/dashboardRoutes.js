'use strict';

const express = require('express');
const dashboardController = require('../controllers/dashboardController');
const auth = require('../middleware/auth');

const router = express.Router();

// Dashboard general
router.get('/stats', auth(), dashboardController.getStats);
router.get('/activity', auth(), dashboardController.getActivity);
router.get('/charts', auth({ roles: ['ADMIN', 'CAPTAIN'] }), dashboardController.getCharts);

// Notifications (personal)
router.get('/notifications', auth(), dashboardController.getNotifications);
router.patch('/notifications/mark-all-read', auth(), dashboardController.markAllRead);
router.patch('/notifications/:id/read', auth(), dashboardController.markRead);

module.exports = router;
