'use strict';

const prisma = require('../config/prisma');
const { AppError } = require('../middleware/errorHandler');

const CALORIE_ESTIMATES = { WASHROOM_TAX: 0, STOLEN_FOOD: 250, BRIBE_PAYMENT: 0, OTHER_EXPENSE: 50 };

async function addEntry({ type, amount, description, paymentMethod, userId }) {
  const entry = await prisma.moneyTrack.create({
    data: {
      type, amount: parseFloat(amount), description,
      paymentMethod: paymentMethod || 'CASH',
      status: 'COMPLETED',
      userId: userId || null,
      auditHistory: JSON.stringify([{ action: 'CREATED', at: new Date().toISOString() }]),
    },
  });
  return entry;
}

async function listEntries({ page = 1, limit = 20, type, status, userId } = {}) {
  const skip = (page - 1) * limit;
  const where = {};
  if (type) where.type = type;
  if (status) where.status = status;
  if (userId) where.userId = userId;

  const [entries, total] = await Promise.all([
    prisma.moneyTrack.findMany({ where, skip, take: limit, orderBy: { createdAt: 'desc' } }),
    prisma.moneyTrack.count({ where }),
  ]);
  return { entries, total, page, limit, pages: Math.ceil(total / limit) };
}

async function getEntry(id) {
  const entry = await prisma.moneyTrack.findUnique({ where: { id } });
  if (!entry) throw new AppError('Entry not found', 404);
  return entry;
}

async function getSummary(userId) {
  const where = userId ? { userId } : {};
  const entries = await prisma.moneyTrack.findMany({ where, select: { type: true, amount: true } });
  const totalByType = {};
  let grandTotal = 0;
  let calories = 0;

  entries.forEach(e => {
    const amt = parseFloat(e.amount);
    totalByType[e.type] = (totalByType[e.type] || 0) + amt;
    grandTotal += amt;
    calories += (CALORIE_ESTIMATES[e.type] || 0);
  });

  const totalMoney = totalByType.WASHROOM_TAX || 0;
  const totalFood = totalByType.STOLEN_FOOD || 0;

  return {
    totalByType,
    totalMoney: parseFloat(totalMoney.toFixed(2)),
    totalFood: parseFloat(totalFood.toFixed(2)),
    grandTotal: parseFloat(grandTotal.toFixed(2)),
    funAnalysis: {
      totalCaloriesGained: calories,
      cricketBatsKuddusCouldBuy: Math.floor(grandTotal / 1200),
      jhalmuriBags: Math.floor(grandTotal / 20),
    },
  };
}

async function updateEntryStatus(id, action, by) {
  const entry = await prisma.moneyTrack.findUnique({ where: { id } });
  if (!entry) throw new AppError('Entry not found', 404);

  const statusMap = { approve: 'COMPLETED', complete: 'COMPLETED', refund: 'REFUNDED', cancel: 'CANCELLED' };
  const newStatus = statusMap[action];
  if (!newStatus) throw new AppError('Invalid action', 400);

  const history = Array.isArray(entry.auditHistory) ? entry.auditHistory : JSON.parse(entry.auditHistory || '[]');
  history.push({ action: action.toUpperCase(), at: new Date().toISOString(), by });

  return prisma.moneyTrack.update({
    where: { id },
    data: { status: newStatus, auditHistory: history },
  });
}

async function deleteEntry(id) {
  const entry = await prisma.moneyTrack.findUnique({ where: { id } });
  if (!entry) throw new AppError('Entry not found', 404);
  await prisma.moneyTrack.delete({ where: { id } });
}

async function getBudgets() {
  return prisma.budget.findMany();
}

async function getTodayMenu() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  const menu = await prisma.tiffinMenu.findFirst({
    where: { date: { gte: today, lt: tomorrow } },
  });
  return menu || { message: 'No menu set for today' };
}

async function upsertMenu({ date, items }) {
  const d = date ? new Date(date) : new Date();
  d.setHours(0, 0, 0, 0);

  return prisma.tiffinMenu.upsert({
    where: { date: d },
    update: { items },
    create: { date: d, items },
  });
}

module.exports = {
  addEntry, listEntries, getEntry, getSummary,
  updateEntryStatus, deleteEntry, getBudgets, getTodayMenu, upsertMenu,
};
