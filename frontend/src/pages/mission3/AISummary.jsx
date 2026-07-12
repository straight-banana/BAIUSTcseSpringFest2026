import { useState } from 'react';
import { Link } from 'react-router-dom';
import PageContainer from '../../components/layout/PageContainer.jsx';
import PageHeader from '../../components/layout/PageHeader.jsx';
import Mission3SubNav from '../../components/mission3/Mission3SubNav.jsx';
import Card from '../../components/common/Card.jsx';
import Button from '../../components/common/Button.jsx';
import Badge from '../../components/ui/Badge.jsx';
import SectionHeader from '../../components/ui/SectionHeader.jsx';
import DifficultyBadge from '../../components/mission3/DifficultyBadge.jsx';
import PriorityBadge from '../../components/mission3/PriorityBadge.jsx';
import AIResponseCard from '../../components/mission3/AIResponseCard.jsx';
import { ProgressBar } from '../../components/ui/Progress.jsx';
import { BookOpen, Copy, Download, RefreshCw, ChevronDown, Check, X, Target, ArrowRight } from 'lucide-react';
import { MOCK_SUMMARY } from '../../mocks/data/mission3.js';
import { cx } from '../../utils/index.js';
import { getLastRun } from '../../services/aiResultStore.js';

// Best-effort mapper. Real API field names may vary; fall back to mock so
// existing UI keeps working while wiring stabilizes.
function normalizeSummary(raw) {
  if (!raw || typeof raw !== 'object') return MOCK_SUMMARY;
  const pick = (...keys) => {
    for (const k of keys) if (raw[k] != null) return raw[k];
    return undefined;
  };
  const important = pick('important_topics', 'importantTopics', 'important', 'topics') ?? [];
  const removed = pick('removed_topics', 'removedTopics', 'removed', 'non_examinable') ?? [];
  const exam = pick('exam_topics', 'examTopics', 'suggested_exam_topics') ?? [];
  return {
    courseTitle: pick('course_title', 'courseTitle', 'title') || MOCK_SUMMARY.courseTitle,
    overview: pick('overview', 'summary', 'description') || '',
    importantTopics: important.map((t) => (typeof t === 'string' ? t : t?.name || t?.title || '')).filter(Boolean),
    removedTopics: removed.map((t) => (typeof t === 'string' ? t : t?.name || t?.title || '')).filter(Boolean),
    examTopics: exam.map((e) =>
      typeof e === 'string'
        ? { name: e, probability: 70 }
        : { name: e?.name || e?.title || 'Topic', probability: Number(e?.probability ?? e?.score ?? 70) }
    ),
    difficulty: pick('difficulty') || 'medium',
    priority: pick('priority') || 'normal',
    estimatedHours: Number(pick('estimated_hours', 'estimatedHours', 'hours') || 0) || MOCK_SUMMARY.estimatedHours,
  };
}

function Section({ title, defaultOpen = true, children, count }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <Card className="p-5">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between text-left"
      >
        <div>
          <h3 className="text-sm font-semibold text-fg">{title}</h3>
          {count !== undefined && <p className="text-xs text-muted mt-0.5">{count} items</p>}
        </div>
        <ChevronDown size={16} className={cx('text-muted transition-transform', open && 'rotate-180')} />
      </button>
      {open && <div className="mt-4">{children}</div>}
    </Card>
  );
}

export default function AISummary() {
  const lastRun = getLastRun();
  const isLive = lastRun?.kind === 'summary';
  const s = isLive ? normalizeSummary(lastRun.result) : MOCK_SUMMARY;

  return (
    <PageContainer>
      <PageHeader
        title="AI Summary"
        subtitle={s.courseTitle}
        icon={<BookOpen size={18} />}
        actions={
          <div className="flex gap-2">
            <Button variant="secondary" size="sm" leftIcon={<Copy size={14} />}>Copy</Button>
            <Button variant="secondary" size="sm" leftIcon={<Download size={14} />}>Download</Button>
            <Link to="/mission-3/input"><Button variant="secondary" size="sm" leftIcon={<RefreshCw size={14} />}>New</Button></Link>
          </div>
        }
      />
      <Mission3SubNav />

      {!isLive && (
        <div className="mb-4 rounded-md border border-border bg-elevated/60 p-3 text-xs text-muted">
          Showing example summary. Paste a syllabus in <Link to="/mission-3/input" className="text-brand hover:underline">New</Link> to run the live AI service.
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
          <AIResponseCard title="Course overview" subtitle={isLive ? 'From your syllabus' : 'Example response'}>
            <p>{s.overview}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <DifficultyBadge value={s.difficulty} />
              <PriorityBadge value={s.priority} />
              <Badge tone="neutral">{s.estimatedHours}h estimated</Badge>
              <Badge tone="brand">{s.importantTopics.length} core topics</Badge>
            </div>
          </AIResponseCard>

          {s.importantTopics.length > 0 && (
            <Section title="Important topics" count={s.importantTopics.length}>
              <div className="flex flex-wrap gap-2">
                {s.importantTopics.map((t) => (
                  <span key={t} className="inline-flex items-center gap-1.5 rounded-full bg-brand-soft text-brand px-3 py-1 text-xs font-medium">
                    <Check size={12} /> {t}
                  </span>
                ))}
              </div>
            </Section>
          )}

          {s.removedTopics.length > 0 && (
            <Section title="Removed topics (non-examinable)" count={s.removedTopics.length} defaultOpen={false}>
              <ul className="space-y-2">
                {s.removedTopics.map((t) => (
                  <li key={t} className="flex items-center gap-2 text-sm text-muted line-through">
                    <X size={14} className="text-danger" /> {t}
                  </li>
                ))}
              </ul>
            </Section>
          )}

          {s.examTopics.length > 0 && (
            <Section title="Suggested exam topics" count={s.examTopics.length}>
              <ul className="space-y-3">
                {s.examTopics.map((e) => (
                  <li key={e.name}>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-fg font-medium">{e.name}</span>
                      <span className="text-xs font-mono text-muted">{e.probability}%</span>
                    </div>
                    <ProgressBar value={e.probability} tone={e.probability > 80 ? 'danger' : e.probability > 65 ? 'warning' : 'brand'} />
                  </li>
                ))}
              </ul>
            </Section>
          )}
        </div>

        <div className="space-y-4">
          <Card className="p-5">
            <SectionHeader title="Estimated difficulty" />
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-xl bg-danger/10 text-danger flex items-center justify-center">
                <Target size={20} />
              </div>
              <div>
                <p className="text-lg font-semibold text-fg capitalize">{s.difficulty}</p>
                <p className="text-xs text-muted">Based on topic depth & prerequisites</p>
              </div>
            </div>
          </Card>

          <Card className="p-5">
            <SectionHeader title="Study priority" />
            <PriorityBadge value={s.priority} />
          </Card>

          <Card className="p-5">
            <SectionHeader title="Next step" description="Turn this summary into a schedule." />
            <Link to="/mission-3/plan">
              <Button className="w-full" rightIcon={<ArrowRight size={14} />}>Open study plan</Button>
            </Link>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
}
