'use strict';

const candidateService = require('../services/candidateService');

async function listRounds(req, res, next) {
  try {
    const rounds = await candidateService.listRounds();
    res.json({ status: 'success', data: rounds });
  } catch (error) {
    next(error);
  }
}

async function getRound(req, res, next) {
  try {
    const round = await candidateService.getRound(req.params.id);
    res.json({ status: 'success', data: round });
  } catch (error) {
    next(error);
  }
}

async function updateWeights(req, res, next) {
  try {
    const round = await candidateService.updateWeights(req.params.id, req.body.weights);
    res.json({ status: 'success', data: round });
  } catch (error) {
    next(error);
  }
}

async function createRound(req, res, next) {
  try {
    const round = await candidateService.createRound(req.body.name, req.body.weights);
    res.status(201).json({ status: 'success', data: round });
  } catch (error) {
    next(error);
  }
}

async function getRankedCandidates(req, res, next) {
  try {
    const { minScore, badge } = req.query;
    const ranked = await candidateService.getRankedCandidates(req.params.id, { minScore, badge });
    res.json({ status: 'success', data: ranked });
  } catch (error) {
    next(error);
  }
}

async function getProfile(req, res, next) {
  try {
    const profile = await candidateService.getCandidateProfile(req.params.id, req.params.userId);
    res.json({ status: 'success', data: profile });
  } catch (error) {
    next(error);
  }
}

async function upsertProfile(req, res, next) {
  try {
    const profile = await candidateService.upsertCandidateProfile(req.params.id, req.params.userId, req.body);
    res.json({ status: 'success', data: profile });
  } catch (error) {
    next(error);
  }
}

async function compare(req, res, next) {
  try {
    const ids = req.query.ids ? req.query.ids.split(',') : [];
    const profiles = await candidateService.compareCandidates(req.params.id, ids);
    res.json({ status: 'success', data: profiles });
  } catch (error) {
    next(error);
  }
}

async function submitOverride(req, res, next) {
  try {
    const profile = await candidateService.submitOverride(req.params.id, req.params.userId, req.body);
    res.json({ status: 'success', data: profile });
  } catch (error) {
    next(error);
  }
}

async function getHistory(req, res, next) {
  try {
    const history = await candidateService.getRoundHistory();
    res.json({ status: 'success', data: history });
  } catch (error) {
    next(error);
  }
}

async function getAnalytics(req, res, next) {
  try {
    const analytics = await candidateService.getCandidateAnalytics(req.params.id);
    res.json({ status: 'success', data: analytics });
  } catch (error) {
    next(error);
  }
}

async function getRoster(req, res, next) {
  try {
    const { class: cls, section, q } = req.query;
    const roster = await candidateService.getRoster({ class: cls, section, q });
    res.json({ status: 'success', data: roster });
  } catch (error) {
    next(error);
  }
}

async function setCaptain(req, res, next) {
  try {
    const student = await candidateService.setCaptain(req.params.studentId, !!req.body.isCaptain);
    res.json({ status: 'success', data: student });
  } catch (error) {
    next(error);
  }
}

async function getCaptains(req, res, next) {
  try {
    const captains = await candidateService.getCaptains();
    res.json({ status: 'success', data: captains });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  listRounds, getRound, updateWeights, createRound, getRankedCandidates,
  getProfile, upsertProfile, compare, submitOverride, getHistory, getAnalytics,
  getRoster, setCaptain, getCaptains,
};
