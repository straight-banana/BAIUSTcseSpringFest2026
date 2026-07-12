import { Gavel, BarChart3, Users, BookOpen } from 'lucide-react';
import RoleDashboardShell from './RoleDashboardShell.jsx';

export default function OfficeDashboard() {
  return (
    <RoleDashboardShell
      role="office"
      title="Office console"
      subtitle="Moderation authority, analytics, and election oversight."
      stats={[
        { label: 'Awaiting review', value: '7', hint: 'Complaints' },
        { label: 'Auto-flags', value: '2', hint: 'Trust threshold' },
        { label: 'Candidates', value: '4', hint: 'Shortlisted' },
        { label: 'Turnout', value: '68%', hint: 'Current election' },
      ]}
      actions={[
        { label: 'Moderation queue', description: 'Validate, reject, or escalate reports.', to: '/mission-1/moderation', icon: Gavel },
        { label: 'Analytics', description: 'Complaint trends and SOS heatmap.', to: '/mission-1/analytics', icon: BarChart3 },
        { label: 'Election admin', description: 'Manage candidates and ballots.', to: '/mission-9/admin', icon: Users },
        { label: 'Syllabus AI', description: 'Filtered study plans and RAG.', to: '/mission-3', icon: BookOpen },
      ]}
    />
  );
}
