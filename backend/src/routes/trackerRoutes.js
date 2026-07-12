'use strict';

const express = require('express');
const trackerController = require('../controllers/trackerController');
const auth = require('../middleware/auth');

const router = express.Router();

router.post('/', auth({ optional: true }), trackerController.addEntry);
router.get('/', auth({ optional: true }), trackerController.listEntries);
router.get('/summary', auth({ optional: true }), trackerController.getSummary);
router.get('/:id', trackerController.getEntry);
router.patch('/:id/status', auth({ roles: ['ADMIN', 'CAPTAIN'] }), trackerController.updateStatus);
router.delete('/:id', auth({ roles: ['ADMIN'] }), trackerController.deleteEntry);

router.post('/entries', auth({ optional: true }), trackerController.addEntry);
router.get('/entries', auth({ optional: true }), trackerController.listEntries);
router.get('/entries/summary', auth({ optional: true }), trackerController.getSummary);
router.get('/entries/:id', trackerController.getEntry);
router.patch('/entries/:id/status', auth({ roles: ['ADMIN', 'CAPTAIN'] }), trackerController.updateStatus);
router.delete('/entries/:id', auth({ roles: ['ADMIN'] }), trackerController.deleteEntry);

router.get('/budgets', trackerController.getBudgets);
router.get('/menu', trackerController.getMenu);
router.post('/menu', auth({ roles: ['ADMIN'] }), trackerController.upsertMenu);

module.exports = router;
