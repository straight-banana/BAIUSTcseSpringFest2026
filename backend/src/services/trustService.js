'use strict';

const prisma = require('../config/prisma');
const { AppError } = require('../middleware/errorHandler');

async function getTrustScore(userId) {
  let score = await prisma.trustScore.findUnique({
    where: { userId },
    include: { user: { select: { id: true, name: true, rollNumber: true, isCaptain: true } } },
  });
  if (!score) {
    score = await prisma.trustScore.create({
      data: { userId },
      include: { user: { select: { id: true, name: true, rollNumber: true, isCaptain: true } } },
    });
  }
  return score;
}

async function getUnresolvedFlags(userId) {
  const where = { isResolved: false };
  if (userId) where.targetId = userId;
  return prisma.trustFlag.findMany({
    where,
    include: { target: { select: { id: true, name: true, rollNumber: true } } },
    orderBy: { createdAt: 'desc' },
  });
}

async function resolveFlag(flagId) {
  const flag = await prisma.trustFlag.findUnique({ where: { id: flagId } });
  if (!flag) throw new AppError('Flag not found', 404);
  return prisma.trustFlag.update({
    where: { id: flagId },
    data: { isResolved: true, resolvedAt: new Date() },
  });
}

async function createFlag(targetId, reason) {
  const user = await prisma.user.findUnique({ where: { id: targetId } });
  if (!user) throw new AppError('User not found', 404);

  const flag = await prisma.trustFlag.create({ data: { targetId, reason } });

  // Decrease trust score
  await prisma.trustScore.upsert({
    where: { userId: targetId },
    update: { score: { decrement: 5 } },
    create: { userId: targetId, score: 95 },
  });

  return flag;
}

async function getDashboard() {
  const [avg, openFlags, flaggedUsers, totalScores] = await Promise.all([
    prisma.trustScore.aggregate({ _avg: { score: true } }),
    prisma.trustFlag.count({ where: { isResolved: false } }),
    prisma.trustFlag.findMany({ where: { isResolved: false }, distinct: ['targetId'], select: { targetId: true } }),
    prisma.trustScore.count(),
  ]);
  return {
    averageScore: avg._avg.score != null ? parseFloat(avg._avg.score.toFixed(1)) : 100,
    openFlags,
    flaggedUserCount: flaggedUsers.length,
    scoredUserCount: totalScores,
  };
}

module.exports = { getTrustScore, getUnresolvedFlags, resolveFlag, createFlag, getDashboard };
