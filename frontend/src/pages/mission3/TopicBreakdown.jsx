import { useMemo, useState } from 'react';
import PageContainer from '../../components/layout/PageContainer.jsx';
import PageHeader from '../../components/layout/PageHeader.jsx';
import Mission3SubNav from '../../components/mission3/Mission3SubNav.jsx';
import Card from '../../components/common/Card.jsx';
import SectionHeader from '../../components/ui/SectionHeader.jsx';
import SearchBar from '../../components/mission3/SearchBar.jsx';
import TopicCard from '../../components/mission3/TopicCard.jsx';
import EmptyState from '../../components/feedback/EmptyState.jsx';
import { ListChecks } from 'lucide-react';
import { MOCK_TOPICS, DIFFICULTIES } from '../../mocks/data/mission3.js';
import { cx } from '../../utils/index.js';

const SORTS = [
  { value: 'importance', label: 'Importance' },
  { value: 'exam', label: 'Exam probability' },
  { value: 'hours', label: 'Study hours' },
  { value: 'name', label: 'Name' },
];

export default function TopicBreakdown() {
  const [q, setQ] = useState('');
  const [difficulty, setDifficulty] = useState('all');
  const [sort, setSort] = useState('importance');

  const filtered = useMemo(() => {
    let list = MOCK_TOPICS.filter((t) => {
      const matchesQ = !q || t.name.toLowerCase().includes(q.toLowerCase());
      const matchesD = difficulty === 'all' || t.difficulty === difficulty;
      return matchesQ && matchesD;
    });
    list = [...list].sort((a, b) => {
      if (sort === 'name') return a.name.localeCompare(b.name);
      if (sort === 'exam') return b.examProbability - a.examProbability;
      if (sort === 'hours') return b.hours - a.hours;
      return b.importance - a.importance;
    });
    return list;
  }, [q, difficulty, sort]);

  return (
    <PageContainer>
      <PageHeader
        title="Topic Breakdown"
        subtitle="Every detected topic with importance, difficulty and exam probability."
        icon={<ListChecks size={18} />}
      />
      <Mission3SubNav />

      <Card className="p-5 mb-4">
        <SectionHeader
          title={`${filtered.length} topics`}
          message="Filter and sort to prioritize what to study first."
          action={
            <div className="flex flex-wrap items-center gap-2">
              <SearchBar value={q} onChange={setQ} placeholder="Search topics..." className="w-full sm:w-56" />
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="h-9 rounded-md border border-border bg-surface px-3 text-sm text-fg focus:outline-none focus:ring-2 focus:ring-brand/40"
              >
                <option value="all">All difficulties</option>
                {DIFFICULTIES.map((d) => (
                  <option key={d.value} value={d.value}>{d.label}</option>
                ))}
              </select>
              <div className="inline-flex rounded-md border border-border overflow-hidden">
                {SORTS.map((s) => (
                  <button
                    key={s.value}
                    onClick={() => setSort(s.value)}
                    className={cx(
                      'px-3 h-9 text-xs transition-colors',
                      sort === s.value ? 'bg-brand text-brand-fg' : 'bg-surface text-muted hover:text-fg'
                    )}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
          }
        />
      </Card>

      {filtered.length === 0 ? (
        <EmptyState title="No topics match your filter" message="Adjust the difficulty or search query." />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
          {filtered.map((t) => <TopicCard key={t.id} topic={t} />)}
        </div>
      )}
    </PageContainer>
  );
}
