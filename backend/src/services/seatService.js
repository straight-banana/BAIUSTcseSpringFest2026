'use strict';

const prisma = require('../config/prisma');
const { AppError } = require('../middleware/errorHandler');
const crypto = require('crypto');

// ── Seating Algorithm ─────────────────────────────────────────────────────────
// Rules:
//  1. Students with vision problems → front rows
//  2. Students with hearing problems → center columns
//  3. Kuddus (tallest student) → back row, center column
//  4. Remaining: sort by height ascending → fill front-to-back

function assignSeats(students, gridCols) {
  const sorted = [...students].sort((a, b) => a.height - b.height);

  // Find Kuddus (tallest)
  const tallest = [...students].sort((a, b) => b.height - a.height)[0];
  const kuddusIdx = sorted.findIndex(s => s.rollNumber === tallest.rollNumber);
  const kuddus = sorted.splice(kuddusIdx, 1)[0];

  // Vision students → front rows preference
  const visionStudents = sorted.filter(s => s.hasVisionProblem);
  const hearingStudents = sorted.filter(s => s.hasHearingProblem && !s.hasVisionProblem);
  const regular = sorted.filter(s => !s.hasVisionProblem && !s.hasHearingProblem);

  const ordered = [...visionStudents, ...hearingStudents, ...regular];

  const totalSeats = ordered.length + 1; // +1 for Kuddus
  const gridRows = Math.ceil(totalSeats / gridCols);

  const seats = [];
  let idx = 0;

  for (let r = 0; r < gridRows; r++) {
    for (let c = 0; c < gridCols; c++) {
      if (idx < ordered.length) {
        const student = ordered[idx++];
        seats.push({
          name: student.name,
          rollNumber: student.rollNumber,
          height: student.height,
          row: r,
          col: c,
          isKuddus: false,
          hasVisionProblem: student.hasVisionProblem || false,
          hasHearingProblem: student.hasHearingProblem || false,
          notes: student.notes || null,
        });
      }
    }
  }

  // Place Kuddus at last row, center column
  const kuddusRow = gridRows - 1;
  const kuddusCol = Math.floor(gridCols / 2);
  // Remove whoever is at that position (swap)
  const occupied = seats.find(s => s.row === kuddusRow && s.col === kuddusCol);
  if (occupied) {
    // Move displaced student to first empty seat
    const usedPositions = new Set(seats.map(s => `${s.row},${s.col}`));
    for (let r = 0; r < gridRows; r++) {
      for (let c = 0; c < gridCols; c++) {
        if (!usedPositions.has(`${r},${c}`)) {
          occupied.row = r;
          occupied.col = c;
          break;
        }
      }
      if (!(`${occupied.row},${occupied.col}` === `${kuddusRow},${kuddusCol}`)) break;
    }
  }

  seats.push({
    name: kuddus.name,
    rollNumber: kuddus.rollNumber,
    height: kuddus.height,
    row: kuddusRow,
    col: kuddusCol,
    isKuddus: true,
    hasVisionProblem: kuddus.hasVisionProblem || false,
    hasHearingProblem: kuddus.hasHearingProblem || false,
    notes: kuddus.notes || null,
  });

  return { seats, gridRows, gridCols };
}

async function generatePlan({ planName, gridCols, students }) {
  if (!students || students.length < 2) throw new AppError('Need at least 2 students', 400);
  const cols = parseInt(gridCols) || 5;

  const { seats, gridRows } = assignSeats(students, cols);

  // Deactivate old plans
  await prisma.seatPlan.updateMany({ where: { isActive: true }, data: { isActive: false } });

  const plan = await prisma.seatPlan.create({
    data: {
      planName: planName || 'Seating Plan',
      gridRows,
      gridCols: cols,
      isActive: true,
      seats: { create: seats },
    },
    include: { seats: true },
  });

  return plan;
}

async function getLatestPlan() {
  const plan = await prisma.seatPlan.findFirst({
    where: { isActive: true },
    orderBy: { createdAt: 'desc' },
    include: { seats: { orderBy: [{ row: 'asc' }, { col: 'asc' }] } },
  });
  if (!plan) throw new AppError('No active seat plan found', 404);
  return plan;
}

async function getPlanById(id) {
  const plan = await prisma.seatPlan.findUnique({
    where: { id },
    include: {
      seats: { orderBy: [{ row: 'asc' }, { col: 'asc' }] },
      constraints: true,
    },
  });
  if (!plan) throw new AppError('Seat plan not found', 404);
  return plan;
}

async function getAllPlans() {
  return prisma.seatPlan.findMany({
    orderBy: { createdAt: 'desc' },
    select: { id: true, planName: true, gridRows: true, gridCols: true, isActive: true, createdAt: true },
  });
}

async function deletePlan(id) {
  const plan = await prisma.seatPlan.findUnique({ where: { id } });
  if (!plan) throw new AppError('Plan not found', 404);
  await prisma.seatPlan.delete({ where: { id } });
}

async function getConstraints(planId) {
  const plan = await prisma.seatPlan.findUnique({ where: { id: planId } });
  if (!plan) throw new AppError('Plan not found', 404);
  return prisma.seatConstraint.findMany({ where: { planId } });
}

async function addConstraint(planId, { type, rollNumber, notes }) {
  const plan = await prisma.seatPlan.findUnique({ where: { id: planId } });
  if (!plan) throw new AppError('Plan not found', 404);
  return prisma.seatConstraint.create({ data: { planId, type, rollNumber, notes } });
}

async function getLineOfSight(planId) {
  const plan = await prisma.seatPlan.findUnique({
    where: { id: planId },
    include: { seats: { orderBy: [{ row: 'asc' }, { col: 'asc' }] } },
  });
  if (!plan) throw new AppError('Plan not found', 404);

  // Simple line-of-sight: students in last 2 rows who are shorter than the avg height of students in front
  const { seats, gridRows } = plan;
  const results = seats.map(seat => {
    const inFront = seats.filter(s => s.col === seat.col && s.row < seat.row);
    const blocked = inFront.some(s => s.height > seat.height);
    return { ...seat, isBlocked: blocked };
  });

  return { planId, gridRows, gridCols: plan.gridCols, lineOfSight: results };
}

async function moveSeat(planId, seatId, { row, col }) {
  const seat = await prisma.seat.findFirst({ where: { id: seatId, planId } });
  if (!seat) throw new AppError('Seat not found', 404);
  // Check target position
  const existing = await prisma.seat.findFirst({ where: { planId, row, col, NOT: { id: seatId } } });
  if (existing) throw new AppError('Target position is occupied', 409);
  return prisma.seat.update({ where: { id: seatId }, data: { row, col } });
}

module.exports = {
  generatePlan, getLatestPlan, getPlanById, getAllPlans, deletePlan,
  getConstraints, addConstraint, getLineOfSight, moveSeat,
};
