import api from './api.js';

export const getDashboardStats = () => api.get('/dashboard/stats').then((r) => r.data);
export const getDashboardActivity = () => api.get('/dashboard/activity').then((r) => r.data);
export const getDashboardCharts = () => api.get('/dashboard/charts').then((r) => r.data);
export const getDashboardNotifications = (unreadOnly = false) =>
  api.get(`/dashboard/notifications${unreadOnly ? '?unread=true' : ''}`).then((r) => r.data);