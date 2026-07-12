'use strict';

const express = require('express');
const candidateController = require('../controllers/candidateController');
const auth = require('../middleware/auth');

const router = express.Router();

// Captain roster
router.get('/roster', auth({ roles: ['ADMIN'] }), candidateController.getRoster);
router.patch('/roster/:studentId/captain', auth({ roles: ['ADMIN'] }), candidateController.setCaptain);
router.get('/captains', candidateController.getCaptains);

router.get('/history', auth({ roles: ['ADMIN'] }), candidateController.getHistory);

router.get('/rounds', auth({ roles: ['ADMIN', 'CAPTAIN'] }), candidateController.listRounds);
router.post('/rounds', auth({ roles: ['ADMIN'] }), candidateController.createRound);
router.get('/rounds/:id', auth({ roles: ['ADMIN', 'CAPTAIN'] }), candidateController.getRound);
router.patch('/rounds/:id/weights', auth({ roles: ['ADMIN'] }), candidateController.updateWeights);

router.get('/rounds/:id/candidates', auth({ roles: ['ADMIN', 'CAPTAIN'] }), candidateController.getRankedCandidates);
router.get('/rounds/:id/candidates/compare', auth({ roles: ['ADMIN', 'CAPTAIN'] }), candidateController.compare);
router.get('/rounds/:id/analytics', auth({ roles: ['ADMIN'] }), candidateController.getAnalytics);

router.get('/rounds/:id/candidates/:userId', auth({ roles: ['ADMIN', 'CAPTAIN'] }), candidateController.getProfile);
router.put('/rounds/:id/candidates/:userId', auth({ roles: ['ADMIN'] }), candidateController.upsertProfile);
router.post('/rounds/:id/candidates/:userId/override', auth({ roles: ['ADMIN'] }), candidateController.submitOverride);

module.exports = router;
