import { useState } from 'react';
import { ShieldCheck, Play, Pause, Square, Send, Download, Activity, Users, Vote, TrendingUp } from 'lucide-react';
import PageContainer from '../../components/layout/PageContainer.jsx';
import PageHeader from '../../components/layout/PageHeader.jsx';
import Card from '../../components/common/Card.jsx';
import Button from '../../components/common/Button.jsx';
import Badge from '../../components/ui/Badge.jsx';
import Avatar from '../../components/ui/Avatar.jsx';
import SectionHeader from '../../components/ui/SectionHeader.jsx';
import Mission9SubNav from '../../components/mission9/Mission9SubNav.jsx';
import ElectionStatusBadge from '../../components/mission9/ElectionStatusBadge.jsx';
import ElectionStatCard from '../../components/mission9/ElectionStatCard.jsx';
import ElectionTimeline from '../../components/mission9/ElectionTimeline.jsx';
import { CANDIDATES, ELECTION, RECENT_ACTIVITY, TIMELINE, TURNOUT_PCT } from '../../mocks/data/mission9.js';

export default function AdminDashboard() {
  const [status, setStatus] = useState(ELECTION.status);
  const [toast, setToast] = useState('');

  const notify = (msg) => { setToast(msg); setTimeout(() => setToast(''), 2200); };

  const actions = [
    { label: 'Start Election',   icon: <Play size={14} />,   variant: 'success', disabled: status === 'active',                  onClick: () => { setStatus('active'); notify('Election started (UI only)'); } },
    { label: 'Pause Election',   icon: <Pause size={14} />,  variant: 'secondary', disabled: status !== 'active',                onClick: () => { setStatus('paused'); notify('Election paused (UI only)'); } },
    { label: 'End Election',     icon: <Square size={14} />, variant: 'outline', disabled: status === 'closed' || status === 'published', onClick: () => { setStatus('closed'); notify('Election ended (UI only)'); } },
    { label: 'Publish Results',  icon: <Send size={14} />,   variant: 'primary', disabled: status !== 'closed',                  onClick: () => { setStatus('published'); notify('Results published (UI only)'); } },
    { label: 'Export Results',   icon: <Download size={14} />, variant: 'ghost',                                                  onClick: () => notify('Export queued (UI only)') },
  ];

  return (
    <PageContainer>
      <PageHeader
        title="Election Administration"
        subtitle={`${ELECTION.name} · Election ID ${ELECTION.id}`}
        icon={<ShieldCheck size={18} />}
        actions={<ElectionStatusBadge status={status} />}
      />
      <Mission9SubNav />

      <Card className="p-4 mb-6">
        <div className="flex flex-wrap gap-2">
          {actions.map((a) => (
            <Button key={a.label} variant={a.variant} leftIcon={a.icon} disabled={a.disabled} onClick={a.onClick}>{a.label}</Button>
          ))}
        </div>
        {toast && (
          <div role="status" aria-live="polite" className="mt-3 text-xs text-success bg-success/10 border border-success/30 rounded-md px-3 py-2 inline-block">
            {toast}
          </div>
        )}
      </Card>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <ElectionStatCard icon={<Users size={16} />}     label="Candidates"       value={ELECTION.candidateCount} />
        <ElectionStatCard icon={<Vote size={16} />}      label="Total Votes"      value={ELECTION.votesCast} tone="success" />
        <ElectionStatCard icon={<TrendingUp size={16} />} label="Turnout"          value={`${TURNOUT_PCT}%`} tone="warning" />
        <ElectionStatCard icon={<Activity size={16} />}  label="Reviewers"        value={ELECTION.reviewers} tone="brand" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-5 overflow-x-auto">
            <SectionHeader title="Candidate list" description="Live vote counts (UI only)" />
            <table className="w-full text-sm min-w-[600px]">
              <thead>
                <tr className="text-left text-xs uppercase text-muted">
                  <th className="px-3 py-2 font-medium">#</th>
                  <th className="px-3 py-2 font-medium">Candidate</th>
                  <th className="px-3 py-2 font-medium">Class</th>
                  <th className="px-3 py-2 font-medium text-right">Votes</th>
                  <th className="px-3 py-2 font-medium text-right">Share</th>
                </tr>
              </thead>
              <tbody>
                {[...CANDIDATES].sort((a, b) => b.votes - a.votes).map((c, i) => (
                  <tr key={c.id} className="border-t border-border">
                    <td className="px-3 py-3 text-muted">{i + 1}</td>
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-2 min-w-0">
                        <Avatar name={c.name} size={28} />
                        <div className="min-w-0">
                          <p className="text-fg font-medium truncate">{c.name}</p>
                          <p className="text-[11px] text-muted truncate">{c.roll}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-3 text-muted">{c.department}</td>
                    <td className="px-3 py-3 text-fg tabular-nums text-right">{c.votes}</td>
                    <td className="px-3 py-3 tabular-nums text-right">
                      <Badge tone={i === 0 ? 'success' : 'neutral'}>{c.votePct}%</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>

          <Card className="p-5">
            <SectionHeader title="Participation statistics" />
            <div className="grid sm:grid-cols-3 gap-4">
              <Stat label="Ballots cast" value={ELECTION.votesCast} />
              <Stat label="Eligible" value={ELECTION.eligibleVoters} />
              <Stat label="Non-voters" value={ELECTION.eligibleVoters - ELECTION.votesCast} />
            </div>
          </Card>
        </div>

        <aside className="space-y-6">
          <Card className="p-5">
            <SectionHeader title="Election timeline" />
            <ElectionTimeline items={TIMELINE} />
          </Card>

          <Card className="p-5">
            <SectionHeader title="Recent activity" />
            <ul className="space-y-3">
              {RECENT_ACTIVITY.map((a, i) => (
                <li key={i} className="flex gap-3 text-sm">
                  <div className="h-2 w-2 rounded-full bg-brand mt-2 shrink-0" />
                  <div className="min-w-0">
                    <p className="text-fg">{a.text}</p>
                    <p className="text-[11px] text-muted">{a.time}</p>
                  </div>
                </li>
              ))}
            </ul>
          </Card>
        </aside>
      </div>
    </PageContainer>
  );
}

function Stat({ label, value }) {
  return (
    <div className="rounded-lg border border-border p-3">
      <p className="text-[11px] uppercase text-subtle">{label}</p>
      <p className="mt-0.5 text-lg font-semibold text-fg tabular-nums">{value}</p>
    </div>
  );
}
