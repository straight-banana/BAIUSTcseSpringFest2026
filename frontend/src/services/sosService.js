import api from './api.js';

export const SOS_LOCATIONS = ['LIBRARY', 'PLAYGROUND', 'CORRIDOR', 'CLASSROOM', 'CANTEEN'];

export const triggerSos = ({ location, message }) =>
  api.post('/sos', { location, message }).then((r) => r.data);

export const listActiveSos = () => api.get('/sos/active').then((r) => r.data);
export const listAllSos = () => api.get('/sos').then((r) => r.data);
export const claimSos = (id) => api.patch(`/sos/${id}/claim`).then((r) => r.data);
export const resolveSos = (id) => api.patch(`/sos/${id}/resolve`).then((r) => r.data);
export const getSosLocations = () => api.get('/sos/locations').then((r) => r.data);
export const getSosAnalytics = () => api.get('/sos/analytics').then((r) => r.data);
