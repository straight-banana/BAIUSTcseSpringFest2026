import MissionSubNav from '../mission-common/MissionSubNav.jsx';

const links = [
  { to: '/mission-6', end: true, label: 'Checker' },
  { to: '/mission-6/rules', label: 'Rulebook' },
  { to: '/mission-6/trending', label: 'Trending' },
];

export default function Mission6SubNav() {
  return <MissionSubNav links={links} ariaLabel="Mission 6 sections" />;
}
