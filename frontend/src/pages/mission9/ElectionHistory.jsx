import { useMemo, useState } from 'react';
import { History, Trophy } from 'lucide-react';
import PageContainer from '../../components/layout/PageContainer.jsx';
import PageHeader from '../../components/layout/PageHeader.jsx';
import Card from '../../components/common/Card.jsx';
import SearchInput from '../../components/forms/SearchInput.jsx';
import Select from '../../components/forms/Select.jsx';
import Badge from '../../components/ui/Badge.jsx';
import Pagination from '../../components/ui/Pagination.jsx';
import EmptyState from '../../components/feedback/EmptyState.jsx';
import Mission9SubNav from '../../components/mission9/Mission9SubNav.jsx';
import { HISTORY } from '../../mocks/data/mission9.js';

const PER = 5;

export default function ElectionHistory() {
  const [q, setQ] = useState('');
  const [status, setStatus] = useState('all');
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => HISTORY.filter((h) => {
    if (status !== 'all' && h.status !== status) return false;
    if (q) {
      const s = q.toLowerCase();
      return h.year.toLowerCase().includes(s) || h.winner.toLowerCase().includes(s) || h.id.toLowerCase().includes(s);
    }
    return true;
  }), [q, status]);

  const pages = Math.max(1, Math.ceil(filtered.length / PER));
  const p = Math.min(page, pages);
  const shown = filtered.slice((p - 1) * PER, p * PER);

  return (
    <PageContainer>
      <PageHeader title="Election History" subtitle="Every past captain election, at a glance." icon={<History size={18} />} />
      <Mission9SubNav />

      <Card className="p-4 mb-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="sm:col-span-2">
          <SearchInput value={q} onChange={(e) => { setQ(e.target.value); setPage(1); }} placeholder="Search year, winner, or ID…" />
        </div>
        <Select value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }}>
          <option value="all">All statuses</option>
          <option value="closed">Closed</option>
          <option value="published">Published</option>
        </Select>
      </Card>

      {shown.length === 0 ? (
        <EmptyState title="No elections match" message="Try clearing the filters or search." />
      ) : (
        <>
          {/* Desktop table */}
          <Card className="hidden md:block overflow-x-auto mb-4">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs uppercase text-muted border-b border-border">
                  <th className="px-4 py-3 font-medium">Election year</th>
                  <th className="px-4 py-3 font-medium">Winner</th>
                  <th className="px-4 py-3 font-medium text-right">Candidates</th>
                  <th className="px-4 py-3 font-medium text-right">Votes cast</th>
                  <th className="px-4 py-3 font-medium text-right">Turnout</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {shown.map((h) => (
                  <tr key={h.id} className="border-b border-border last:border-0">
                    <td className="px-4 py-3">
                      <p className="text-fg font-medium">{h.year}</p>
                      <p className="text-[11px] font-mono text-muted">{h.id}</p>
                    </td>
                    <td className="px-4 py-3">
                      <div className="inline-flex items-center gap-2">
                        <Trophy size={14} className="text-warning" />
                        <span className="text-fg">{h.winner}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-fg tabular-nums text-right">{h.candidates}</td>
                    <td className="px-4 py-3 text-fg tabular-nums text-right">{h.votesCast} <span className="text-muted text-xs">/ {h.eligible}</span></td>
                    <td className="px-4 py-3 tabular-nums text-right">
                      <Badge tone={h.turnout >= 85 ? 'success' : h.turnout >= 75 ? 'brand' : 'warning'}>{h.turnout.toFixed(1)}%</Badge>
                    </td>
                    <td className="px-4 py-3">
                      <Badge tone={h.status === 'closed' ? 'neutral' : 'brand'} className="capitalize">{h.status}</Badge>
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
                  <div>
                    <p className="text-fg font-medium">{h.year}</p>
                    <p className="text-[11px] font-mono text-muted">{h.id}</p>
                  </div>
                  <Badge tone={h.status === 'closed' ? 'neutral' : 'brand'} className="capitalize">{h.status}</Badge>
                </div>
                <div className="inline-flex items-center gap-2 mb-3">
                  <Trophy size={14} className="text-warning" />
                  <span className="text-fg text-sm">{h.winner}</span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center border-t border-border pt-3">
                  <div><p className="text-sm font-semibold text-fg tabular-nums">{h.candidates}</p><p className="text-[10px] uppercase text-subtle">Cand</p></div>
                  <div><p className="text-sm font-semibold text-fg tabular-nums">{h.votesCast}</p><p className="text-[10px] uppercase text-subtle">Votes</p></div>
                  <div><p className="text-sm font-semibold text-fg tabular-nums">{h.turnout.toFixed(1)}%</p><p className="text-[10px] uppercase text-subtle">Turnout</p></div>
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
