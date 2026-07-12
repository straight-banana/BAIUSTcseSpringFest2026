import { useEffect, useState } from 'react';
import { BarChart3, Trophy, Users, Vote } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from 'recharts';
import PageContainer from '../../components/layout/PageContainer.jsx';
import PageHeader from '../../components/layout/PageHeader.jsx';
import Card from '../../components/common/Card.jsx';
import SectionHeader from '../../components/ui/SectionHeader.jsx';
import Mission9SubNav from '../../components/mission9/Mission9SubNav.jsx';
import ElectionStatCard from '../../components/mission9/ElectionStatCard.jsx';
import WinnerCard from '../../components/mission9/WinnerCard.jsx';
import VoteBar from '../../components/mission9/VoteBar.jsx';
import LoadingState from '../../components/feedback/Loading.jsx';
import ErrorState from '../../components/feedback/ErrorState.jsx';
import EmptyState from '../../components/feedback/EmptyState.jsx';
import { getActive, getResults } from '../../services/electionsService.js';

export default function ElectionResults() {
  const [election, setElection] = useState(null);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notPublished, setNotPublished] = useState(false);

  useEffect(() => {
    let active = true;
    getActive()
      .then((e) => {
        if (!active) return null;
        setElection(e);
        return e ? getResults(e.id) : null;
      })
      .then((r) => { if (active && r) setResults(r); })
      .catch((err) => {
        if (!active) return;
        if (err?.status === 404) return; // no active election
        if (err?.status === 403) setNotPublished(true);
        else setError(err?.message || 'Unable to load results');
      })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  if (loading) {
    return (
      <PageContainer>
        <PageHeader title="Election Results" icon={<BarChart3 size={18} />} />
        <Mission9SubNav />
        <LoadingState label="Loading results..." />
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer>
        <PageHeader title="Election Results" icon={<BarChart3 size={18} />} />
        <Mission9SubNav />
        <ErrorState title="Couldn't load results" message={error} />
      </PageContainer>
    );
  }

  if (!election) {
    return (
      <PageContainer>
        <PageHeader title="Election Results" icon={<BarChart3 size={18} />} />
        <Mission9SubNav />
        <EmptyState title="No active election" message="Results will appear here once an election is running." />
      </PageContainer>
    );
  }

  if (notPublished || !results) {
    return (
      <PageContainer>
        <PageHeader title="Election Results" subtitle={election.title} icon={<BarChart3 size={18} />} />
        <Mission9SubNav />
        <EmptyState title="Results not yet published" message="The election admin has not published results for this round yet. Check back later." />
      </PageContainer>
    );
  }

  const sorted = [...results.results].sort((a, b) => b.firstChoiceVotes - a.firstChoiceVotes);
  const winner = sorted[0];
  const totalVoters = results.totalVoters || 0;
  const winnerPct = totalVoters ? Math.round((winner.firstChoiceVotes / totalVoters) * 100) : 0;
  const barData = sorted.map((c) => ({ name: c.user?.name?.split(' ')[0] || 'Unknown', votes: c.firstChoiceVotes }));

  return (
    <PageContainer>
      <PageHeader title="Election Results" subtitle={`${election.title} · published`} icon={<BarChart3 size={18} />} />
      <Mission9SubNav />

      {winner && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
          <div className="lg:col-span-1">
            <WinnerCard
              candidate={{ name: winner.user?.name, roll: winner.user?.rollNumber, votes: winner.firstChoiceVotes, votePct: winnerPct }}
              totalVotes={totalVoters}
            />
          </div>
          <div className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-3">
            <ElectionStatCard icon={<Vote size={16} />}   label="Total Voters" value={totalVoters} />
            <ElectionStatCard icon={<Users size={16} />} label="Candidates"   value={sorted.length} tone="brand" />
            <ElectionStatCard icon={<Trophy size={16} />} label="Winning Share" value={`${winnerPct}%`} tone="warning" />
          </div>
        </div>
      )}

      <Card className="p-5 mb-6">
        <SectionHeader title="Vote distribution" description="First-choice votes per candidate" />
        <div className="space-y-3">
          {sorted.map((c, i) => (
            <VoteBar
              key={c.candidateId}
              label={`${i + 1}. ${c.user?.name || 'Unknown'}`}
              value={c.firstChoiceVotes}
              max={winner?.firstChoiceVotes || 1}
              suffix={` (${c.totalVotes} total)`}
              highlight={winner && c.candidateId === winner.candidateId}
            />
          ))}
        </div>
      </Card>

      <Card className="p-5">
        <SectionHeader title="Votes per candidate" description="Bar chart" />
        <div style={{ width: '100%', height: 280 }}>
          <ResponsiveContainer>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgb(var(--border))" />
              <XAxis dataKey="name" tick={{ fontSize: 10, fill: 'rgb(var(--muted))' }} />
              <YAxis tick={{ fontSize: 10, fill: 'rgb(var(--muted))' }} />
              <Tooltip contentStyle={{ background: 'rgb(var(--elevated))', border: '1px solid rgb(var(--border))', borderRadius: 8, fontSize: 12 }} />
              <Bar dataKey="votes" radius={[6, 6, 0, 0]}>
                {barData.map((_, i) => <Cell key={i} fill={winner && sorted[i].candidateId === winner.candidateId ? 'rgb(var(--success))' : 'rgb(var(--brand))'} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </PageContainer>
  );
}
