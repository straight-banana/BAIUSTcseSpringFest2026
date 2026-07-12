import MissionSubNav from '../mission-common/MissionSubNav.jsx';

const links = [
  { to: '/mission-5', end: true, label: 'SOS' },
  { to: '/mission-5/report', label: 'Report' },
  { to: '/mission-5/history', label: 'History' },
];

export default function Mission5SubNav() {
  return <MissionSubNav links={links} ariaLabel="Mission 5 sections" />;
}
