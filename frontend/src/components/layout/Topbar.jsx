import { useState } from 'react';
import { Menu, Search, Bell, Sun, Moon, Eye, Siren } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import Avatar from '../ui/Avatar.jsx';
import { Dropdown, Popover } from '../ui/Overlays.jsx';
import { useLocation, useNavigate } from 'react-router-dom';
import SosReportModal from '../mission5/SosReportModal.jsx';

const TITLES = {
  '/': 'Daily Bulletin',
  '/mission-1': 'Whistleblower',
  '/mission-2': 'Seat Planner',
  '/mission-3': 'Syllabus AI',
  '/mission-4': 'Tiffin Ledger',
  '/mission-5': 'SOS Rescue',
  '/mission-6': 'Fact Checker',
  '/mission-7': 'Peer Rating',
  '/mission-8': 'Captain Engine',
  '/mission-9': 'Captain Voting',
  '/analytics': 'Analytics',
  '/notifications': 'Notifications',
  '/profile': 'Profile',
  '/settings': 'Settings',
};

const CODES = {
  '/': 'FILE 00',
  '/mission-1': 'FILE 01',
  '/mission-2': 'FILE 02',
  '/mission-3': 'FILE 03',
  '/mission-4': 'FILE 04',
  '/mission-5': 'FILE 05',
  '/mission-6': 'FILE 06',
  '/mission-7': 'FILE 07',
  '/mission-8': 'FILE 08',
  '/mission-9': 'FILE 09',
};

export default function Topbar({ onOpenSidebar, liveCount = 0 }) {
  const { theme, toggle, colorblind, toggleColorblind } = useTheme();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { signOut, user, role } = useAuth();
  const base = '/' + (pathname.split('/')[1] || '');
  const title = TITLES[base] || 'Console';
  const code = CODES[base] || 'OFFICE';
  const [sosOpen, setSosOpen] = useState(false);
  const isStudent = role === 'student' || user?.role === 'student' || user?.roles?.includes('student');

  const handleSignOut = () => {
    signOut();
    navigate('/auth/welcome', { replace: true });
  };

  const handleSosSubmit = (payload) => {
    setSosOpen(false);
    navigate('/mission-5/success', { state: payload });
  };

  return (
    <>
    <header
      style={{ background: 'rgb(var(--sidebar-bg))', color: 'rgb(var(--chrome-fg))' }}
      className="sticky top-0 z-20 border-b border-[rgb(var(--chrome-fg))]/15 text-[rgb(var(--chrome-fg))]"
    >
      {/* Row 1 — utility rail */}
      <div className="h-9 px-4 sm:px-6 flex items-center gap-3 border-b border-[rgb(var(--chrome-fg))]/15 text-[rgb(var(--chrome-fg))]/80">

        <div className="flex-1" />
        {liveCount > 0 && (
          <span className="inline-flex items-center gap-1.5 font-mono text-[10px] tracking-widest uppercase text-[rgb(var(--chrome-fg))]">
            <span className="h-1.5 w-1.5 rounded-full bg-white stamp-live" />
            {liveCount} live signal{liveCount === 1 ? '' : 's'}
          </span>
        )}
      </div>

      {/* Row 2 — title bar */}
      <div className="px-4 sm:px-6 py-3 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4">
        <div className="min-w-0">
          <p className="font-mono text-[10px] font-medium tracking-[0.18em] uppercase text-[rgb(var(--chrome-fg))]/75">{code}</p>
          <h1 className="mt-0.5 font-display text-xl sm:text-2xl leading-none text-[rgb(var(--chrome-fg))] truncate">
            {title}
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <label className="hidden md:flex items-center gap-2 w-72 h-9 px-3 border border-[rgb(var(--chrome-fg))]/30 bg-[rgb(var(--chrome-fg))]/8 text-sm text-[rgb(var(--chrome-fg))]/90 rounded-sm focus-within:border-white focus-within:bg-[rgb(var(--chrome-fg))]/10">
            <Search size={14} />
            <input
              className="flex-1 bg-transparent outline-none placeholder:text-[rgb(var(--chrome-fg))]/60 text-[rgb(var(--chrome-fg))]"
              placeholder="Search cases, students, rolls…"
              aria-label="Search"
            />
            <kbd className="font-mono text-[10px] text-[rgb(var(--chrome-fg))]/70 border border-[rgb(var(--chrome-fg))]/30 px-1">/</kbd>
          </label>

          <button
            onClick={toggle}
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            className="h-9 w-9 border border-[rgb(var(--chrome-fg))]/30 text-[rgb(var(--chrome-fg))]/90 hover:text-[rgb(var(--chrome-fg))] hover:bg-[rgb(var(--chrome-fg))]/8 flex items-center justify-center rounded-sm"
          >
            {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
          </button>

          <button
            onClick={toggleColorblind}
            aria-label={colorblind ? 'Disable colorblind mode' : 'Enable colorblind mode'}
            aria-pressed={colorblind}
            title={colorblind ? 'Colorblind mode: on' : 'Colorblind mode: off'}
            className={
              colorblind
                ? 'h-9 w-9 border border-white bg-white/20 text-white flex items-center justify-center rounded-sm'
                : 'h-9 w-9 border border-[rgb(var(--chrome-fg))]/30 text-[rgb(var(--chrome-fg))]/90 hover:text-[rgb(var(--chrome-fg))] hover:bg-[rgb(var(--chrome-fg))]/8 flex items-center justify-center rounded-sm'
            }
          >
            <Eye size={15} />
          </button>

          {isStudent && (
            <button
              onClick={() => setSosOpen(true)}
              aria-label="Trigger SOS emergency"
              className="inline-flex items-center gap-1.5 h-9 px-3 rounded-sm bg-danger text-white font-mono text-[11px] font-bold tracking-widest uppercase hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-danger/60 shadow-sm"
            >
              <Siren size={14} />
              SOS
            </button>
          )}

          <Popover
            trigger={
              <span className="relative h-9 w-9 border border-[rgb(var(--chrome-fg))]/30 text-[rgb(var(--chrome-fg))]/90 hover:text-[rgb(var(--chrome-fg))] hover:bg-[rgb(var(--chrome-fg))]/8 flex items-center justify-center rounded-sm">
                <Bell size={15} />
                <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-white" aria-hidden />
              </span>
            }
          >
            <p className="eyebrow mb-2">Recent entries</p>
            <ul className="space-y-2 text-xs text-muted">
              <li>New SOS filed from Playground</li>
              <li>Trust score drop flagged for Captain Rana</li>
              <li>Vote closes in 2 hours</li>
            </ul>
          </Popover>

          <Dropdown
            trigger={<Avatar name={user?.name || user?.rollId || 'Account'} />}
            items={[
              { label: 'Profile', onClick: () => navigate('/profile') },
              { label: 'Settings', onClick: () => navigate('/settings') },
              { label: 'Sign out', onClick: handleSignOut },
            ]}
          />
        </div>
      </div>

    </header>
    {isStudent && (
      <SosReportModal open={sosOpen} onClose={() => setSosOpen(false)} onSubmit={handleSosSubmit} />
    )}
    </>
  );
}
