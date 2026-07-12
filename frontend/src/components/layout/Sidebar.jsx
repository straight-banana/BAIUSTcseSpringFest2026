import { memo } from 'react';
import { NavLink } from 'react-router-dom';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { cx } from '../../utils/index.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { NAV_BY_ROLE } from '../../routes/navigation.js';
import { prefetchRoute } from '../../routes/prefetch.js';

function Sidebar({ collapsed, onToggle, mobileOpen, onCloseMobile }) {
  const { role } = useAuth();
  const NAV = NAV_BY_ROLE[role] || NAV_BY_ROLE.student;
  return (
    <>
    {mobileOpen && (
      <div className="fixed inset-0 z-50 lg:hidden">
        <button
          type="button"
          aria-label="Close navigation overlay"
          className="absolute inset-0 bg-fg/35"
          onClick={onCloseMobile}
        />
        <aside
          style={{ background: 'rgb(var(--sidebar-bg))', color: 'rgb(var(--chrome-fg))' }}
          className="relative z-10 flex h-dvh w-72 max-w-[86vw] flex-col border-r border-[rgb(var(--chrome-fg))]/15 shadow-xl"
        >
          <div className="border-b border-[rgb(var(--chrome-fg))]/15 px-4 py-4">
            <div className="flex items-center gap-3">
              <div className="relative h-10 w-10 shrink-0 border border-[rgb(var(--chrome-fg))]/40 bg-[rgb(var(--chrome-fg))]/10 text-[rgb(var(--chrome-fg))] flex items-center justify-center font-display text-xl">
                K
                <span aria-hidden className="absolute -bottom-1 -right-1 h-3 w-3 bg-white border border-[rgb(var(--chrome-fg))]/60" />
              </div>
              <div className="min-w-0 leading-tight">
                <p className="font-display text-[15px] uppercase tracking-wide truncate text-[rgb(var(--chrome-fg))]">Anti Kuddus Protocol</p>
                <p className="font-mono text-[10px] uppercase tracking-widest text-[rgb(var(--chrome-fg))]/80 mt-0.5">
                  Class 9C · Reg. 2026
                </p>
              </div>
              <button
                type="button"
                aria-label="Close navigation"
                onClick={onCloseMobile}
                className="ml-auto h-8 w-8 border border-[rgb(var(--chrome-fg))]/30 text-[rgb(var(--chrome-fg))]/90 hover:text-[rgb(var(--chrome-fg))] hover:bg-[rgb(var(--chrome-fg))]/8 flex items-center justify-center rounded-sm"
              >
                <X size={15} />
              </button>
            </div>
          </div>

          <NavSections NAV={NAV} collapsed={false} onCloseMobile={onCloseMobile} />
        </aside>
      </div>
    )}

    <aside
      style={{ background: 'rgb(var(--sidebar-bg))', color: 'rgb(var(--chrome-fg))' }}
      className={cx(
        'hidden lg:flex sticky top-0 z-40 h-dvh shrink-0',
        'border-r border-[rgb(var(--chrome-fg))]/15',
        'flex-col transition-[width] duration-200',
        collapsed ? 'lg:w-16' : 'lg:w-64'
      )}
    >
        {/* Header — official stamp */}
        <div className="border-b border-[rgb(var(--chrome-fg))]/15 px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="relative h-10 w-10 shrink-0 border border-[rgb(var(--chrome-fg))]/40 bg-[rgb(var(--chrome-fg))]/10 text-[rgb(var(--chrome-fg))] flex items-center justify-center font-display text-xl">
              K
              <span aria-hidden className="absolute -bottom-1 -right-1 h-3 w-3 bg-white border border-[rgb(var(--chrome-fg))]/60" />
            </div>
            {!collapsed && (
              <div className="min-w-0 leading-tight">
                <p className="font-display text-[15px] uppercase tracking-wide truncate text-[rgb(var(--chrome-fg))]">Anti Kuddus Protocol</p>
                <p className="font-mono text-[10px] uppercase tracking-widest text-[rgb(var(--chrome-fg))]/80 mt-0.5">
                  Class 9C · Reg. 2026
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Nav */}
        <NavSections NAV={NAV} collapsed={collapsed} onCloseMobile={onCloseMobile} />

        {/* Footer */}
        <div className="border-t border-[rgb(var(--chrome-fg))]/15 p-3 hidden lg:block">
          <button
            onClick={onToggle}
            className="w-full flex items-center justify-center gap-2 h-8 text-[11px] font-mono uppercase tracking-widest text-[rgb(var(--chrome-fg))]/80 hover:text-[rgb(var(--chrome-fg))] transition-colors"
            aria-label={collapsed ? 'Expand navigation' : 'Collapse navigation'}
          >
            {collapsed ? <ChevronRight size={14} /> : (<><ChevronLeft size={14} /> Collapse</>)}
          </button>
        </div>
      </aside>
    </>
  );
}

function NavSections({ NAV, collapsed, onCloseMobile }) {
  return (
    <nav className="flex-1 overflow-y-auto py-3">
      {NAV.map((group) => (
        <div key={group.section} className="mb-5">
          {!collapsed && (
            <div className="px-4 mb-2">
              <p className="font-mono text-[10px] font-medium tracking-[0.18em] uppercase text-[rgb(var(--chrome-fg))]/75">{group.section}</p>
            </div>
          )}
          <ul>
            {group.items.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  end={item.end}
                  onClick={onCloseMobile}
                  onMouseEnter={() => prefetchRoute(item.to)}
                  onFocus={() => prefetchRoute(item.to)}
                  className={({ isActive }) =>
                    cx(
                      'relative flex items-center gap-3 py-2.5 pl-4 pr-3 text-sm font-medium transition-colors',
                      'border-l-[3px]',
                      isActive
                        ? 'border-white bg-[rgb(var(--chrome-fg))]/15 text-[rgb(var(--chrome-fg))]'
                        : 'border-transparent text-[rgb(var(--chrome-fg))]/90 hover:text-[rgb(var(--chrome-fg))] hover:bg-[rgb(var(--chrome-fg))]/8',
                      collapsed && 'justify-center px-2'
                    )
                  }
                  title={collapsed ? item.label : undefined}
                >
                  <item.icon size={16} className="shrink-0" />
                  {!collapsed && <span className="truncate">{item.label}</span>}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </nav>
  );
}

export default memo(Sidebar);
