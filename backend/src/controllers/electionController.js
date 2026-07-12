'use strict';

const electionService = require('../services/electionService');

async function getActiveElection(req, res, next) {
  try {
    const election = await electionService.getActiveElection();
    res.json({ status: 'success', data: election });
  } catch (error) {
    next(error);
  }
}

async function listElections(req, res, next) {
  try {
    const elections = await electionService.listElections();
    res.json({ status: 'success', data: elections });
  } catch (error) {
    next(error);
  }
}

async function getCandidates(req, res, next) {
  try {
    const candidates = await electionService.getCandidates(req.params.id);
    res.json({ status: 'success', data: candidates });
  } catch (error) {
    next(error);
  }
}

async function getCandidateProfile(req, res, next) {
  try {
    const profile = await electionService.getCandidateProfile(req.params.id, req.params.candidateId);
    res.json({ status: 'success', data: profile });
  } catch (error) {
    next(error);
  }
}

async function compareCandidates(req, res, next) {
  try {
    const ids = req.query.ids ? req.query.ids.split(',') : [];
    const profiles = await electionService.compareCandidates(req.params.id, ids);
    res.json({ status: 'success', data: profiles });
  } catch (error) {
    next(error);
  }
}

async function getTimeline(req, res, next) {
  try {
    const timeline = await electionService.getTimeline(req.params.id);
    res.json({ status: 'success', data: timeline });
  } catch (error) {
    next(error);
  }
}

async function castVote(req, res, next) {
  try {
    const result = await electionService.castVote(req.params.id, req.user.id, req.body.rankedChoices);
    res.json({ status: 'success', data: result });
  } catch (error) {
    next(error);
  }
}

async function hasVoted(req, res, next) {
  try {
    const result = await electionService.hasVoted(req.params.id, req.user.id);
    res.json({ status: 'success', data: result });
  } catch (error) {
    next(error);
  }
}

async function getResults(req, res, next) {
  try {
    const results = await electionService.getResults(req.params.id, req.user.role);
    res.json({ status: 'success', data: results });
  } catch (error) {
    next(error);
  }
}

async function getHistory(req, res, next) {
  try {
    const history = await electionService.getElectionHistory();
    res.json({ status: 'success', data: history });
  } catch (error) {
    next(error);
  }
}

async function getAdminView(req, res, next) {
  try {
    const view = await electionService.getAdminView(req.params.id);
    res.json({ status: 'success', data: view });
  } catch (error) {
    next(error);
  }
}

async function updateStatus(req, res, next) {
  try {
    const election = await electionService.updateElectionStatus(req.params.id, req.body.status, req.user.id);
    res.json({ status: 'success', data: election });
  } catch (error) {
    next(error);
  }
}

async function getActivityLog(req, res, next) {
  try {
    const log = await electionService.getActivityLog(req.params.id);
    res.json({ status: 'success', data: log });
  } catch (error) {
    next(error);
  }
}

async function createElection(req, res, next) {
  try {
    const election = await electionService.createElection(req.body);
    res.status(201).json({ status: 'success', data: election });
  } catch (error) {
    next(error);
  }
}

async function addCandidate(req, res, next) {
  try {
    const candidate = await electionService.addCandidate(req.params.id, req.body.userId, req.body);
    res.status(201).json({ status: 'success', data: candidate });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getActiveElection, listElections, getCandidates, getCandidateProfile,
  compareCandidates, getTimeline, castVote, hasVoted, getResults,
  getHistory, getAdminView, updateStatus, getActivityLog, createElection, addCandidate,
};
