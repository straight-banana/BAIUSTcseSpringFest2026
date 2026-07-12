'use strict';

/**
 * Reads + validates required environment variables.
 * Throws on startup if any required var is missing.
 */

const REQUIRED_VARS = [
  'DATABASE_URL',
  'JWT_SECRET',
];

function validateEnv() {
  const missing = REQUIRED_VARS.filter((key) => !process.env[key]);
  if (missing.length > 0) {
    throw new Error(
      `❌ Missing required environment variables: ${missing.join(', ')}\n` +
        `   Copy .env.example → .env and fill in the values.`
    );
  }
}

const env = {
  PORT: parseInt(process.env.PORT || '5000', 10),
  NODE_ENV: process.env.NODE_ENV || 'development',
  DATABASE_URL: process.env.DATABASE_URL,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:3000',
  MAX_FILE_SIZE_MB: parseInt(process.env.MAX_FILE_SIZE_MB || '5', 10),
  UPLOAD_DIR: process.env.UPLOAD_DIR || 'uploads',
};

module.exports = { env, validateEnv };
