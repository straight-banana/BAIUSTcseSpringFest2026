// Path-prefix access matrix per role. `*` = allow everything.
// Order does not matter — we check with startsWith.
// Kept in sync with the Role × Capability × Endpoint matrix.
export const COMMON = ['/profile', '/settings', '/notifications', '/team', '/analytics'];

export const ROLE_ACCESS = {
  student: [
    '/student',
    // M1 — own submissions + own history/strikes only
    '/mission-1', '/mission-1/submit', '/mission-1/submitted', '/mission-1/history',
    '/mission-1/strikes', '/mission-1/evidence',
    // M2 — read-only auto plan
    '/mission-2',
    // M3
    '/mission-3',
    // M4 — full tiffin ledger view
    '/mission-4',
    // M5 — trigger + own history
    '/mission-5', '/mission-5/report', '/mission-5/success', '/mission-5/history',
    // M6
    '/mission-6',
    // M7 — rate + own history + public leaderboard
    '/mission-7', '/mission-7/students', '/mission-7/rate', '/mission-7/leaderboard', '/mission-7/history',
    // M9 — voter surfaces
    '/mission-9', '/mission-9/candidates', '/mission-9/compare', '/mission-9/ballot',
    '/mission-9/confirmation', '/mission-9/results',
    ...COMMON,
  ],
  captain: [
    '/captain',
    // M1 — triage
    '/mission-1/captain', '/mission-1/history', '/mission-1/strikes', '/mission-1/moderation/students',
    // M2 — overview, roster (read), plan
    '/mission-2',
    // M4 — full ledger + menu
    '/mission-4',
    // M5 — console + full incidents view + supporting screens
    '/mission-5', '/mission-5/captain', '/mission-5/map', '/mission-5/analytics',
    '/mission-5/notifications', '/mission-5/history', '/mission-5/incidents',
    // M7 — leaderboard + analytics + roster
    '/mission-7/leaderboard', '/mission-7/analytics', '/mission-7/students',
    // M8 — captain engine is teacher-only
    // (removed from captain access)

    // M9 — read
    '/mission-9/results', '/mission-9/candidates',
    // M10 — own trust score
    '/mission-10',
    ...COMMON,
  ],
  office: ['*'],
  teacher: ['*'],
};

export function canAccess(role, pathname) {
  const effective = role || 'student';
  const allow = ROLE_ACCESS[effective] || ROLE_ACCESS.student;
  if (allow.includes('*')) return true;
  return allow.some((p) => pathname === p || pathname.startsWith(p + '/'));
}

export const ROLE_HOME = {
  student: '/student',
  captain: '/captain',
  office: '/office',
  teacher: '/teacher',
};
