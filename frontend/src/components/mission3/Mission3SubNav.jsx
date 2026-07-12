import MissionSubNav from '../mission-common/MissionSubNav.jsx';

const links = [
  { to: '/mission-3', end: true, label: 'Workspace' },
  { to: '/mission-3/input', label: 'New' },
  { to: '/mission-3/plan', label: 'Study Plan' },
];

export default function Mission3SubNav() {
  return <MissionSubNav links={links} ariaLabel="Mission 3 sections" />;
}
