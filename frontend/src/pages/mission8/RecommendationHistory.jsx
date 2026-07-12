import { useEffect, useMemo, useState } from 'react';
import { History } from 'lucide-react';
import PageContainer from '../../components/layout/PageContainer.jsx';
import PageHeader from '../../components/layout/PageHeader.jsx';
import Mission8SubNav from '../../components/mission8/Mission8SubNav.jsx';
import Card from '../../components/common/Card.jsx';
import Table from '../../components/common/Table.jsx';
import Badge from '../../components/ui/Badge.jsx';
import SearchInput from '../../components/forms/SearchInput.jsx';
import Pagination from '../../components/ui/Pagination.jsx';
import EmptyState from '../../components/feedback/EmptyState.jsx';
import LoadingState from '../../components/feedback/Loading.jsx';
import ErrorState from '../../components/feedback/ErrorState.jsx';
import { getHistory } from '../../services/candidatesService.js';

const PAGE_SIZE = 5;

export default function RecommendationHistory() {
  const [rounds, setRounds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [q, setQ] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    let active = true;
    getHistory()
      .then((data) => { if (active) setRounds(Array.isArray(data) ? data : []); })
      .catch((err) => { if (active) setError(err?.message || 'Unable to load round history'); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  const filtered = useMemo(() => {
    if (!q) return rounds;
    const t = q.toLowerCase();
    return rounds.filter((r) => r.name.toLowerCase().includes(t) || r.id.toLowerCase().includes(t));
  }, [rounds, q]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const items = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const columns = [
    { key: 'name', label: 'Round', render: (r) => <div><p className="font-medium text-fg">{r.name}</p><p className="text-xs text-muted">{r.id}</p></div> },
    { key: 'createdAt', label: 'Created', render: (r) => new Date(r.createdAt).toLocaleDateString() },
    { key: 'candidates', label: 'Candidates', render: (r) => r._count?.profiles ?? 0 },
    { key: 'status', label: 'Status', render: () => <Badge tone="neutral">Closed</Badge> },
  ];

  return (
    <PageContainer>
      <PageHeader title="Recommendation History" subtitle="Every past round." icon={<History size={18} />} />
      <Mission8SubNav />

      <div className="flex flex-wrap gap-3 items-end mb-4">
        <div className="flex-1 min-w-[220px]">
          <SearchInput value={q} onChange={(e) => { setQ(e.target.value); setPage(1); }} placeholder="Search rounds..." />
        </div>
      </div>

      {loading ? (
        <LoadingState label="Loading round history..." />
      ) : error ? (
        <ErrorState title="Couldn't load round history" message={error} />
      ) : items.length === 0 ? (
        <EmptyState title="No closed rounds yet" message="Past candidate rounds will appear here once closed." />
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
                    <p className="text-xs text-muted">{new Date(r.createdAt).toLocaleDateString()}</p>
                  </div>
                  <Badge tone="neutral">Closed</Badge>
                </div>
                <p className="mt-2 text-xs text-muted">{r._count?.profiles ?? 0} candidates</p>
              </Card>
            ))}
          </div>
        </>
      )}

      {!loading && !error && filtered.length > PAGE_SIZE && (
        <div className="mt-6 flex justify-center">
          <Pagination page={page} total={totalPages} onChange={setPage} />
        </div>
      )}
    </PageContainer>
  );
}
