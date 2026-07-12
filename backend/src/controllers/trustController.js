'use strict';

const trustService = require('../services/trustService');
const { successResponse } = require('../utils/apiResponse');

async function getTrustScore(req, res, next) {
  try {
    const score = await trustService.getTrustScore(req.params.userId);
    res.json(successResponse(score));
  } catch (error) {
    next(error);
  }
}

async function getUnresolvedFlags(req, res, next) {
  try {
    const flags = await trustService.getUnresolvedFlags(req.params.userId);
    res.json(successResponse(flags));
  } catch (error) {
    next(error);
  }
}

async function getAllFlags(req, res, next) {
  try {
    const flags = await trustService.getUnresolvedFlags();
    res.json(successResponse(flags));
  } catch (error) {
    next(error);
  }
}

async function getDashboard(req, res, next) {
  try {
    const dashboard = await trustService.getDashboard();
    res.json(successResponse(dashboard));
  } catch (error) {
    next(error);
  }
}

async function createFlag(req, res, next) {
  try {
    const flag = await trustService.createFlag(req.params.userId, req.body.reason);
    res.status(201).json(successResponse(flag));
  } catch (error) {
    next(error);
  }
}

async function resolveFlag(req, res, next) {
  try {
    const flag = await trustService.resolveFlag(req.params.flagId);
    res.json(successResponse(flag));
  } catch (error) {
    next(error);
  }
}

module.exports = { getTrustScore, getUnresolvedFlags, getAllFlags, getDashboard, createFlag, resolveFlag };
