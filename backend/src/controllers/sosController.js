'use strict';

const sosService = require('../services/sosService');
const { successResponse } = require('../utils/apiResponse');

async function triggerAlert(req, res, next) {
  try {
    const data = { ...req.body, reportedById: req.user ? req.user.id : null };
    const io = req.app.get('io');
    const alert = await sosService.triggerSos(data, io);
    res.status(201).json(successResponse(alert));
  } catch (error) {
    next(error);
  }
}

async function getActiveAlerts(req, res, next) {
  try {
    const alerts = await sosService.getActiveAlerts();
    res.json(successResponse(alerts));
  } catch (error) {
    next(error);
  }
}

async function listAlerts(req, res, next) {
  try {
    const { page, limit, status, location } = req.query;
    const result = await sosService.listAlerts({
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 20,
      status, location
    });
    res.json(successResponse(result));
  } catch (error) {
    next(error);
  }
}

async function claimAlert(req, res, next) {
  try {
    const io = req.app.get('io');
    const alert = await sosService.claimAlert(req.params.id, req.user.id, io);
    res.json(successResponse(alert));
  } catch (error) {
    next(error);
  }
}

async function resolveAlert(req, res, next) {
  try {
    const io = req.app.get('io');
    const alert = await sosService.resolveAlert(req.params.id, io);
    res.json(successResponse(alert));
  } catch (error) {
    next(error);
  }
}

async function getLocations(req, res, next) {
  try {
    const locations = sosService.getMapLocations();
    res.json(successResponse(locations));
  } catch (error) {
    next(error);
  }
}

async function getAnalytics(req, res, next) {
  try {
    const analytics = await sosService.getAnalytics();
    res.json(successResponse(analytics));
  } catch (error) {
    next(error);
  }
}

module.exports = { triggerAlert, getActiveAlerts, listAlerts, claimAlert, resolveAlert, getLocations, getAnalytics };
