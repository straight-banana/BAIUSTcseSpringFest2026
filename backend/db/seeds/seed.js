'use strict';

/**
 * Seed script — run with: node db/seeds/seed.js
 * Creates 30 sample students + 1 admin account.
 */

require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();



const SALT_ROUNDS = 10;

const students = [
  { rollNumber: '001', name: 'Alice Rahman', height: 145 },
  { rollNumber: '002', name: 'Bob Hossain', height: 168 },
  { rollNumber: '003', name: 'Charlie Islam', height: 155 },
  { rollNumber: '004', name: 'Diana Khan', height: 140 },
  { rollNumber: '005', name: 'Kuddus Mia', height: 172 },
  { rollNumber: '006', name: 'Farhan Ahmed', height: 160 },
  { rollNumber: '007', name: 'Gita Das', height: 148 },
  { rollNumber: '008', name: 'Habib Ullah', height: 176 },
  { rollNumber: '009', name: 'Ismat Jahan', height: 143 },
  { rollNumber: '010', name: 'Jamal Uddin', height: 165 },
  { rollNumber: '011', name: 'Kiran Biswas', height: 152 },
  { rollNumber: '012', name: 'Lina Akter', height: 138 },
  { rollNumber: '013', name: 'Monir Hasan', height: 170 },
  { rollNumber: '014', name: 'Nadia Sultana', height: 158 },
  { rollNumber: '015', name: 'Omar Faruk', height: 163 },
  { rollNumber: '016', name: 'Priya Sharma', height: 147 },
  { rollNumber: '017', name: 'Qasim Ali', height: 174 },
  { rollNumber: '018', name: 'Ritu Devi', height: 141 },
  { rollNumber: '019', name: 'Salim Reza', height: 167 },
  { rollNumber: '020', name: 'Tania Akter', height: 154 },
  { rollNumber: '021', name: 'Umar Sheikh', height: 162 },
  { rollNumber: '022', name: 'Vipa Roy', height: 144 },
  { rollNumber: '023', name: 'Wahid Hasan', height: 178 },
  { rollNumber: '024', name: 'Xena Das', height: 150 },
  { rollNumber: '025', name: 'Yusuf Molla', height: 169 },
  { rollNumber: '026', name: 'Zannat Bibi', height: 137 },
  { rollNumber: '027', name: 'Arif Islam', height: 173 },
  { rollNumber: '028', name: 'Bela Begum', height: 146 },
  { rollNumber: '029', name: 'Cyrus Alam', height: 161 },
  { rollNumber: '030', name: 'Dola Khanam', height: 153 },
];

async function main() {
  console.log('🌱 Seeding database...');

  // Admin account
  const adminHash = await bcrypt.hash('admin123', SALT_ROUNDS);
  await prisma.user.upsert({
    where: { rollNumber: 'ADMIN' },
    update: {},
    create: {
      rollNumber: 'ADMIN',
      name: 'Class Teacher',
      passwordHash: adminHash,
      role: 'ADMIN',
    },
  });
  console.log('✅ Admin created: ADMIN / admin123');

  // Teacher / office account (custom login)
  const teacherHash = await bcrypt.hash('1234', SALT_ROUNDS);
  await prisma.user.upsert({
    where: { rollNumber: 't101' },
    update: {},
    create: {
      rollNumber: 't101',
      name: 'Teacher / Office',
      passwordHash: teacherHash,
      role: 'ADMIN',
    },
  });
  console.log('✅ Teacher/Office account created: t101 / 1234');

  // Students
  for (const s of students) {
    const hash = await bcrypt.hash('student123', SALT_ROUNDS);
    await prisma.user.upsert({
      where: { rollNumber: s.rollNumber },
      update: {},
      create: {
        rollNumber: s.rollNumber,
        name: s.name,
        passwordHash: hash,
        role: 'STUDENT',
      },
    });
  }
  console.log(`✅ ${students.length} students created (password: student123)`);
  console.log('🎉 Seed complete!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
