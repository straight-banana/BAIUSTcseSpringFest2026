import { useMemo, useState } from 'react';
import PageContainer from '../../components/layout/PageContainer.jsx';
import PageHeader from '../../components/layout/PageHeader.jsx';
import Mission1SubNav from '../../components/mission1/Mission1SubNav.jsx';
import Card from '../../components/common/Card.jsx';
import SearchInput from '../../components/forms/SearchInput.jsx';
import FilterDropdown from '../../components/mission1/FilterDropdown.jsx';
import Select from '../../components/forms/Select.jsx';
import { StatCard } from '../../components/common/Cards.jsx';
import ModerationModal from '../../components/mission1/ModerationModal.jsx';
import StatusBadge from '../../components/mission1/StatusBadge.jsx';
import CategoryBadge from '../../components/mission1/CategoryBadge.jsx';
import ProgressRing from '../../components/mission1/ProgressRing.jsx';
import WarningLevelBadge from '../../components/mission1/WarningLevelBadge.jsx';
import EmptyState from '../../components/feedback/EmptyState.jsx';
import Timeline from '../../components/mission1/Timeline.jsx';
import { useToast } from '../../components/feedback/Toast.jsx';
import {
  CATEGORIES, STATUSES, complaints, complaintStats,
  recentDecisions, strikeSummary,
} from '../../mocks/data/complaints.js';
import { Gavel, CheckCircle2, XCircle, MessageSquareWarning, FileText, Image as ImageIcon } from 'lucide-react';

export default function TeacherModeration() {
  const toast = useToast();
  const [q, setQ] = useState('');
  const [cat, setCat] = useState('');
  const [status, setStatus] = useState('');
  const [sort, setSort] = useState('newest');
  const [selected, setSelected] = useState(null);

  const list = useMemo(() => {
    let out = complaints.filter((c) => {
      if (cat && c.category !== cat) return false;
      if (status && c.status !== status) return false;
      if (q) {
        const s = q.toLowerCase();
        if (!c.title.toLowerCase().includes(s) && !c.id.toLowerCase().includes(s)) return false;
      }
      return true;
    });
    out = [...out].sort((a, b) => {
      const dA = new Date(a.submittedAt), dB = new Date(b.submittedAt);
      return sort === 'oldest' ? dA - dB : dB - dA;
    });
    return out;
  }, [q, cat, status, sort]);

  const decide = ({ decision, notes }) => {
    const map = {
      resolved: { tone: 'success', title: 'Complaint approved' },
      rejected: { tone: 'error',   title: 'Complaint rejected' },
      under_review: { tone: 'info', title: 'Sent back for review' },
      add_strike:  { tone: 'warning', title: 'Strike added' },
    };
    const t = map[decision] || { tone: 'info', title: decision };
    toast.push({ tone: t.tone, title: t.title, message: `${selected?.id}${notes ? ' · notes saved' : ''}` });
    setSelected(null);
  };

  return (
    <PageContainer>
      <PageHeader
        title="Teacher Moderation"
        subtitle="Review anonymous complaints, request more info, and issue strikes. Rater identities are never shown."
        icon={<Gavel size={18} />}
      />
      <Mission1SubNav />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
        <StatCard icon={<FileText size={16} />}             label="Awaiting Decision" value={complaintStats.pending + complaintStats.underReview} hint="Needs review" />
        <StatCard icon={<CheckCircle2 size={16} />}         label="Approved Today"    value={3} trend={12.4} hint="Added to strikes" />
        <StatCard icon={<XCircle size={16} />}              label="Rejected Today"    value={1} trend={-4.2} hint="Insufficient evidence" />
        <StatCard icon={<MessageSquareWarning size={16} />} label="Requested Review"  value={2} hint="Escalated" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="xl:col-span-2 space-y-4">
          <Card className="p-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 items-end">
              <div className="lg:col-span-2">
                <SearchInput label="Search" placeholder="Search complaints…" value={q} onChange={(e) => setQ(e.target.value)} />
              </div>
              <FilterDropdown label="Category" value={cat} onChange={setCat} options={CATEGORIES} allLabel="All" />
              <FilterDropdown label="Status" value={status} onChange={setStatus} options={STATUSES} allLabel="All" />
              <Select label="Sort" value={sort} onChange={(e) => setSort(e.target.value)}>
                <option value="newest">Newest first</option>
                <option value="oldest">Oldest first</option>
              </Select>
            </div>
          </Card>

          {list.length === 0 ? (
            <EmptyState title="No complaints match" message="Try relaxing your filters." />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {list.slice(0, 10).map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelected(c)}
                  className="text-left rounded-xl border border-border bg-elevated p-4 hover:border-brand/40 transition-colors"
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-mono text-[11px] text-muted">{c.id}</span>
                    <StatusBadge status={c.status} />
                  </div>
                  <p className="mt-1.5 text-sm font-medium text-fg line-clamp-2">{c.subject || c.title}</p>
                  <p className="mt-1 text-xs text-muted line-clamp-2">{c.description}</p>
                  <div className="mt-3 flex items-center justify-between gap-2 flex-wrap">
                    <CategoryBadge category={c.category} />
                    <span className="inline-flex items-center gap-1 text-[11px] text-muted">
                      {c.hasEvidence ? <ImageIcon size={11} /> : null}
                      {new Date(c.submittedAt).toLocaleDateString()}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-4">
          <Card className="p-5 flex flex-col items-center">
            <p className="text-xs uppercase tracking-wider text-muted font-mono">Impeachment Meter</p>
            <div className="mt-3">
              <ProgressRing
                value={strikeSummary.strikePercent}
                tone={strikeSummary.warningLevel.tone}
                size={140}
                stroke={12}
                sublabel={`${strikeSummary.totalStrikes} / ${strikeSummary.strikeCap}`}
              />
            </div>
            <div className="mt-3"><WarningLevelBadge level={strikeSummary.warningLevel} /></div>
          </Card>

          <Card className="p-5">
            <h3 className="text-sm font-semibold text-fg mb-3">Recent Decisions</h3>
            <Timeline items={recentDecisions.map((d) => ({
              title: `${d.id} · ${d.decision.replace('_', ' ')}`,
              body: CATEGORIES.find((c) => c.value === d.category)?.label,
              when: d.when,
              tone: d.decision === 'resolved' ? 'success' : 'danger',
            }))} />
          </Card>
        </div>
      </div>

      <ModerationModal
        complaint={selected}
        open={!!selected}
        onClose={() => setSelected(null)}
        onDecide={decide}
      />
    </PageContainer>
  );
}
