import { useMemo, useState } from 'react';
import PageContainer from '../../components/layout/PageContainer.jsx';
import PageHeader from '../../components/layout/PageHeader.jsx';
import Mission3SubNav from '../../components/mission3/Mission3SubNav.jsx';
import Card from '../../components/common/Card.jsx';
import Button from '../../components/common/Button.jsx';
import Badge from '../../components/ui/Badge.jsx';
import SectionHeader from '../../components/ui/SectionHeader.jsx';
import SearchBar from '../../components/mission3/SearchBar.jsx';
import EmptyState from '../../components/feedback/EmptyState.jsx';
import { History, MoreHorizontal, ArrowRight, BookOpen } from 'lucide-react';
import { RECENT_SESSIONS } from '../../mocks/data/mission3.js';
import { Link } from 'react-router-dom';
import { cx } from '../../utils/index.js';

const PAGE = 5;
const FILTERS = ['all', 'ready', 'archived'];

export default function AIHistory() {
  const [q, setQ] = useState('');
  const [filter, setFilter] = useState('all');
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    return RECENT_SESSIONS.filter((s) => {
      const matchesQ = !q || `${s.title} ${s.course}`.toLowerCase().includes(q.toLowerCase());
      const matchesF = filter === 'all' || s.status === filter;
      return matchesQ && matchesF;
    });
  }, [q, filter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE));
  const pageItems = filtered.slice((page - 1) * PAGE, page * PAGE);
  const fmt = (iso) => new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });

  return (
    <PageContainer>
      <PageHeader
        title="AI History"
        subtitle="Your previous syllabus analyses"
        icon={<History size={18} />}
      />
      <Mission3SubNav />

      <Card className="p-5">
        <SectionHeader
          title={`${filtered.length} analyses`}
          message="Search or filter across your past sessions."
          action={
            <div className="flex flex-wrap items-center gap-2">
              <SearchBar value={q} onChange={(v) => { setQ(v); setPage(1); }} placeholder="Search title or course..." className="w-full sm:w-64" />
              <div className="inline-flex rounded-md border border-border overflow-hidden">
                {FILTERS.map((f) => (
                  <button
                    key={f}
                    onClick={() => { setFilter(f); setPage(1); }}
                    className={cx(
                      'px-3 h-9 text-xs capitalize transition-colors',
                      filter === f ? 'bg-brand text-brand-fg' : 'bg-surface text-muted hover:text-fg'
                    )}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>
          }
        />

        {pageItems.length === 0 ? (
          <EmptyState title="No analyses found" message="Try clearing your filters or starting a new analysis." />
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-xs uppercase tracking-wider text-subtle">
                  <tr className="border-b border-border">
                    <th className="text-left font-medium py-2 pr-4">Title</th>
                    <th className="text-left font-medium py-2 pr-4">Course</th>
                    <th className="text-left font-medium py-2 pr-4">Created</th>
                    <th className="text-left font-medium py-2 pr-4">Last opened</th>
                    <th className="text-left font-medium py-2 pr-4">Status</th>
                    <th className="text-right font-medium py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pageItems.map((s) => (
                    <tr key={s.id} className="border-b border-border last:border-0 hover:bg-elevated/50">
                      <td className="py-3 pr-4 text-fg font-medium">{s.title}</td>
                      <td className="py-3 pr-4 text-muted">{s.course}</td>
                      <td className="py-3 pr-4 text-muted">{fmt(s.createdAt)}</td>
                      <td className="py-3 pr-4 text-muted">{fmt(s.lastOpenedAt)}</td>
                      <td className="py-3 pr-4">
                        <Badge tone={s.status === 'ready' ? 'success' : 'neutral'}>{s.status}</Badge>
                      </td>
                      <td className="py-3 text-right">
                        <Link to="/mission-3/summary">
                          <Button size="sm" variant="ghost" rightIcon={<ArrowRight size={14} />}>Open</Button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <ul className="md:hidden space-y-3">
              {pageItems.map((s) => (
                <li key={s.id} className="rounded-lg border border-border p-4">
                  <div className="flex items-start gap-3">
                    <div className="h-9 w-9 rounded-lg bg-brand-soft text-brand flex items-center justify-center shrink-0">
                      <BookOpen size={16} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-fg truncate">{s.title}</p>
                      <p className="text-xs text-muted mt-0.5">{s.course}</p>
                      <div className="mt-2 flex items-center gap-2">
                        <Badge tone={s.status === 'ready' ? 'success' : 'neutral'}>{s.status}</Badge>
                        <span className="text-xs text-subtle">Opened {fmt(s.lastOpenedAt)}</span>
                      </div>
                    </div>
                    <button aria-label="More actions" className="text-muted hover:text-fg p-1">
                      <MoreHorizontal size={16} />
                    </button>
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-4 flex items-center justify-between">
              <p className="text-xs text-muted">Page {page} of {totalPages}</p>
              <div className="flex gap-2">
                <Button size="sm" variant="secondary" disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
                  Previous
                </Button>
                <Button size="sm" variant="secondary" disabled={page === totalPages} onClick={() => setPage((p) => p + 1)}>
                  Next
                </Button>
              </div>
            </div>
          </>
        )}
      </Card>
    </PageContainer>
  );
}
