'use strict';

const prisma = require('../config/prisma');
const { AppError } = require('../middleware/errorHandler');

function computeScore(scores, weights) {
  let total = 0;
  let weightSum = 0;
  Object.keys(weights).forEach(k => {
    if (scores[k] !== undefined) {
      total += scores[k] * weights[k];
      weightSum += weights[k];
    }
  });
  return weightSum > 0 ? parseFloat((total / weightSum).toFixed(2)) : 0;
}

function assignBadge(score) {
  if (score >= 4.5) return 'GOLD';
  if (score >= 3.5) return 'SILVER';
  if (score >= 2.5) return 'BRONZE';
  return null;
}

async function listRounds() {
  return prisma.candidateRound.findMany({ orderBy: { createdAt: 'desc' } });
}

async function getRound(id) {
  const round = await prisma.candidateRound.findUnique({ where: { id } });
  if (!round) throw new AppError('Round not found', 404);
  return round;
}

async function updateWeights(id, weights) {
  return prisma.candidateRound.update({ where: { id }, data: { weights } });
}

async function createRound(name, weights) {
  return prisma.candidateRound.create({ data: { name, weights: weights || undefined } });
}

async function getRankedCandidates(roundId, { minScore, badge } = {}) {
  const round = await prisma.candidateRound.findUnique({ where: { id: roundId } });
  if (!round) throw new AppError('Round not found', 404);

  let profiles = await prisma.candidateProfile.findMany({
    where: {
      roundId,
      ...(badge ? { badge } : {}),
    },
    include: { user: { select: { id: true, name: true, rollNumber: true, class: true, section: true } } },
    orderBy: { computedScore: 'desc' },
  });

  if (minScore) profiles = profiles.filter(p => p.computedScore >= parseFloat(minScore));
  return profiles;
}

async function getCandidateProfile(roundId, userId) {
  const profile = await prisma.candidateProfile.findUnique({
    where: { roundId_userId: { roundId, userId } },
    include: { user: { select: { id: true, name: true, rollNumber: true } } },
  });
  if (!profile) throw new AppError('Candidate profile not found', 404);
  return profile;
}

async function upsertCandidateProfile(roundId, userId, data) {
  const round = await prisma.candidateRound.findUnique({ where: { id: roundId } });
  if (!round) throw new AppError('Round not found', 404);

  const computed = computeScore(data.scores || {}, round.weights);
  const badge = assignBadge(computed);

  return prisma.candidateProfile.upsert({
    where: { roundId_userId: { roundId, userId } },
    update: { ...data, computedScore: computed, badge },
    create: { roundId, userId, computedScore: computed, badge, ...data },
    include: { user: { select: { id: true, name: true, rollNumber: true } } },
  });
}

async function compareCandidates(roundId, userIds) {
  return prisma.candidateProfile.findMany({
    where: { roundId, userId: { in: userIds } },
    include: { user: { select: { id: true, name: true, rollNumber: true } } },
  });
}

async function submitOverride(roundId, userId, { add, remove, pin, reason }) {
  const profile = await prisma.candidateProfile.findUnique({
    where: { roundId_userId: { roundId, userId } },
  });
  if (!profile) throw new AppError('Profile not found', 404);

  const data = { manualOverride: true, overrideReason: reason };
  if (pin !== undefined) data.isPinned = pin;

  const timeline = Array.isArray(profile.timeline) ? profile.timeline : [];
  timeline.push({ date: new Date().toISOString(), event: `Override: ${reason}` });
  data.timeline = timeline;

  return prisma.candidateProfile.update({ where: { roundId_userId: { roundId, userId } }, data });
}

async function getRoundHistory() {
  return prisma.candidateRound.findMany({
    where: { isActive: false },
    orderBy: { createdAt: 'desc' },
    include: { _count: { select: { profiles: true } } },
  });
}

async function getCandidateAnalytics(roundId) {
  const profiles = await prisma.candidateProfile.findMany({
    where: { roundId },
    select: { computedScore: true, badge: true, manualOverride: true },
  });
  return {
    total: profiles.length,
    avgScore: profiles.length ? parseFloat((profiles.reduce((a, p) => a + p.computedScore, 0) / profiles.length).toFixed(2)) : 0,
    byBadge: { GOLD: 0, SILVER: 0, BRONZE: 0, NONE: 0, ...Object.fromEntries(
      Object.entries(profiles.reduce((acc, p) => {
        const b = p.badge || 'NONE';
        acc[b] = (acc[b] || 0) + 1;
        return acc;
      }, {}))
    )},
    overrideCount: profiles.filter(p => p.manualOverride).length,
  };
}

async function getRoster({ class: cls, section, q } = {}) {
  const where = { role: 'STUDENT' };
  if (cls) where.class = parseInt(cls, 10);
  if (section) where.section = section;
  if (q) {
    where.OR = [
      { name: { contains: q, mode: 'insensitive' } },
      { rollNumber: { contains: q, mode: 'insensitive' } },
    ];
  }
  return prisma.user.findMany({
    where,
    select: { id: true, name: true, rollNumber: true, class: true, section: true, isCaptain: true },
    orderBy: [{ class: 'asc' }, { section: 'asc' }, { name: 'asc' }],
  });
}

async function setCaptain(studentId, isCaptain) {
  const student = await prisma.user.findUnique({ where: { id: studentId } });
  if (!student) throw new AppError('Student not found', 404);

  if (isCaptain) {
    // Enforce one captain per class+section — demote any existing captain there first.
    await prisma.user.updateMany({
      where: { role: 'STUDENT', class: student.class, section: student.section, isCaptain: true, id: { not: studentId } },
      data: { isCaptain: false },
    });
  }

  return prisma.user.update({
    where: { id: studentId },
    data: { isCaptain },
    select: { id: true, name: true, rollNumber: true, class: true, section: true, isCaptain: true },
  });
}

async function getCaptains() {
  return prisma.user.findMany({
    where: { role: 'STUDENT', isCaptain: true },
    select: { id: true, name: true, rollNumber: true, class: true, section: true },
    orderBy: [{ class: 'asc' }, { section: 'asc' }],
  });
}

module.exports = {
  listRounds, getRound, updateWeights, createRound, getRankedCandidates,
  getCandidateProfile, upsertCandidateProfile, compareCandidates,
  submitOverride, getRoundHistory, getCandidateAnalytics,
  getRoster, setCaptain, getCaptains,
};
