import MissionSubNav from '../mission-common/MissionSubNav.jsx';

const links = [
  { to: '/mission-7', end: true, label: 'Dashboard' },
  { to: '/mission-7/rate', label: 'Rate' },
  { to: '/mission-7/leaderboard', label: 'Leaderboard' },
];

export default function Mission7SubNav() {
  return <MissionSubNav links={links} ariaLabel="Mission 7 sections" />;
}
