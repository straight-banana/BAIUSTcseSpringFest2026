// Route chunk prefetch: kicked off on link hover / focus so the lazy chunk is
// warm before the user clicks. Keys are the route path prefixes used in the
// sidebar / mobile chips (see routes/navigation.js).
const LOADERS = {
  '/student':      () => import('../pages/dashboards/StudentDashboard.jsx'),
  '/captain':      () => import('../pages/dashboards/CaptainDashboardHome.jsx'),
  '/office':       () => import('../pages/dashboards/OfficeDashboard.jsx'),
  '/teacher':      () => import('../pages/dashboards/TeacherDashboard.jsx'),
  '/analytics':    () => import('../pages/Analytics.jsx'),
  '/notifications':() => import('../pages/Notifications.jsx'),
  '/profile':      () => import('../pages/Profile.jsx'),
  '/settings':     () => import('../pages/Settings.jsx'),
  '/mission-1':    () => import('../pages/mission1/Mission1Overview.jsx'),
  '/mission-1/captain':  () => import('../pages/mission1/CaptainDashboard.jsx'),
  '/mission-1/archive':  () => import('../pages/mission1/ComplaintHistory.jsx'),
  '/mission-2':    () => import('../pages/mission2/Mission2Overview.jsx'),
  '/mission-3':    () => import('../pages/mission3/AIWorkspace.jsx'),
  '/mission-4':    () => import('../pages/mission4/Mission4Overview.jsx'),
  '/mission-4/tiffin': () => import('../pages/mission4/TiffinDashboard.jsx'),
  '/mission-5/captain':   () => import('../pages/mission5/CaptainDashboard.jsx'),
  '/mission-5/incidents': () => import('../pages/mission5/SosHistory.jsx'),
  '/mission-6':    () => import('../pages/mission6/FactCheckerLanding.jsx'),
  '/mission-7':    () => import('../pages/mission7/PeerRatingDashboard.jsx'),
  '/mission-7/leaderboard': () => import('../pages/mission7/LeaderboardPage.jsx'),
  '/mission-8':    () => import('../pages/mission8/RecommendationDashboard.jsx'),
  '/mission-9':    () => import('../pages/mission9/VotingDashboard.jsx'),
  '/mission-9/results': () => import('../pages/mission9/ElectionResults.jsx'),
  '/mission-10':   () => import('../pages/mission10/TrustDashboard.jsx'),
};

const started = new Set();

export function prefetchRoute(to) {
  if (!to || started.has(to)) return;
  const loader = LOADERS[to];
  if (!loader) return;
  started.add(to);
  // Fire and forget; ignore rejections so a slow network doesn't leak errors.
  loader().catch(() => started.delete(to));
}
