import { useEffect, useMemo, useState } from 'react';
import { History } from 'lucide-react';
import PageContainer from '../../components/layout/PageContainer.jsx';
import PageHeader from '../../components/layout/PageHeader.jsx';
import Mission7SubNav from '../../components/mission7/Mission7SubNav.jsx';
import Card from '../../components/common/Card.jsx';
import Table from '../../components/common/Table.jsx';
import SearchInput from '../../components/forms/SearchInput.jsx';
import Pagination from '../../components/ui/Pagination.jsx';
import Avatar from '../../components/ui/Avatar.jsx';
import EmptyState from '../../components/feedback/EmptyState.jsx';
import LoadingState from '../../components/feedback/Loading.jsx';
import ErrorState from '../../components/feedback/ErrorState.jsx';
import { getMyRated } from '../../services/ratingsService.js';

const PAGE_SIZE = 8;

export default function RatingHistory() {
  const [rated, setRated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [q, setQ] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    let active = true;
    getMyRated()
      .then((data) => { if (active) setRated(Array.isArray(data) ? data : []); })
      .catch((err) => { if (active) setError(err?.message || 'Unable to load rating history'); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  const filtered = useMemo(() => {
    if (!q) return rated;
    const t = q.toLowerCase();
    return rated.filter((r) => r.name.toLowerCase().includes(t) || (r.rollNumber || '').includes(t));
  }, [rated, q]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const items = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const columns = [
    {
      key: 'name',
      label: 'Student',
      render: (r) => (
        <div className="flex items-center gap-2">
          <Avatar name={r.name} size={28} />
          <div><p className="font-medium text-fg">{r.name}</p><p className="text-xs text-muted">{r.rollNumber}</p></div>
        </div>
      ),
    },
  ];

  return (
    <PageContainer>
      <PageHeader
        title="Students You've Rated"
        subtitle="Ratings are anonymous by design — the score and comment you gave are never linked back to you, so only the list of who you've rated is available here."
        icon={<History size={18} />}
      />
      <Mission7SubNav />

      <div className="flex flex-wrap gap-3 items-end mb-4">
        <div className="flex-1 min-w-[220px]">
          <SearchInput value={q} onChange={(e) => { setQ(e.target.value); setPage(1); }} placeholder="Search by name or roll..." />
        </div>
      </div>

      {loading ? (
        <LoadingState label="Loading rating history..." />
      ) : error ? (
        <ErrorState title="Couldn't load rating history" message={error} />
      ) : items.length === 0 ? (
        <EmptyState title="No ratings yet" message="Submit your first peer rating to see it here." />
      ) : (
        <>
          <div className="hidden sm:block">
            <Table columns={columns} rows={items} />
          </div>
          <div className="sm:hidden space-y-3">
            {items.map((r) => (
              <Card key={r.id} className="p-4 flex items-center gap-3">
                <Avatar name={r.name} size={36} />
                <div>
                  <p className="text-sm font-medium text-fg">{r.name}</p>
                  <p className="text-xs text-muted">{r.rollNumber}</p>
                </div>
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
