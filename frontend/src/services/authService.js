import api, { setToken, clearToken } from './api.js';

export async function register({ rollNumber, name, password, role, className, section, height, dob, vision, hearing }) {
  const res = await api.post('/auth/register', {
    rollNumber, name, password, role, className, section,
    height, dob, vision, hearing,
  });
  if (res?.data?.token) setToken(res.data.token);
  return res.data; // { user, token }
}

export async function login({ rollNumber, password }) {
  const res = await api.post('/auth/login', { rollNumber, password });
  if (res?.data?.token) setToken(res.data.token);
  return res.data; // { user, token }
}

export async function me() {
  const res = await api.get('/auth/me');
  return res.data;
}

export function logout() {
  clearToken();
}
