import { useMemo, useState, useCallback } from 'react';
import PageContainer from '../../components/layout/PageContainer.jsx';
import PageHeader from '../../components/layout/PageHeader.jsx';
import Mission1SubNav from '../../components/mission1/Mission1SubNav.jsx';
import Card from '../../components/common/Card.jsx';
import Table from '../../components/common/Table.jsx';
import Button from '../../components/common/Button.jsx';
import SearchInput from '../../components/forms/SearchInput.jsx';
import Select from '../../components/forms/Select.jsx';
import FilterDropdown from '../../components/mission1/FilterDropdown.jsx';
import StatusBadge from '../../components/mission1/StatusBadge.jsx';
import CategoryBadge from '../../components/mission1/CategoryBadge.jsx';
import ComplaintCard from '../../components/mission1/ComplaintCard.jsx';
import ModerationModal from '../../components/mission1/ModerationModal.jsx';
import Pagination from '../../components/ui/Pagination.jsx';
import EmptyState from '../../components/feedback/EmptyState.jsx';
import { CATEGORIES, STATUSES, complaints as seedComplaints } from '../../mocks/data/complaints.js';
import { History, Eye, ArrowUpDown, Gavel } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { useToast } from '../../components/feedback/Toast.jsx';

const PAGE_SIZE = 8;

function StrikeWeightCell({ w = 0 }) {
  const tone = w >= 3 ? 'text-danger' : w === 2 ? 'text-warning' : w === 1 ? 'text-brand' : 'text-muted';
  return (
    <span className={`inline-flex items-center gap-1 font-mono text-xs ${tone}`}>
      {'●'.repeat(w || 0).padEnd(3, '○').split('').map((ch, i) => (
        <span key={i}>{ch}</span>
      ))}
    </span>
  );
}

export default function ComplaintHistory() {
  const { role } = useAuth();
  const toast = useToast();
  const isReviewer = role === 'teacher' || role === 'office';
  const [rows, setRows] = useState(seedComplaints);
  const [q, setQ] = useState('');
  const [cat, setCat] = useState('');
  const [status, setStatus] = useState('');
  const [sort, setSort] = useState('newest');
  const [page, setPage] = useState(1);
  const [reviewing, setReviewing] = useState(null);

  const filtered = useMemo(() => {
    let out = rows.filter((c) => {
      if (cat && c.category !== cat) return false;
      if (status && c.status !== status) return false;
      if (q) {
        const s = q.toLowerCase();
        if (
          !c.title.toLowerCase().includes(s) &&
          !c.id.toLowerCase().includes(s) &&
          !(c.course || '').toLowerCase().includes(s)
        ) return false;
      }
      return true;
    });
    out = [...out].sort((a, b) => {
      const dA = new Date(a.submittedAt), dB = new Date(b.submittedAt);
      if (sort === 'oldest') return dA - dB;
      if (sort === 'weight') return (b.strikeWeight || 0) - (a.strikeWeight || 0);
      return dB - dA;
    });
    return out;
  }, [q, cat, status, sort, rows]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageRows = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleDecide = useCallback(({ decision, notes }) => {
    if (!reviewing) return;
    const nextStatus = decision === 'resolved' ? 'resolved'
      : decision === 'rejected' ? 'rejected'
      : 'under_review';
    setRows((prev) => prev.map((c) => c.id === reviewing.id
      ? { ...c, status: nextStatus, teacherRemark: notes, lastUpdated: new Date().toISOString() }
      : c));
    toast.push({
      tone: nextStatus === 'resolved' ? 'success' : nextStatus === 'rejected' ? 'error' : 'warning',
      title: `Case ${reviewing.id}`,
      message: `Marked as ${nextStatus.replace('_', ' ')}.`,
    });
    setReviewing(null);
  }, [reviewing, toast]);

  const columns = useMemo(() => [
    { key: 'id', label: 'Anonymous ID', render: (r) => <span className="font-mono text-xs">{r.id}</span> },
    { key: 'category', label: 'Category', render: (r) => <CategoryBadge category={r.category} /> },
    { key: 'submittedAt', label: 'Submitted', render: (r) => new Date(r.submittedAt).toLocaleDateString() },
    { key: 'status', label: 'Status', render: (r) => <StatusBadge status={r.status} /> },
    { key: 'strikeWeight', label: 'Strike Wt.', render: (r) => <StrikeWeightCell w={r.strikeWeight} /> },
    { key: 'lastUpdated', label: 'Last Updated', render: (r) => new Date(r.lastUpdated).toLocaleDateString() },
    {
      key: 'actions',
      label: '',
      render: (r) => isReviewer ? (
        <Button size="sm" variant="secondary" leftIcon={<Gavel size={12} />} onClick={() => setReviewing(r)}>Review</Button>
      ) : (
        <Button size="sm" variant="ghost" leftIcon={<Eye size={12} />}>View</Button>
      ),
    },
  ], [isReviewer]);

  return (
    <PageContainer>
      <PageHeader
        title={isReviewer ? 'Case Archive' : 'Complaint History'}
        subtitle={isReviewer
          ? 'Review each case and mark it resolved, rejected, or under review.'
          : "Track every anonymous report you've filed and its current status."}
        icon={<History size={18} />}
      />
      <Mission1SubNav />

      <Card className="p-4 mb-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 items-end">
          <div className="lg:col-span-2">
            <SearchInput
              label="Search"
              placeholder="Search by ID, title or course…"
              value={q}
              onChange={(e) => { setQ(e.target.value); setPage(1); }}
            />
          </div>
          <FilterDropdown label="Category" value={cat} onChange={(v) => { setCat(v); setPage(1); }} options={CATEGORIES} allLabel="All categories" />
          <FilterDropdown label="Status" value={status} onChange={(v) => { setStatus(v); setPage(1); }} options={STATUSES} allLabel="All statuses" />
          <Select
            label={<span className="inline-flex items-center gap-1"><ArrowUpDown size={12} /> Sort</span>}
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
            <option value="weight">Highest strike weight</option>
          </Select>
        </div>
      </Card>

      {filtered.length === 0 ? (
        <EmptyState title="No complaints found" message="Try adjusting your search or filters." />
      ) : (
        <>
          <div className="hidden md:block">
            <Table columns={columns} rows={pageRows} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:hidden">
            {pageRows.map((c) => <ComplaintCard key={c.id} complaint={c} />)}
          </div>

          <div className="mt-4 flex items-center justify-between flex-wrap gap-2">
            <p className="text-xs text-muted">
              Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}
            </p>
            <Pagination page={page} total={totalPages} onChange={setPage} />
          </div>
        </>
      )}

      <ModerationModal
        complaint={reviewing}
        open={!!reviewing}
        onClose={() => setReviewing(null)}
        onDecide={handleDecide}
      />
    </PageContainer>
  );
}
