'use strict';

const prisma = require('../config/prisma');
const { AppError } = require('../middleware/errorHandler');

async function getRoster(requesterId) {
  // All students except the requester themselves
  return prisma.user.findMany({
    where: { role: 'STUDENT', id: { not: requesterId } },
    select: {
      id: true, name: true, rollNumber: true,
      class: true, section: true, isCaptain: true,
      _count: { select: { receivedRatings: { where: { status: 'APPROVED' } } } },
    },
    orderBy: { name: 'asc' },
  });
}

async function getStudentProfile(rateeId) {
  const user = await prisma.user.findUnique({
    where: { id: rateeId },
    select: { id: true, name: true, rollNumber: true, class: true, section: true, isCaptain: true },
  });
  if (!user) throw new AppError('Student not found', 404);

  const ratings = await prisma.peerRating.findMany({
    where: { rateeId, status: 'APPROVED' },
    select: { scores: true },
  });

  // Compute aggregated scores
  const keys = ['leadership', 'communication', 'teamwork', 'punctuality', 'attitude'];
  const aggregate = {};
  if (ratings.length > 0) {
    keys.forEach(k => {
      const vals = ratings.map(r => (r.scores[k] || 0));
      aggregate[k] = parseFloat((vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(2));
    });
    aggregate.overall = parseFloat((Object.values(aggregate).reduce((a, b) => a + b, 0) / keys.length).toFixed(2));
  }

  return { ...user, aggregateRatings: aggregate, ratingCount: ratings.length };
}

async function submitRating({ raterId, rateeId, scores, comment }) {
  // Check duplicate
  const existing = await prisma.ratingRecord.findUnique({
    where: { raterId_rateeId: { raterId, rateeId } },
  });
  if (existing) throw new AppError('You have already rated this student', 409);

  // Record who rated whom (identity tracking, separate from content)
  await prisma.ratingRecord.create({ data: { raterId, rateeId } });

  // Create anonymous rating (no raterId stored here)
  const rating = await prisma.peerRating.create({
    data: { rateeId, scores, comment: comment || null },
    select: { id: true, rateeId: true, scores: true, status: true, createdAt: true },
  });

  return rating;
}

async function getMyRated(raterId) {
  // Who I've already rated — returns ratee profiles only
  const records = await prisma.ratingRecord.findMany({
    where: { raterId },
    select: { rateeId: true },
  });
  const rateeIds = records.map(r => r.rateeId);
  if (!rateeIds.length) return [];

  return prisma.user.findMany({
    where: { id: { in: rateeIds } },
    select: { id: true, name: true, rollNumber: true },
  });
}

async function getLeaderboard() {
  const users = await prisma.user.findMany({
    where: { role: 'STUDENT' },
    select: {
      id: true, name: true, rollNumber: true, class: true, section: true, isCaptain: true,
      receivedRatings: { where: { status: 'APPROVED' }, select: { scores: true } },
    },
  });

  const keys = ['leadership', 'communication', 'teamwork', 'punctuality', 'attitude'];
  const board = users.map(u => {
    const ratings = u.receivedRatings;
    const breakdown = Object.fromEntries(keys.map(k => [k, 0]));
    let overall = 0;
    if (ratings.length > 0) {
      keys.forEach(k => {
        const vals = ratings.map(r => (r.scores[k] || 0));
        breakdown[k] = parseFloat((vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(2));
      });
      const sum = ratings.reduce((acc, r) => {
        keys.forEach(k => { acc += (r.scores[k] || 0); });
        return acc;
      }, 0);
      overall = parseFloat((sum / (ratings.length * keys.length)).toFixed(2));
    }
    return {
      id: u.id, name: u.name, rollNumber: u.rollNumber,
      class: u.class, section: u.section, isCaptain: u.isCaptain,
      overall, ratingCount: ratings.length, breakdown,
    };
  });

  return board.sort((a, b) => b.overall - a.overall);
}

async function getModerationQueue() {
  return prisma.peerRating.findMany({
    where: { status: 'PENDING' },
    include: { ratee: { select: { id: true, name: true, rollNumber: true } } },
  });
}

async function moderateRating(id, action, editedComment) {
  const actionMap = { approve: 'APPROVED', flag: 'FLAGGED', reject: 'REJECTED' };
  const status = actionMap[action];
  if (!status) throw new AppError('Invalid action', 400);
  return prisma.peerRating.update({
    where: { id },
    data: { status, ...(editedComment ? { comment: editedComment } : {}) },
  });
}

async function getPublicComments(rateeId) {
  return prisma.peerRating.findMany({
    where: { rateeId, status: 'APPROVED', comment: { not: null } },
    select: { id: true, comment: true, scores: true, createdAt: true },
    orderBy: { createdAt: 'desc' },
  });
}

async function getRatingAnalytics() {
  const [total, byStatus] = await Promise.all([
    prisma.peerRating.count(),
    prisma.peerRating.groupBy({ by: ['status'], _count: { _all: true } }),
  ]);
  return {
    total,
    byStatus: Object.fromEntries(byStatus.map(x => [x.status, x._count._all])),
  };
}

module.exports = {
  getRoster, getStudentProfile, submitRating, getMyRated, getLeaderboard,
  getModerationQueue, moderateRating, getPublicComments, getRatingAnalytics,
};
