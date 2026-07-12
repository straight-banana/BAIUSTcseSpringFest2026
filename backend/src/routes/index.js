'use strict';

const express = require('express');

const authRoutes = require('./authRoutes');
const complaintRoutes = require('./complaintRoutes');
const seatRoutes = require('./seatRoutes');
const sosRoutes = require('./sosRoutes');
const trackerRoutes = require('./trackerRoutes');
const ratingRoutes = require('./ratingRoutes');
const candidateRoutes = require('./candidateRoutes');
const electionRoutes = require('./electionRoutes');
const trustRoutes = require('./trustRoutes');
const dashboardRoutes = require('./dashboardRoutes');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/complaints', complaintRoutes);
router.use('/seats', seatRoutes);
router.use('/sos', sosRoutes);
router.use('/tracker', trackerRoutes);
router.use('/ratings', ratingRoutes);
router.use('/candidates', candidateRoutes);
router.use('/elections', electionRoutes);
router.use('/trust', trustRoutes);
router.use('/dashboard', dashboardRoutes);

module.exports = router;
