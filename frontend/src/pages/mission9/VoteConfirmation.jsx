import { Link, useSearchParams } from 'react-router-dom';
import { CheckCircle2, Copy, LayoutDashboard, BarChart3 } from 'lucide-react';
import { useState } from 'react';
import PageContainer from '../../components/layout/PageContainer.jsx';
import Card from '../../components/common/Card.jsx';
import Button from '../../components/common/Button.jsx';
import Avatar from '../../components/ui/Avatar.jsx';
import Badge from '../../components/ui/Badge.jsx';
import { ELECTION, getCandidateById } from '../../mocks/data/mission9.js';

export default function VoteConfirmation() {
  const [params] = useSearchParams();
  const ref = params.get('ref') || 'VOTE-2026-XXXXXX';
  const candidate = getCandidateById(params.get('candidate') || 'cand-1');
  const [copied, setCopied] = useState(false);

  const copy = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(ref).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      });
    }
  };

  return (
    <PageContainer>
      <div className="max-w-xl mx-auto">
        <Card className="p-8 text-center relative overflow-hidden">
          <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-success/10 text-success flex items-center justify-center animate-in fade-in zoom-in duration-500">
            <CheckCircle2 size={36} />
          </div>
          <h1 className="text-xl sm:text-2xl font-semibold text-fg">Vote submitted successfully</h1>
          <p className="mt-2 text-sm text-muted">
            Thank you for participating in the {ELECTION.name}. Your ballot has been recorded anonymously.
          </p>

          <div className="mt-6 rounded-xl bg-elevated border border-border p-4 text-left">
            <p className="text-[11px] uppercase text-subtle">Vote reference ID</p>
            <div className="mt-1 flex items-center justify-between gap-2">
              <p className="text-sm font-mono font-semibold text-fg break-all">{ref}</p>
              <button
                onClick={copy}
                className="inline-flex items-center gap-1.5 h-8 px-3 text-xs rounded-md bg-surface border border-border hover:bg-elevated text-muted hover:text-fg transition-colors"
                aria-label="Copy vote reference"
              >
                <Copy size={12} />{copied ? 'Copied' : 'Copy'}
              </button>
            </div>
            <p className="text-[11px] text-muted mt-1">Save this ID — it is the only trace you have that a ballot was cast.</p>
          </div>

          <div className="mt-6 rounded-xl border border-border p-4 flex items-center gap-3 text-left">
            <Avatar name={candidate.name} size={44} />
            <div className="min-w-0 flex-1">
              <p className="text-xs text-muted">You voted for</p>
              <p className="text-sm font-semibold text-fg truncate">{candidate.name}</p>
              <p className="text-xs text-muted truncate">{candidate.roll} · {candidate.department}</p>
            </div>
            <Badge tone="success">Recorded</Badge>
          </div>

          <div className="mt-4 rounded-xl bg-brand/5 border border-brand/30 p-3 text-left">
            <p className="text-xs text-muted"><span className="font-semibold text-fg">Election:</span> {ELECTION.name}</p>
            <p className="text-xs text-muted"><span className="font-semibold text-fg">Closes:</span> {new Date(ELECTION.closes).toLocaleString()}</p>
            <p className="text-xs text-muted"><span className="font-semibold text-fg">Results:</span> Published Feb 22, 2026</p>
          </div>

          <div className="mt-6 flex flex-wrap justify-center gap-2">
            <Link to="/mission-9"><Button variant="outline" leftIcon={<LayoutDashboard size={14} />}>Return to Dashboard</Button></Link>
            <Link to="/mission-9/results"><Button leftIcon={<BarChart3 size={14} />}>View Election Status</Button></Link>
          </div>
        </Card>
      </div>
    </PageContainer>
  );
}
