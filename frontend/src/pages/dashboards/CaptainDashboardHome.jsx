import { Siren, Grid3X3, Coins, ShieldAlert } from 'lucide-react';
import RoleDashboardShell from './RoleDashboardShell.jsx';

export default function CaptainDashboardHome() {
  return (
    <RoleDashboardShell
      role="captain"
      title="Captain console"
      subtitle="Live moderation, distress signals, and class coordination."
      stats={[
        { label: 'Active SOS', value: '0', hint: 'Realtime' },
        { label: 'Pending complaints', value: '5', hint: 'Awaiting triage' },
        { label: 'Trust score', value: '82', hint: 'Rolling 30d' },
        { label: 'Tiffin ledger', value: '৳ 240', hint: 'Extorted this week' },
      ]}
      actions={[
        { label: 'SOS console', description: 'Monitor live distress flares.', to: '/mission-5', icon: Siren },
        { label: 'Seat planner', description: 'Line-of-sight aware grid.', to: '/mission-2', icon: Grid3X3 },
        { label: 'Tiffin ledger', description: 'Track extortion & lost caloric equity.', to: '/mission-4', icon: Coins },
        { label: 'Strike panel', description: 'View-only, no rater identity.', to: '/mission-1/captain', icon: ShieldAlert },
      ]}
    />
  );
}
