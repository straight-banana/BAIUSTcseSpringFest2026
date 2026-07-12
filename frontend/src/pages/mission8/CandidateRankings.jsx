import { useEffect, useMemo, useState } from 'react';
import { ListOrdered, LayoutGrid, List } from 'lucide-react';
import PageContainer from '../../components/layout/PageContainer.jsx';
import PageHeader from '../../components/layout/PageHeader.jsx';
import Mission8SubNav from '../../components/mission8/Mission8SubNav.jsx';
import CandidateCard from '../../components/mission8/CandidateCard.jsx';
import SearchInput from '../../components/forms/SearchInput.jsx';
import Select from '../../components/forms/Select.jsx';
import Pagination from '../../components/ui/Pagination.jsx';
import Button from '../../components/common/Button.jsx';
import EmptyState from '../../components/feedback/EmptyState.jsx';
import LoadingState from '../../components/feedback/Loading.jsx';
import ErrorState from '../../components/feedback/ErrorState.jsx';
import { getCurrentRound, getRankedCandidates } from '../../services/candidatesService.js';
import { cx } from '../../utils/index.js';

const PAGE_SIZE = 8;
const BADGES = ['GOLD', 'SILVER', 'BRONZE'];

export default function CandidateRankings() {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [q, setQ] = useState('');
  const [badge, setBadge] = useState('');
  const [sort, setSort] = useState('overall-desc');
  const [view, setView] = useState('list');
  const [page, setPage] = useState(1);

  useEffect(() => {
    let active = true;
    getCurrentRound()
      .then((round) => (round ? getRankedCandidates(round.id) : []))
      .then((data) => { if (active) setCandidates(data || []); })
      .catch((err) => { if (active) setError(err?.message || 'Unable to load rankings'); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  const filtered = useMemo(() => {
    let list = candidates.filter((c) => {
      if (badge && c.badge !== badge) return false;
      if (q) {
        const t = q.toLowerCase();
        return c.name?.toLowerCase().includes(t) || (c.roll || '').includes(t);
      }
      return true;
    });
    const [key, dir] = sort.split('-');
    const getVal = (c) => key === 'name' ? c.name : c.scores?.[key] ?? c.overall ?? 0;
    list = [...list].sort((a, b) => {
      const av = getVal(a), bv = getVal(b);
      if (av < bv) return dir === 'asc' ? -1 : 1;
      if (av > bv) return dir === 'asc' ? 1 : -1;
      return 0;
    });
    return list;
  }, [candidates, q, badge, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const items = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <PageContainer>
      <PageHeader title="Candidate Rankings" subtitle="All candidates in the current round, ranked by weighted score." icon={<ListOrdered size={18} />} />
      <Mission8SubNav />

      <div className="flex flex-wrap gap-3 items-end mb-4">
        <div className="flex-1 min-w-[220px]">
          <SearchInput value={q} onChange={(e) => { setQ(e.target.value); setPage(1); }} placeholder="Search by name or roll..." />
        </div>
        <Select label="Badge" value={badge} onChange={(e) => { setBadge(e.target.value); setPage(1); }} className="min-w-[140px]">
          <option value="">All</option>
          {BADGES.map((b) => <option key={b} value={b}>{b}</option>)}
        </Select>
        <Select label="Sort" value={sort} onChange={(e) => setSort(e.target.value)} className="min-w-[160px]">
          <option value="overall-desc">Overall (high→low)</option>
          <option value="leadership-desc">Leadership</option>
          <option value="name-asc">Name A→Z</option>
        </Select>
        <div className="inline-flex rounded-md border border-border overflow-hidden">
          <Button size="icon" variant={view === 'list' ? 'secondary' : 'ghost'} onClick={() => setView('list')} aria-label="List"><List size={14} /></Button>
          <Button size="icon" variant={view === 'grid' ? 'secondary' : 'ghost'} onClick={() => setView('grid')} aria-label="Grid"><LayoutGrid size={14} /></Button>
        </div>
      </div>

      {loading ? (
        <LoadingState label="Loading rankings..." />
      ) : error ? (
        <ErrorState title="Couldn't load rankings" message={error} />
      ) : items.length === 0 ? (
        <EmptyState title="No candidates match your filters" message="Try clearing search or filters." />
      ) : (
        <div className={cx(view === 'grid'
          ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'
          : 'space-y-3'
        )}>
          {items.map((c, i) => (
            <CandidateCard key={c.id} candidate={c} rank={(page - 1) * PAGE_SIZE + i + 1} variant={view} />
          ))}
        </div>
      )}

      {!loading && !error && filtered.length > PAGE_SIZE && (
        <div className="mt-6 flex justify-center">
          <Pagination page={page} total={totalPages} onChange={setPage} />
        </div>
      )}
    </PageContainer>
  );
}
