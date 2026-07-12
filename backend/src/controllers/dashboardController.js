'use strict';

const dashboardService = require('../services/dashboardService');

async function getStats(req, res, next) {
  try {
    const stats = await dashboardService.getStats(req.user.id, req.user.role);
    res.json({ status: 'success', data: stats });
  } catch (error) {
    next(error);
  }
}

async function getActivity(req, res, next) {
  try {
    const activity = await dashboardService.getActivity(req.user.id, req.user.role);
    res.json({ status: 'success', data: activity });
  } catch (error) {
    next(error);
  }
}

async function getCharts(req, res, next) {
  try {
    const charts = await dashboardService.getChartData();
    res.json({ status: 'success', data: charts });
  } catch (error) {
    next(error);
  }
}

async function getNotifications(req, res, next) {
  try {
    const { unread } = req.query;
    const notifications = await dashboardService.getNotifications(req.user.id, unread === 'true');
    res.json({ status: 'success', data: notifications });
  } catch (error) {
    next(error);
  }
}

async function markRead(req, res, next) {
  try {
    const notif = await dashboardService.markRead(req.params.id, req.user.id);
    res.json({ status: 'success', data: notif });
  } catch (error) {
    next(error);
  }
}

async function markAllRead(req, res, next) {
  try {
    const result = await dashboardService.markAllRead(req.user.id);
    res.json({ status: 'success', data: result });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getStats, getActivity, getCharts,
  getNotifications, markRead, markAllRead,
};
