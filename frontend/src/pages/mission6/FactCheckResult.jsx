import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { SearchCheck, ArrowLeft, Share2, Bookmark, Sparkles, AlertTriangle } from 'lucide-react';
import PageContainer from '../../components/layout/PageContainer.jsx';
import PageHeader from '../../components/layout/PageHeader.jsx';
import Card from '../../components/common/Card.jsx';
import SectionHeader from '../../components/ui/SectionHeader.jsx';
import Button from '../../components/common/Button.jsx';
import Mission6SubNav from '../../components/mission6/Mission6SubNav.jsx';
import SearchBar from '../../components/mission6/SearchBar.jsx';
import VerdictBadge from '../../components/mission6/VerdictBadge.jsx';
import ConfidenceRing from '../../components/mission6/ConfidenceRing.jsx';
import RuleCard from '../../components/mission6/RuleCard.jsx';
import Spinner from '../../components/ui/Spinner.jsx';
import { verifyClaim, isTrueVerdict, isFalseVerdict } from '../../services/factCheckService.js';
import { AkpApiError } from '../../services/aiApi.js';
import { useToast } from '../../components/feedback/Toast.jsx';

// Normalize a verify() response into what the existing UI expects.
// Contract notes:
//   - status is a bracketed literal '[TRUE]' or '[FALSE]' (not boolean)
//   - matched_rules may be missing — guard for undefined
function normalizeVerify(raw) {
  if (!raw || typeof raw !== 'object') return null;
  const status = raw.status;
  let verdict = 'unverifiable';
  if (isTrueVerdict(status)) verdict = 'true';
  else if (isFalseVerdict(status)) verdict = 'false';

  const matched = Array.isArray(raw.matched_rules) ? raw.matched_rules : [];

  return {
    verdict,
    status, // keep raw for display
    confidence: (() => {
      const n = Number(raw.confidence_score ?? raw.confidence ?? raw.score ?? 0) || 0;
      return Math.round(n <= 1 ? n * 100 : n);
    })(),
    exactQuote: raw.exact_quote || '',
    summary: raw.summary || raw.explanation || raw.reason || '',
    detailed: raw.detailed || raw.analysis || '',
    reasoning: Array.isArray(raw.reasoning) ? raw.reasoning : [],
    recommendations: Array.isArray(raw.recommendations) ? raw.recommendations : [],
    matchedRules: matched.map((r, i) => ({
      id: r?.id ?? `rule-${i}`,
      number: r?.chapter != null ? `Chapter ${r.chapter}` : (r?.number ?? ''),
      chapter: r?.chapter ?? null,
      category: r?.category ?? 'general',
      title: r?.title ?? r?.rule ?? `Rule ${i + 1}`,
      summary: r?.body ?? r?.text ?? r?.content ?? r?.summary ?? '',
    })),
  };
}

export default function FactCheckResult() {
  const [params] = useSearchParams();
  const nav = useNavigate();
  const query = params.get('q') ?? '';
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // { message, fieldErrors }
  const [result, setResult] = useState(null);
  const toast = useToast();

  useEffect(() => {
    if (!query) return;
    const ac = new AbortController();
    setLoading(true);
    setError(null);
    verifyClaim(query, { signal: ac.signal })
      .then((raw) => setResult(normalizeVerify(raw)))
      .catch((e) => {
        if (e?.name === 'AbortError' || ac.signal.aborted) return;
        if (e instanceof AkpApiError) {
          setError({ message: e.message, fieldErrors: e.fieldErrors || {} });
          if (e.code !== 'validation') {
            toast.push({ tone: 'error', title: 'Fact check failed', message: e.toUserMessage() });
          }
        } else {
          const msg = e?.message || 'Something went wrong.';
          setError({ message: msg, fieldErrors: {} });
          toast.push({ tone: 'error', title: 'Fact check failed', message: msg });
        }
      })
      .finally(() => setLoading(false));
    return () => ac.abort();
  }, [query]);

  const verdictDesc = useMemo(() => {
    if (!result) return '';
    if (result.verdict === 'true') return 'The rulebook supports this claim.';
    if (result.verdict === 'false') return 'The rulebook contradicts this claim.';
    return 'The rulebook does not clearly cover this claim.';
  }, [result]);

  if (loading) {
    return (
      <PageContainer>
        <div className="min-h-[60vh] flex flex-col items-center justify-center text-center">
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-brand/20 blur-2xl animate-pulse" />
            <div className="relative h-16 w-16 rounded-full bg-brand-soft flex items-center justify-center">
              <Sparkles className="text-brand animate-pulse" size={28} />
            </div>
          </div>
          <p className="mt-6 text-sm font-medium text-fg">Cross-referencing the rulebook…</p>
          <div className="mt-4"><Spinner /></div>
        </div>
      </PageContainer>
    );
  }

  if (error) {
    const claimError = error.fieldErrors?.claim || error.fieldErrors?.input;
    return (
      <PageContainer>
        <PageHeader
          title="Fact Check"
          icon={<SearchCheck size={18} />}
          actions={<Button variant="secondary" size="sm" leftIcon={<ArrowLeft size={14} />} onClick={() => nav('/mission-6')}>Back</Button>}
        />
        <Mission6SubNav />
        <div className="mb-6">
          <SearchBar size="sm" value={query} onSubmit={(q) => nav(`/mission-6/result?q=${encodeURIComponent(q)}`)} />
        </div>
        <Card className="p-6">
          <div className="flex items-start gap-3 text-danger">
            <AlertTriangle size={18} className="shrink-0 mt-0.5" />
            <div>
              <p className="font-medium">{claimError || error.message}</p>
              {!claimError && Object.entries(error.fieldErrors || {}).length > 0 && (
                <ul className="mt-2 text-xs text-muted space-y-1">
                  {Object.entries(error.fieldErrors).map(([field, msg]) => (
                    <li key={field}><span className="font-mono">{field}</span>: {msg}</li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </Card>
      </PageContainer>
    );
  }

  if (!result) {
    return (
      <PageContainer>
        <Card className="p-6 text-sm text-muted">No result.</Card>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <PageHeader
        title="Fact Check Result"
        subtitle="AI-assisted verification against the official rulebook"
        icon={<SearchCheck size={18} />}
        actions={
          <Button variant="secondary" size="sm" leftIcon={<ArrowLeft size={14} />} onClick={() => nav('/mission-6')}>Back</Button>
        }
      />
      <Mission6SubNav />

      <div className="mb-6">
        <SearchBar size="sm" value={query} onSubmit={(q) => nav(`/mission-6/result?q=${encodeURIComponent(q)}`)} />
      </div>

      <Card className="p-6 mb-4 bg-gradient-to-br from-surface to-brand-soft/30">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          <div className="md:col-span-2">
            <div className="text-[11px] uppercase tracking-wider text-muted">Claim</div>
            <h2 className="mt-1 text-lg sm:text-xl font-semibold text-fg leading-snug">"{query}"</h2>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <VerdictBadge verdict={result.verdict} size="lg" />
              {result.status && <span className="font-mono text-[11px] text-muted">{result.status}</span>}
            </div>
            <p className="mt-3 text-sm text-muted">{verdictDesc}</p>
            <div className="mt-4 flex items-center gap-2">
              <Button size="sm" variant="secondary" leftIcon={<Bookmark size={14} />}>Save</Button>
              <Button size="sm" variant="ghost" leftIcon={<Share2 size={14} />}>Share</Button>
            </div>
          </div>
          <div className="flex justify-center md:justify-end">
            <ConfidenceRing value={result.confidence} verdict={result.verdict} size={140} />
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
          {result.summary && (
            <Card className="p-5">
              <SectionHeader title="Summary" description="What the AI concluded" />
              <p className="text-sm text-fg leading-relaxed">{result.summary}</p>
            </Card>
          )}

          {result.detailed && (
            <Card className="p-5">
              <SectionHeader title="Detailed analysis" />
              <p className="text-sm text-fg leading-relaxed whitespace-pre-wrap">{result.detailed}</p>
            </Card>
          )}

          {result.reasoning.length > 0 && (
            <Card className="p-5">
              <SectionHeader title="Reasoning steps" />
              <ol className="list-decimal pl-5 space-y-1 text-sm text-fg">
                {result.reasoning.map((r, i) => <li key={i}>{r}</li>)}
              </ol>
            </Card>
          )}

          {result.recommendations.length > 0 && (
            <Card className="p-5">
              <SectionHeader title="Recommendations" />
              <ul className="list-disc pl-5 space-y-1 text-sm text-fg">
                {result.recommendations.map((r, i) => <li key={i}>{r}</li>)}
              </ul>
            </Card>
          )}
        </div>

        <div className="space-y-4">
          <Card className="p-5">
            <SectionHeader
              title="Matched rules"
              description={result.matchedRules.length ? `${result.matchedRules.length} rule${result.matchedRules.length === 1 ? '' : 's'} cross-referenced` : 'No rules matched'}
            />
            {result.matchedRules.length === 0 ? (
              <p className="text-xs text-muted">The AI did not cite any specific rule for this claim.</p>
            ) : (
              <div className="space-y-3">
                {result.matchedRules.map((r) => <RuleCard key={r.id} rule={r} />)}
              </div>
            )}
          </Card>
        </div>
      </div>
    </PageContainer>
  );
}
