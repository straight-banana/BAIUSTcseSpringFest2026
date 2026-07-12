'use strict';

const prisma = require('../config/prisma');
const { AppError } = require('../middleware/errorHandler');
const { logger } = require('../utils/logger');

// Static map pin locations
const MAP_LOCATIONS = [
  { id: 'CLASSROOM',  name: 'Classroom',  lat: 23.8103, lng: 90.4125, icon: '🏫' },
  { id: 'LIBRARY',   name: 'Library',    lat: 23.8110, lng: 90.4130, icon: '📚' },
  { id: 'PLAYGROUND', name: 'Playground', lat: 23.8095, lng: 90.4118, icon: '⚽' },
  { id: 'CORRIDOR',  name: 'Corridor',   lat: 23.8105, lng: 90.4122, icon: '🚶' },
  { id: 'CANTEEN',   name: 'Canteen',    lat: 23.8108, lng: 90.4135, icon: '🍽️' },
  { id: 'OFFICE',    name: 'Office',     lat: 23.8112, lng: 90.4128, icon: '🏢' },
  { id: 'RESTROOM',  name: 'Restroom',   lat: 23.8100, lng: 90.4120, icon: '🚻' },
  { id: 'OTHER',     name: 'Other',      lat: 23.8103, lng: 90.4125, icon: '📍' },
];

const LOCATION_MAP = {
  classroom: 'CLASSROOM',
  library: 'LIBRARY',
  playground: 'PLAYGROUND',
  corridor: 'CORRIDOR',
  canteen: 'CANTEEN',
  office: 'OFFICE',
  restroom: 'RESTROOM',
  laboratory: 'OTHER',
  auditorium: 'OTHER',
  other: 'OTHER',
};

const TYPE_MAP = {
  bullying: 'BULLYING',
  injury: 'MEDICAL',
  medical: 'MEDICAL',
  harass: 'BULLYING',
  theft: 'THEFT',
  fight: 'BULLYING',
  lost: 'OTHER',
  other: 'OTHER',
};

const SEVERITY_MAP = {
  low: 'LOW',
  medium: 'MEDIUM',
  high: 'HIGH',
  critical: 'CRITICAL',
};

function normalizeLocation(location) {
  if (!location) return 'OTHER';
  const key = String(location).toLowerCase();
  return LOCATION_MAP[key] || String(location).toUpperCase();
}

function normalizeType(type) {
  if (!type) return 'OTHER';
  const key = String(type).toLowerCase();
  return TYPE_MAP[key] || 'OTHER';
}

function normalizeSeverity(severity) {
  if (!severity) return 'MEDIUM';
  const key = String(severity).toLowerCase();
  return SEVERITY_MAP[key] || 'MEDIUM';
}

async function triggerSos({ location, type, severity, message, reportedById }, io) {
  const normalizedLocation = normalizeLocation(location);
  const normalizedType = normalizeType(type);
  const normalizedSeverity = normalizeSeverity(severity);

  const alert = await prisma.sosAlert.create({
    data: {
      location: normalizedLocation,
      type: normalizedType,
      severity: normalizedSeverity,
      message: message || null,
      reportedById: reportedById || null,
    },
    include: { reportedBy: { select: { id: true, name: true, rollNumber: true } } },
  });

  if (io) {
    io.to('admin').emit('sos:new', alert);
  }

  // Create notification for all admins
  const admins = await prisma.user.findMany({ where: { role: 'ADMIN' }, select: { id: true } });
  await prisma.notification.createMany({
    data: admins.map(a => ({
      userId: a.id,
      type: 'SOS_NEW',
      title: `🚨 New SOS Alert — ${normalizedLocation}`,
      body: message || `Emergency at ${normalizedLocation}. Severity: ${normalizedSeverity}`,
      metadata: { alertId: alert.id, location: normalizedLocation, severity: normalizedSeverity, type: normalizedType },
    })),
  });

  return alert;
}

async function getActiveAlerts() {
  return prisma.sosAlert.findMany({
    where: { status: { in: ['ACTIVE', 'CLAIMED'] } },
    orderBy: [{ severity: 'desc' }, { createdAt: 'desc' }],
    include: {
      reportedBy: { select: { id: true, name: true, rollNumber: true } },
      claimedBy:  { select: { id: true, name: true, rollNumber: true } },
    },
  });
}

async function listAlerts({ page = 1, limit = 20, status, location } = {}) {
  const skip = (page - 1) * limit;
  const where = {};
  if (status) where.status = status;
  if (location) where.location = location;

  const [alerts, total] = await Promise.all([
    prisma.sosAlert.findMany({
      where, skip, take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        reportedBy: { select: { id: true, name: true, rollNumber: true } },
        claimedBy:  { select: { id: true, name: true, rollNumber: true } },
      },
    }),
    prisma.sosAlert.count({ where }),
  ]);
  return { alerts, total, page, limit };
}

async function claimAlert(id, claimedById, io) {
  const alert = await prisma.sosAlert.findUnique({ where: { id } });
  if (!alert) throw new AppError('Alert not found', 404);
  if (alert.status !== 'ACTIVE') throw new AppError('Alert is not claimable', 400);

  const updated = await prisma.sosAlert.update({
    where: { id },
    data: { status: 'CLAIMED', claimedById },
    include: { claimedBy: { select: { id: true, name: true, rollNumber: true } } },
  });

  if (io) io.to('admin').emit('sos:claimed', updated);
  return updated;
}

async function resolveAlert(id, io) {
  const alert = await prisma.sosAlert.findUnique({ where: { id } });
  if (!alert) throw new AppError('Alert not found', 404);

  const updated = await prisma.sosAlert.update({
    where: { id },
    data: { status: 'RESOLVED' },
  });

  if (io) io.to('admin').emit('sos:resolved', { id, status: 'RESOLVED' });
  return updated;
}

function getMapLocations() {
  return MAP_LOCATIONS;
}

async function getAnalytics() {
  const [byLocation, bySeverity, byStatus, recent] = await Promise.all([
    prisma.sosAlert.groupBy({ by: ['location'], _count: { _all: true } }),
    prisma.sosAlert.groupBy({ by: ['severity'], _count: { _all: true } }),
    prisma.sosAlert.groupBy({ by: ['status'],   _count: { _all: true } }),
    prisma.sosAlert.findMany({ take: 30, orderBy: { createdAt: 'desc' }, select: { createdAt: true, severity: true, location: true } }),
  ]);
  return {
    byLocation: Object.fromEntries(byLocation.map(x => [x.location, x._count._all])),
    bySeverity: Object.fromEntries(bySeverity.map(x => [x.severity, x._count._all])),
    byStatus:   Object.fromEntries(byStatus.map(x => [x.status, x._count._all])),
    recentTrend: recent,
  };
}

module.exports = { triggerSos, getActiveAlerts, listAlerts, claimAlert, resolveAlert, getMapLocations, getAnalytics };
