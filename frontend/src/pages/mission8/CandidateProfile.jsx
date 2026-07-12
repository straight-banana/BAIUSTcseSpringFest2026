import { Link, useParams } from 'react-router-dom';
import { Award, Share2, Download, TrendingUp, ThumbsUp, Sparkles, Calendar } from 'lucide-react';
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
import { useToast } from '../../components/feedback/Toast.jsx';
import { getCandidateById, SCORE_WEIGHTS } from '../../mocks/data/mission8.js';

export default function CandidateProfile() {
  const { id } = useParams();
  const c = getCandidateById(id);
  const { push } = useToast();
  const recommend = () => push({ tone: 'success', title: 'Recommendation logged', message: `${c.name} added to your shortlist.` });

  return (
    <PageContainer>
      <PageHeader title="Candidate Profile" subtitle="Detailed leadership overview." icon={<Award size={18} />} />
      <Mission8SubNav />

      <Card className="p-5 mb-6">
        <div className="flex flex-wrap items-center gap-4">
          <Avatar name={c.name} size={64} />
          <div className="min-w-0 flex-1">
            <h2 className="text-lg font-semibold text-fg">{c.name}</h2>
            <p className="text-xs text-muted">{c.roll} · {c.department} · Sec {c.section} · Year {c.year}</p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              <RecommendationBadge status={c.status} />
              <Badge tone="brand">{c.badge}</Badge>
              {c.achievements.map((a) => <Badge key={a} tone="neutral">{a}</Badge>)}
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" leftIcon={<Share2 size={13} />}>Share</Button>
            <Button variant="outline" size="sm" leftIcon={<Download size={13} />}>Export</Button>
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
                {SCORE_WEIGHTS.slice(0, 4).map((w) => (
                  <ScoreBar key={w.key} label={w.label} value={c.scores[w.key]} />
                ))}
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <SectionHeader title="Recommendation breakdown" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {SCORE_WEIGHTS.map((w) => (
                <ScoreBar key={w.key} label={`${w.label} (${Math.round(w.weight * 100)}%)`} value={c.scores[w.key]} />
              ))}
            </div>
          </Card>

          <Card className="p-4">
            <SectionHeader title="Leadership timeline" />
            <ol className="relative border-l border-border ml-2 space-y-4 pl-4">
              {c.timeline.map((t, i) => (
                <li key={i} className="relative">
                  <span className="absolute -left-[21px] top-1 h-3 w-3 rounded-full bg-brand border-2 border-bg" />
                  <p className="text-xs text-muted inline-flex items-center gap-1"><Calendar size={11} /> {new Date(t.date).toLocaleDateString()}</p>
                  <p className="text-sm text-fg">{t.event}</p>
                </li>
              ))}
            </ol>
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
            <h4 className="text-xs font-semibold uppercase text-subtle mb-3">Academic overview</h4>
            <div className="grid grid-cols-2 gap-3 text-center">
              <div><p className="text-lg font-semibold text-fg">{c.cgpa}</p><p className="text-[11px] text-muted">CGPA</p></div>
              <div><p className="text-lg font-semibold text-fg">{c.attendancePct}%</p><p className="text-[11px] text-muted">Attendance</p></div>
              <div><p className="text-lg font-semibold text-fg">{c.participationEvents}</p><p className="text-[11px] text-muted">Events</p></div>
              <div><p className="text-lg font-semibold text-fg">{c.achievements.length}</p><p className="text-[11px] text-muted">Badges</p></div>
            </div>
          </Card>

          <Card className="p-4">
            <h4 className="text-xs font-semibold uppercase text-subtle mb-2">Strengths</h4>
            <ul className="text-sm text-fg space-y-1.5">
              {c.strengths.map((s) => (
                <li key={s} className="flex gap-2"><ThumbsUp size={14} className="text-success shrink-0 mt-0.5" /> {s}</li>
              ))}
            </ul>
          </Card>

          <Card className="p-4">
            <h4 className="text-xs font-semibold uppercase text-subtle mb-2">Areas for improvement</h4>
            <ul className="text-sm text-muted space-y-1.5">
              {c.improvements.map((s) => (
                <li key={s} className="flex gap-2"><TrendingUp size={14} className="text-warning shrink-0 mt-0.5" /> {s}</li>
              ))}
            </ul>
          </Card>
        </aside>
      </div>
    </PageContainer>
  );
}
