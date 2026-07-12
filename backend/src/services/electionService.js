'use strict';

const prisma = require('../config/prisma');
const { AppError } = require('../middleware/errorHandler');
const crypto = require('crypto');

const VOTE_SALT = process.env.VOTE_SALT || 'hackathon-vote-salt-2026';

function hashVoterId(userId, electionId) {
  return crypto.createHash('sha256').update(`${userId}:${electionId}:${VOTE_SALT}`).digest('hex');
}

async function getActiveElection() {
  const election = await prisma.election.findFirst({
    where: { status: 'ACTIVE' },
    include: {
      candidates: {
        include: { user: { select: { id: true, name: true, rollNumber: true } } },
      },
    },
  });
  if (!election) throw new AppError('No active election found', 404);
  return election;
}

async function listElections() {
  return prisma.election.findMany({
    orderBy: { createdAt: 'desc' },
    select: { id: true, title: true, status: true, startsAt: true, endsAt: true, createdAt: true, _count: { select: { candidates: true, votes: true } } },
  });
}

async function getCandidates(electionId) {
  return prisma.electionCandidate.findMany({
    where: { electionId },
    include: { user: { select: { id: true, name: true, rollNumber: true, class: true, section: true } } },
  });
}

async function getCandidateProfile(electionId, candidateId) {
  const candidate = await prisma.electionCandidate.findFirst({
    where: { id: candidateId, electionId },
    include: { user: { select: { id: true, name: true, rollNumber: true, class: true, section: true, isCaptain: true } } },
  });
  if (!candidate) throw new AppError('Candidate not found', 404);
  return candidate;
}

async function compareCandidates(electionId, candidateIds) {
  return prisma.electionCandidate.findMany({
    where: { electionId, id: { in: candidateIds } },
    include: { user: { select: { id: true, name: true, rollNumber: true } } },
  });
}

async function getTimeline(electionId) {
  const election = await prisma.election.findUnique({ where: { id: electionId } });
  if (!election) throw new AppError('Election not found', 404);
  return { id: election.id, title: election.title, startsAt: election.startsAt, endsAt: election.endsAt, status: election.status };
}

async function castVote(electionId, voterId, rankedChoices) {
  // rankedChoices: [{candidateId, rank}]
  const election = await prisma.election.findUnique({ where: { id: electionId } });
  if (!election) throw new AppError('Election not found', 404);
  if (election.status !== 'ACTIVE') throw new AppError('Election is not active', 400);

  // Check double-vote using one-way hash
  const hashed = hashVoterId(voterId, electionId);
  const existingRecord = await prisma.voteRecord.findUnique({
    where: { electionId_hashedVoterId: { electionId, hashedVoterId: hashed } },
  });
  if (existingRecord) throw new AppError('You have already voted in this election', 409);

  // Record that this person voted (no link to actual vote content)
  await prisma.voteRecord.create({ data: { electionId, hashedVoterId: hashed } });

  // Create anonymous votes
  await prisma.vote.createMany({
    data: rankedChoices.map(({ candidateId, rank }) => ({ electionId, candidateId, rank })),
  });

  return { message: 'Vote cast successfully' };
}

async function hasVoted(electionId, voterId) {
  const hashed = hashVoterId(voterId, electionId);
  const record = await prisma.voteRecord.findUnique({
    where: { electionId_hashedVoterId: { electionId, hashedVoterId: hashed } },
  });
  return { hasVoted: !!record };
}

async function getResults(electionId, requesterRole) {
  const election = await prisma.election.findUnique({ where: { id: electionId } });
  if (!election) throw new AppError('Election not found', 404);

  if (election.status !== 'PUBLISHED' && requesterRole !== 'ADMIN') {
    throw new AppError('Results not yet published', 403);
  }

  const candidates = await prisma.electionCandidate.findMany({
    where: { electionId },
    include: {
      user: { select: { id: true, name: true, rollNumber: true } },
      votes: true,
    },
  });

  const results = candidates.map(c => {
    const firstChoiceVotes = c.votes.filter(v => v.rank === 1).length;
    const totalVotes = c.votes.length;
    return { candidateId: c.id, user: c.user, firstChoiceVotes, totalVotes };
  }).sort((a, b) => b.firstChoiceVotes - a.firstChoiceVotes);

  const totalVoters = await prisma.voteRecord.count({ where: { electionId } });
  return { electionId, totalVoters, results };
}

async function getElectionHistory() {
  return prisma.election.findMany({
    where: { status: { in: ['CLOSED', 'PUBLISHED'] } },
    orderBy: { createdAt: 'desc' },
    include: { _count: { select: { candidates: true, voteRecords: true } } },
  });
}

async function getAdminView(electionId) {
  const election = await prisma.election.findUnique({
    where: { id: electionId },
    include: {
      candidates: { include: { user: { select: { id: true, name: true, rollNumber: true } }, votes: true } },
      _count: { select: { voteRecords: true } },
    },
  });
  if (!election) throw new AppError('Election not found', 404);

  const turnout = await prisma.voteRecord.count({ where: { electionId } });
  const totalStudents = await prisma.user.count({ where: { role: 'STUDENT' } });

  return {
    ...election,
    turnout,
    turnoutPercentage: totalStudents ? parseFloat(((turnout / totalStudents) * 100).toFixed(1)) : 0,
  };
}

async function updateElectionStatus(id, status, adminId) {
  const election = await prisma.election.findUnique({ where: { id } });
  if (!election) throw new AppError('Election not found', 404);

  const log = Array.isArray(election.activityLog) ? election.activityLog : [];
  log.push({ action: `STATUS_CHANGED_TO_${status}`, at: new Date().toISOString(), by: adminId });

  return prisma.election.update({
    where: { id },
    data: { status, activityLog: log },
  });
}

async function getActivityLog(electionId) {
  const election = await prisma.election.findUnique({ where: { id: electionId }, select: { activityLog: true } });
  if (!election) throw new AppError('Election not found', 404);
  return election.activityLog;
}

async function createElection({ title, description, startsAt, endsAt }) {
  return prisma.election.create({ data: { title, description, startsAt, endsAt } });
}

async function addCandidate(electionId, userId, { bio, achievements }) {
  return prisma.electionCandidate.create({
    data: { electionId, userId, bio, achievements: achievements || [] },
    include: { user: { select: { id: true, name: true, rollNumber: true } } },
  });
}

module.exports = {
  getActiveElection, listElections, getCandidates, getCandidateProfile,
  compareCandidates, getTimeline, castVote, hasVoted, getResults,
  getElectionHistory, getAdminView, updateElectionStatus, getActivityLog,
  createElection, addCandidate,
};
