import { Link } from 'react-router-dom';
import { Award, Users, TrendingUp, ShieldCheck, Sparkles, ArrowRight, BarChart3, ListOrdered, User, UserCheck } from 'lucide-react';
import PageContainer from '../../components/layout/PageContainer.jsx';
import PageHeader from '../../components/layout/PageHeader.jsx';
import Card from '../../components/common/Card.jsx';
import Button from '../../components/common/Button.jsx';
import SectionHeader from '../../components/ui/SectionHeader.jsx';
import KpiCard from '../../components/mission4/KpiCard.jsx';
import Mission8SubNav from '../../components/mission8/Mission8SubNav.jsx';
import CandidateCard from '../../components/mission8/CandidateCard.jsx';
import { CANDIDATES, LEADERBOARDS, CURRENT_ROUND } from '../../mocks/data/mission8.js';

const quick = [
  { to: '/mission-8/assign',    icon: <UserCheck size={16} />, title: 'Assign Captain', desc: 'Promote one student per section' },
  { to: '/mission-8/rankings',    icon: <ListOrdered size={16} />, title: 'View Rankings', desc: 'Full ranked candidate list' },
  { to: '/mission-8/candidates/cand-1', icon: <User size={16} />, title: 'Candidate Profiles', desc: 'Deep-dive on a leader' },
  { to: '/mission-8/analytics',   icon: <BarChart3 size={16} />, title: 'Analytics', desc: 'Selection trends & distributions' },
];

export default function RecommendationDashboard() {
  const eligible = CANDIDATES.filter((c) => c.status !== 'not-eligible').length;
  const recommended = CANDIDATES.filter((c) => c.status === 'recommended').length;
  const avgLead = (CANDIDATES.reduce((s, c) => s + c.scores.leadership, 0) / CANDIDATES.length).toFixed(1);
  const avgPart = Math.round(CANDIDATES.reduce((s, c) => s + c.scores.participation, 0) / CANDIDATES.length);

  return (
    <PageContainer>
      <PageHeader
        title="Captain Recommendation Engine"
        subtitle={`Round ${CURRENT_ROUND.name} · closes ${new Date(CURRENT_ROUND.closes).toLocaleDateString()}`}
        icon={<Award size={18} />}
        actions={
          <Link to="/mission-8/rankings"><Button leftIcon={<Sparkles size={14} />}>View Rankings</Button></Link>
        }
      />
      <Mission8SubNav />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <KpiCard icon={<Users size={16} />} label="Eligible Candidates" value={eligible} delta={4.2} />
        <KpiCard icon={<ShieldCheck size={16} />} tone="success" label="Recommended" value={recommended} delta={12.6} />
        <KpiCard icon={<Award size={16} />} tone="warning" label="Avg Leadership" value={avgLead} delta={2.1} />
        <KpiCard icon={<TrendingUp size={16} />} tone="brand" label="Participation" value={`${avgPart}%`} delta={-1.4} />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <ReadyCard label="Election Readiness" value="82%" hint="On track for open date" />
        <ReadyCard label="Recommendation Accuracy" value="91%" hint="vs. historical approvals" />
        <ReadyCard label="Reviewers" value={CURRENT_ROUND.reviewers} hint="Teachers assigned this round" />
        <ReadyCard label="Round Opened" value={new Date(CURRENT_ROUND.opened).toLocaleDateString()} hint={CURRENT_ROUND.id} />
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
            <div className="space-y-3">
              {LEADERBOARDS.overall.slice(0, 4).map((c, i) => (
                <CandidateCard key={c.id} candidate={c} rank={i + 1} variant="list" />
              ))}
            </div>
          </div>
        </div>

        <aside className="space-y-4">
          <Card className="p-4">
            <h4 className="text-xs font-semibold uppercase text-subtle mb-3">Current round</h4>
            <p className="text-sm font-medium text-fg">{CURRENT_ROUND.name}</p>
            <p className="text-xs text-muted mt-0.5">Opened {new Date(CURRENT_ROUND.opened).toLocaleDateString()}</p>
            <p className="text-xs text-muted">Closes {new Date(CURRENT_ROUND.closes).toLocaleDateString()}</p>
            <div className="mt-3 h-2 rounded-full bg-elevated overflow-hidden">
              <div className="h-full bg-brand" style={{ width: '48%' }} />
            </div>
            <p className="mt-1 text-[11px] text-muted">48% of review window elapsed</p>
          </Card>
          <Card className="p-4">
            <h4 className="text-xs font-semibold uppercase text-subtle mb-2">How ranking works</h4>
            <ul className="text-xs text-muted space-y-1.5 list-disc pl-4">
              <li>Weighted mix of leadership, peer feedback, participation, and academics.</li>
              <li>Teacher reviewers can approve, reject, or flag each candidate.</li>
              <li>Results roll up into round-level history.</li>
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
