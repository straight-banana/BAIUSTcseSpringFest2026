import { useEffect, useState } from 'react';
import { ShieldCheck, Play, Pause, Square, Send, Activity, Users, Vote, TrendingUp, Plus } from 'lucide-react';
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
import LoadingState from '../../components/feedback/Loading.jsx';
import ErrorState from '../../components/feedback/ErrorState.jsx';
import EmptyState from '../../components/feedback/EmptyState.jsx';
import { getActive, getAdminView, updateStatus, getActivityLog, createElection } from '../../services/electionsService.js';

const NEXT_STATUS = {
  DRAFT: 'ACTIVE',
  ACTIVE: 'PAUSED',
  PAUSED: 'ACTIVE',
  CLOSED: 'PUBLISHED',
};

export default function AdminDashboard() {
  const [election, setElection] = useState(null);
  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [toast, setToast] = useState('');
  const [busy, setBusy] = useState(false);

  const notify = (msg) => { setToast(msg); setTimeout(() => setToast(''), 2200); };

  const load = () => {
    setLoading(true);
    getActive()
      .then((e) => {
        if (!e) return null;
        return Promise.all([getAdminView(e.id), getActivityLog(e.id)]);
      })
      .then((result) => {
        if (!result) { setElection(null); return; }
        const [adminView, log] = result;
        setElection(adminView);
        setActivity(Array.isArray(log) ? log : []);
      })
      .catch((err) => { if (err?.status !== 404) setError(err?.message || 'Unable to load election'); })
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const changeStatus = async (status) => {
    setBusy(true);
    try {
      await updateStatus(election.id, status);
      notify(`Election status changed to ${status}`);
      load();
    } catch (err) {
      notify(err?.message || 'Failed to update status');
    } finally {
      setBusy(false);
    }
  };

  const createNew = async () => {
    setBusy(true);
    try {
      await createElection({ title: 'New Captain Election' });
      notify('Election created');
      load();
    } catch (err) {
      notify(err?.message || 'Failed to create election');
    } finally {
      setBusy(false);
    }
  };

  if (loading) {
    return (
      <PageContainer>
        <PageHeader title="Election Administration" icon={<ShieldCheck size={18} />} />
        <Mission9SubNav />
        <LoadingState label="Loading election..." />
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer>
        <PageHeader title="Election Administration" icon={<ShieldCheck size={18} />} />
        <Mission9SubNav />
        <ErrorState title="Couldn't load election" message={error} />
      </PageContainer>
    );
  }

  if (!election) {
    return (
      <PageContainer>
        <PageHeader title="Election Administration" icon={<ShieldCheck size={18} />} />
        <Mission9SubNav />
        <Card className="p-8">
          <EmptyState title="No election yet" message="Create one to start managing captain voting." />
          <div className="mt-4 flex justify-center">
            <Button leftIcon={<Plus size={14} />} onClick={createNew} disabled={busy}>Create Election</Button>
          </div>
        </Card>
      </PageContainer>
    );
  }

  const status = election.status;
  const actions = [
    status === 'DRAFT' && { label: 'Start Election', icon: <Play size={14} />, variant: 'success', onClick: () => changeStatus('ACTIVE') },
    status === 'ACTIVE' && { label: 'Pause Election', icon: <Pause size={14} />, variant: 'secondary', onClick: () => changeStatus('PAUSED') },
    status === 'PAUSED' && { label: 'Resume Election', icon: <Play size={14} />, variant: 'success', onClick: () => changeStatus('ACTIVE') },
    (status === 'ACTIVE' || status === 'PAUSED') && { label: 'End Election', icon: <Square size={14} />, variant: 'outline', onClick: () => changeStatus('CLOSED') },
    status === 'CLOSED' && { label: 'Publish Results', icon: <Send size={14} />, variant: 'primary', onClick: () => changeStatus('PUBLISHED') },
  ].filter(Boolean);

  const candidates = [...(election.candidates || [])].map((c) => ({
    ...c,
    voteCount: (c.votes || []).filter((v) => v.rank === 1).length,
  })).sort((a, b) => b.voteCount - a.voteCount);
  const totalVotes = candidates.reduce((a, c) => a + c.voteCount, 0);

  return (
    <PageContainer>
      <PageHeader
        title="Election Administration"
        subtitle={election.title}
        icon={<ShieldCheck size={18} />}
        actions={<ElectionStatusBadge status={status?.toLowerCase()} />}
      />
      <Mission9SubNav />

      <Card className="p-4 mb-6">
        <div className="flex flex-wrap gap-2">
          {actions.map((a) => (
            <Button key={a.label} variant={a.variant} leftIcon={a.icon} disabled={busy} onClick={a.onClick}>{a.label}</Button>
          ))}
        </div>
        {toast && (
          <div role="status" aria-live="polite" className="mt-3 text-xs text-success bg-success/10 border border-success/30 rounded-md px-3 py-2 inline-block">
            {toast}
          </div>
        )}
      </Card>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <ElectionStatCard icon={<Users size={16} />}     label="Candidates"  value={candidates.length} />
        <ElectionStatCard icon={<Vote size={16} />}      label="Total Votes" value={totalVotes} tone="success" />
        <ElectionStatCard icon={<TrendingUp size={16} />} label="Turnout"    value={`${election.turnoutPercentage ?? 0}%`} tone="warning" />
        <ElectionStatCard icon={<Activity size={16} />}  label="Voters"      value={election.turnout ?? 0} tone="brand" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-5 overflow-x-auto">
            <SectionHeader title="Candidate list" description="First-choice vote counts" />
            {candidates.length === 0 ? (
              <p className="text-sm text-muted">No candidates added yet.</p>
            ) : (
              <table className="w-full text-sm min-w-[600px]">
                <thead>
                  <tr className="text-left text-xs uppercase text-muted">
                    <th className="px-3 py-2 font-medium">#</th>
                    <th className="px-3 py-2 font-medium">Candidate</th>
                    <th className="px-3 py-2 font-medium text-right">Votes</th>
                  </tr>
                </thead>
                <tbody>
                  {candidates.map((c, i) => (
                    <tr key={c.id} className="border-t border-border">
                      <td className="px-3 py-3 text-muted">{i + 1}</td>
                      <td className="px-3 py-3">
                        <div className="flex items-center gap-2 min-w-0">
                          <Avatar name={c.user?.name} size={28} />
                          <div className="min-w-0">
                            <p className="text-fg font-medium truncate">{c.user?.name}</p>
                            <p className="text-[11px] text-muted truncate">{c.user?.rollNumber}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-3 text-fg tabular-nums text-right">
                        <Badge tone={i === 0 ? 'success' : 'neutral'}>{c.voteCount}</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </Card>
        </div>

        <aside className="space-y-6">
          <Card className="p-5">
            <SectionHeader title="Recent activity" />
            {activity.length === 0 ? (
              <p className="text-sm text-muted">No activity logged yet.</p>
            ) : (
              <ul className="space-y-3">
                {activity.slice().reverse().map((a, i) => (
                  <li key={i} className="flex gap-3 text-sm">
                    <div className="h-2 w-2 rounded-full bg-brand mt-2 shrink-0" />
                    <div className="min-w-0">
                      <p className="text-fg">{a.action}</p>
                      <p className="text-[11px] text-muted">{new Date(a.at).toLocaleString()}</p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </aside>
      </div>
    </PageContainer>
  );
}
