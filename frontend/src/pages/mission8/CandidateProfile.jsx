import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Award, TrendingUp, ThumbsUp, Sparkles, Calendar } from 'lucide-react';
import PageContainer from '../../components/layout/PageContainer.jsx';
import PageHeader from '../../components/layout/PageHeader.jsx';
import Mission8SubNav from '../../components/mission8/Mission8SubNav.jsx';
import Card from '../../components/common/Card.jsx';
import Button from '../../components/common/Button.jsx';
import Badge from '../../components/ui/Badge.jsx';
import Avatar from '../../components/ui/Avatar.jsx';
import SectionHeader from '../../components/ui/SectionHeader.jsx';
import CircularScore from '../../components/mission8/CircularScore.jsx';
import ScoreBar from '../../components/mission8/ScoreBar.jsx';
import RecommendationBadge from '../../components/mission8/RecommendationBadge.jsx';
import LoadingState from '../../components/feedback/Loading.jsx';
import ErrorState from '../../components/feedback/ErrorState.jsx';
import { useToast } from '../../components/feedback/Toast.jsx';
import { getCurrentRound, getRankedCandidates, weightsToList } from '../../services/candidatesService.js';
import { getLeaderboard } from '../../services/ratingsService.js';

export default function CandidateProfile() {
  const { id } = useParams();
  const [c, setC] = useState(null);
  const [weights, setWeights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { push } = useToast();

  useEffect(() => {
    let active = true;
    Promise.all([getCurrentRound(), getLeaderboard()])
      .then(([round, board]) => {
        if (!active || !round) return null;
        setWeights(weightsToList(round.weights));
        return getRankedCandidates(round.id).then((ranked) => {
          const found = ranked.find((p) => p.id === id);
          if (!found) return null;
          const boardEntry = board.find((b) => b.id === found.userId);
          return { ...found, peerRating: boardEntry?.overall ?? 0, peerRatingCount: boardEntry?.ratingCount ?? 0 };
        });
      })
      .then((profile) => { if (active) setC(profile); })
      .catch((err) => { if (active) setError(err?.message || 'Unable to load candidate profile'); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [id]);

  const recommend = () => push({ tone: 'success', title: 'Recommendation logged', message: `${c.name} added to your shortlist.` });

  if (loading) {
    return (
      <PageContainer>
        <PageHeader title="Candidate Profile" subtitle="Detailed leadership overview." icon={<Award size={18} />} />
        <Mission8SubNav />
        <LoadingState label="Loading profile..." />
      </PageContainer>
    );
  }

  if (error || !c) {
    return (
      <PageContainer>
        <PageHeader title="Candidate Profile" subtitle="Detailed leadership overview." icon={<Award size={18} />} />
        <Mission8SubNav />
        <ErrorState title="Couldn't load profile" message={error || 'Candidate not found'} />
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <PageHeader title="Candidate Profile" subtitle="Detailed leadership overview." icon={<Award size={18} />} />
      <Mission8SubNav />

      <Card className="p-5 mb-6">
        <div className="flex flex-wrap items-center gap-4">
          <Avatar name={c.name} size={64} />
          <div className="min-w-0 flex-1">
            <h2 className="text-lg font-semibold text-fg">{c.name}</h2>
            <p className="text-xs text-muted">{c.roll} · Sec {c.section}</p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {c.badge && <Badge tone="brand">{c.badge}</Badge>}
              {c.isPinned && <RecommendationBadge status="recommended" label="Pinned" />}
              {(c.achievements || []).map((a) => <Badge key={a} tone="neutral">{a}</Badge>)}
            </div>
          </div>
          <div className="flex gap-2">
            <Link to={`/mission-8/candidates/${c.id}/breakdown`}>
              <Button variant="secondary" size="sm">Breakdown</Button>
            </Link>
            <Button size="sm" leftIcon={<Sparkles size={13} />} onClick={recommend}>Recommend</Button>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-5">
            <SectionHeader title="Leadership summary" description="Weighted composite of all inputs" />
            <div className="flex flex-wrap items-center gap-6">
              <CircularScore value={c.scores.overall} size={128} stroke={10} label="Overall" />
              <div className="flex-1 min-w-[220px] space-y-3">
                {weights.slice(0, 4).map((w) => (
                  <ScoreBar key={w.key} label={w.label} value={c.scores?.[w.key] ?? 0} />
                ))}
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <SectionHeader title="Recommendation breakdown" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {weights.map((w) => (
                <ScoreBar key={w.key} label={`${w.label} (${Math.round(w.weight * 100)}%)`} value={c.scores?.[w.key] ?? 0} />
              ))}
            </div>
          </Card>

          <Card className="p-4">
            <SectionHeader title="Leadership timeline" />
            {(c.timeline || []).length === 0 ? (
              <p className="text-xs text-muted">No timeline events recorded yet.</p>
            ) : (
              <ol className="relative border-l border-border ml-2 space-y-4 pl-4">
                {c.timeline.map((t, i) => (
                  <li key={i} className="relative">
                    <span className="absolute -left-[21px] top-1 h-3 w-3 rounded-full bg-brand border-2 border-bg" />
                    <p className="text-xs text-muted inline-flex items-center gap-1"><Calendar size={11} /> {new Date(t.date).toLocaleDateString()}</p>
                    <p className="text-sm text-fg">{t.event}</p>
                  </li>
                ))}
              </ol>
            )}
          </Card>
        </div>

        <aside className="space-y-4">
          <Card className="p-4">
            <h4 className="text-xs font-semibold uppercase text-subtle mb-3">Peer rating</h4>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-semibold text-fg tabular-nums">{c.peerRating.toFixed(2)}</span>
              <span className="text-xs text-muted">/ 5.00</span>
            </div>
            <p className="text-[11px] text-muted mt-1">{c.peerRatingCount} peers rated</p>
          </Card>

          <Card className="p-4">
            <h4 className="text-xs font-semibold uppercase text-subtle mb-3">Profile status</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-muted">Manual override</span><span className="text-fg font-medium">{c.manualOverride ? 'Yes' : 'No'}</span></div>
              {c.manualOverride && c.overrideReason && <p className="text-xs text-muted">{c.overrideReason}</p>}
              <div className="flex justify-between"><span className="text-muted">Pinned</span><span className="text-fg font-medium">{c.isPinned ? 'Yes' : 'No'}</span></div>
            </div>
          </Card>

          <Card className="p-4">
            <h4 className="text-xs font-semibold uppercase text-subtle mb-2">Strengths</h4>
            {(c.strengths || []).length === 0 ? (
              <p className="text-xs text-muted">No strengths recorded yet.</p>
            ) : (
              <ul className="text-sm text-fg space-y-1.5">
                {c.strengths.map((s) => (
                  <li key={s} className="flex gap-2"><ThumbsUp size={14} className="text-success shrink-0 mt-0.5" /> {s}</li>
                ))}
              </ul>
            )}
          </Card>

          <Card className="p-4">
            <h4 className="text-xs font-semibold uppercase text-subtle mb-2">Areas for improvement</h4>
            {(c.improvements || []).length === 0 ? (
              <p className="text-xs text-muted">No improvement notes yet.</p>
            ) : (
              <ul className="text-sm text-muted space-y-1.5">
                {c.improvements.map((s) => (
                  <li key={s} className="flex gap-2"><TrendingUp size={14} className="text-warning shrink-0 mt-0.5" /> {s}</li>
                ))}
              </ul>
            )}
          </Card>
        </aside>
      </div>
    </PageContainer>
  );
}
