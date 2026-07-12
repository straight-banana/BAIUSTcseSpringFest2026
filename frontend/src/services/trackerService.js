import api from './api.js';

export const TRACKER_TYPES = ['WASHROOM_TAX', 'STOLEN_FOOD'];

export const addTrackerEntry = ({ type, amount, description }) =>
  api.post('/tracker', { type, amount, description }).then((r) => r.data);

export const listTrackerEntries = () => api.get('/tracker').then((r) => r.data);
export const getTrackerEntry = (id) => api.get(`/tracker/${id}`).then((r) => r.data);
export const getTrackerSummary = () => api.get('/tracker/summary').then((r) => r.data);
export const updateTrackerStatus = (id, status) =>
  api.patch(`/tracker/${id}/status`, { status }).then((r) => r.data);
export const deleteTrackerEntry = (id) => api.del(`/tracker/${id}`).then((r) => r.data);

export const getBudgets = () => api.get('/tracker/budgets').then((r) => r.data);
export const getMenu = () => api.get('/tracker/menu').then((r) => r.data);
export const upsertMenu = (payload) => api.post('/tracker/menu', payload).then((r) => r.data);
