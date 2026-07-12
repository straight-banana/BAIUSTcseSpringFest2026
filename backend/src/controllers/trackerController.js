'use strict';

const trackerService = require('../services/trackerService');

async function addEntry(req, res, next) {
  try {
    const data = { ...req.body, userId: req.user ? req.user.id : null };
    const entry = await trackerService.addEntry(data);
    res.status(201).json({ status: 'success', data: entry });
  } catch (error) {
    next(error);
  }
}

async function listEntries(req, res, next) {
  try {
    const { page, limit, type, status, mine } = req.query;
    const userId = mine === 'true' && req.user ? req.user.id : undefined;
    const result = await trackerService.listEntries({
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 20,
      type, status, userId
    });
    res.json({ status: 'success', data: result });
  } catch (error) {
    next(error);
  }
}

async function getEntry(req, res, next) {
  try {
    const entry = await trackerService.getEntry(req.params.id);
    res.json({ status: 'success', data: entry });
  } catch (error) {
    next(error);
  }
}

async function getSummary(req, res, next) {
  try {
    const { mine } = req.query;
    const userId = mine === 'true' && req.user ? req.user.id : undefined;
    const summary = await trackerService.getSummary(userId);
    res.json({ status: 'success', data: summary });
  } catch (error) {
    next(error);
  }
}

async function updateStatus(req, res, next) {
  try {
    const { action } = req.body;
    const entry = await trackerService.updateEntryStatus(req.params.id, action, req.user.id);
    res.json({ status: 'success', data: entry });
  } catch (error) {
    next(error);
  }
}

async function deleteEntry(req, res, next) {
  try {
    await trackerService.deleteEntry(req.params.id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}

async function getBudgets(req, res, next) {
  try {
    const budgets = await trackerService.getBudgets();
    res.json({ status: 'success', data: budgets });
  } catch (error) {
    next(error);
  }
}

async function getMenu(req, res, next) {
  try {
    const menu = await trackerService.getTodayMenu();
    res.json({ status: 'success', data: menu });
  } catch (error) {
    next(error);
  }
}

async function upsertMenu(req, res, next) {
  try {
    const menu = await trackerService.upsertMenu(req.body);
    res.json({ status: 'success', data: menu });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  addEntry, listEntries, getEntry, getSummary, updateStatus, deleteEntry,
  getBudgets, getMenu, upsertMenu,
};
