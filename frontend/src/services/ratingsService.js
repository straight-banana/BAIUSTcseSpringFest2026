import api from './api.js';

// Backend PeerRating.scores only aggregates these 5 keys (see backend/src/services/ratingService.js).
export const RATING_CATEGORIES = [
  { key: 'leadership',    label: 'Leadership' },
  { key: 'communication', label: 'Communication' },
  { key: 'teamwork',      label: 'Teamwork' },
  { key: 'punctuality',   label: 'Punctuality' },
  { key: 'attitude',      label: 'Attitude' },
];

const mapPerson = (u) => {
  if (!u) return u;
  return {
    ...u,
    roll: u.rollNumber,
    className: u.class,
    totalRatings: u._count?.receivedRatings ?? u.ratingCount ?? u.totalRatings,
  };
};

export const getRoster = () => api.get('/ratings/roster').then((r) => (r.data || []).map(mapPerson));

export const getMyRated = () => api.get('/ratings/my-rated').then((r) => (r.data || []).map(mapPerson));

export const submitRating = (rateeId, { scores, comment }) =>
  api.post(`/ratings/rate/${rateeId}`, { scores, comment }).then((r) => r.data);

export const getLeaderboard = () => api.get('/ratings/leaderboard').then((r) => (r.data || []).map(mapPerson));

export const getStudentProfile = (id) =>
  api.get(`/ratings/profile/${id}`).then((r) => mapPerson(r.data));

export const getPublicComments = (id) => api.get(`/ratings/profile/${id}/comments`).then((r) => r.data || []);

export const getModerationQueue = () =>
  api.get('/ratings/moderate').then((r) => (r.data || []).map((item) => ({ ...item, ratee: mapPerson(item.ratee) })));

export const moderateRating = (id, action, comment) =>
  api.patch(`/ratings/moderate/${id}`, { action, comment }).then((r) => r.data);

export const getAnalytics = () => api.get('/ratings/analytics').then((r) => r.data);
