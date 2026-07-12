import { useMemo, useState } from 'react';
import { Users, LayoutGrid, List } from 'lucide-react';
import PageContainer from '../../components/layout/PageContainer.jsx';
import PageHeader from '../../components/layout/PageHeader.jsx';
import Mission7SubNav from '../../components/mission7/Mission7SubNav.jsx';
import StudentProfileCard from '../../components/mission7/StudentProfileCard.jsx';
import SearchInput from '../../components/forms/SearchInput.jsx';
import Select from '../../components/forms/Select.jsx';
import Pagination from '../../components/ui/Pagination.jsx';
import Button from '../../components/common/Button.jsx';
import EmptyState from '../../components/feedback/EmptyState.jsx';
import { STUDENTS } from '../../mocks/data/mission7.js';
import { cx } from '../../utils/index.js';

const PAGE_SIZE = 8;

export default function StudentList() {
  const [q, setQ] = useState('');
  const [section, setSection] = useState('');
  const [sort, setSort] = useState('overall-desc');
  const [view, setView] = useState('grid');
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    let list = STUDENTS.filter((s) => {
      if (section && s.section !== section) return false;
      if (q) {
        const t = q.toLowerCase();
        return s.name.toLowerCase().includes(t) || s.roll.includes(t);
      }
      return true;
    });
    const [key, dir] = sort.split('-');
    list = [...list].sort((a, b) => {
      const av = key === 'name' ? a.name : key === 'ratings' ? a.totalRatings : a.overall;
      const bv = key === 'name' ? b.name : key === 'ratings' ? b.totalRatings : b.overall;
      if (av < bv) return dir === 'asc' ? -1 : 1;
      if (av > bv) return dir === 'asc' ? 1 : -1;
      return 0;
    });
    return list;
  }, [q, section, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <PageContainer>
      <PageHeader title="Students" subtitle="Browse classmates and submit ratings." icon={<Users size={18} />} />
      <Mission7SubNav />

      <div className="flex flex-wrap gap-3 items-end mb-4">
        <div className="flex-1 min-w-[220px]">
          <SearchInput value={q} onChange={(e) => { setQ(e.target.value); setPage(1); }} placeholder="Search by name or roll..." />
        </div>
        <Select label="Section" value={section} onChange={(e) => { setSection(e.target.value); setPage(1); }} className="min-w-[120px]">
          <option value="">All</option>
          <option value="A">A</option>
          <option value="B">B</option>
          <option value="C">C</option>
        </Select>
        <Select label="Sort" value={sort} onChange={(e) => setSort(e.target.value)} className="min-w-[160px]">
          <option value="overall-desc">Highest rated</option>
          <option value="overall-asc">Lowest rated</option>
          <option value="ratings-desc">Most rated</option>
          <option value="name-asc">Name A→Z</option>
        </Select>
        <div className="inline-flex rounded-md border border-border overflow-hidden">
          <Button size="icon" variant={view === 'grid' ? 'secondary' : 'ghost'} onClick={() => setView('grid')} aria-label="Grid view">
            <LayoutGrid size={14} />
          </Button>
          <Button size="icon" variant={view === 'list' ? 'secondary' : 'ghost'} onClick={() => setView('list')} aria-label="List view">
            <List size={14} />
          </Button>
        </div>
      </div>

      {pageItems.length === 0 ? (
        <EmptyState title="No students match your filters" message="Try clearing the search or section." />
      ) : (
        <div className={cx(view === 'grid'
          ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'
          : 'space-y-3'
        )}>
          {pageItems.map((s) => (
            <StudentProfileCard key={s.id} student={s} variant={view === 'list' ? 'list' : 'grid'} />
          ))}
        </div>
      )}

      {filtered.length > PAGE_SIZE && (
        <div className="mt-6 flex justify-center">
          <Pagination page={page} total={totalPages} onChange={setPage} />
        </div>
      )}
    </PageContainer>
  );
}
