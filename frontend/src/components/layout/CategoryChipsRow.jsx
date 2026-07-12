import { NavLink, useLocation } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import { cx } from '../../utils/index.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { NAV_BY_ROLE } from '../../routes/navigation.js';
import { prefetchRoute } from '../../routes/prefetch.js';

// Mobile quick-nav: minimal chips. Order is stable — the active chip stays
// where it sits in the nav list and simply scrolls into view.
export default function CategoryChipsRow() {
  const { role } = useAuth();
  const { pathname } = useLocation();
  const navRole = role === 'teacher' ? 'office' : role;
  const NAV = NAV_BY_ROLE[navRole] || NAV_BY_ROLE.student;

  const items = NAV.flatMap((g) => g.items);
  const scrollerRef = useRef(null);

  useEffect(() => {
    const el = scrollerRef.current?.querySelector('[data-active="true"]');
    if (el && typeof el.scrollIntoView === 'function') {
      el.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }
  }, [pathname]);


  return (
    <div className="border-b border-border bg-bg">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <nav
          ref={scrollerRef}
          aria-label="Quick navigation"
          className="flex gap-2 overflow-x-auto py-3 no-scrollbar"
        >
          {items.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onMouseEnter={() => prefetchRoute(to)}
              onTouchStart={() => prefetchRoute(to)}
              onFocus={() => prefetchRoute(to)}
              className={({ isActive }) =>
                cx(
                  'inline-flex items-center gap-2 rounded-full px-3.5 h-9 text-sm font-medium whitespace-nowrap shrink-0 transition-colors border',
                  isActive
                    ? 'bg-brand text-brand-fg border-transparent shadow-sm'
                    : 'bg-surface text-fg border-border hover:bg-elevated'
                )
              }
            >
              {({ isActive }) => (
                <span data-active={isActive ? 'true' : 'false'} className="inline-flex items-center gap-2">
                  <Icon size={14} />
                  {label}
                </span>
              )}
            </NavLink>

          ))}
        </nav>

      </div>
    </div>
  );
}
