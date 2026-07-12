import { useAuth } from '../context/AuthContext.jsx';

/**
 * Picks between two elements based on the current user's role.
 * Used to keep captain/office seat-planner pages, while students see
 * only their own seat view.
 */
export default function RoleSwitch({ studentEl, staffEl }) {
  const { role } = useAuth();
  return role === 'student' ? studentEl : staffEl;
}
