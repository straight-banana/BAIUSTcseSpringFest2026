'use strict';

const jwt = require('jsonwebtoken');
const { env } = require('../config/env');

function signToken(payload) {
  return jwt.sign(payload, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES_IN || '7d' });
}

function verifyToken(token) {
  try {
    return jwt.verify(token, env.JWT_SECRET);
  } catch {
    return null;
  }
}

function signRefreshToken(payload) {
  const secret = process.env.REFRESH_TOKEN_SECRET || env.JWT_SECRET + '_refresh';
  return jwt.sign(payload, secret, { expiresIn: '30d' });
}

function verifyRefreshToken(token) {
  try {
    const secret = process.env.REFRESH_TOKEN_SECRET || env.JWT_SECRET + '_refresh';
    return jwt.verify(token, secret);
  } catch {
    return null;
  }
}

module.exports = { signToken, verifyToken, signRefreshToken, verifyRefreshToken };
