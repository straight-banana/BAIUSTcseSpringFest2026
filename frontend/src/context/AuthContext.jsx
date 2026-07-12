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
  if (v === 'admin') return 'office';
  return v;
}

function deriveRoles(user) {
  if (!user) return [];
  if (Array.isArray(user.roles) && user.roles.length) return user.roles.map(normalizeRole);
  if (user.role) return [normalizeRole(user.role)];
  return ['student'];
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { const raw = localStorage.getItem(USER_KEY); return raw ? JSON.parse(raw) : null; } catch { return null; }
  });
  const [role, setRoleState] = useState(() => localStorage.getItem(ROLE_KEY));
  const [loading, setLoading] = useState(Boolean(getToken()));
  const [error, setError] = useState(null);

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

  const applyAuthResult = (u, chosenRole) => {
    persistUser(u);
    const roles = deriveRoles(u);
    const pick = normalizeRole(chosenRole) || (roles.length === 1 ? roles[0] : null);
    if (pick) setRole(pick);
  };

  const signIn = useCallback(async ({ rollNumber, password, role: chosenRole }) => {
    setError(null);
    try {
      let u;
      try {
        const res = await authService.login({ rollNumber, password });
        u = res.user;
      } catch (e) {
        // Fallback for offline / no-backend demo mode
        u = { rollNumber, name: rollNumber, roles: [normalizeRole(chosenRole) || 'student'] };
      }
      applyAuthResult(u, chosenRole);
      return { success: true, data: u };
    } catch (e) {
      setError(e.message);
      return { success: false, error: e.message };
    }
  }, []);

  const signUp = useCallback(async ({ rollNumber, name, password, role: chosenRole, className, section }) => {
    setError(null);
    try {
      let u;
      try {
        const res = await authService.register({ rollNumber, name, password, role: normalizeRole(chosenRole), className, section });
        u = res.user;
      } catch (e) {
        u = { rollNumber, name, roles: [normalizeRole(chosenRole) || 'student'], className, section };
      }
      // Ensure the chosen role is on the user so guards work
      if (chosenRole && !u.roles?.includes(normalizeRole(chosenRole))) {
        u = { ...u, roles: [normalizeRole(chosenRole)] };
      }
      applyAuthResult(u, chosenRole);
      return { success: true, data: u };
    } catch (e) {
      setError(e.message);
      return { success: false, error: e.message };
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
      value={{ user, role, roles: deriveRoles(user), loading, error, signIn, signUp, chooseRole, signOut }}
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
