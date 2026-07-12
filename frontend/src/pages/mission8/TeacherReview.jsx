import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Check, X, MessageSquare, Eye } from 'lucide-react';
import PageContainer from '../../components/layout/PageContainer.jsx';
import PageHeader from '../../components/layout/PageHeader.jsx';
import Mission8SubNav from '../../components/mission8/Mission8SubNav.jsx';
import Card from '../../components/common/Card.jsx';
import Button from '../../components/common/Button.jsx';
import Select from '../../components/forms/Select.jsx';
import Avatar from '../../components/ui/Avatar.jsx';
import SectionHeader from '../../components/ui/SectionHeader.jsx';
import KpiCard from '../../components/mission4/KpiCard.jsx';
import RecommendationBadge from '../../components/mission8/RecommendationBadge.jsx';
import { useToast } from '../../components/feedback/Toast.jsx';
import { CANDIDATES } from '../../mocks/data/mission8.js';

export default function TeacherReview() {
  const [filter, setFilter] = useState('pending');
  const [rows, setRows] = useState(CANDIDATES);
  const { push } = useToast();

  const filtered = useMemo(() => rows.filter((c) => !filter || c.review === filter), [rows, filter]);
  const counts = useMemo(() => ({
    pending: rows.filter((c) => c.review === 'pending').length,
    approved: rows.filter((c) => c.review === 'approved').length,
    rejected: rows.filter((c) => c.review === 'rejected').length,
    recommended: rows.filter((c) => c.status === 'recommended').length,
  }), [rows]);

  const decide = (id, review) => {
    setRows((r) => r.map((c) => (c.id === id ? { ...c, review } : c)));
    push({ tone: review === 'approved' ? 'success' : review === 'rejected' ? 'error' : 'info', title: `Marked ${review}` });
  };

  return (
    <PageContainer>
      <PageHeader title="Teacher Review" subtitle="Approve, reject, or flag captain recommendations." icon={<ShieldCheck size={18} />} />
      <Mission8SubNav />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <KpiCard icon={<ShieldCheck size={16} />} label="Recommended" value={counts.recommended} />
        <KpiCard icon={<Eye size={16} />} tone="warning" label="Pending Reviews" value={counts.pending} />
        <KpiCard icon={<Check size={16} />} tone="success" label="Approved" value={counts.approved} />
        <KpiCard icon={<X size={16} />} tone="danger" label="Rejected" value={counts.rejected} />
      </div>

      <div className="flex items-end justify-between gap-3 mb-4">
        <SectionHeader title="Review queue" description={`${filtered.length} candidates`} className="!mb-0" />
        <Select label="Filter" value={filter} onChange={(e) => setFilter(e.target.value)} className="min-w-[140px]">
          <option value="">All</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </Select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filtered.map((c) => (
          <Card key={c.id} className="p-4">
            <div className="flex items-center gap-3">
              <Avatar name={c.name} size={44} />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-fg truncate">{c.name}</p>
                <p className="text-xs text-muted truncate">{c.roll} · {c.department} · Sec {c.section}</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-semibold text-fg tabular-nums">{c.scores.overall}</p>
                <p className="text-[11px] text-muted">Overall</p>
              </div>
            </div>
            <div className="mt-2 flex flex-wrap gap-1.5">
              <RecommendationBadge status={c.status} />
              <RecommendationBadge status={c.review} label={`Review: ${c.review}`} />
            </div>

            <div className="mt-3 grid grid-cols-4 gap-2 text-center">
              {['leadership','communication','participation','discipline'].map((k) => (
                <div key={k} className="rounded-md bg-elevated py-1.5">
                  <p className="text-xs font-semibold text-fg tabular-nums">{c.scores[k]}</p>
                  <p className="text-[10px] uppercase text-subtle capitalize">{k.slice(0, 5)}</p>
                </div>
              ))}
            </div>

            <div className="mt-3">
              <label className="text-[11px] uppercase text-subtle">Notes</label>
              <textarea
                rows={2}
                placeholder="Leave a short review note..."
                className="mt-1 w-full text-xs rounded-md border border-border bg-surface px-3 py-2 text-fg placeholder:text-subtle focus:outline-none focus:ring-2 focus:ring-brand/40 focus:border-brand"
              />
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              <Button size="sm" variant="success" leftIcon={<Check size={13} />} onClick={() => decide(c.id, 'approved')}>Approve</Button>
              <Button size="sm" variant="danger" leftIcon={<X size={13} />} onClick={() => decide(c.id, 'rejected')}>Reject</Button>
              <Button size="sm" variant="secondary" leftIcon={<MessageSquare size={13} />} onClick={() => decide(c.id, 'pending')}>Request Review</Button>
              <Link to={`/mission-8/candidates/${c.id}`} className="ml-auto">
                <Button size="sm" variant="ghost" leftIcon={<Eye size={13} />}>View Profile</Button>
              </Link>
            </div>
          </Card>
        ))}
      </div>
    </PageContainer>
  );
}
