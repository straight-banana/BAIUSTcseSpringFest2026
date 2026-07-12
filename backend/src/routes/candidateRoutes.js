'use strict';

const express = require('express');
const candidateController = require('../controllers/candidateController');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/roster', auth({ roles: ['ADMIN', 'CAPTAIN'] }), candidateController.getRoster);
router.get('/roster/:id/captain', auth({ roles: ['ADMIN'] }), candidateController.getStudentCaptainStatus);
router.get('/captains', auth({ roles: ['ADMIN'] }), candidateController.getCaptainRoster);

router.get('/recommendations/rounds', auth({ roles: ['ADMIN', 'CAPTAIN'] }), candidateController.listRounds);
router.get('/recommendations/rounds/:id', auth({ roles: ['ADMIN', 'CAPTAIN'] }), candidateController.getRound);
router.get('/recommendations/rounds/:id/candidates', auth({ roles: ['ADMIN', 'CAPTAIN'] }), candidateController.getRankedCandidates);
router.get('/recommendations/rounds/:id/candidates/:userId', auth({ roles: ['ADMIN', 'CAPTAIN'] }), candidateController.getProfile);
router.post('/recommendations/rounds/:id/candidates/:userId/override', auth({ roles: ['ADMIN'] }), candidateController.submitOverride);

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
