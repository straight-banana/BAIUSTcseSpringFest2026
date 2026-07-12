'use strict';

const authService = require('../services/authService');

async function register(req, res, next) {
  try {
    const { accessToken, refreshToken, user } = await authService.register(req.body);
    res.status(201).json({ status: 'success', data: { token: accessToken, refreshToken, user } });
  } catch (error) {
    next(error);
  }
}

async function login(req, res, next) {
  try {
    const { token, refreshToken, user } = await authService.login(req.body);
    res.json({ status: 'success', data: { token, refreshToken, user } });
  } catch (error) {
    next(error);
  }
}

async function refreshToken(req, res, next) {
  try {
    const { refreshToken } = req.body;
    const tokens = await authService.refreshToken(refreshToken);
    res.json({ status: 'success', data: tokens });
  } catch (error) {
    next(error);
  }
}

async function logout(req, res, next) {
  try {
    await authService.logout(req.user.id);
    res.json({ status: 'success', message: 'Logged out successfully' });
  } catch (error) {
    next(error);
  }
}

async function getProfile(req, res, next) {
  try {
    const profile = await authService.getProfile(req.params.id);
    res.json({ status: 'success', data: profile });
  } catch (error) {
    next(error);
  }
}

async function getMe(req, res, next) {
  try {
    const profile = await authService.getProfile(req.user.id);
    res.json({ status: 'success', data: profile });
  } catch (error) {
    next(error);
  }
}

async function updateProfile(req, res, next) {
  try {
    const profile = await authService.updateProfile(req.params.id, req.body);
    res.json({ status: 'success', data: profile });
  } catch (error) {
    next(error);
  }
}

module.exports = { register, login, refreshToken, logout, getProfile, getMe, updateProfile };
