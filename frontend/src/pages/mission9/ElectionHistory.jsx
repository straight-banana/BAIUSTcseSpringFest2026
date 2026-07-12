import { useEffect, useMemo, useState } from 'react';
import { History } from 'lucide-react';
import PageContainer from '../../components/layout/PageContainer.jsx';
import PageHeader from '../../components/layout/PageHeader.jsx';
import Card from '../../components/common/Card.jsx';
import SearchInput from '../../components/forms/SearchInput.jsx';
import Select from '../../components/forms/Select.jsx';
import Badge from '../../components/ui/Badge.jsx';
import Pagination from '../../components/ui/Pagination.jsx';
import EmptyState from '../../components/feedback/EmptyState.jsx';
import LoadingState from '../../components/feedback/Loading.jsx';
import ErrorState from '../../components/feedback/ErrorState.jsx';
import Mission9SubNav from '../../components/mission9/Mission9SubNav.jsx';
import { getHistory } from '../../services/electionsService.js';

const PER = 5;

export default function ElectionHistory() {
  const [elections, setElections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [q, setQ] = useState('');
  const [status, setStatus] = useState('all');
  const [page, setPage] = useState(1);

  useEffect(() => {
    let active = true;
    getHistory()
      .then((data) => { if (active) setElections(Array.isArray(data) ? data : []); })
      .catch((err) => { if (active) setError(err?.message || 'Unable to load election history'); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  const filtered = useMemo(() => elections.filter((h) => {
    if (status !== 'all' && h.status?.toLowerCase() !== status) return false;
    if (q) return h.title.toLowerCase().includes(q.toLowerCase());
    return true;
  }), [elections, q, status]);

  const pages = Math.max(1, Math.ceil(filtered.length / PER));
  const p = Math.min(page, pages);
  const shown = filtered.slice((p - 1) * PER, p * PER);

  return (
    <PageContainer>
      <PageHeader title="Election History" subtitle="Every past captain election, at a glance." icon={<History size={18} />} />
      <Mission9SubNav />

      <Card className="p-4 mb-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="sm:col-span-2">
          <SearchInput value={q} onChange={(e) => { setQ(e.target.value); setPage(1); }} placeholder="Search by title…" />
        </div>
        <Select value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }}>
          <option value="all">All statuses</option>
          <option value="closed">Closed</option>
          <option value="published">Published</option>
        </Select>
      </Card>

      {loading ? (
        <LoadingState label="Loading election history..." />
      ) : error ? (
        <ErrorState title="Couldn't load history" message={error} />
      ) : shown.length === 0 ? (
        <EmptyState title="No elections match" message="Try clearing the filters or search." />
      ) : (
        <>
          {/* Desktop table */}
          <Card className="hidden md:block overflow-x-auto mb-4">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs uppercase text-muted border-b border-border">
                  <th className="px-4 py-3 font-medium">Election</th>
                  <th className="px-4 py-3 font-medium text-right">Candidates</th>
                  <th className="px-4 py-3 font-medium text-right">Voters</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {shown.map((h) => (
                  <tr key={h.id} className="border-b border-border last:border-0">
                    <td className="px-4 py-3">
                      <p className="text-fg font-medium">{h.title}</p>
                      <p className="text-[11px] text-muted">{h.startsAt ? new Date(h.startsAt).toLocaleDateString() : ''}</p>
                    </td>
                    <td className="px-4 py-3 text-fg tabular-nums text-right">{h._count?.candidates ?? 0}</td>
                    <td className="px-4 py-3 text-fg tabular-nums text-right">{h._count?.voteRecords ?? 0}</td>
                    <td className="px-4 py-3">
                      <Badge tone={h.status === 'CLOSED' ? 'neutral' : 'brand'} className="capitalize">{h.status?.toLowerCase()}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>

          {/* Mobile cards */}
          <div className="md:hidden space-y-3 mb-4">
            {shown.map((h) => (
              <Card key={h.id} className="p-4">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <p className="text-fg font-medium">{h.title}</p>
                  <Badge tone={h.status === 'CLOSED' ? 'neutral' : 'brand'} className="capitalize">{h.status?.toLowerCase()}</Badge>
                </div>
                <div className="grid grid-cols-2 gap-2 text-center border-t border-border pt-3">
                  <div><p className="text-sm font-semibold text-fg tabular-nums">{h._count?.candidates ?? 0}</p><p className="text-[10px] uppercase text-subtle">Candidates</p></div>
                  <div><p className="text-sm font-semibold text-fg tabular-nums">{h._count?.voteRecords ?? 0}</p><p className="text-[10px] uppercase text-subtle">Voters</p></div>
                </div>
              </Card>
            ))}
          </div>

          {pages > 1 && (
            <div className="flex justify-center">
              <Pagination page={p} total={pages} onChange={setPage} />
            </div>
          )}
        </>
      )}
    </PageContainer>
  );
}
