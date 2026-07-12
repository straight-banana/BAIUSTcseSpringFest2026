'use strict';

const ratingService = require('../services/ratingService');

async function getRoster(req, res, next) {
  try {
    const roster = await ratingService.getRoster(req.user.id);
    res.json({ status: 'success', data: roster });
  } catch (error) {
    next(error);
  }
}

async function getStudentProfile(req, res, next) {
  try {
    const profile = await ratingService.getStudentProfile(req.params.id);
    res.json({ status: 'success', data: profile });
  } catch (error) {
    next(error);
  }
}

async function submitRating(req, res, next) {
  try {
    const rating = await ratingService.submitRating({
      raterId: req.user.id,
      rateeId: req.params.id,
      ...req.body
    });
    res.status(201).json({ status: 'success', data: rating });
  } catch (error) {
    next(error);
  }
}

async function getMyRated(req, res, next) {
  try {
    const rated = await ratingService.getMyRated(req.user.id);
    res.json({ status: 'success', data: rated });
  } catch (error) {
    next(error);
  }
}

async function getLeaderboard(req, res, next) {
  try {
    const leaderboard = await ratingService.getLeaderboard();
    res.json({ status: 'success', data: leaderboard });
  } catch (error) {
    next(error);
  }
}

async function getModerationQueue(req, res, next) {
  try {
    const queue = await ratingService.getModerationQueue();
    res.json({ status: 'success', data: queue });
  } catch (error) {
    next(error);
  }
}

async function moderateRating(req, res, next) {
  try {
    const { action, comment } = req.body;
    const rating = await ratingService.moderateRating(req.params.id, action, comment);
    res.json({ status: 'success', data: rating });
  } catch (error) {
    next(error);
  }
}

async function getPublicComments(req, res, next) {
  try {
    const comments = await ratingService.getPublicComments(req.params.id);
    res.json({ status: 'success', data: comments });
  } catch (error) {
    next(error);
  }
}

async function getAnalytics(req, res, next) {
  try {
    const analytics = await ratingService.getRatingAnalytics();
    res.json({ status: 'success', data: analytics });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getRoster, getStudentProfile, submitRating, getMyRated, getLeaderboard,
  getModerationQueue, moderateRating, getPublicComments, getAnalytics,
};
