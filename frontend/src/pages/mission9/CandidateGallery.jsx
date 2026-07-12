import { useMemo, useState } from 'react';
import { Users, LayoutGrid, List } from 'lucide-react';
import PageContainer from '../../components/layout/PageContainer.jsx';
import PageHeader from '../../components/layout/PageHeader.jsx';
import Card from '../../components/common/Card.jsx';
import SearchInput from '../../components/forms/SearchInput.jsx';
import Select from '../../components/forms/Select.jsx';
import Pagination from '../../components/ui/Pagination.jsx';
import EmptyState from '../../components/feedback/EmptyState.jsx';
import Mission9SubNav from '../../components/mission9/Mission9SubNav.jsx';
import CandidateVoteCard from '../../components/mission9/CandidateVoteCard.jsx';
import { CANDIDATES } from '../../mocks/data/mission9.js';
import { cx } from '../../utils/index.js';

const CLASSES = ['All', '6', '7', '8', '9', '10'];
const SORTS = [
  { value: 'overall',    label: 'Overall score' },
  { value: 'leadership', label: 'Leadership' },
  { value: 'peer',       label: 'Peer rating' },
  { value: 'name',       label: 'Name (A–Z)' },
];
const PER_PAGE = 6;

export default function CandidateGallery() {
  const [q, setQ] = useState('');
  const [cls, setCls] = useState('All');
  const [sort, setSort] = useState('overall');
  const [view, setView] = useState('grid');
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    let arr = CANDIDATES.filter((c) => {
      if (cls !== 'All' && c.className !== cls) return false;
      if (q) {
        const s = q.toLowerCase();
        return c.name.toLowerCase().includes(s) || c.roll.includes(s) || c.manifesto.toLowerCase().includes(s);
      }
      return true;
    });
    arr = [...arr].sort((a, b) => {
      if (sort === 'name') return a.name.localeCompare(b.name);
      if (sort === 'peer') return b.scores.peer - a.scores.peer;
      if (sort === 'leadership') return b.scores.leadership - a.scores.leadership;
      return b.overallScore - a.overallScore;
    });
    return arr;
  }, [q, cls, sort]);

  const pages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const p = Math.min(page, pages);
  const shown = filtered.slice((p - 1) * PER_PAGE, p * PER_PAGE);

  return (
    <PageContainer>
      <PageHeader title="Candidate Gallery" subtitle="Browse everyone running for captain this round." icon={<Users size={18} />} />
      <Mission9SubNav />

      <Card className="p-4 mb-6 grid grid-cols-1 sm:grid-cols-4 gap-3">
        <div className="sm:col-span-2">
          <SearchInput value={q} onChange={(e) => { setQ(e.target.value); setPage(1); }} placeholder="Search name, roll, or manifesto…" />
        </div>
        <Select value={cls} onChange={(e) => { setCls(e.target.value); setPage(1); }}>
          {CLASSES.map((d) => <option key={d} value={d}>{d === 'All' ? 'All classes' : `Class ${d}`}</option>)}
        </Select>
        <Select value={sort} onChange={(e) => setSort(e.target.value)}>
          {SORTS.map((s) => <option key={s.value} value={s.value}>Sort · {s.label}</option>)}
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

      {shown.length === 0 ? (
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

      {pages > 1 && (
        <div className="mt-6 flex justify-center">
          <Pagination page={p} total={pages} onChange={setPage} />
        </div>
      )}
    </PageContainer>
  );
}
