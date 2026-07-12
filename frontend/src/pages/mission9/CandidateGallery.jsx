import { useEffect, useMemo, useState } from 'react';
import { Users, LayoutGrid, List } from 'lucide-react';
import PageContainer from '../../components/layout/PageContainer.jsx';
import PageHeader from '../../components/layout/PageHeader.jsx';
import Card from '../../components/common/Card.jsx';
import SearchInput from '../../components/forms/SearchInput.jsx';
import Select from '../../components/forms/Select.jsx';
import Pagination from '../../components/ui/Pagination.jsx';
import EmptyState from '../../components/feedback/EmptyState.jsx';
import LoadingState from '../../components/feedback/Loading.jsx';
import ErrorState from '../../components/feedback/ErrorState.jsx';
import Mission9SubNav from '../../components/mission9/Mission9SubNav.jsx';
import CandidateVoteCard from '../../components/mission9/CandidateVoteCard.jsx';
import { getActive } from '../../services/electionsService.js';
import { cx } from '../../utils/index.js';

const PER_PAGE = 6;

export default function CandidateGallery() {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [q, setQ] = useState('');
  const [cls, setCls] = useState('All');
  const [sort, setSort] = useState('name');
  const [view, setView] = useState('grid');
  const [page, setPage] = useState(1);

  useEffect(() => {
    let active = true;
    getActive()
      .then((e) => { if (active) setCandidates(e?.candidates || []); })
      .catch((err) => {
        if (!active) return;
        if (err?.status !== 404) setError(err?.message || 'Unable to load candidates');
      })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  const classes = useMemo(() => ['All', ...new Set(candidates.map((c) => c.className).filter((c) => c != null))], [candidates]);

  const filtered = useMemo(() => {
    let arr = candidates.filter((c) => {
      if (cls !== 'All' && c.className !== cls) return false;
      if (q) {
        const s = q.toLowerCase();
        return c.name.toLowerCase().includes(s) || (c.roll || '').includes(s) || (c.manifesto || '').toLowerCase().includes(s);
      }
      return true;
    });
    arr = [...arr].sort((a, b) => a.name.localeCompare(b.name));
    return arr;
  }, [candidates, q, cls, sort]);

  const pages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const p = Math.min(page, pages);
  const shown = filtered.slice((p - 1) * PER_PAGE, p * PER_PAGE);

  return (
    <PageContainer>
      <PageHeader title="Candidate Gallery" subtitle="Browse everyone running for captain this round." icon={<Users size={18} />} />
      <Mission9SubNav />

      <Card className="p-4 mb-6 grid grid-cols-1 sm:grid-cols-4 gap-3">
        <div className="sm:col-span-2">
          <SearchInput value={q} onChange={(e) => { setQ(e.target.value); setPage(1); }} placeholder="Search name, roll, or bio…" />
        </div>
        <Select value={cls} onChange={(e) => { setCls(e.target.value); setPage(1); }}>
          {classes.map((d) => <option key={d} value={d}>{d === 'All' ? 'All classes' : `Class ${d}`}</option>)}
        </Select>
      </Card>

      <div className="flex items-center justify-between mb-4">
        <p className="text-xs text-muted">{filtered.length} candidate{filtered.length === 1 ? '' : 's'}</p>
        <div className="inline-flex rounded-md border border-border overflow-hidden" role="tablist" aria-label="View mode">
          {[
            { v: 'grid', icon: <LayoutGrid size={14} />, label: 'Grid' },
            { v: 'list', icon: <List size={14} />,       label: 'List' },
          ].map((o) => (
            <button
              key={o.v}
              onClick={() => setView(o.v)}
              role="tab"
              aria-selected={view === o.v}
              className={cx(
                'inline-flex items-center gap-1.5 px-3 h-8 text-xs',
                view === o.v ? 'bg-brand text-brand-fg' : 'bg-surface text-muted hover:text-fg'
              )}
            >
              {o.icon}{o.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <LoadingState label="Loading candidates..." />
      ) : error ? (
        <ErrorState title="Couldn't load candidates" message={error} />
      ) : shown.length === 0 ? (
        <EmptyState title="No candidates match" message="Try clearing the filters or search." />
      ) : view === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {shown.map((c) => <CandidateVoteCard key={c.id} candidate={c} />)}
        </div>
      ) : (
        <div className="space-y-3">
          {shown.map((c) => <CandidateVoteCard key={c.id} candidate={c} variant="list" />)}
        </div>
      )}

      {!loading && !error && pages > 1 && (
        <div className="mt-6 flex justify-center">
          <Pagination page={p} total={pages} onChange={setPage} />
        </div>
      )}
    </PageContainer>
  );
}
