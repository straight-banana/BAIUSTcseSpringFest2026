import MissionSubNav from '../mission-common/MissionSubNav.jsx';

const links = [
  { to: '/mission-8', end: true, label: 'Dashboard' },
  { to: '/mission-8/assign', label: 'Assign Captain' },
  { to: '/mission-8/rankings', label: 'Rankings' },
  { to: '/mission-8/compare', label: 'Compare' },
];

export default function Mission8SubNav() {
  return <MissionSubNav links={links} ariaLabel="Mission 8 sections" />;
}
