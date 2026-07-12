'use strict';

const express = require('express');
const electionController = require('../controllers/electionController');
const auth = require('../middleware/auth');

const router = express.Router();

// General visibility
router.get('/active', electionController.getActiveElection);
router.get('/', electionController.listElections);
router.get('/history', electionController.getHistory);

router.get('/:id/candidates', electionController.getCandidates);
router.get('/:id/candidates/compare', electionController.compareCandidates);
router.get('/:id/candidates/:candidateId', electionController.getCandidateProfile);

router.get('/:id/timeline', electionController.getTimeline);
router.get('/:id/results', auth(), electionController.getResults); // service enforces published/admin

// Student Actions
router.post('/:id/vote', auth({ roles: ['STUDENT'] }), electionController.castVote);
router.get('/:id/has-voted', auth({ roles: ['STUDENT'] }), electionController.hasVoted);

// Admin Actions
router.post('/', auth({ roles: ['ADMIN'] }), electionController.createElection);
router.post('/:id/candidates', auth({ roles: ['ADMIN'] }), electionController.addCandidate);
router.get('/:id/admin', auth({ roles: ['ADMIN'] }), electionController.getAdminView);
router.patch('/:id/status', auth({ roles: ['ADMIN'] }), electionController.updateStatus);
router.get('/:id/activity', auth({ roles: ['ADMIN'] }), electionController.getActivityLog);

module.exports = router;
