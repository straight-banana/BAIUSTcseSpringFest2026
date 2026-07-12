'use strict';

const prisma = require('../config/prisma');
const { AppError } = require('../middleware/errorHandler');
const { stripExifAndSave } = require('../utils/exifStrip');
const crypto = require('crypto');

const ENCRYPTION_KEY = () => Buffer.from((process.env.ENCRYPTION_KEY || 'hackathon-default-32-byte-secret!').padEnd(32, '0').slice(0, 32));

function decryptIdentity(encrypted) {
  try {
    const [ivHex, tagHex, dataHex] = encrypted.split(':');
    const iv = Buffer.from(ivHex, 'hex');
    const tag = Buffer.from(tagHex, 'hex');
    const data = Buffer.from(dataHex, 'hex');
    const decipher = crypto.createDecipheriv('aes-256-gcm', ENCRYPTION_KEY(), iv);
    decipher.setAuthTag(tag);
    return decipher.update(data) + decipher.final('utf8');
  } catch {
    return null;
  }
}

async function createComplaint({ category, description, anonymous, reportedById, offenderId, imageFile, metadata }) {
  let imageUrl = null;
  if (imageFile) {
    imageUrl = await stripExifAndSave(imageFile);
  }

  const parsedAnonymous = anonymous === false || anonymous === 'false' ? false : true;
  const complaint = await prisma.complaint.create({
    data: {
      category,
      description,
      anonymous: parsedAnonymous,
      reportedById: parsedAnonymous ? null : reportedById,
      offenderId: offenderId || null,
      imageUrl,
      metadata: metadata || null,
      statusHistory: JSON.stringify([{
        status: 'PENDING',
        changedAt: new Date().toISOString(),
        changedBy: 'system',
        note: 'Complaint submitted',
      }]),
    },
    select: {
      id: true, referenceCode: true, category: true, description: true,
      anonymous: true, status: true, imageUrl: true, createdAt: true, updatedAt: true,
      metadata: true,
    },
  });

  return complaint;
}

async function uploadComplaintImage(complaintId, file) {
  const complaint = await prisma.complaint.findUnique({ where: { id: complaintId } });
  if (!complaint) throw new AppError('Complaint not found', 404);
  const imageUrl = await stripExifAndSave(file);
  return prisma.complaint.update({ where: { id: complaintId }, data: { imageUrl }, select: { id: true, imageUrl: true } });
}

async function listComplaints({ page = 1, limit = 10, status, category, userRole, userId } = {}) {
  const skip = (page - 1) * limit;
  const where = {};
  if (status) where.status = status;
  if (category) where.category = category;
  if (userRole === 'STUDENT' && userId) where.reportedById = userId;

  const [complaints, total] = await Promise.all([
    prisma.complaint.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true, referenceCode: true, category: true, description: true,
        anonymous: true, status: true, warningCount: true, imageUrl: true,
        createdAt: true, updatedAt: true, metadata: true,
        offender: { select: { id: true, name: true, rollNumber: true } },
      },
    }),
    prisma.complaint.count({ where }),
  ]);

  return { complaints, total, page, limit, pages: Math.ceil(total / limit) };
}

async function getComplaintById(id) {
  const complaint = await prisma.complaint.findUnique({
    where: { id },
    select: {
      id: true, referenceCode: true, category: true, description: true,
      anonymous: true, status: true, statusHistory: true, warningCount: true,
      imageUrl: true, createdAt: true, updatedAt: true, metadata: true,
      offender: { select: { id: true, name: true, rollNumber: true } },
    },
  });
  if (!complaint) throw new AppError('Complaint not found', 404);
  return complaint;
}

async function getComplaintHistory(id) {
  const complaint = await prisma.complaint.findUnique({
    where: { id },
    select: { id: true, referenceCode: true, status: true, statusHistory: true },
  });
  if (!complaint) throw new AppError('Complaint not found', 404);
  return complaint;
}

async function updateComplaintStatus(id, newStatus, changedBy, note = '') {
  const complaint = await prisma.complaint.findUnique({ where: { id } });
  if (!complaint) throw new AppError('Complaint not found', 404);

  const history = Array.isArray(complaint.statusHistory) ? complaint.statusHistory : JSON.parse(complaint.statusHistory || '[]');
  history.push({
    status: newStatus,
    changedAt: new Date().toISOString(),
    changedBy,
    note,
  });

  const updated = await prisma.complaint.update({
    where: { id },
    data: { status: newStatus, statusHistory: history },
    select: { id: true, referenceCode: true, status: true, statusHistory: true },
  });

  // If RESOLVED → increment offender strikes, check captain removal
  if (newStatus === 'RESOLVED' && complaint.offenderId) {
    await handleStrikeIncrement(complaint.offenderId);
  }

  return updated;
}

async function handleStrikeIncrement(offenderId) {
  const offender = await prisma.user.findUnique({ where: { id: offenderId } });
  if (!offender) return;

  const newStrikeCount = offender.strikeCount + 1;

  if (newStrikeCount >= 3 && offender.isCaptain) {
    // Remove captain status, reset strikes
    await prisma.user.update({
      where: { id: offenderId },
      data: { strikeCount: 0, isCaptain: false },
    });
    // Notify the user
    await prisma.notification.create({
      data: {
        userId: offenderId,
        type: 'CAPTAIN_REMOVED',
        title: '⚠️ Captain status removed',
        body: '3 complaints against you have been proven. Your captain status has been removed.',
        metadata: { strikeCount: 3, resetAt: new Date().toISOString() },
      },
    });
  } else {
    await prisma.user.update({
      where: { id: offenderId },
      data: { strikeCount: newStrikeCount },
    });
  }
}

async function addWarning(id, changedBy) {
  const complaint = await prisma.complaint.findUnique({ where: { id } });
  if (!complaint) throw new AppError('Complaint not found', 404);
  return prisma.complaint.update({
    where: { id },
    data: { warningCount: { increment: 1 } },
    select: { id: true, warningCount: true, offenderId: true },
  });
}

async function getStrikes(offenderId) {
  const user = await prisma.user.findUnique({
    where: { id: offenderId },
    select: { id: true, name: true, rollNumber: true, strikeCount: true, isCaptain: true },
  });
  if (!user) throw new AppError('User not found', 404);
  const level = user.strikeCount === 0 ? 'CLEAN' : user.strikeCount === 1 ? 'WARNING' : user.strikeCount === 2 ? 'SEVERE' : 'REMOVED';
  return { ...user, warningLevel: level };
}

async function getMyComplaints(userId) {
  return prisma.complaint.findMany({
    where: { reportedById: userId },
    orderBy: { createdAt: 'desc' },
    select: {
      id: true, referenceCode: true, category: true, description: true,
      status: true, warningCount: true, createdAt: true, metadata: true,
    },
  });
}

async function getDashboard() {
  const [total, byStatus, byCategory] = await Promise.all([
    prisma.complaint.count(),
    prisma.complaint.groupBy({ by: ['status'], _count: { _all: true } }),
    prisma.complaint.groupBy({ by: ['category'], _count: { _all: true } }),
  ]);
  return {
    total,
    byStatus: Object.fromEntries(byStatus.map(s => [s.status, s._count._all])),
    byCategory: Object.fromEntries(byCategory.map(c => [c.category, c._count._all])),
  };
}

async function deleteComplaint(id) {
  const complaint = await prisma.complaint.findUnique({ where: { id } });
  if (!complaint) throw new AppError('Complaint not found', 404);
  await prisma.complaint.delete({ where: { id } });
}

module.exports = {
  createComplaint, uploadComplaintImage, listComplaints, getComplaintById,
  getComplaintHistory, updateComplaintStatus, addWarning, getStrikes,
  getMyComplaints, getDashboard, deleteComplaint,
};
