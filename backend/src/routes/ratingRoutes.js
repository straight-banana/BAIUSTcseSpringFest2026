'use strict';

const express = require('express');
const ratingController = require('../controllers/ratingController');
const auth = require('../middleware/auth');

const router = express.Router();

// Peer-to-peer actions
router.get('/roster', auth({ roles: ['STUDENT'] }), ratingController.getRoster);
router.get('/my-rated', auth({ roles: ['STUDENT'] }), ratingController.getMyRated);
router.post('/rate/:id', auth({ roles: ['STUDENT'] }), ratingController.submitRating);

// Public / general
router.get('/leaderboard', ratingController.getLeaderboard);
router.get('/profile/:id', ratingController.getStudentProfile);
router.get('/profile/:id/comments', ratingController.getPublicComments);

// Moderation
router.get('/moderate', auth({ roles: ['ADMIN'] }), ratingController.getModerationQueue);
router.patch('/moderate/:id', auth({ roles: ['ADMIN'] }), ratingController.moderateRating);
router.get('/analytics', auth({ roles: ['ADMIN'] }), ratingController.getAnalytics);

module.exports = router;
