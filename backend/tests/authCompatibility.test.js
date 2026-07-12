process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-secret';
process.env.DATABASE_URL = process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/test';

const test = require('node:test');
const assert = require('node:assert/strict');
const { normalizeRegisterPayload } = require('../src/services/authService');

test('normalizes frontend-style register payloads to backend field names', () => {
  const payload = normalizeRegisterPayload({
    rollNumber: '901A-001',
    name: 'Asha',
    password: 'secret123',
    role: 'captain',
    className: '9',
    section: 'A',
    height: 160,
    dob: '2008-01-02',
    vision: 'Mild',
    hearing: 'None',
  });

  assert.equal(payload.role, 'STUDENT');
  assert.equal(payload.class, '9');
  assert.equal(payload.dateOfBirth, '2008-01-02');
  assert.equal(payload.hasVisionProblem, true);
  assert.equal(payload.hasHearingProblem, false);
  assert.equal(payload.height, 160);
});

test('rejects unsupported roles before they reach Prisma', () => {
  const payload = normalizeRegisterPayload({
    rollNumber: '901A-001',
    name: 'Asha',
    password: 'secret123',
    role: 'teacher',
  });

  assert.equal(payload.role, 'teacher');
  assert.equal(payload.error, 'Unsupported role: teacher');
});
