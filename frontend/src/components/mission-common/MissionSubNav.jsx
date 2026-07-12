import { NavLink } from 'react-router-dom';
import { cx } from '../../utils/index.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { canAccess } from '../../routes/permissions.js';

/**
 * Shared mission sub-navigation. Filters tabs by the active role so users
 * only see sections they are permitted to open.
 */
export default function MissionSubNav({ links, ariaLabel }) {
  const { role, user } = useAuth();
  const active = role || user?.roles?.[0] || 'student';
  const visible = links.filter((l) => canAccess(active, l.to));
  if (visible.length === 0) return null;

  return (
    <div className="border-b border-border -mx-4 sm:-mx-6 px-4 sm:px-6 mb-6 overflow-x-auto">
      <nav className="flex gap-1 min-w-max" aria-label={ariaLabel}>
        {visible.map((l) => (
          <NavLink
            key={l.to}
            to={l.to}
            end={l.end}
            className={({ isActive }) =>
              cx(
                'px-3 py-2.5 text-sm border-b-2 -mb-px transition-colors whitespace-nowrap',
                isActive
                  ? 'border-brand text-fg font-medium'
                  : 'border-transparent text-muted hover:text-fg'
              )
            }
          >
            {l.label}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
