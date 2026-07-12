'use strict';

const seatService = require('../services/seatService');

async function generatePlan(req, res, next) {
  try {
    const plan = await seatService.generatePlan(req.body);
    res.status(201).json({ status: 'success', data: plan });
  } catch (error) {
    next(error);
  }
}

async function getLatestPlan(req, res, next) {
  try {
    const plan = await seatService.getLatestPlan();
    res.json({ status: 'success', data: plan });
  } catch (error) {
    next(error);
  }
}

async function getPlan(req, res, next) {
  try {
    const plan = await seatService.getPlanById(req.params.id);
    res.json({ status: 'success', data: plan });
  } catch (error) {
    next(error);
  }
}

async function getAllPlans(req, res, next) {
  try {
    const plans = await seatService.getAllPlans();
    res.json({ status: 'success', data: plans });
  } catch (error) {
    next(error);
  }
}

async function deletePlan(req, res, next) {
  try {
    await seatService.deletePlan(req.params.id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}

async function getConstraints(req, res, next) {
  try {
    const constraints = await seatService.getConstraints(req.params.id);
    res.json({ status: 'success', data: constraints });
  } catch (error) {
    next(error);
  }
}

async function addConstraint(req, res, next) {
  try {
    const constraint = await seatService.addConstraint(req.params.id, req.body);
    res.status(201).json({ status: 'success', data: constraint });
  } catch (error) {
    next(error);
  }
}

async function getLineOfSight(req, res, next) {
  try {
    const data = await seatService.getLineOfSight(req.params.id);
    res.json({ status: 'success', data });
  } catch (error) {
    next(error);
  }
}

async function moveSeat(req, res, next) {
  try {
    const seat = await seatService.moveSeat(req.params.id, req.params.seatId, req.body);
    res.json({ status: 'success', data: seat });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  generatePlan, getLatestPlan, getPlan, getAllPlans, deletePlan,
  getConstraints, addConstraint, getLineOfSight, moveSeat,
};
