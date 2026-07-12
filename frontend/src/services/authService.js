import api, { setToken, clearToken } from './api.js';

function toBackendRole(role) {
  if (!role) return undefined;
  const normalized = String(role).toUpperCase();
  return ['STUDENT', 'CAPTAIN', 'ADMIN'].includes(normalized) ? normalized : undefined;
}

function normalizeUser(user) {
  if (!user) return user;
  return {
    ...user,
    className: user.class ?? user.className,
    dob: user.dateOfBirth ?? user.dob,
    vision: user.vision ?? (user.hasVisionProblem ? 'Mild' : 'None'),
    hearing: user.hearing ?? (user.hasHearingProblem ? 'Mild' : 'None'),
  };
}

export async function register({ rollNumber, name, password, role, className, section, height, dob, vision, hearing }) {
  const res = await api.post('/auth/register', {
    rollNumber,
    name,
    password,
    role: toBackendRole(role),
    class: className,
    section,
    height,
    dateOfBirth: dob,
    hasVisionProblem: vision && vision !== 'None',
    hasHearingProblem: hearing && hearing !== 'None',
  });
  if (res?.data?.token) setToken(res.data.token);
  return { ...res.data, user: normalizeUser(res.data.user) };
}

export async function login({ rollNumber, password }) {
  const res = await api.post('/auth/login', { rollNumber, password });
  if (res?.data?.token) setToken(res.data.token);
  return { ...res.data, user: normalizeUser(res.data.user) };
}

export async function me() {
  const res = await api.get('/auth/me');
  return normalizeUser(res.data);
}

export function logout() {
  clearToken();
}
