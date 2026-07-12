import api from './api.js';

export const generateSeatingPlan = ({ planName, gridCols, students }) =>
  api.post('/seats/plan', { planName, gridCols, students }).then((r) => r.data);

export const getLatestPlan = () => api.get('/seats').then((r) => r.data);
export const getPlan = (planId) => api.get(`/seats/${planId}`).then((r) => r.data);
export const listPlans = () => api.get('/seats/all/plans').then((r) => r.data);
export const deletePlan = (planId) => api.del(`/seats/${planId}`).then((r) => r.data);
