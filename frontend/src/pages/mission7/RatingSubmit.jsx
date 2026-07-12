import { useMemo, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Star, Send, RotateCcw, ShieldCheck } from 'lucide-react';
import PageContainer from '../../components/layout/PageContainer.jsx';
import PageHeader from '../../components/layout/PageHeader.jsx';
import Mission7SubNav from '../../components/mission7/Mission7SubNav.jsx';
import Card from '../../components/common/Card.jsx';
import Button from '../../components/common/Button.jsx';
import Select from '../../components/forms/Select.jsx';
import Textarea from '../../components/forms/Textarea.jsx';
import CategoryRatingCard from '../../components/mission7/CategoryRatingCard.jsx';
import AnonymousBadge from '../../components/mission7/AnonymousBadge.jsx';
import Avatar from '../../components/ui/Avatar.jsx';
import { useToast } from '../../components/feedback/Toast.jsx';
import { RATING_CATEGORIES, STUDENTS, getStudentById } from '../../mocks/data/mission7.js';

const MAX_COMMENT = 500;
const initialRatings = () => Object.fromEntries(RATING_CATEGORIES.map((c) => [c.key, 0]));

export default function RatingSubmit() {
  const [params] = useSearchParams();
  const nav = useNavigate();
  const { push } = useToast();
  const [studentId, setStudentId] = useState(params.get('student') || '');
  const [ratings, setRatings] = useState(initialRatings);
  const [comment, setComment] = useState('');
  const [strengths, setStrengths] = useState('');
  const [improvements, setImprovements] = useState('');
  const [touched, setTouched] = useState(false);

  const student = studentId ? getStudentById(studentId) : null;
  const missing = useMemo(() => {
    const errs = {};
    if (!studentId) errs.student = 'Select a student';
    if (RATING_CATEGORIES.some((c) => !ratings[c.key])) errs.ratings = 'Rate every category';
    if (comment.length > MAX_COMMENT) errs.comment = 'Too long';
    return errs;
  }, [studentId, ratings, comment]);

  const reset = () => {
    setStudentId('');
    setRatings(initialRatings());
    setComment(''); setStrengths(''); setImprovements(''); setTouched(false);
  };

  const submit = (e) => {
    e.preventDefault();
    setTouched(true);
    if (Object.keys(missing).length) {
      push({ tone: 'error', title: 'Please complete the form', message: Object.values(missing)[0] });
      return;
    }
    push({ tone: 'success', title: 'Rating submitted', message: 'Your anonymous rating has been recorded.' });
    setTimeout(() => nav('/mission-7/history'), 500);
  };

  return (
    <PageContainer>
      <PageHeader title="Submit a Peer Rating" subtitle="Fully anonymous — your identity is never linked to this rating." icon={<Star size={18} />} />
      <Mission7SubNav />

      <div className="rounded-lg border border-brand/30 bg-brand-soft/40 p-3 mb-6 flex items-center gap-3">
        <ShieldCheck size={16} className="text-brand shrink-0" />
        <p className="text-xs text-fg">
          <span className="font-medium">Anonymous submission.</span> Ratings are stored with zero link back to your account.
        </p>
        <AnonymousBadge className="ml-auto" />
      </div>

      <form onSubmit={submit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-5">
          <Card className="p-4">
            <h3 className="text-sm font-semibold text-fg mb-3">1. Student</h3>
            <Select
              label="Select student"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              error={touched && missing.student}
            >
              <option value="">— Choose a classmate —</option>
              {STUDENTS.map((s) => (
                <option key={s.id} value={s.id}>{s.name} ({s.roll})</option>
              ))}
            </Select>
            {student && (
              <div className="mt-3 flex items-center gap-3 rounded-md border border-border bg-elevated p-3">
                <Avatar name={student.name} size={36} />
                <div>
                  <p className="text-sm font-medium text-fg">{student.name}</p>
                  <p className="text-xs text-muted">{student.roll} · Sec {student.section}</p>
                </div>
              </div>
            )}
          </Card>

          <Card className="p-4">
            <h3 className="text-sm font-semibold text-fg mb-3">2. Rate each category</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {RATING_CATEGORIES.map((c) => (
                <CategoryRatingCard
                  key={c.key}
                  label={c.label}
                  value={ratings[c.key]}
                  onChange={(v) => setRatings((r) => ({ ...r, [c.key]: v }))}
                />
              ))}
            </div>
            {touched && missing.ratings && <p className="mt-2 text-xs text-danger">{missing.ratings}</p>}
          </Card>

          <Card className="p-4 space-y-4">
            <h3 className="text-sm font-semibold text-fg">3. Written feedback (optional)</h3>
            <div>
              <Textarea
                label="Anonymous comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share honest, constructive feedback..."
                error={comment.length > MAX_COMMENT ? 'Character limit exceeded' : ''}
              />
              <p className="mt-1 text-[11px] text-muted text-right">{comment.length}/{MAX_COMMENT}</p>
            </div>
            <Textarea
              label="Strengths"
              value={strengths}
              onChange={(e) => setStrengths(e.target.value)}
              placeholder="What are they great at?"
            />
            <Textarea
              label="Suggestions for improvement"
              value={improvements}
              onChange={(e) => setImprovements(e.target.value)}
              placeholder="Where could they grow?"
            />
          </Card>

          <div className="flex flex-wrap gap-2 justify-end">
            <Button type="button" variant="outline" leftIcon={<RotateCcw size={14} />} onClick={reset}>Reset</Button>
            <Button type="submit" leftIcon={<Send size={14} />}>Submit Rating</Button>
          </div>
        </div>

        <aside className="space-y-4">
          <Card className="p-4">
            <h4 className="text-xs font-semibold uppercase text-subtle mb-3">Live preview</h4>
            <div className="space-y-2">
              {RATING_CATEGORIES.map((c) => (
                <div key={c.key} className="flex items-center justify-between text-sm">
                  <span className="text-muted">{c.label}</span>
                  <span className="font-medium text-fg tabular-nums">{ratings[c.key] || '—'}</span>
                </div>
              ))}
              <div className="pt-2 mt-2 border-t border-border flex items-center justify-between text-sm">
                <span className="text-fg font-medium">Average</span>
                <span className="font-semibold text-brand tabular-nums">
                  {(() => {
                    const vals = Object.values(ratings).filter(Boolean);
                    return vals.length ? (vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(2) : '0.00';
                  })()}
                </span>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <h4 className="text-xs font-semibold uppercase text-subtle mb-2">Guidelines</h4>
            <ul className="text-xs text-muted space-y-1.5 list-disc pl-4">
              <li>Be honest, specific, and respectful.</li>
              <li>Avoid personal attacks — focus on behavior.</li>
              <li>Comments are moderated before publishing.</li>
            </ul>
          </Card>
        </aside>
      </form>
    </PageContainer>
  );
}
