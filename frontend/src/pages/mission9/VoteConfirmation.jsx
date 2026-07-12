import { Link, useLocation } from 'react-router-dom';
import { CheckCircle2, LayoutDashboard, BarChart3 } from 'lucide-react';
import PageContainer from '../../components/layout/PageContainer.jsx';
import Card from '../../components/common/Card.jsx';
import Button from '../../components/common/Button.jsx';
import Avatar from '../../components/ui/Avatar.jsx';
import Badge from '../../components/ui/Badge.jsx';

export default function VoteConfirmation() {
  const { state } = useLocation();
  const candidate = state?.candidate;
  const electionTitle = state?.electionTitle;

  return (
    <PageContainer>
      <div className="max-w-xl mx-auto">
        <Card className="p-8 text-center relative overflow-hidden">
          <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-success/10 text-success flex items-center justify-center animate-in fade-in zoom-in duration-500">
            <CheckCircle2 size={36} />
          </div>
          <h1 className="text-xl sm:text-2xl font-semibold text-fg">Vote submitted successfully</h1>
          <p className="mt-2 text-sm text-muted">
            Thank you for participating{electionTitle ? ` in ${electionTitle}` : ''}. Your ballot has been recorded anonymously — there is no link back to your identity.
          </p>

          {candidate && (
            <div className="mt-6 rounded-xl border border-border p-4 flex items-center gap-3 text-left">
              <Avatar name={candidate.name} size={44} />
              <div className="min-w-0 flex-1">
                <p className="text-xs text-muted">You voted for</p>
                <p className="text-sm font-semibold text-fg truncate">{candidate.name}</p>
                <p className="text-xs text-muted truncate">{candidate.roll}</p>
              </div>
              <Badge tone="success">Recorded</Badge>
            </div>
          )}

          <div className="mt-6 flex flex-wrap justify-center gap-2">
            <Link to="/mission-9"><Button variant="outline" leftIcon={<LayoutDashboard size={14} />}>Return to Dashboard</Button></Link>
            <Link to="/mission-9/results"><Button leftIcon={<BarChart3 size={14} />}>View Election Status</Button></Link>
          </div>
        </Card>
      </div>
    </PageContainer>
  );
}
