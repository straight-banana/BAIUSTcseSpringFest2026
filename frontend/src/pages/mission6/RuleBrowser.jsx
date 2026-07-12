import { useEffect, useMemo, useState } from 'react';
import { BookOpen, Search, AlertTriangle } from 'lucide-react';
import PageContainer from '../../components/layout/PageContainer.jsx';
import PageHeader from '../../components/layout/PageHeader.jsx';
import Card from '../../components/common/Card.jsx';
import Mission6SubNav from '../../components/mission6/Mission6SubNav.jsx';
import RuleCard from '../../components/mission6/RuleCard.jsx';
import EmptyState from '../../components/feedback/EmptyState.jsx';
import Spinner from '../../components/ui/Spinner.jsx';
import { cx } from '../../utils/index.js';
import { searchRules } from '../../services/factCheckService.js';
import { AkpApiError } from '../../services/aiApi.js';
import { useToast } from '../../components/feedback/Toast.jsx';

// Server-side contract: single free-text `query`, no filter fields.
// Response items expose `chapter` — filter by chapter on the client only.
function normalizeRule(r, i) {
  return {
    id: r?.id ?? `r-${i}`,
    title: r?.title ?? r?.rule ?? `Rule ${i + 1}`,
    summary: r?.summary ?? r?.body ?? r?.text ?? r?.content ?? '',
    chapter: r?.chapter ?? null,
    number: r?.chapter != null ? `Chapter ${r.chapter}` : (r?.number ?? ''),
    category: r?.category ?? 'general',
  };
}

export default function RuleBrowser() {
  const [query, setQuery] = useState('');
  const [submitted, setSubmitted] = useState('');
  const [chapter, setChapter] = useState('all');
  const [rules, setRules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const toast = useToast();

  useEffect(() => {
    if (!submitted) { setRules([]); return; }
    const ac = new AbortController();
    setLoading(true);
    setError(null);
    setChapter('all');
    searchRules(submitted, { signal: ac.signal })
      .then((raw) => {
        const items = Array.isArray(raw) ? raw : (raw?.results ?? raw?.rules ?? raw?.data ?? []);
        setRules(items.map(normalizeRule));
      })
      .catch((e) => {
        if (e?.name === 'AbortError' || ac.signal.aborted) return;
        setRules([]);
        const isApi = e instanceof AkpApiError;
        const msg = isApi ? e.toUserMessage() : (e?.message || 'Search failed.');
        setError(msg);
        toast.push({ tone: 'error', title: 'Search failed', message: msg });
      })
      .finally(() => setLoading(false));
    return () => ac.abort();
  }, [submitted]);

  const chapters = useMemo(() => {
    const set = new Set();
    for (const r of rules) if (r.chapter != null && r.chapter !== '') set.add(String(r.chapter));
    return Array.from(set).sort((a, b) => Number(a) - Number(b) || a.localeCompare(b));
  }, [rules]);

  const filtered = useMemo(
    () => (chapter === 'all' ? rules : rules.filter((r) => String(r.chapter) === chapter)),
    [rules, chapter]
  );

  const onSubmit = (e) => {
    e.preventDefault();
    setSubmitted(query.trim());
  };

  return (
    <PageContainer>
      <PageHeader
        title="University Rulebook"
        subtitle="Search the official rules. Filter by chapter after results load."
        icon={<BookOpen size={18} />}
      />
      <Mission6SubNav />

      <Card className="p-4 mb-4">
        <form onSubmit={onSubmit} className="flex items-center gap-2 rounded-full border border-border bg-elevated px-4 h-11">
          <Search size={16} className="text-muted" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search rules (free text)…"
            className="flex-1 bg-transparent outline-none text-sm text-fg placeholder:text-muted"
          />
          <button type="submit" className="text-xs text-brand font-medium hover:underline">Search</button>
        </form>

        {chapters.length > 0 && (
          <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
            <button
              onClick={() => setChapter('all')}
              className={cx(
                'shrink-0 inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs border transition',
                chapter === 'all' ? 'bg-brand text-brand-fg border-transparent' : 'text-fg border-border bg-surface hover:bg-elevated'
              )}
            >
              All chapters
            </button>
            {chapters.map((c) => (
              <button
                key={c}
                onClick={() => setChapter(c)}
                className={cx(
                  'shrink-0 inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs border transition',
                  chapter === c ? 'bg-brand text-brand-fg border-transparent' : 'text-fg border-border bg-surface hover:bg-elevated'
                )}
              >
                Chapter {c}
              </button>
            ))}
          </div>
        )}
      </Card>

      {loading && (
        <div className="py-12 flex justify-center"><Spinner /></div>
      )}

      {!loading && error && (
        <Card className="p-4 flex items-start gap-2 text-danger text-sm">
          <AlertTriangle size={16} className="shrink-0 mt-0.5" /> {error}
        </Card>
      )}

      {!loading && !error && !submitted && (
        <EmptyState title="Search the rulebook" message="Type a keyword or claim above and press Search." />
      )}

      {!loading && !error && submitted && filtered.length === 0 && (
        <EmptyState title="No rules found" message="Try a different keyword or clear the chapter filter." />
      )}

      {!loading && !error && filtered.length > 0 && (
        <>
          <div className="mb-3 text-xs text-muted">
            Showing {filtered.length} of {rules.length} rule{rules.length === 1 ? '' : 's'}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {filtered.map((r) => <RuleCard key={r.id} rule={r} />)}
          </div>
        </>
      )}
    </PageContainer>
  );
}
