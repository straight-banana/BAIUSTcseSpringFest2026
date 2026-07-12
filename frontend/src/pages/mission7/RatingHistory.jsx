import { useMemo, useState } from 'react';
import { History } from 'lucide-react';
import PageContainer from '../../components/layout/PageContainer.jsx';
import PageHeader from '../../components/layout/PageHeader.jsx';
import Mission7SubNav from '../../components/mission7/Mission7SubNav.jsx';
import Card from '../../components/common/Card.jsx';
import Table from '../../components/common/Table.jsx';
import Badge from '../../components/ui/Badge.jsx';
import SearchInput from '../../components/forms/SearchInput.jsx';
import Select from '../../components/forms/Select.jsx';
import Pagination from '../../components/ui/Pagination.jsx';
import StarRating from '../../components/mission7/StarRating.jsx';
import EmptyState from '../../components/feedback/EmptyState.jsx';
import { MY_RATINGS } from '../../mocks/data/mission7.js';

const PAGE_SIZE = 8;

export default function RatingHistory() {
  const [q, setQ] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    return MY_RATINGS.filter((r) => {
      if (status && r.status !== status) return false;
      if (q) return r.studentName.toLowerCase().includes(q.toLowerCase()) || r.roll.includes(q);
      return true;
    });
  }, [q, status]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const items = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const columns = [
    { key: 'date',    label: 'Date',    render: (r) => new Date(r.date).toLocaleDateString() },
    { key: 'studentName', label: 'Student', render: (r) => <div><p className="font-medium text-fg">{r.studentName}</p><p className="text-xs text-muted">{r.roll}</p></div> },
    { key: 'overall', label: 'Overall', render: (r) => <StarRating value={Math.round(r.overall)} readOnly size={14} showValue /> },
    { key: 'status',  label: 'Status',  render: (r) => <Badge tone={r.status === 'approved' ? 'success' : 'warning'} className="capitalize">{r.status}</Badge> },
    { key: 'commentPreview', label: 'Comment', render: (r) => <p className="text-xs text-muted line-clamp-2 max-w-xs">{r.commentPreview}</p> },
  ];

  return (
    <PageContainer>
      <PageHeader title="My Rating History" subtitle="Every rating you've submitted, kept anonymous to others." icon={<History size={18} />} />
      <Mission7SubNav />

      <div className="flex flex-wrap gap-3 items-end mb-4">
        <div className="flex-1 min-w-[220px]">
          <SearchInput value={q} onChange={(e) => { setQ(e.target.value); setPage(1); }} placeholder="Search by name or roll..." />
        </div>
        <Select label="Status" value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }} className="min-w-[140px]">
          <option value="">All</option>
          <option value="approved">Approved</option>
          <option value="pending">Pending</option>
        </Select>
      </div>

      {items.length === 0 ? (
        <EmptyState title="No ratings yet" message="Submit your first peer rating to see it here." />
      ) : (
        <>
          <div className="hidden sm:block">
            <Table columns={columns} rows={items} />
          </div>
          <div className="sm:hidden space-y-3">
            {items.map((r) => (
              <Card key={r.id} className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-fg">{r.studentName}</p>
                    <p className="text-xs text-muted">{r.roll} · {new Date(r.date).toLocaleDateString()}</p>
                  </div>
                  <Badge tone={r.status === 'approved' ? 'success' : 'warning'} className="capitalize">{r.status}</Badge>
                </div>
                <div className="mt-2"><StarRating value={Math.round(r.overall)} readOnly size={14} showValue /></div>
                <p className="mt-2 text-xs text-muted line-clamp-2">{r.commentPreview}</p>
              </Card>
            ))}
          </div>
        </>
      )}

      {filtered.length > PAGE_SIZE && (
        <div className="mt-6 flex justify-center">
          <Pagination page={page} total={totalPages} onChange={setPage} />
        </div>
      )}
    </PageContainer>
  );
}
