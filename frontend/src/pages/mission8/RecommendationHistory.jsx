import { useMemo, useState } from 'react';
import { History, Eye } from 'lucide-react';
import PageContainer from '../../components/layout/PageContainer.jsx';
import PageHeader from '../../components/layout/PageHeader.jsx';
import Mission8SubNav from '../../components/mission8/Mission8SubNav.jsx';
import Card from '../../components/common/Card.jsx';
import Table from '../../components/common/Table.jsx';
import Badge from '../../components/ui/Badge.jsx';
import SearchInput from '../../components/forms/SearchInput.jsx';
import Select from '../../components/forms/Select.jsx';
import Pagination from '../../components/ui/Pagination.jsx';
import Button from '../../components/common/Button.jsx';
import EmptyState from '../../components/feedback/EmptyState.jsx';
import { HISTORY_ROUNDS } from '../../mocks/data/mission8.js';

const PAGE_SIZE = 5;

export default function RecommendationHistory() {
  const [q, setQ] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    return HISTORY_ROUNDS.filter((r) => {
      if (status && r.status !== status) return false;
      if (q) return r.name.toLowerCase().includes(q.toLowerCase()) || r.id.toLowerCase().includes(q.toLowerCase());
      return true;
    });
  }, [q, status]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const items = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const columns = [
    { key: 'name', label: 'Round', render: (r) => <div><p className="font-medium text-fg">{r.name}</p><p className="text-xs text-muted">{r.id}</p></div> },
    { key: 'date', label: 'Date', render: (r) => new Date(r.date).toLocaleDateString() },
    { key: 'recommended', label: 'Recommended' },
    { key: 'approved', label: 'Approved', render: (r) => <Badge tone="success">{r.approved}</Badge> },
    { key: 'rejected', label: 'Rejected', render: (r) => <Badge tone="danger">{r.rejected}</Badge> },
    { key: 'status', label: 'Status', render: (r) => <Badge tone={r.status === 'open' ? 'warning' : 'neutral'} className="capitalize">{r.status}</Badge> },
    { key: 'actions', label: '', render: () => <Button size="sm" variant="ghost" leftIcon={<Eye size={13} />}>View</Button> },
  ];

  return (
    <PageContainer>
      <PageHeader title="Recommendation History" subtitle="Every past round with outcomes." icon={<History size={18} />} />
      <Mission8SubNav />

      <div className="flex flex-wrap gap-3 items-end mb-4">
        <div className="flex-1 min-w-[220px]">
          <SearchInput value={q} onChange={(e) => { setQ(e.target.value); setPage(1); }} placeholder="Search rounds..." />
        </div>
        <Select label="Status" value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }} className="min-w-[140px]">
          <option value="">All</option>
          <option value="open">Open</option>
          <option value="closed">Closed</option>
        </Select>
      </div>

      {items.length === 0 ? (
        <EmptyState title="No rounds match" message="Try clearing filters." />
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
                    <p className="text-sm font-medium text-fg">{r.name}</p>
                    <p className="text-xs text-muted">{r.id} · {new Date(r.date).toLocaleDateString()}</p>
                  </div>
                  <Badge tone={r.status === 'open' ? 'warning' : 'neutral'} className="capitalize">{r.status}</Badge>
                </div>
                <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                  <div><p className="text-sm font-semibold text-fg">{r.recommended}</p><p className="text-[10px] uppercase text-subtle">Rec.</p></div>
                  <div><p className="text-sm font-semibold text-success">{r.approved}</p><p className="text-[10px] uppercase text-subtle">Appr.</p></div>
                  <div><p className="text-sm font-semibold text-danger">{r.rejected}</p><p className="text-[10px] uppercase text-subtle">Rej.</p></div>
                </div>
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
