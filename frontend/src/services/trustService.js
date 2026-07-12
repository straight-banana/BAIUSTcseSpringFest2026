import api from './api.js';

const mapFlag = (f) => {
  if (!f) return f;
  return {
    ...f,
    targetName: f.target?.name,
    targetRoll: f.target?.rollNumber,
  };
};

export const getScore = (userId) => api.get(`/trust/${userId}/score`).then((r) => r.data);

export const getFlags = (userId) => api.get(`/trust/${userId}/flags`).then((r) => (r.data || []).map(mapFlag));

export const getAllFlags = () => api.get('/trust/flags').then((r) => (r.data || []).map(mapFlag));

export const getDashboard = () => api.get('/trust/dashboard').then((r) => r.data);

export const createFlag = (userId, reason) =>
  api.post(`/trust/${userId}/flags`, { reason }).then((r) => mapFlag(r.data));

export const resolveFlag = (flagId) => api.patch(`/trust/flags/${flagId}/resolve`).then((r) => mapFlag(r.data));
