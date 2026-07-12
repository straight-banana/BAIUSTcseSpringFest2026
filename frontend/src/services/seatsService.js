import api from './api.js';

export const generateSeatingPlan = ({ planName, gridCols, students }) =>
  api.post('/seats/plan', { planName, gridCols, students }).then((r) => r.data);

export const getLatestPlan = () => api.get('/seats/latest').then((r) => r.data);
export const getPlan = (planId) => api.get(`/seats/${planId}`).then((r) => r.data);
export const listPlans = () => api.get('/seats/all/plans').then((r) => r.data);
export const deletePlan = (planId) => api.del(`/seats/${planId}`).then((r) => r.data);

// Constraints
export const getConstraints = (planId) =>
  api.get(`/seats/${planId}/constraints`).then((r) => r.data);
export const addConstraint = (planId, constraint) =>
  api.post(`/seats/${planId}/constraints`, constraint).then((r) => r.data);

// Line of sight
export const getLineOfSight = (planId) =>
  api.get(`/seats/${planId}/line-of-sight`).then((r) => r.data);

// Manual seat move
export const moveSeat = (planId, seatId, patch) =>
  api.patch(`/seats/${planId}/seats/${seatId}/move`, patch).then((r) => r.data);
