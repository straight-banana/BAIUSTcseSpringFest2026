import MissionSubNav from '../mission-common/MissionSubNav.jsx';

const links = [
  { to: '/mission-9', end: true, label: 'Dashboard' },
  { to: '/mission-9/candidates', label: 'Candidates' },
  { to: '/mission-9/results', label: 'Results' },
];

export default function Mission9SubNav() {
  return <MissionSubNav links={links} ariaLabel="Mission 9 sections" />;
}
