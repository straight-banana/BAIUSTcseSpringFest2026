import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Check, X, Eye } from 'lucide-react';
import PageContainer from '../../components/layout/PageContainer.jsx';
import PageHeader from '../../components/layout/PageHeader.jsx';
import Mission8SubNav from '../../components/mission8/Mission8SubNav.jsx';
import Card from '../../components/common/Card.jsx';
import Button from '../../components/common/Button.jsx';
import Avatar from '../../components/ui/Avatar.jsx';
import Badge from '../../components/ui/Badge.jsx';
import SectionHeader from '../../components/ui/SectionHeader.jsx';
import KpiCard from '../../components/mission4/KpiCard.jsx';
import LoadingState from '../../components/feedback/Loading.jsx';
import ErrorState from '../../components/feedback/ErrorState.jsx';
import EmptyState from '../../components/feedback/EmptyState.jsx';
import { useToast } from '../../components/feedback/Toast.jsx';
import { getCurrentRound, getRankedCandidates, weightsToList, submitOverride } from '../../services/candidatesService.js';

export default function TeacherReview() {
  const [round, setRound] = useState(null);
  const [weights, setWeights] = useState([]);
  const [rows, setRows] = useState([]);
  const [notes, setNotes] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { push } = useToast();

  useEffect(() => {
    let active = true;
    getCurrentRound()
      .then((r) => {
        if (!active) return null;
        setRound(r);
        if (!r) return null;
        setWeights(weightsToList(r.weights));
        return getRankedCandidates(r.id);
      })
      .then((data) => { if (active && data) setRows(data); })
      .catch((err) => { if (active) setError(err?.message || 'Unable to load review queue'); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  const counts = useMemo(() => ({
    total: rows.length,
    gold: rows.filter((c) => c.badge === 'GOLD').length,
    overridden: rows.filter((c) => c.manualOverride).length,
    pinned: rows.filter((c) => c.isPinned).length,
  }), [rows]);

  const decide = async (candidate, action) => {
    if (!round) return;
    const reason = notes[candidate.id] || `Marked ${action} by reviewer`;
    try {
      const updated = await submitOverride(round.id, candidate.userId, {
        pin: action === 'approved' ? true : action === 'rejected' ? false : undefined,
        reason,
      });
      setRows((r) => r.map((c) => (c.id === candidate.id ? { ...c, ...updated, name: c.name, roll: c.roll } : c)));
      push({ tone: action === 'approved' ? 'success' : action === 'rejected' ? 'error' : 'info', title: `Marked ${action}` });
    } catch (err) {
      push({ tone: 'error', title: 'Action failed', message: err?.message || '' });
    }
  };

  if (loading) {
    return (
      <PageContainer>
        <PageHeader title="Teacher Review" subtitle="Review and override captain recommendations." icon={<ShieldCheck size={18} />} />
        <Mission8SubNav />
        <LoadingState label="Loading review queue..." />
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer>
        <PageHeader title="Teacher Review" subtitle="Review and override captain recommendations." icon={<ShieldCheck size={18} />} />
        <Mission8SubNav />
        <ErrorState title="Couldn't load review queue" message={error} />
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <PageHeader title="Teacher Review" subtitle="Review and override captain recommendations." icon={<ShieldCheck size={18} />} />
      <Mission8SubNav />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <KpiCard icon={<ShieldCheck size={16} />} label="Candidates" value={counts.total} />
        <KpiCard icon={<Check size={16} />} tone="success" label="Gold Badge" value={counts.gold} />
        <KpiCard icon={<Eye size={16} />} tone="warning" label="Manual Overrides" value={counts.overridden} />
        <KpiCard icon={<X size={16} />} label="Pinned" value={counts.pinned} />
      </div>

      <SectionHeader title="Review queue" description={`${rows.length} candidates`} className="mb-4" />

      {rows.length === 0 ? (
        <EmptyState title="No candidates yet" message="Once a candidate round is active, profiles will appear here for review." />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {rows.map((c) => (
            <Card key={c.id} className="p-4">
              <div className="flex items-center gap-3">
                <Avatar name={c.name} size={44} />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-fg truncate">{c.name}</p>
                  <p className="text-xs text-muted truncate">{c.roll} · Sec {c.section}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold text-fg tabular-nums">{c.scores?.overall ?? 0}</p>
                  <p className="text-[11px] text-muted">Overall</p>
                </div>
              </div>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {c.badge && <Badge tone="brand">{c.badge}</Badge>}
                {c.manualOverride && <Badge tone="warning">Overridden</Badge>}
                {c.isPinned && <Badge tone="success">Pinned</Badge>}
              </div>

              <div className="mt-3 grid grid-cols-4 gap-2 text-center">
                {weights.slice(0, 4).map((w) => (
                  <div key={w.key} className="rounded-md bg-elevated py-1.5">
                    <p className="text-xs font-semibold text-fg tabular-nums">{c.scores?.[w.key] ?? 0}</p>
                    <p className="text-[10px] uppercase text-subtle">{w.label.slice(0, 5)}</p>
                  </div>
                ))}
              </div>

              <div className="mt-3">
                <label className="text-[11px] uppercase text-subtle">Notes / override reason</label>
                <textarea
                  rows={2}
                  value={notes[c.id] || ''}
                  onChange={(e) => setNotes((n) => ({ ...n, [c.id]: e.target.value }))}
                  placeholder="Leave a short review note..."
                  className="mt-1 w-full text-xs rounded-md border border-border bg-surface px-3 py-2 text-fg placeholder:text-subtle focus:outline-none focus:ring-2 focus:ring-brand/40 focus:border-brand"
                />
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                <Button size="sm" variant="success" leftIcon={<Check size={13} />} onClick={() => decide(c, 'approved')}>Pin / Approve</Button>
                <Button size="sm" variant="danger" leftIcon={<X size={13} />} onClick={() => decide(c, 'rejected')}>Unpin / Reject</Button>
                <Link to={`/mission-8/candidates/${c.id}`} className="ml-auto">
                  <Button size="sm" variant="ghost" leftIcon={<Eye size={13} />}>View Profile</Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      )}
    </PageContainer>
  );
}
