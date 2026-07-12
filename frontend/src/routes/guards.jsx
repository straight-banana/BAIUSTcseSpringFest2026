import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { canAccess, ROLE_HOME } from './permissions.js';

export function RequireAuth({ children }) {
  const { user, loading } = useAuth();
  const loc = useLocation();
  if (loading) return null;
  if (!user) return <Navigate to="/" replace state={{ from: loc.pathname }} />;
  return children ?? <Outlet />;
}

export function RoleGuard({ children }) {
  const { user, role, loading } = useAuth();
  const loc = useLocation();
  if (loading) return null;
  if (!user) return <Navigate to="/" replace />;
  const active = role || user.roles?.[0] || 'student';
  // /app is the authenticated entry point — send users to their role home.
  if (loc.pathname === '/app') {
    return <Navigate to={ROLE_HOME[active] || '/student'} replace />;
  }
  if (!canAccess(active, loc.pathname)) {
    return <Navigate to="/auth/denied" replace />;
  }
  return children ?? <Outlet />;
}
