import api from './api.js';

export const CATEGORY_LABELS = {
  leadership: 'Leadership',
  communication: 'Communication',
  teamwork: 'Teamwork',
  punctuality: 'Punctuality',
  attitude: 'Attitude',
};

export function weightsToList(weights = {}) {
  return Object.entries(weights || {}).map(([key, weight]) => ({
    key,
    weight,
    label: CATEGORY_LABELS[key] || key.charAt(0).toUpperCase() + key.slice(1),
  }));
}

// Real CandidateProfile has no peerRating/attendancePct/department/cgpa fields —
// default them so shared cards (e.g. CandidateCard.jsx calling .toFixed() on peerRating)
// never crash on missing data. Pages that want the real peer-rating number merge it in
// from ratingsService.getLeaderboard() by userId.
const mapProfile = (p) => {
  if (!p) return p;
  return {
    ...p,
    name: p.user?.name,
    roll: p.user?.rollNumber,
    className: p.user?.class,
    section: p.user?.section,
    userId: p.userId || p.user?.id,
    overall: p.computedScore,
    scores: { ...(p.scores || {}), overall: p.computedScore },
    peerRating: 0,
    peerRatingCount: 0,
    attendancePct: 0,
    cgpa: null,
    department: null,
  };
};

export const listRounds = () => api.get('/candidates/rounds').then((r) => r.data || []);

export const getCurrentRound = () =>
  listRounds().then((rounds) => rounds.find((rnd) => rnd.isActive) || rounds[0] || null);

export const getRound = (roundId) => api.get(`/candidates/rounds/${roundId}`).then((r) => r.data);

export const createRound = (name, weights) =>
  api.post('/candidates/rounds', { name, weights }).then((r) => r.data);

export const updateWeights = (roundId, weights) =>
  api.patch(`/candidates/rounds/${roundId}/weights`, { weights }).then((r) => r.data);

export const getRankedCandidates = (roundId, { minScore, badge } = {}) => {
  const params = new URLSearchParams();
  if (minScore != null) params.set('minScore', minScore);
  if (badge) params.set('badge', badge);
  const qs = params.toString() ? `?${params.toString()}` : '';
  return api.get(`/candidates/rounds/${roundId}/candidates${qs}`).then((r) => (r.data || []).map(mapProfile));
};

export const getProfile = (roundId, userId) =>
  api.get(`/candidates/rounds/${roundId}/candidates/${userId}`).then((r) => mapProfile(r.data));

export const upsertProfile = (roundId, userId, data) =>
  api.put(`/candidates/rounds/${roundId}/candidates/${userId}`, data).then((r) => mapProfile(r.data));

export const compareCandidates = (roundId, userIds) =>
  api.get(`/candidates/rounds/${roundId}/candidates/compare?ids=${userIds.join(',')}`).then((r) => (r.data || []).map(mapProfile));

export const submitOverride = (roundId, userId, { add, remove, pin, reason }) =>
  api.post(`/candidates/rounds/${roundId}/candidates/${userId}/override`, { add, remove, pin, reason }).then((r) => mapProfile(r.data));

export const getHistory = () => api.get('/candidates/history').then((r) => r.data || []);

export const getAnalytics = (roundId) => api.get(`/candidates/rounds/${roundId}/analytics`).then((r) => r.data);

export const getRoster = ({ class: cls, section, q } = {}) => {
  const params = new URLSearchParams();
  if (cls) params.set('class', cls);
  if (section) params.set('section', section);
  if (q) params.set('q', q);
  const qs = params.toString() ? `?${params.toString()}` : '';
  return api.get(`/candidates/roster${qs}`).then((r) => (r.data || []).map((s) => ({ ...s, roll: s.rollNumber, className: s.class })));
};

export const setCaptain = (studentId, isCaptain) =>
  api.patch(`/candidates/roster/${studentId}/captain`, { isCaptain }).then((r) => r.data);

export const getCaptains = () => api.get('/candidates/captains').then((r) => (r.data || []).map((s) => ({ ...s, roll: s.rollNumber, className: s.class })));
