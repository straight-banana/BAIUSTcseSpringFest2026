import api from './api.js';

// Real ElectionCandidate has only { bio, achievements, user } — no manifesto/scores/votes.
// Default those fields so shared cards (CandidateVoteCard, WinnerCard) that read
// c.scores.leadership / c.scores.peer.toFixed() / c.overallScore / c.votes never crash.
const mapCandidate = (c) => {
  if (!c) return c;
  return {
    ...c,
    name: c.user?.name,
    roll: c.user?.rollNumber,
    className: c.user?.class,
    section: c.user?.section,
    isCaptain: c.user?.isCaptain,
    manifesto: c.bio || '',
    scores: { leadership: 0, peer: 0 },
    overallScore: 0,
    votes: 0,
    votePct: 0,
  };
};

const mapElection = (e) => {
  if (!e) return e;
  return {
    ...e,
    candidates: Array.isArray(e.candidates) ? e.candidates.map(mapCandidate) : e.candidates,
  };
};

export const getActive = () => api.get('/elections/active').then((r) => mapElection(r.data));

export const list = () => api.get('/elections').then((r) => r.data || []);

export const getHistory = () => api.get('/elections/history').then((r) => r.data || []);

export const getCandidates = (electionId) =>
  api.get(`/elections/${electionId}/candidates`).then((r) => (r.data || []).map(mapCandidate));

export const getCandidateProfile = (electionId, candidateId) =>
  api.get(`/elections/${electionId}/candidates/${candidateId}`).then((r) => mapCandidate(r.data));

export const compareCandidates = (electionId, candidateIds) =>
  api.get(`/elections/${electionId}/candidates/compare?ids=${candidateIds.join(',')}`).then((r) => (r.data || []).map(mapCandidate));

export const getTimeline = (electionId) => api.get(`/elections/${electionId}/timeline`).then((r) => r.data);

export const getResults = (electionId) =>
  api.get(`/elections/${electionId}/results`).then((r) => ({
    ...r.data,
    results: (r.data?.results || []).map((row) => ({ ...row, name: row.user?.name, roll: row.user?.rollNumber })),
  }));

export const castVote = (electionId, rankedChoices) =>
  api.post(`/elections/${electionId}/vote`, { rankedChoices }).then((r) => r.data);

export const hasVoted = (electionId) => api.get(`/elections/${electionId}/has-voted`).then((r) => r.data);

// Admin actions
export const createElection = (payload) => api.post('/elections', payload).then((r) => mapElection(r.data));

export const addCandidate = (electionId, userId, payload) =>
  api.post(`/elections/${electionId}/candidates`, { userId, ...payload }).then((r) => mapCandidate(r.data));

export const getAdminView = (electionId) => api.get(`/elections/${electionId}/admin`).then((r) => mapElection(r.data));

export const updateStatus = (electionId, status) =>
  api.patch(`/elections/${electionId}/status`, { status }).then((r) => mapElection(r.data));

export const getActivityLog = (electionId) => api.get(`/elections/${electionId}/activity`).then((r) => r.data || []);
