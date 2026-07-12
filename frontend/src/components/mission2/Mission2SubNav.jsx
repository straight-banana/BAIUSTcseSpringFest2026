import MissionSubNav from '../mission-common/MissionSubNav.jsx';

const links = [
  { to: '/mission-2', end: true, label: 'Overview' },
  { to: '/mission-2/classroom', label: 'Classroom' },
  { to: '/mission-2/plan', label: 'Plan' },
];

export default function Mission2SubNav() {
  return <MissionSubNav links={links} ariaLabel="Mission 2 sections" />;
}
