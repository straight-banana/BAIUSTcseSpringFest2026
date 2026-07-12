import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Award, Users, ShieldCheck, Sparkles, ArrowRight, BarChart3, ListOrdered, User, UserCheck } from 'lucide-react';
import PageContainer from '../../components/layout/PageContainer.jsx';
import PageHeader from '../../components/layout/PageHeader.jsx';
import Card from '../../components/common/Card.jsx';
import Button from '../../components/common/Button.jsx';
import SectionHeader from '../../components/ui/SectionHeader.jsx';
import KpiCard from '../../components/mission4/KpiCard.jsx';
import Mission8SubNav from '../../components/mission8/Mission8SubNav.jsx';
import CandidateCard from '../../components/mission8/CandidateCard.jsx';
import LoadingState from '../../components/feedback/Loading.jsx';
import ErrorState from '../../components/feedback/ErrorState.jsx';
import EmptyState from '../../components/feedback/EmptyState.jsx';
import { getCurrentRound, getRankedCandidates, getAnalytics, weightsToList } from '../../services/candidatesService.js';

const quick = [
  { to: '/mission-8/assign',    icon: <UserCheck size={16} />, title: 'Assign Captain', desc: 'Promote one student per section' },
  { to: '/mission-8/rankings',    icon: <ListOrdered size={16} />, title: 'View Rankings', desc: 'Full ranked candidate list' },
  { to: '/mission-8/analytics',   icon: <BarChart3 size={16} />, title: 'Analytics', desc: 'Selection trends & distributions' },
];

export default function RecommendationDashboard() {
  const [round, setRound] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    getCurrentRound()
      .then((r) => {
        if (!active) return null;
        setRound(r);
        if (!r) return null;
        return Promise.all([getRankedCandidates(r.id), getAnalytics(r.id)]);
      })
      .then((result) => {
        if (!active || !result) return;
        const [ranked, analyticsData] = result;
        setCandidates(ranked || []);
        setAnalytics(analyticsData);
      })
      .catch((err) => { if (active) setError(err?.message || 'Unable to load recommendation dashboard'); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  if (loading) {
    return (
      <PageContainer>
        <PageHeader title="Captain Recommendation Engine" icon={<Award size={18} />} />
        <Mission8SubNav />
        <LoadingState label="Loading dashboard..." />
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer>
        <PageHeader title="Captain Recommendation Engine" icon={<Award size={18} />} />
        <Mission8SubNav />
        <ErrorState title="Couldn't load dashboard" message={error} />
      </PageContainer>
    );
  }

  if (!round) {
    return (
      <PageContainer>
        <PageHeader title="Captain Recommendation Engine" icon={<Award size={18} />} />
        <Mission8SubNav />
        <EmptyState title="No candidate round yet" message="Create a round to start ranking captain candidates." />
      </PageContainer>
    );
  }

  const weightList = weightsToList(round.weights);
  const avgFor = (key) => candidates.length ? (candidates.reduce((a, c) => a + (c.scores?.[key] || 0), 0) / candidates.length).toFixed(1) : '0.0';
  const recommended = candidates.filter((c) => c.badge === 'GOLD').length;

  return (
    <PageContainer>
      <PageHeader
        title="Captain Recommendation Engine"
        subtitle={`Round: ${round.name}`}
        icon={<Award size={18} />}
        actions={
          <Link to="/mission-8/rankings"><Button leftIcon={<Sparkles size={14} />}>View Rankings</Button></Link>
        }
      />
      <Mission8SubNav />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <KpiCard icon={<Users size={16} />} label="Candidates" value={candidates.length} />
        <KpiCard icon={<ShieldCheck size={16} />} tone="success" label="Gold Badge" value={recommended} />
        {weightList.slice(0, 2).map((w) => (
          <KpiCard key={w.key} icon={<Award size={16} />} tone="warning" label={`Avg ${w.label}`} value={avgFor(w.key)} />
        ))}
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <ReadyCard label="Total Candidates" value={analytics?.total ?? 0} />
        <ReadyCard label="Avg Score" value={analytics?.avgScore ?? 0} />
        <ReadyCard label="Manual Overrides" value={analytics?.overrideCount ?? 0} />
        <ReadyCard label="Round Status" value={round.isActive ? 'Active' : 'Closed'} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div>
            <SectionHeader title="Quick actions" description="Jump into a review flow" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {quick.map((a) => (
                <Link key={a.to} to={a.to} className="group">
                  <Card className="p-4 flex items-center gap-3 hover:border-brand/60 transition-colors">
                    <div className="h-9 w-9 rounded-lg bg-brand-soft text-brand flex items-center justify-center">{a.icon}</div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-fg">{a.title}</p>
                      <p className="text-xs text-muted truncate">{a.desc}</p>
                    </div>
                    <ArrowRight size={14} className="text-muted group-hover:text-brand transition-colors" />
                  </Card>
                </Link>
              ))}
            </div>
          </div>

          <div>
            <SectionHeader
              title="Top recommendations"
              description="Ranked by weighted overall score"
              action={<Link to="/mission-8/rankings" className="text-xs text-brand hover:underline">All rankings</Link>}
            />
            {candidates.length === 0 ? (
              <p className="text-sm text-muted">No candidate profiles in this round yet.</p>
            ) : (
              <div className="space-y-3">
                {candidates.slice(0, 4).map((c, i) => (
                  <CandidateCard key={c.id} candidate={c} rank={i + 1} variant="list" />
                ))}
              </div>
            )}
          </div>
        </div>

        <aside className="space-y-4">
          <Card className="p-4">
            <h4 className="text-xs font-semibold uppercase text-subtle mb-3">Current round</h4>
            <p className="text-sm font-medium text-fg">{round.name}</p>
            <p className="text-xs text-muted mt-0.5">{round.isActive ? 'Active' : 'Closed'}</p>
          </Card>
          <Card className="p-4">
            <h4 className="text-xs font-semibold uppercase text-subtle mb-2">How ranking works</h4>
            <ul className="text-xs text-muted space-y-1.5 list-disc pl-4">
              {weightList.map((w) => (
                <li key={w.key}>{w.label} — {Math.round(w.weight * 100)}% weight</li>
              ))}
            </ul>
          </Card>
        </aside>
      </div>
    </PageContainer>
  );
}

function ReadyCard({ label, value, hint }) {
  return (
    <Card className="p-4">
      <p className="text-[11px] uppercase text-subtle">{label}</p>
      <p className="mt-1 text-lg font-semibold text-fg">{value}</p>
      {hint && <p className="text-[11px] text-muted mt-0.5">{hint}</p>}
    </Card>
  );
}
