'use strict';

require('dotenv').config();
const { PrismaClient } = require('@prisma/client');

/**
 * Singleton Prisma client — import this everywhere instead of
 * calling `new PrismaClient()` directly.
 */
const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
});

module.exports = prisma;

