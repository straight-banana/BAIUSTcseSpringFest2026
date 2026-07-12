import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageContainer from '../../components/layout/PageContainer.jsx';
import PageHeader from '../../components/layout/PageHeader.jsx';
import Mission3SubNav from '../../components/mission3/Mission3SubNav.jsx';
import Card from '../../components/common/Card.jsx';
import Button from '../../components/common/Button.jsx';
import Badge from '../../components/ui/Badge.jsx';
import SectionHeader from '../../components/ui/SectionHeader.jsx';
import { BookOpen, Sparkles, Timer, Lightbulb, Type, Hash, AlertTriangle } from 'lucide-react';
import { EXAMPLE_SYLLABUS } from '../../mocks/data/mission3.js';
import { summarizeSyllabus } from '../../services/syllabusService.js';
import { setLastRun } from '../../services/aiResultStore.js';
import { AkpApiError } from '../../services/aiApi.js';
import { useToast } from '../../components/feedback/Toast.jsx';

const MIN_CHARS = 20;
const readingTime = (words) => Math.max(1, Math.round(words / 220));

export default function SyllabusInput() {
  const toast = useToast();
  const [text, setText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null); // { message, fieldErrors }
  const navigate = useNavigate();
  const abortRef = useRef(null);
  const mountedRef = useRef(true);

  // Cancel any in-flight request on unmount so we don't setState after teardown.
  useEffect(() => {
    return () => {
      mountedRef.current = false;
      abortRef.current?.abort();
    };
  }, []);

  const { chars, words, minutes } = useMemo(() => {
    const w = text.trim() ? text.trim().split(/\s+/).length : 0;
    return { chars: text.length, words: w, minutes: readingTime(w) };
  }, [text]);

  const canSubmit = chars >= MIN_CHARS && !submitting;
  const fieldError = error?.fieldErrors?.syllabus_text || error?.fieldErrors?.input;

  const handleSubmit = async () => {
    setError(null);
    setSubmitting(true);
    abortRef.current?.abort();
    const ac = new AbortController();
    abortRef.current = ac;
    try {
      const result = await summarizeSyllabus(text, { signal: ac.signal });
      if (!mountedRef.current || ac.signal.aborted) return;
      setLastRun({ kind: 'summary', syllabusText: text, result, createdAt: Date.now() });
      toast.push({ tone: 'success', title: 'Summary ready', message: 'AI finished analyzing the syllabus.' });
      navigate('/mission-3/summary');
    } catch (e) {
      if (e?.name === 'AbortError' || ac.signal.aborted) return;
      if (!mountedRef.current) return;
      if (e instanceof AkpApiError) {
        setError({ message: e.message, fieldErrors: e.fieldErrors || {} });
        if (e.code !== 'validation') {
          toast.push({ tone: 'error', title: 'Analysis failed', message: e.toUserMessage() });
        }
      } else {
        const msg = e?.message || 'Something went wrong.';
        setError({ message: msg, fieldErrors: {} });
        toast.push({ tone: 'error', title: 'Analysis failed', message: msg });
      }
    } finally {
      if (mountedRef.current) setSubmitting(false);
    }
  };

  return (
    <PageContainer>
      <PageHeader
        title="New Syllabus Analysis"
        subtitle="Paste the full syllabus. The AI will identify exam-worthy topics and remove noise."
        icon={<BookOpen size={18} />}
      />
      <Mission3SubNav />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
          <Card className="p-5">
            <SectionHeader
              title="Syllabus editor"
              description={`Text only — minimum ${MIN_CHARS} characters.`}
              action={
                <button
                  type="button"
                  onClick={() => setText(EXAMPLE_SYLLABUS)}
                  className="text-xs text-brand hover:underline"
                >
                  Load example
                </button>
              }
            />
            <label htmlFor="syllabus" className="sr-only">Syllabus text</label>
            <textarea
              id="syllabus"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Paste the complete syllabus here..."
              rows={16}
              className="w-full resize-y rounded-lg border border-border bg-bg px-4 py-3 text-sm text-fg placeholder:text-subtle font-mono leading-relaxed focus:outline-none focus:ring-2 focus:ring-brand/40"
              aria-invalid={fieldError ? 'true' : 'false'}
              aria-describedby={fieldError ? 'syllabus-error' : undefined}
            />
            <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-muted">
              <span className="inline-flex items-center gap-1"><Hash size={12} /> {chars.toLocaleString()} chars</span>
              <span className="inline-flex items-center gap-1"><Type size={12} /> {words.toLocaleString()} words</span>
              <span className="inline-flex items-center gap-1"><Timer size={12} /> ~{minutes} min read</span>
            </div>

            {fieldError && (
              <p id="syllabus-error" className="mt-2 text-xs text-danger flex items-center gap-1.5">
                <AlertTriangle size={12} /> {fieldError}
              </p>
            )}

            <div className="mt-5">
              <Button
                size="lg"
                className="w-full sm:w-auto"
                leftIcon={<Sparkles size={16} />}
                disabled={!canSubmit}
                onClick={handleSubmit}
              >
                {submitting ? 'Analyzing…' : 'Generate Summary'}
              </Button>
            </div>
            {chars < MIN_CHARS && (
              <p className="mt-2 text-xs text-subtle">Paste at least {MIN_CHARS} characters to enable analysis.</p>
            )}

            {error && !fieldError && (
              <div className="mt-4 rounded-md border border-danger/30 bg-danger/5 p-3 text-xs text-danger flex items-start gap-2">
                <AlertTriangle size={14} className="shrink-0 mt-0.5" />
                <span>{error.message}</span>
              </div>
            )}
          </Card>
        </div>

        <div className="space-y-4">
          <Card className="p-5">
            <SectionHeader title="Example syllabus" description="Preview the shape the AI expects." />
            <div className="rounded-lg border border-border bg-bg p-3 max-h-56 overflow-y-auto">
              <pre className="text-xs font-mono text-muted whitespace-pre-wrap leading-relaxed">
                {EXAMPLE_SYLLABUS}
              </pre>
            </div>
            <Button
              size="sm"
              variant="secondary"
              className="w-full mt-3"
              onClick={() => setText(EXAMPLE_SYLLABUS)}
            >
              Use this example
            </Button>
          </Card>

          <Card className="p-5">
            <SectionHeader title="Tips for better results" description="Give the model clean context." />
            <ul className="space-y-3 text-sm text-fg">
              {[
                'Include week numbers or unit labels — this helps the plan.',
                'Keep chapter numbers next to topics if you have them.',
                'Non-examinable sections (indexes, biographies) will be filtered out automatically.',
                'Longer syllabi produce more accurate difficulty ratings.',
              ].map((t, i) => (
                <li key={i} className="flex gap-2">
                  <Lightbulb size={16} className="text-warning shrink-0 mt-0.5" />
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </Card>

          <div>
            <Badge tone="brand">AI</Badge>
            <p className="mt-2 text-xs text-muted">
              Live AI service. Your syllabus text is sent to the AKP AI endpoint for analysis.
            </p>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
