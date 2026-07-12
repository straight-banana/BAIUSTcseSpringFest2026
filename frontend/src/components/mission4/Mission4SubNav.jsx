import MissionSubNav from '../mission-common/MissionSubNav.jsx';

const links = [
  { to: '/mission-4', end: true, label: 'Ledger' },
  { to: '/mission-4/history', label: 'History' },
  { to: '/mission-4/analytics', label: 'Analytics' },
];

export default function Mission4SubNav() {
  return <MissionSubNav links={links} ariaLabel="Mission 4 sections" />;
}
