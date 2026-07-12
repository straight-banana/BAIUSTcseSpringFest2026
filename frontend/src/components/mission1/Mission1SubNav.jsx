import MissionSubNav from '../mission-common/MissionSubNav.jsx';
import { useAuth } from '../../context/AuthContext.jsx';

const studentLinks = [
  { to: '/mission-1', end: true, label: 'Overview' },
  { to: '/mission-1/submit', label: 'Submit' },
  { to: '/mission-1/history', label: 'History' },
];

const reviewerLinks = [
  { to: '/mission-1', end: true, label: 'Overview' },
  { to: '/mission-1/archive', label: 'Case archive' },
  { to: '/mission-1/analytics', label: 'Analytics' },
];

export default function Mission1SubNav() {
  const { role } = useAuth();
  const isReviewer = role === 'teacher' || role === 'office';
  return <MissionSubNav links={isReviewer ? reviewerLinks : studentLinks} ariaLabel="Mission 1 sections" />;
}
