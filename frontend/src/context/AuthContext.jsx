import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import * as authService from '../services/authService.js';
import { getToken, clearToken } from '../services/api.js';

const AuthContext = createContext(null);

const ROLE_ROUTES = { student: '/student', captain: '/captain', office: '/office', teacher: '/teacher', admin: '/office' };
const ROLE_KEY = 'akp:selectedRole';
const USER_KEY = 'akp:user';

function normalizeRole(r) {
  if (!r) return null;
  const v = String(r).toLowerCase();
  // Backend only has STUDENT/ADMIN — no staffRole field to distinguish
  // "office" from "teacher". Land ADMIN accounts on the teacher panel by
  // default; both roles carry identical '*' permissions either way.
  if (v === 'admin') return 'teacher';
  return v;
}

function isTeacherStaff(user) {
  return String(user?.staffRole || '').toLowerCase() === 'teacher';
}

function deriveRoles(user) {
  if (!user) return [];
  if (isTeacherStaff(user)) return ['teacher'];
  if (Array.isArray(user.roles) && user.roles.length) return user.roles.map(normalizeRole);
  if (user.role) {
    const base = normalizeRole(user.role);
    // Captaincy isn't its own Role value in the backend — it's role: STUDENT
    // plus isCaptain: true. Surface it as 'captain' here so the rest of the
    // app (route guards, nav) sees the real permission level.
    if (base === 'student' && user.isCaptain) return ['captain'];
    return [base];
  }
  return ['student'];
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { const raw = localStorage.getItem(USER_KEY); return raw ? JSON.parse(raw) : null; } catch { return null; }
  });
  const [role, setRoleState] = useState(() => localStorage.getItem(ROLE_KEY));
  const [loading, setLoading] = useState(Boolean(getToken()));
  const [error, setError] = useState(null);
  const roles = deriveRoles(user);
  const normalizedRole = normalizeRole(role);
  const activeRole = normalizedRole && (!roles.length || roles.includes(normalizedRole))
    ? normalizedRole
    : roles[0] || null;

  const persistUser = (u) => {
    setUser(u);
    try { u ? localStorage.setItem(USER_KEY, JSON.stringify(u)) : localStorage.removeItem(USER_KEY); } catch {}
  };
  const setRole = (r) => {
    const n = normalizeRole(r);
    setRoleState(n);
    try { n ? localStorage.setItem(ROLE_KEY, n) : localStorage.removeItem(ROLE_KEY); } catch {}
  };

  // Rehydrate from token on mount (best-effort — backend optional)
  useEffect(() => {
    let alive = true;
    if (!getToken()) { setLoading(false); return; }
    authService.me()
      .then((u) => {
        if (!alive) return;
        persistUser(u);
        const roles = deriveRoles(u);
        if (roles.length === 1) setRole(roles[0]);
      })
      .catch(() => { clearToken(); })
      .finally(() => alive && setLoading(false));
    return () => { alive = false; };
  }, []);

  useEffect(() => {
    if (!user) return;
    const roles = deriveRoles(user);
    const active = normalizeRole(role);
    if (roles.length && (!active || !roles.includes(active))) setRole(roles[0]);
  }, [user, role]);

  const applyAuthResult = (u, chosenRole) => {
    persistUser(u);
    const roles = deriveRoles(u);
    // The role the backend actually returned is the source of truth — the
    // login form's tab is just a UX hint (which field to show) and only
    // matters as a fallback when the backend didn't give us enough to go on
    // (e.g. offline/demo-mode fallback, where `roles` is built from it anyway).
    const pick = (roles.length === 1 ? roles[0] : null) || normalizeRole(chosenRole);
    if (pick) setRole(pick);
  };

  const signIn = useCallback(async ({ rollNumber, password, role: chosenRole }) => {
    setError(null);
    try {
      const res = await authService.login({ rollNumber, password });
      const u = res.user;
      applyAuthResult(u, chosenRole);
      return { success: true, data: u };
    } catch (e) {
      const message = e?.message || 'Unable to sign in';
      setError(message);
      return { success: false, error: message };
    }
  }, []);

  const signUp = useCallback(async ({ rollNumber, name, password, role: chosenRole, className, section }) => {
    setError(null);
    try {
      const res = await authService.register({ rollNumber, name, password, role: normalizeRole(chosenRole), className, section });
      const u = res.user;
      applyAuthResult(u, chosenRole);
      return { success: true, data: u };
    } catch (e) {
      const message = e?.message || 'Unable to create account';
      setError(message);
      return { success: false, error: message };
    }
  }, []);

  const chooseRole = useCallback((r) => setRole(r), []);
  const signOut = useCallback(() => {
    authService.logout();
    persistUser(null);
    setRole(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, role: activeRole, roles, loading, error, signIn, signUp, chooseRole, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}

export { ROLE_ROUTES };
