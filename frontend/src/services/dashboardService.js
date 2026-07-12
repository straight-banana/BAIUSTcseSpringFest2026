// Shared dashboard + notifications endpoints
import api from './api.js';

export const getDashboardStats = () => api.get('/dashboard/stats').then((r) => r.data);
export const getDashboardActivity = () => api.get('/dashboard/activity').then((r) => r.data);
export const getDashboardCharts = () => api.get('/dashboard/charts').then((r) => r.data);

export const getNotifications = () => api.get('/dashboard/notifications').then((r) => r.data);
export const markNotificationRead = (id) =>
  api.patch(`/dashboard/notifications/${id}/read`).then((r) => r.data);
export const markAllNotificationsRead = () =>
  api.patch('/dashboard/notifications/mark-all-read').then((r) => r.data);
