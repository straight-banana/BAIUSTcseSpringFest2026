import { useAuth } from '../context/AuthContext.jsx';
import { canAccess } from '../routes/permissions.js';

/**
 * Hide children when the active role cannot see the given feature.
 *
 * Usage:
 *   <RoleGate roles={['captain', 'office']}> ... </RoleGate>
 *   <RoleGate path="/mission-1/moderation"> ... </RoleGate>
 */
export default function RoleGate({ roles, path, fallback = null, children }) {
  const { role, user } = useAuth();
  const active = role || user?.roles?.[0] || 'student';

  if (path && !canAccess(active, path)) return fallback;
  if (roles && !roles.includes(active)) return fallback;
  return children;
}
