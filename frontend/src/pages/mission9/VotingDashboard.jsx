import { Link } from 'react-router-dom';
import { Vote, Users, UserCheck, TrendingUp, ListChecks, BarChart3, ArrowRight, ShieldCheck, FileText, Clock } from 'lucide-react';
import PageContainer from '../../components/layout/PageContainer.jsx';
import PageHeader from '../../components/layout/PageHeader.jsx';
import Card from '../../components/common/Card.jsx';
import Button from '../../components/common/Button.jsx';
import EmptyState from '../../components/feedback/EmptyState.jsx';
import SectionHeader from '../../components/ui/SectionHeader.jsx';
import Mission9SubNav from '../../components/mission9/Mission9SubNav.jsx';
import ElectionStatCard from '../../components/mission9/ElectionStatCard.jsx';
import ElectionStatusBadge from '../../components/mission9/ElectionStatusBadge.jsx';
import CountdownTimer from '../../components/mission9/CountdownTimer.jsx';
import CandidateVoteCard from '../../components/mission9/CandidateVoteCard.jsx';
import { CANDIDATES, ELECTION, TURNOUT_PCT } from '../../mocks/data/mission9.js';
import { useAuth } from '../../context/AuthContext.jsx';

export default function VotingDashboard() {
  const { role } = useAuth();
  const isStaff = role === 'teacher' || role === 'office';
  const isVotingOpen = ELECTION.status === 'active';
  const top3 = [...CANDIDATES].sort((a, b) => b.overallScore - a.overallScore).slice(0, 3);

  // Voting closed for students → show "no voting yet" state.
  if (!isStaff && !isVotingOpen) {
    return (
      <PageContainer>
        <PageHeader
          title="Captain Voting"
          subtitle="Voting is not open right now."
          icon={<Vote size={18} />}
        />
        <Mission9SubNav />
        <Card className="p-8">
          <EmptyState
            icon={<Clock size={20} />}
            title="No voting yet"
            message="Your teacher hasn't started the election. Come back when voting opens — you'll see the shortlisted candidates and can cast your ballot then."
          />
          <div className="mt-4 flex justify-center">
            <ElectionStatusBadge status={ELECTION.status} />
          </div>
        </Card>
      </PageContainer>
    );
  }

  const quick = [
    !isStaff && { to: '/mission-9/ballot',     icon: <Vote size={16} />,       title: 'Vote Now',        desc: 'Cast your ballot for the Spring 2026 captain' },
    { to: '/mission-9/candidates', icon: <Users size={16} />,      title: 'View Candidates', desc: 'Browse manifestos and profiles' },
    { to: '/mission-9/results',    icon: <BarChart3 size={16} />,  title: 'Election Results',desc: 'Live tally, charts, and turnout' },
    { to: '#rules',                icon: <ShieldCheck size={16} />, title: 'Election Rules', desc: 'What counts as a valid ballot' },
  ].filter(Boolean);

  return (
    <PageContainer>
      <PageHeader
        title="Captain Voting"
        subtitle={`${ELECTION.name} · closes ${new Date(ELECTION.closes).toLocaleDateString()}`}
        icon={<Vote size={18} />}
        actions={!isStaff ? (
          <Link to="/mission-9/ballot"><Button leftIcon={<Vote size={14} />}>Vote Now</Button></Link>
        ) : null}
      />
      <Mission9SubNav />

      <div className="mb-6 flex flex-wrap items-center gap-2">
        <ElectionStatusBadge status={ELECTION.status} />
        <span className="text-xs text-muted">Election ID: <span className="font-mono text-fg">{ELECTION.id}</span></span>
        {isStaff && <span className="text-[11px] text-muted ml-2">Admin view — voting is disabled for staff.</span>}
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <ElectionStatCard icon={<Users size={16} />}      label="Candidates"      value={ELECTION.candidateCount} hint="Approved ballots" />
        <ElectionStatCard icon={<UserCheck size={16} />}  label="Eligible Voters" value={ELECTION.eligibleVoters} hint="3rd-year enrolled" tone="brand" />
        <ElectionStatCard icon={<Vote size={16} />}       label="Votes Cast"      value={ELECTION.votesCast}      hint="Live count" tone="success" />
        <ElectionStatCard icon={<TrendingUp size={16} />} label="Turnout"         value={`${TURNOUT_PCT}%`}       hint="of eligible voters" tone="warning" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
          <SectionHeader title="Quick actions" description="Everything you need for this election" />
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
          <SectionHeader title="Countdown" description="Time left to vote" />
          <CountdownTimer target={ELECTION.closes} />
        </div>
      </div>

      <SectionHeader
        title="Top candidates"
        description="Ranked by weighted leadership score"
        action={<Link to="/mission-9/candidates" className="text-xs text-brand hover:underline">See all</Link>}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {top3.map((c) => <CandidateVoteCard key={c.id} candidate={c} />)}
      </div>

      <Card id="rules" className="p-5">
        <div className="flex items-center gap-2 mb-3">
          <FileText size={16} className="text-brand" />
          <h3 className="text-sm font-semibold text-fg">Election Rules</h3>
        </div>
        <ul className="space-y-2">
          {ELECTION.rules.map((r, i) => (
            <li key={i} className="flex gap-2 text-sm text-muted">
              <ListChecks size={14} className="text-brand shrink-0 mt-0.5" />
              <span>{r}</span>
            </li>
          ))}
        </ul>
      </Card>
    </PageContainer>
  );
}

