import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { History, Trash2, Search } from 'lucide-react';
import PageContainer from '../../components/layout/PageContainer.jsx';
import PageHeader from '../../components/layout/PageHeader.jsx';
import Card from '../../components/common/Card.jsx';
import Button from '../../components/common/Button.jsx';
import Mission6SubNav from '../../components/mission6/Mission6SubNav.jsx';
import HistoryCard from '../../components/mission6/HistoryCard.jsx';
import EmptyState from '../../components/feedback/EmptyState.jsx';
import Pagination from '../../components/ui/Pagination.jsx';
import { HISTORY } from '../../mocks/data/mission6.js';

const PAGE_SIZE = 8;

export default function SearchHistory() {
  const nav = useNavigate();
  const [items, setItems] = useState(HISTORY);
  const [q, setQ] = useState('');
  const [page, setPage] = useState(1);

  const filtered = useMemo(
    () => items.filter((i) => !q || i.query.toLowerCase().includes(q.toLowerCase())),
    [items, q]
  );
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));

  const del = (item) => setItems((prev) => prev.filter((x) => x.id !== item.id));
  const doSearch = (item) => nav(`/mission-6/result?q=${encodeURIComponent(item.query)}`);

  return (
    <PageContainer>
      <PageHeader
        title="Search History"
        subtitle="Every fact-check you've performed."
        icon={<History size={18} />}
        actions={
          <Button size="sm" variant="secondary" leftIcon={<Trash2 size={14} />} onClick={() => setItems([])}>
            Clear all
          </Button>
        }
      />
      <Mission6SubNav />

      <Card className="p-3 mb-4">
        <div className="flex items-center gap-2 rounded-full border border-border bg-elevated px-4 h-10">
          <Search size={14} className="text-muted" />
          <input
            value={q}
            onChange={(e) => { setQ(e.target.value); setPage(1); }}
            placeholder="Search your history..."
            className="flex-1 bg-transparent outline-none text-sm text-fg placeholder:text-muted"
          />
        </div>
      </Card>

      {filtered.length === 0 ? (
        <EmptyState
          title="No history yet"
          message="Your fact checks will show up here."
          action={<Button onClick={() => nav('/mission-6')}>Start fact-checking</Button>}
        />
      ) : (
        <>
          <div className="space-y-3">
            {paged.map((h) => <HistoryCard key={h.id} item={h} onSearch={doSearch} onDelete={del} />)}
          </div>
          <div className="mt-6 flex justify-center">
            <Pagination page={page} total={totalPages} onChange={setPage} />
          </div>
        </>
      )}
    </PageContainer>
  );
}
