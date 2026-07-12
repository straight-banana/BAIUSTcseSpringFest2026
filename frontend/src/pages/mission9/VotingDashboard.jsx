import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Vote, Users, BarChart3, ArrowRight, Clock } from 'lucide-react';
import PageContainer from '../../components/layout/PageContainer.jsx';
import PageHeader from '../../components/layout/PageHeader.jsx';
import Card from '../../components/common/Card.jsx';
import Button from '../../components/common/Button.jsx';
import EmptyState from '../../components/feedback/EmptyState.jsx';
import LoadingState from '../../components/feedback/Loading.jsx';
import ErrorState from '../../components/feedback/ErrorState.jsx';
import SectionHeader from '../../components/ui/SectionHeader.jsx';
import Mission9SubNav from '../../components/mission9/Mission9SubNav.jsx';
import ElectionStatCard from '../../components/mission9/ElectionStatCard.jsx';
import ElectionStatusBadge from '../../components/mission9/ElectionStatusBadge.jsx';
import CountdownTimer from '../../components/mission9/CountdownTimer.jsx';
import CandidateVoteCard from '../../components/mission9/CandidateVoteCard.jsx';
import { getActive, hasVoted } from '../../services/electionsService.js';
import { useAuth } from '../../context/AuthContext.jsx';

export default function VotingDashboard() {
  const { role } = useAuth();
  const isStaff = role === 'teacher' || role === 'office';
  const [election, setElection] = useState(null);
  const [voted, setVoted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    getActive()
      .then((e) => {
        if (!active) return null;
        setElection(e);
        if (!isStaff && e) return hasVoted(e.id).catch(() => null);
        return null;
      })
      .then((v) => { if (active && v) setVoted(!!v.hasVoted); })
      .catch((err) => {
        if (!active) return;
        if (err?.status === 404) setElection(null);
        else setError(err?.message || 'Unable to load election');
      })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [isStaff]);

  if (loading) {
    return (
      <PageContainer>
        <PageHeader title="Captain Voting" icon={<Vote size={18} />} />
        <Mission9SubNav />
        <LoadingState label="Loading election..." />
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer>
        <PageHeader title="Captain Voting" icon={<Vote size={18} />} />
        <Mission9SubNav />
        <ErrorState title="Couldn't load election" message={error} />
      </PageContainer>
    );
  }

  // No active election → show "no voting yet" state.
  if (!election) {
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
            message="There's no active election. Come back when voting opens — you'll see the shortlisted candidates and can cast your ballot then."
          />
        </Card>
      </PageContainer>
    );
  }

  const quick = [
    !isStaff && !voted && { to: '/mission-9/ballot',     icon: <Vote size={16} />,       title: 'Vote Now',        desc: 'Cast your ballot for this election' },
    { to: '/mission-9/candidates', icon: <Users size={16} />,      title: 'View Candidates', desc: 'Browse candidate profiles' },
    { to: '/mission-9/results',    icon: <BarChart3 size={16} />,  title: 'Election Results',desc: 'View results once published' },
  ].filter(Boolean);

  return (
    <PageContainer>
      <PageHeader
        title="Captain Voting"
        subtitle={election.title}
        icon={<Vote size={18} />}
        actions={!isStaff && !voted ? (
          <Link to="/mission-9/ballot"><Button leftIcon={<Vote size={14} />}>Vote Now</Button></Link>
        ) : null}
      />
      <Mission9SubNav />

      <div className="mb-6 flex flex-wrap items-center gap-2">
        <ElectionStatusBadge status={election.status?.toLowerCase()} />
        {!isStaff && voted && <span className="text-[11px] text-success">You've already voted in this election.</span>}
        {isStaff && <span className="text-[11px] text-muted ml-2">Admin view — voting is disabled for staff.</span>}
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <ElectionStatCard icon={<Users size={16} />} label="Candidates" value={election.candidates?.length ?? 0} />
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
        {election.endsAt && (
          <div>
            <SectionHeader title="Countdown" description="Time left to vote" />
            <CountdownTimer target={election.endsAt} />
          </div>
        )}
      </div>

      <SectionHeader
        title="Candidates"
        action={<Link to="/mission-9/candidates" className="text-xs text-brand hover:underline">See all</Link>}
      />
      {(election.candidates || []).length === 0 ? (
        <p className="text-sm text-muted">No candidates added yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {election.candidates.slice(0, 3).map((c) => <CandidateVoteCard key={c.id} candidate={c} />)}
        </div>
      )}
    </PageContainer>
  );
}

