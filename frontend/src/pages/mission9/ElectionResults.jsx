import { BarChart3, Trophy, Users, Vote, TrendingUp } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  PieChart, Pie, Cell, Legend, LineChart, Line, Area, AreaChart,
} from 'recharts';
import PageContainer from '../../components/layout/PageContainer.jsx';
import PageHeader from '../../components/layout/PageHeader.jsx';
import Card from '../../components/common/Card.jsx';
import SectionHeader from '../../components/ui/SectionHeader.jsx';
import Mission9SubNav from '../../components/mission9/Mission9SubNav.jsx';
import ElectionStatCard from '../../components/mission9/ElectionStatCard.jsx';
import WinnerCard from '../../components/mission9/WinnerCard.jsx';
import VoteBar from '../../components/mission9/VoteBar.jsx';
import { CANDIDATES, ELECTION, TURNOUT_PCT, TURNOUT_TREND, DEPT_TURNOUT, getWinner } from '../../mocks/data/mission9.js';

const COLORS = ['rgb(var(--brand))', 'rgb(var(--success))', 'rgb(var(--warning))', 'rgb(var(--danger))', 'rgb(var(--accent))', '#8b5cf6', '#06b6d4', '#f97316'];

export default function ElectionResults() {
  const winner = getWinner();
  const sorted = [...CANDIDATES].sort((a, b) => b.votes - a.votes);
  const pieData = sorted.map((c) => ({ name: c.name.split(' ')[0], value: c.votes }));
  const barData = sorted.map((c) => ({ name: c.name.split(' ')[0], votes: c.votes }));

  return (
    <PageContainer>
      <PageHeader title="Election Results" subtitle={`${ELECTION.name} · live tally`} icon={<BarChart3 size={18} />} />
      <Mission9SubNav />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <div className="lg:col-span-1">
          <WinnerCard candidate={winner} totalVotes={ELECTION.votesCast} />
        </div>
        <div className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-4 gap-3">
          <ElectionStatCard icon={<Vote size={16} />}      label="Total Votes"      value={ELECTION.votesCast} />
          <ElectionStatCard icon={<Users size={16} />}     label="Eligible"          value={ELECTION.eligibleVoters} tone="brand" />
          <ElectionStatCard icon={<TrendingUp size={16} />} label="Turnout"          value={`${TURNOUT_PCT}%`} tone="success" />
          <ElectionStatCard icon={<Trophy size={16} />}    label="Winning Share"    value={`${winner.votePct}%`} tone="warning" />
        </div>
      </div>

      <Card className="p-5 mb-6">
        <SectionHeader title="Vote distribution" description="Votes received per candidate" />
        <div className="space-y-3">
          {sorted.map((c, i) => (
            <VoteBar
              key={c.id}
              label={`${i + 1}. ${c.name} · ${c.department}`}
              value={c.votes}
              max={winner.votes}
              suffix={` (${c.votePct}%)`}
              highlight={c.id === winner.id}
            />
          ))}
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
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
                  {barData.map((_, i) => <Cell key={i} fill={sorted[i].id === winner.id ? 'rgb(var(--success))' : 'rgb(var(--brand))'} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-5">
          <SectionHeader title="Vote share" description="Doughnut breakdown" />
          <div style={{ width: '100%', height: 280 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie data={pieData} innerRadius={55} outerRadius={95} dataKey="value" paddingAngle={2}>
                  {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ background: 'rgb(var(--elevated))', border: '1px solid rgb(var(--border))', borderRadius: 8, fontSize: 12 }} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card className="p-5">
          <SectionHeader title="Turnout over time" description="Cumulative votes across voting window" />
          <div style={{ width: '100%', height: 260 }}>
            <ResponsiveContainer>
              <AreaChart data={TURNOUT_TREND}>
                <defs>
                  <linearGradient id="tg" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%"   stopColor="rgb(var(--brand))" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="rgb(var(--brand))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgb(var(--border))" />
                <XAxis dataKey="day" tick={{ fontSize: 10, fill: 'rgb(var(--muted))' }} />
                <YAxis tick={{ fontSize: 10, fill: 'rgb(var(--muted))' }} />
                <Tooltip contentStyle={{ background: 'rgb(var(--elevated))', border: '1px solid rgb(var(--border))', borderRadius: 8, fontSize: 12 }} />
                <Area type="monotone" dataKey="votes" stroke="rgb(var(--brand))" fill="url(#tg)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-5">
          <SectionHeader title="Participation by class" description="Turnout percentage per class" />
          <div style={{ width: '100%', height: 260 }}>
            <ResponsiveContainer>
              <LineChart data={DEPT_TURNOUT}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgb(var(--border))" />
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: 'rgb(var(--muted))' }} />
                <YAxis tick={{ fontSize: 10, fill: 'rgb(var(--muted))' }} />
                <Tooltip contentStyle={{ background: 'rgb(var(--elevated))', border: '1px solid rgb(var(--border))', borderRadius: 8, fontSize: 12 }} />
                <Line type="monotone" dataKey="turnout" stroke="rgb(var(--success))" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <Card className="p-5">
        <SectionHeader title="Election statistics" description="A snapshot of this round" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <Stat label="Candidates"      value={ELECTION.candidateCount} />
          <Stat label="Total ballots"   value={ELECTION.votesCast} />
          <Stat label="Turnout"         value={`${TURNOUT_PCT}%`} />
          <Stat label="Winning margin"  value={`${(winner.votePct - (sorted[1]?.votePct || 0)).toFixed(1)}%`} />
          <Stat label="Reviewers"       value={ELECTION.reviewers} />
          <Stat label="Round opened"    value={new Date(ELECTION.opened).toLocaleDateString()} />
          <Stat label="Round closes"    value={new Date(ELECTION.closes).toLocaleDateString()} />
          <Stat label="Status"          value={ELECTION.status} />
        </div>
      </Card>
    </PageContainer>
  );
}

function Stat({ label, value }) {
  return (
    <div>
      <p className="text-[11px] uppercase text-subtle">{label}</p>
      <p className="mt-0.5 text-sm font-semibold text-fg tabular-nums">{value}</p>
    </div>
  );
}
