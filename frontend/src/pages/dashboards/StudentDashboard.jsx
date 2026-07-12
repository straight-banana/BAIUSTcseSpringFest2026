import { FileWarning, Star, Vote, SearchCheck } from 'lucide-react';
import RoleDashboardShell from './RoleDashboardShell.jsx';

export default function StudentDashboard() {
  return (
    <RoleDashboardShell
      role="student"
      title="Student console"
      subtitle="Report, rate, vote — anonymously and safely."
      stats={[
        { label: 'Open complaints', value: '2', hint: 'Under review' },
        { label: 'Peer ratings given', value: '14', hint: 'This term' },
        { label: 'Strike meter', value: '1 / 3', hint: 'Warnings against Kuddus' },
        { label: 'Votes cast', value: '3', hint: 'Elections' },
      ]}
      actions={[
        { label: 'File complaint', description: 'Anonymously report an incident.', to: '/mission-1/submit', icon: FileWarning },
        { label: 'Rate a peer', description: 'Score classmates on core traits.', to: '/mission-1', icon: Star },
        { label: 'Vote for captain', description: 'Ranked-choice ballot.', to: '/mission-1/captain', icon: Vote },
        { label: 'Fact-checker', description: 'Verify a Kuddus quote against the rulebook.', to: '/mission-6', icon: SearchCheck },
      ]}
    />
  );
}
