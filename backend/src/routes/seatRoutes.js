'use strict';

const express = require('express');
const seatController = require('../controllers/seatController');
const auth = require('../middleware/auth');

const router = express.Router();

router.post('/', auth({ roles: ['ADMIN', 'CAPTAIN'] }), seatController.generatePlan);
router.get('/latest', seatController.getLatestPlan);
router.get('/', seatController.getAllPlans);
router.get('/:id', seatController.getPlan);
router.delete('/:id', auth({ roles: ['ADMIN'] }), seatController.deletePlan);

// Constraints
router.get('/:id/constraints', seatController.getConstraints);
router.post('/:id/constraints', auth({ roles: ['ADMIN', 'CAPTAIN'] }), seatController.addConstraint);

// Line of sight
router.get('/:id/line-of-sight', seatController.getLineOfSight);

// Move manual
router.patch('/:id/seats/:seatId/move', auth({ roles: ['ADMIN', 'CAPTAIN'] }), seatController.moveSeat);

module.exports = router;
