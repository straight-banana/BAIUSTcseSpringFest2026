'use strict';

const express = require('express');
const complaintController = require('../controllers/complaintController');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

router.post('/', auth({ optional: true }), upload.single('image'), complaintController.createComplaint);
router.get('/', auth(), complaintController.listComplaints);
router.get('/my', auth(), complaintController.getMyComplaints);
router.get('/dashboard', auth({ roles: ['ADMIN', 'CAPTAIN'] }), complaintController.getDashboard);

router.get('/:id', auth(), complaintController.getComplaint);
router.put('/:id/image', auth(), upload.single('image'), complaintController.uploadImage);
router.post('/:id/image', auth(), upload.single('image'), complaintController.uploadComplaintImage);
router.get('/:id/history', auth(), complaintController.getHistory);
router.patch('/:id/status', auth({ roles: ['ADMIN', 'CAPTAIN'] }), complaintController.updateStatus);
router.patch('/:id/warn', auth({ roles: ['ADMIN', 'CAPTAIN'] }), complaintController.addWarning);
router.post('/:id/warning', auth({ roles: ['ADMIN', 'CAPTAIN'] }), complaintController.addWarning);
router.delete('/:id', auth({ roles: ['ADMIN'] }), complaintController.deleteComplaint);

module.exports = router;
