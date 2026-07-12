import api, { setToken, clearToken, getToken } from './api.js';

const REFRESH_KEY = 'refreshToken';
const getRefresh = () => { try { return localStorage.getItem(REFRESH_KEY); } catch { return null; } };
const setRefresh = (t) => { try { t ? localStorage.setItem(REFRESH_KEY, t) : localStorage.removeItem(REFRESH_KEY); } catch {} };

function persistTokens(data) {
  if (data?.token) setToken(data.token);
  if (data?.refreshToken) setRefresh(data.refreshToken);
}

export async function register({ rollNumber, name, password, role, className, section, height, dob, vision, hearing }) {
  // Backend accepts `class` or `className`, `dob` or `dateOfBirth`, and vision/hearing strings.
  const res = await api.post('/auth/register', {
    rollNumber, name, password, role: role ? String(role).toUpperCase() : undefined,
    className, section, height, dob, vision, hearing,
  });
  persistTokens(res?.data);
  return res.data; // { user, token, refreshToken? }
}

export async function login({ rollNumber, password }) {
  const res = await api.post('/auth/login', { rollNumber, password });
  persistTokens(res?.data);
  return res.data;
}

export async function refresh() {
  const refreshToken = getRefresh();
  if (!refreshToken) throw new Error('No refresh token');
  const res = await api.post('/auth/refresh', { refreshToken });
  persistTokens(res?.data);
  return res.data;
}

export async function me() {
  const res = await api.get('/auth/me');
  return res.data;
}

export async function getProfile(id) {
  const res = await api.get(`/auth/profile/${id}`);
  return res.data;
}

export async function updateProfile(id, patch) {
  const res = await api.put(`/auth/profile/${id}`, patch);
  return res.data;
}

export async function logout() {
  try { if (getToken()) await api.post('/auth/logout'); } catch { /* ignore */ }
  clearToken();
  setRefresh(null);
}
