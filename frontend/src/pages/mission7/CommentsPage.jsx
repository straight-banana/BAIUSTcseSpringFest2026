import { useMemo, useState } from 'react';
import { MessageSquare } from 'lucide-react';
import PageContainer from '../../components/layout/PageContainer.jsx';
import PageHeader from '../../components/layout/PageHeader.jsx';
import Mission7SubNav from '../../components/mission7/Mission7SubNav.jsx';
import SearchInput from '../../components/forms/SearchInput.jsx';
import Select from '../../components/forms/Select.jsx';
import Pagination from '../../components/ui/Pagination.jsx';
import CommentCard from '../../components/mission7/CommentCard.jsx';
import EmptyState from '../../components/feedback/EmptyState.jsx';
import { COMMENTS, RATING_CATEGORIES } from '../../mocks/data/mission7.js';

const PAGE_SIZE = 9;

export default function CommentsPage() {
  const [q, setQ] = useState('');
  const [cat, setCat] = useState('');
  const [sort, setSort] = useState('newest');
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    let list = COMMENTS.filter((c) => c.status === 'approved');
    if (cat) list = list.filter((c) => c.category === cat);
    if (q) list = list.filter((c) => c.body.toLowerCase().includes(q.toLowerCase()));
    list = [...list].sort((a, b) =>
      sort === 'helpful' ? b.helpful - a.helpful : new Date(b.createdAt) - new Date(a.createdAt)
    );
    return list;
  }, [q, cat, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const items = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <PageContainer>
      <PageHeader title="Anonymous Comments" subtitle="Honest, moderated peer feedback." icon={<MessageSquare size={18} />} />
      <Mission7SubNav />

      <div className="flex flex-wrap gap-3 items-end mb-4">
        <div className="flex-1 min-w-[220px]">
          <SearchInput value={q} onChange={(e) => { setQ(e.target.value); setPage(1); }} placeholder="Search comments..." />
        </div>
        <Select label="Category" value={cat} onChange={(e) => { setCat(e.target.value); setPage(1); }} className="min-w-[160px]">
          <option value="">All categories</option>
          {RATING_CATEGORIES.map((c) => <option key={c.key} value={c.key}>{c.label}</option>)}
        </Select>
        <Select label="Sort" value={sort} onChange={(e) => setSort(e.target.value)} className="min-w-[140px]">
          <option value="newest">Newest</option>
          <option value="helpful">Most helpful</option>
        </Select>
      </div>

      {items.length === 0 ? (
        <EmptyState title="No comments found" message="Try changing filters or search." />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((c) => <CommentCard key={c.id} comment={c} showStudent />)}
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
