import { useMemo, useState } from 'react';
import PageContainer from '../../components/layout/PageContainer.jsx';
import PageHeader from '../../components/layout/PageHeader.jsx';
import Card from '../../components/common/Card.jsx';
import Button from '../../components/common/Button.jsx';
import Badge from '../../components/ui/Badge.jsx';
import { GitCompare, Check, X, AlertTriangle, RotateCcw, FileText, ClipboardCheck } from 'lucide-react';

// Reference syllabus lives server-side. This is a mock stand-in for the UI
// until the /api/mission3/reference endpoint is wired.
const REFERENCE_SYLLABUS = `Grammar fundamentals
Tenses and voice
Essay writing
Comprehension passages
Letter writing
Poetry analysis
Short stories
Vocabulary building
Report writing
Translation practice`;

const tokenize = (text) =>
  text
    .split(/[\n,;•·\-–]+/g)
    .map((t) => t.replace(/^\s*\d+(\.\d+)*[.)]?\s*/, '').trim())
    .filter((t) => t.length > 2)
    .map((t) => ({ raw: t, key: t.toLowerCase().replace(/[^a-z0-9 ]+/g, '').replace(/\s+/g, ' ').trim() }));

export default function AIWorkspace() {
  const [given, setGiven] = useState('');
  const [result, setResult] = useState(null);

  const canCompare = given.trim().length > 0;

  const compare = () => {
    const ref = tokenize(REFERENCE_SYLLABUS);
    const giv = tokenize(given);
    const refKeys = new Set(ref.map((t) => t.key));
    const givKeys = new Set(giv.map((t) => t.key));

    const matched = ref.filter((t) => givKeys.has(t.key));
    const missing = ref.filter((t) => !givKeys.has(t.key));
    const extra = giv.filter((t) => !refKeys.has(t.key));
    const coverage = ref.length ? Math.round((matched.length / ref.length) * 100) : 0;
    const reviewed = [...matched, ...missing];

    setResult({ matched, missing, extra, coverage, refCount: ref.length, reviewed });
  };

  const reset = () => {
    setGiven('');
    setResult(null);
  };

  const verdict = useMemo(() => {
    if (!result) return null;
    if (result.coverage >= 85) return { tone: 'neutral', label: 'Makes sense — aligned' };
    if (result.coverage >= 50) return { tone: 'ochre', label: 'Partial — needs review' };
    return { tone: 'live', label: 'Does not make sense' };
  }, [result]);




  return (
    <PageContainer>
      <PageHeader
        eyebrow="File 03 · Syllabus comparator"
        title="Does the given syllabus make sense?"
        subtitle="Paste the syllabus Kuddus handed out. It's compared against the official reference held on the server."
      />


      <Card className="p-0 overflow-hidden">
        <div className="px-4 py-3 border-b border-ink/10 flex items-baseline justify-between gap-3">
          <p className="font-display text-sm text-ink flex items-center gap-2">
            <FileText size={14} className="text-ochre" />
            New syllabus input
          </p>
          <p className="eyebrow">What Kuddus handed to students</p>
        </div>


        <textarea
          value={given}
          onChange={(e) => setGiven(e.target.value)}
          placeholder={'Paste the handed-out syllabus…\n\ne.g.\n1. Grammar\n2. Essay writing\n3. Barcode & publisher notes'}
          rows={12}
          className="w-full px-4 py-3 bg-transparent text-sm text-ink placeholder:text-ink/30 focus:outline-none resize-y font-mono leading-relaxed"
        />
        <div className="px-4 py-2 border-t border-ink/10 bg-paper/60">
          <p className="font-mono text-[10px] tracking-widest uppercase text-ink/50">
            {given.trim() ? `${tokenize(given).length} topics detected` : 'One topic per line'}
          </p>
        </div>
      </Card>

      <div className="mt-4 flex items-center gap-2">
        <Button leftIcon={<GitCompare size={14} />} disabled={!canCompare} onClick={compare}>
          Analyse syllabus
        </Button>
        {(result || given) && (
          <Button variant="ghost" size="sm" leftIcon={<RotateCcw size={13} />} onClick={reset}>
            Reset
          </Button>
        )}
      </div>

      {result && (
        <>
          <Card eyebrow="AI output · comparison report" ref="CMP //" tone="ochre" className="mt-6 overflow-hidden">
            <div className="px-5 pt-5 pb-4 grid grid-cols-1 sm:grid-cols-[minmax(0,1fr)_auto] gap-4 items-end border-b border-ink/10">
              <div className="min-w-0">
                <p className="eyebrow">How much of it makes sense</p>
                <p className="mt-2 font-display text-4xl sm:text-5xl leading-none text-ink tabular-nums">
                  {result.coverage}<span className="text-ink/40 text-2xl">%</span>
                </p>
                <p className="mt-2 text-sm text-muted">
                  {result.matched.length} of {result.refCount} reference topics found ·
                  {' '}{result.missing.length} missing ·
                  {' '}{result.extra.length} off-syllabus
                </p>
              </div>
              {verdict && <Badge tone={verdict.tone}>{verdict.label}</Badge>}
            </div>

            <div className="px-5 py-3 border-b border-ink/10">
              <div className="h-2 w-full bg-ink/10 overflow-hidden">
                <div className="h-full bg-ochre" style={{ width: `${result.coverage}%` }} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-ink/10">
              <TopicColumn icon={<Check size={13} />} tone="text-ink" label="Matched" count={result.matched.length} items={result.matched} />
              <TopicColumn icon={<AlertTriangle size={13} />} tone="text-danger" label="Missing from given" count={result.missing.length} items={result.missing} emptyText="Nothing missing — full coverage." />
              <TopicColumn icon={<X size={13} />} tone="text-ink/60" label="Off-syllabus additions" count={result.extra.length} items={result.extra} emptyText="No extra topics." />
            </div>
          </Card>

          {result.coverage < 100 && (
            <Card eyebrow="Reviewed syllabus · what to actually study" ref="REV //" tone="live" className="mt-4 overflow-hidden">
              <div className="px-5 py-3 border-b border-ink/10 flex items-center justify-between gap-3">
                <p className="text-sm text-muted flex items-center gap-2">
                  <ClipboardCheck size={14} className="text-danger" />
                  Off-syllabus junk dropped · missing chapters restored from reference
                </p>
                <span className="font-mono text-[11px] tabular-nums text-ink/60">
                  {result.reviewed.length} topics
                </span>
              </div>
              <ol className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 list-decimal list-inside marker:font-mono marker:text-ink/40">
                {result.reviewed.map((t, i) => {
                  const isRestored = !result.matched.some((m) => m.key === t.key);
                  return (
                    <li key={i} className="text-sm text-ink/90">
                      <span className="align-middle">{t.raw}</span>
                      {isRestored && (
                        <span className="ml-2 align-middle font-mono text-[10px] tracking-widest uppercase text-danger">restored</span>
                      )}
                    </li>
                  );
                })}
              </ol>
            </Card>
          )}
        </>
      )}
    </PageContainer>
  );
}

function TopicColumn({ icon, tone, label, count, items, emptyText }) {
  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-3">
        <p className="eyebrow flex items-center gap-1.5">
          <span className={tone}>{icon}</span>
          {label}
        </p>
        <span className="font-mono text-[11px] tabular-nums text-ink/60">{count}</span>
      </div>
      {items.length === 0 ? (
        <p className="text-xs text-muted">{emptyText}</p>
      ) : (
        <ul className="space-y-1.5">
          {items.map((t, i) => (
            <li key={i} className="text-sm text-ink/85 truncate">
              {t.raw}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
