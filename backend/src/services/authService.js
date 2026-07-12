'use strict';

const prisma = require('../config/prisma');
const { hashPassword, comparePassword } = require('../utils/password');
const { signToken, signRefreshToken, verifyRefreshToken } = require('../utils/tokens');
const { AppError } = require('../middleware/errorHandler');
const crypto = require('crypto');

const ENCRYPTION_KEY = () => {
  const key = process.env.ENCRYPTION_KEY || 'hackathon-default-32-byte-secret!';
  return Buffer.from(key.padEnd(32, '0').slice(0, 32));
};

function encryptIdentity(text) {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-gcm', ENCRYPTION_KEY(), iv);
  const encrypted = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();
  return `${iv.toString('hex')}:${tag.toString('hex')}:${encrypted.toString('hex')}`;
}

async function register({ rollNumber, name, password, role, class: cls, section, height, dateOfBirth, hasVisionProblem, hasHearingProblem }) {
  const existing = await prisma.user.findUnique({ where: { rollNumber } });
  if (existing) throw new AppError('Roll number already registered', 409);

  const passwordHash = await hashPassword(password);
  const user = await prisma.user.create({
    data: {
      rollNumber,
      name,
      passwordHash,
      role: role || 'STUDENT',
      class: cls ? parseInt(cls) : null,
      section: section || null,
      height: height ? parseFloat(height) : null,
      dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
      hasVisionProblem: !!hasVisionProblem,
      hasHearingProblem: !!hasHearingProblem,
    },
    select: {
      id: true, rollNumber: true, name: true, role: true,
      class: true, section: true, height: true, dateOfBirth: true,
      hasVisionProblem: true, hasHearingProblem: true,
      isCaptain: true, strikeCount: true, createdAt: true,
    },
  });

  const token = signToken({ id: user.id, rollNumber: user.rollNumber, role: user.role });
  const refreshToken = signRefreshToken({ id: user.id });

  // Store hashed refresh token
  const hashedRefresh = crypto.createHash('sha256').update(refreshToken).digest('hex');
  await prisma.user.update({ where: { id: user.id }, data: { refreshToken: hashedRefresh } });

  return { user, accessToken: token, refreshToken };
}

async function login({ rollNumber, password }) {
  const user = await prisma.user.findUnique({ where: { rollNumber } });
  if (!user) throw new AppError('Invalid roll number or password', 401);

  const valid = await comparePassword(password, user.passwordHash);
  if (!valid) throw new AppError('Invalid roll number or password', 401);

  const token = signToken({ id: user.id, rollNumber: user.rollNumber, role: user.role });
  const refreshToken = signRefreshToken({ id: user.id });

  const hashedRefresh = crypto.createHash('sha256').update(refreshToken).digest('hex');
  await prisma.user.update({ where: { id: user.id }, data: { refreshToken: hashedRefresh } });

  const { passwordHash: _, refreshToken: __, ...safeUser } = user;
  return { user: safeUser, token, refreshToken };
}

async function refreshToken(refreshToken) {
  const decoded = verifyRefreshToken(refreshToken);
  if (!decoded) throw new AppError('Invalid or expired refresh token', 401);

  const user = await prisma.user.findUnique({ where: { id: decoded.id } });
  if (!user || !user.refreshToken) throw new AppError('Session expired', 401);

  const hashedIncoming = crypto.createHash('sha256').update(refreshToken).digest('hex');
  if (hashedIncoming !== user.refreshToken) throw new AppError('Refresh token mismatch', 401);

  const accessToken = signToken({ id: user.id, rollNumber: user.rollNumber, role: user.role });
  const newRefreshToken = signRefreshToken({ id: user.id });
  const hashedRefresh = crypto.createHash('sha256').update(newRefreshToken).digest('hex');
  await prisma.user.update({ where: { id: user.id }, data: { refreshToken: hashedRefresh } });

  return { accessToken, refreshToken: newRefreshToken };
}

async function logout(userId) {
  await prisma.user.update({ where: { id: userId }, data: { refreshToken: null } });
}

async function updateProfile(id, { name, class: cls, section, height, dateOfBirth, hasVisionProblem, hasHearingProblem }) {
  const data = {};
  if (name !== undefined) data.name = name;
  if (cls !== undefined) data.class = cls !== null ? parseInt(cls) : null;
  if (section !== undefined) data.section = section;
  if (height !== undefined) data.height = height !== null ? parseFloat(height) : null;
  if (dateOfBirth !== undefined) data.dateOfBirth = dateOfBirth ? new Date(dateOfBirth) : null;
  if (hasVisionProblem !== undefined) data.hasVisionProblem = !!hasVisionProblem;
  if (hasHearingProblem !== undefined) data.hasHearingProblem = !!hasHearingProblem;

  const user = await prisma.user.update({
    where: { id },
    data,
    select: {
      id: true, rollNumber: true, name: true, role: true,
      class: true, section: true, height: true, dateOfBirth: true,
      hasVisionProblem: true, hasHearingProblem: true,
      isCaptain: true, strikeCount: true, settings: true, createdAt: true,
    },
  });

  if (!user) throw new AppError('User not found', 404);
  return user;
}

async function getUserById(id) {
  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true, rollNumber: true, name: true, role: true,
      class: true, section: true, height: true, dateOfBirth: true,
      hasVisionProblem: true, hasHearingProblem: true,
      isCaptain: true, strikeCount: true, settings: true, createdAt: true,
    },
  });
  if (!user) throw new AppError('User not found', 404);
  return user;
}

async function getSettings(userId) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { settings: true },
  });
  if (!user) throw new AppError('User not found', 404);
  return user.settings || {};
}

async function updateSettings(userId, settings) {
  const user = await prisma.user.update({
    where: { id: userId },
    data: { settings },
    select: { id: true, settings: true },
  });
  return user.settings;
}

module.exports = { register, login, refreshToken, logout, getProfile: getUserById, getUserById, updateProfile, getSettings, updateSettings, encryptIdentity };
