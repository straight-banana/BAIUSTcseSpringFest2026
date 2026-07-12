import api from './api.js';

export const SOS_LOCATIONS = ['LIBRARY', 'PLAYGROUND', 'CORRIDOR', 'CLASSROOM', 'CANTEEN'];

const LOCATION_MAP = {
  classroom: 'CLASSROOM',
  library: 'LIBRARY',
  playground: 'PLAYGROUND',
  corridor: 'CORRIDOR',
  canteen: 'CANTEEN',
  laboratory: 'OTHER',
  auditorium: 'OTHER',
  other: 'OTHER',
};

const TYPE_MAP = {
  bullying: 'BULLYING',
  injury: 'MEDICAL',
  medical: 'MEDICAL',
  harass: 'BULLYING',
  theft: 'THEFT',
  fight: 'BULLYING',
  lost: 'OTHER',
  other: 'OTHER',
};

const SEVERITY_MAP = {
  low: 'LOW',
  medium: 'MEDIUM',
  high: 'HIGH',
  critical: 'CRITICAL',
};

export const triggerSos = ({ location, type, severity, message, description, note }) => {
  const normalizedLocation = LOCATION_MAP[location] || 'OTHER';
  const normalizedType = TYPE_MAP[type] || 'OTHER';
  const normalizedSeverity = SEVERITY_MAP[severity] || 'MEDIUM';
  const finalMessage = message || description || note || null;

  return api
    .post('/sos', {
      location: normalizedLocation,
      type: normalizedType,
      severity: normalizedSeverity,
      message: finalMessage,
    })
    .then((r) => r.data);
};

export const listActiveSos = () => api.get('/sos/active').then((r) => r.data);
export const listAllSos = () => api.get('/sos').then((r) => r.data);
export const resolveSos = (id) => api.patch(`/sos/${id}/resolve`).then((r) => r.data);
