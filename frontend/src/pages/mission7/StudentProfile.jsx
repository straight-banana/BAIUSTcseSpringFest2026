import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MessageSquare, TrendingUp, Star } from 'lucide-react';
import PageContainer from '../../components/layout/PageContainer.jsx';
import PageHeader from '../../components/layout/PageHeader.jsx';
import Mission7SubNav from '../../components/mission7/Mission7SubNav.jsx';
import Card from '../../components/common/Card.jsx';
import Button from '../../components/common/Button.jsx';
import Avatar from '../../components/ui/Avatar.jsx';
import SectionHeader from '../../components/ui/SectionHeader.jsx';
import StarRating from '../../components/mission7/StarRating.jsx';
import CommentCard from '../../components/mission7/CommentCard.jsx';
import LoadingState from '../../components/feedback/Loading.jsx';
import ErrorState from '../../components/feedback/ErrorState.jsx';
import EmptyState from '../../components/feedback/EmptyState.jsx';
import { RATING_CATEGORIES, getStudentProfile, getPublicComments } from '../../services/ratingsService.js';

export default function StudentProfile() {
  const { id } = useParams();
  const [student, setStudent] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    setLoading(true);
    Promise.all([getStudentProfile(id), getPublicComments(id)])
      .then(([profile, publicComments]) => {
        if (!active) return;
        setStudent(profile);
        setComments((publicComments || []).slice(0, 4).map((c) => ({
          id: c.id,
          body: c.comment || '(no written comment)',
          categoryLabel: 'Peer rating',
          status: 'approved',
          createdAt: c.createdAt,
          helpful: 0,
        })));
      })
      .catch((err) => {
        if (!active) return;
        setError(err?.message || 'Unable to load student profile');
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, [id]);

  if (loading) {
    return (
      <PageContainer>
        <PageHeader title="Student Profile" subtitle="Rating overview and anonymous feedback." icon={<Star size={18} />} />
        <Mission7SubNav />
        <LoadingState label="Loading profile..." />
      </PageContainer>
    );
  }

  if (error || !student) {
    return (
      <PageContainer>
        <PageHeader title="Student Profile" subtitle="Rating overview and anonymous feedback." icon={<Star size={18} />} />
        <Mission7SubNav />
        <ErrorState title="Couldn't load profile" message={error || 'Student not found'} />
      </PageContainer>
    );
  }

  const ratings = student.aggregateRatings || {};
  const overall = ratings.overall ?? 0;
  const topCategory = RATING_CATEGORIES.slice().sort((a, b) => (ratings[b.key] ?? 0) - (ratings[a.key] ?? 0))[0];

  return (
    <PageContainer>
      <PageHeader title="Student Profile" subtitle="Rating overview and anonymous feedback." icon={<Star size={18} />} />
      <Mission7SubNav />

      <Card className="p-5 mb-6">
        <div className="flex flex-wrap items-center gap-4">
          <Avatar name={student.name} size={64} />
          <div className="min-w-0 flex-1">
            <h2 className="text-lg font-semibold text-fg">{student.name}</h2>
            <p className="text-xs text-muted">{student.roll} · Sec {student.section || '—'}{student.isCaptain ? ' · Captain' : ''}</p>
          </div>
          <div className="flex gap-2">
            <Link to={`/mission-7/rate?student=${student.id}`}>
              <Button size="sm" leftIcon={<Star size={13} />}>Rate</Button>
            </Link>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <Card className="p-4">
          <p className="text-[11px] uppercase text-subtle">Overall</p>
          <div className="mt-1 flex items-center gap-2">
            <span className="text-2xl font-semibold text-fg tabular-nums">{overall.toFixed(2)}</span>
            <StarRating value={Math.round(overall)} readOnly size={14} />
          </div>
          <p className="mt-1 text-[11px] text-muted">Based on {student.ratingCount} ratings</p>
        </Card>
        <Card className="p-4">
          <p className="text-[11px] uppercase text-subtle">Leadership</p>
          <p className="mt-1 text-2xl font-semibold text-fg tabular-nums">{ratings.leadership ?? '—'}</p>
        </Card>
        <Card className="p-4">
          <p className="text-[11px] uppercase text-subtle">Teamwork</p>
          <p className="mt-1 text-2xl font-semibold text-fg tabular-nums">{ratings.teamwork ?? '—'}</p>
        </Card>
        <Card className="p-4">
          <p className="text-[11px] uppercase text-subtle">Communication</p>
          <p className="mt-1 text-2xl font-semibold text-fg tabular-nums">{ratings.communication ?? '—'}</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div>
            <SectionHeader title="Category breakdown" />
            <Card className="p-4 space-y-3">
              {student.ratingCount === 0 ? (
                <p className="text-xs text-muted">No ratings yet — nothing to break down.</p>
              ) : RATING_CATEGORIES.map((c) => {
                const v = ratings[c.key] ?? 0;
                return (
                  <div key={c.key}>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-fg">{c.label}</span>
                      <span className="tabular-nums text-muted">{v.toFixed(1)}</span>
                    </div>
                    <div className="h-2 rounded-full bg-elevated overflow-hidden">
                      <div className="h-full bg-brand" style={{ width: `${(v / 5) * 100}%` }} />
                    </div>
                  </div>
                );
              })}
            </Card>
          </div>

          <div>
            <SectionHeader
              title="Recent anonymous feedback"
              action={<Link to="/mission-7/comments" className="text-xs text-brand hover:underline inline-flex items-center gap-1"><MessageSquare size={12} /> View all</Link>}
            />
            {comments.length === 0 ? (
              <EmptyState title="No feedback yet" message="Approved comments from peer ratings will appear here." />
            ) : (
              <div className="space-y-3">
                {comments.map((c) => <CommentCard key={c.id} comment={c} />)}
              </div>
            )}
          </div>
        </div>

        <aside className="space-y-4">
          <Card className="p-4">
            <h4 className="text-xs font-semibold uppercase text-subtle mb-3">Strengths summary</h4>
            <ul className="text-sm text-fg space-y-1.5">
              {student.ratingCount > 0 && topCategory ? (
                <li className="flex gap-2"><TrendingUp size={14} className="text-success shrink-0 mt-0.5" /> Strongest in {topCategory.label}</li>
              ) : (
                <li className="text-muted">Not enough ratings yet to summarize strengths.</li>
              )}
            </ul>
          </Card>
          <Card className="p-4">
            <h4 className="text-xs font-semibold uppercase text-subtle mb-3">Statistics</h4>
            <div className="grid grid-cols-2 gap-3 text-center">
              <div><p className="text-lg font-semibold text-fg">{student.ratingCount}</p><p className="text-[11px] text-muted">Ratings</p></div>
              <div><p className="text-lg font-semibold text-fg">{comments.length}</p><p className="text-[11px] text-muted">Comments</p></div>
            </div>
          </Card>
        </aside>
      </div>
    </PageContainer>
  );
}
