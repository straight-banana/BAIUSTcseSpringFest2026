'use strict';

const prisma = require('../config/prisma');
const { AppError } = require('../middleware/errorHandler');

async function getStats(userId, role) {
  if (role === 'ADMIN') {
    const [complaints, sos, students, elections, ratings] = await Promise.all([
      prisma.complaint.count(),
      prisma.sosAlert.count({ where: { status: { in: ['ACTIVE', 'CLAIMED'] } } }),
      prisma.user.count({ where: { role: 'STUDENT' } }),
      prisma.election.count({ where: { status: 'ACTIVE' } }),
      prisma.peerRating.count({ where: { status: 'PENDING' } }),
    ]);
    return {
      totalComplaints: complaints,
      activeAlerts: sos,
      totalStudents: students,
      activeElections: elections,
      pendingRatings: ratings,
    };
  } else {
    const [myComplaints, myAlerts, myRatings, hasVoted] = await Promise.all([
      prisma.complaint.count({ where: { reportedById: userId } }),
      prisma.sosAlert.count({ where: { reportedById: userId } }),
      prisma.ratingRecord.count({ where: { raterId: userId } }),
      prisma.election.findFirst({ where: { status: 'ACTIVE' } }),
    ]);
    return {
      myComplaints,
      myAlerts,
      ratingsGiven: myRatings,
      activeElection: !!hasVoted,
    };
  }
}

async function getActivity(userId, role, limit = 20) {
  // Aggregate recent events across all models
  const events = [];

  const complaints = await prisma.complaint.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' },
    where: role === 'ADMIN' ? {} : { reportedById: userId },
    select: { id: true, referenceCode: true, category: true, status: true, createdAt: true },
  });
  complaints.forEach(c => events.push({ type: 'COMPLAINT', data: c, at: c.createdAt }));

  const alerts = await prisma.sosAlert.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' },
    where: role === 'ADMIN' ? {} : { reportedById: userId },
    select: { id: true, location: true, severity: true, status: true, createdAt: true },
  });
  alerts.forEach(a => events.push({ type: 'SOS', data: a, at: a.createdAt }));

  const notifs = await prisma.notification.findMany({
    take: 10, where: { userId },
    orderBy: { createdAt: 'desc' },
    select: { id: true, type: true, title: true, isRead: true, createdAt: true },
  });
  notifs.forEach(n => events.push({ type: 'NOTIFICATION', data: n, at: n.createdAt }));

  return events.sort((a, b) => new Date(b.at) - new Date(a.at)).slice(0, limit);
}

async function getChartData() {
  // Last 7 days complaint trend
  const days = 7;
  const since = new Date();
  since.setDate(since.getDate() - days);

  const [complaintTrend, sosTrend] = await Promise.all([
    prisma.complaint.findMany({
      where: { createdAt: { gte: since } },
      select: { createdAt: true, status: true },
    }),
    prisma.sosAlert.findMany({
      where: { createdAt: { gte: since } },
      select: { createdAt: true, severity: true },
    }),
  ]);

  // Group by day
  const groupByDay = (items, labelKey) => {
    const map = {};
    items.forEach(item => {
      const day = item.createdAt.toISOString().split('T')[0];
      if (!map[day]) map[day] = {};
      const label = item[labelKey] || 'unknown';
      map[day][label] = (map[day][label] || 0) + 1;
    });
    return map;
  };

  return {
    complaintsByDay: groupByDay(complaintTrend, 'status'),
    sosByDay: groupByDay(sosTrend, 'severity'),
  };
}

// ── Notifications ─────────────────────────────────────────────

async function getNotifications(userId, unreadOnly = false) {
  const where = { userId };
  if (unreadOnly) where.isRead = false;
  return prisma.notification.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    take: 50,
  });
}

async function markRead(notifId, userId) {
  const notif = await prisma.notification.findUnique({ where: { id: notifId } });
  if (!notif || notif.userId !== userId) throw new AppError('Notification not found', 404);
  return prisma.notification.update({ where: { id: notifId }, data: { isRead: true } });
}

async function markAllRead(userId) {
  await prisma.notification.updateMany({ where: { userId, isRead: false }, data: { isRead: true } });
  return { message: 'All notifications marked as read' };
}

async function createNotification(userId, { type, title, body, metadata }) {
  return prisma.notification.create({ data: { userId, type, title, body, metadata: metadata || null } });
}

module.exports = {
  getStats, getActivity, getChartData,
  getNotifications, markRead, markAllRead, createNotification,
};
