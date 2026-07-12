import { useEffect, useMemo, useState } from 'react';
import { MessageSquare } from 'lucide-react';
import PageContainer from '../../components/layout/PageContainer.jsx';
import PageHeader from '../../components/layout/PageHeader.jsx';
import Mission7SubNav from '../../components/mission7/Mission7SubNav.jsx';
import SearchInput from '../../components/forms/SearchInput.jsx';
import Select from '../../components/forms/Select.jsx';
import Pagination from '../../components/ui/Pagination.jsx';
import CommentCard from '../../components/mission7/CommentCard.jsx';
import EmptyState from '../../components/feedback/EmptyState.jsx';
import LoadingState from '../../components/feedback/Loading.jsx';
import ErrorState from '../../components/feedback/ErrorState.jsx';
import { getRoster, getPublicComments } from '../../services/ratingsService.js';

const PAGE_SIZE = 9;

export default function CommentsPage() {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [q, setQ] = useState('');
  const [sort, setSort] = useState('newest');
  const [page, setPage] = useState(1);

  useEffect(() => {
    let active = true;
    getRoster()
      .then((roster) => Promise.all(
        roster.map((s) => getPublicComments(s.id).then((list) => list.map((c) => ({
          id: c.id,
          body: c.comment || '(no written comment)',
          categoryLabel: 'Peer rating',
          status: 'approved',
          createdAt: c.createdAt,
          helpful: 0,
          studentName: s.name,
        }))))
      ))
      .then((lists) => { if (active) setComments(lists.flat()); })
      .catch((err) => { if (active) setError(err?.message || 'Unable to load comments'); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  const filtered = useMemo(() => {
    let list = comments;
    if (q) list = list.filter((c) => c.body.toLowerCase().includes(q.toLowerCase()) || c.studentName?.toLowerCase().includes(q.toLowerCase()));
    list = [...list].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return list;
  }, [comments, q, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const items = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <PageContainer>
      <PageHeader title="Anonymous Comments" subtitle="Honest, moderated peer feedback." icon={<MessageSquare size={18} />} />
      <Mission7SubNav />

      <div className="flex flex-wrap gap-3 items-end mb-4">
        <div className="flex-1 min-w-[220px]">
          <SearchInput value={q} onChange={(e) => { setQ(e.target.value); setPage(1); }} placeholder="Search comments or students..." />
        </div>
        <Select label="Sort" value={sort} onChange={(e) => setSort(e.target.value)} className="min-w-[140px]">
          <option value="newest">Newest</option>
        </Select>
      </div>

      {loading ? (
        <LoadingState label="Loading comments..." />
      ) : error ? (
        <ErrorState title="Couldn't load comments" message={error} />
      ) : items.length === 0 ? (
        <EmptyState title="No comments found" message="Try changing filters or search." />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((c) => <CommentCard key={c.id} comment={c} showStudent />)}
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
