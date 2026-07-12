import { useState } from 'react';
import { Trophy, Award, Users, MessageSquare, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import PageContainer from '../../components/layout/PageContainer.jsx';
import PageHeader from '../../components/layout/PageHeader.jsx';
import Mission8SubNav from '../../components/mission8/Mission8SubNav.jsx';
import Card from '../../components/common/Card.jsx';
import Avatar from '../../components/ui/Avatar.jsx';
import Badge from '../../components/ui/Badge.jsx';
import RecommendationBadge from '../../components/mission8/RecommendationBadge.jsx';
import { LEADERBOARDS } from '../../mocks/data/mission8.js';
import { cx } from '../../utils/index.js';

const TABS = [
  { key: 'overall',        label: 'Overall',           icon: <Trophy size={14} />, metricLabel: 'Overall',       get: (s) => s.scores.overall },
  { key: 'leadership',     label: 'Leadership',        icon: <Award size={14} />,  metricLabel: 'Leadership',    get: (s) => s.scores.leadership },
  { key: 'peer',           label: 'Top Peer Rating',   icon: <MessageSquare size={14} />, metricLabel: 'Peer /5', get: (s) => s.peerRating.toFixed(2) },
  { key: 'participation',  label: 'Participation',     icon: <Users size={14} />,  metricLabel: 'Participation', get: (s) => s.scores.participation },
  { key: 'mostRecommended',label: 'Most Recommended',  icon: <Sparkles size={14} />, metricLabel: 'Overall',      get: (s) => s.scores.overall },
];

export default function LeaderboardPage() {
  const [tab, setTab] = useState('overall');
  const active = TABS.find((t) => t.key === tab);
  const list = LEADERBOARDS[tab] || [];

  return (
    <PageContainer>
      <PageHeader title="Captain Leaderboard" subtitle="Top candidates across every leadership factor." icon={<Trophy size={18} />} />
      <Mission8SubNav />

      <div className="flex gap-2 overflow-x-auto mb-6 pb-1">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={cx(
              'inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium whitespace-nowrap transition-colors',
              tab === t.key ? 'bg-brand text-brand-fg border-brand' : 'bg-surface text-fg border-border hover:bg-elevated'
            )}
          >
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
        {list.slice(0, 3).map((c, i) => (
          <div key={c.id} className={cx('transition-transform', i === 0 && 'sm:-translate-y-2')}>
            <PodiumCard rank={i + 1} candidate={c} metric={active.get(c)} metricLabel={active.metricLabel} />
          </div>
        ))}
      </div>

      <div className="space-y-2">
        {list.slice(3).map((c, i) => (
          <RowCard key={c.id} rank={i + 4} candidate={c} metric={active.get(c)} metricLabel={active.metricLabel} />
        ))}
      </div>
    </PageContainer>
  );
}

function PodiumCard({ rank, candidate, metric, metricLabel }) {
  const tone =
    rank === 1 ? 'bg-warning/20 text-warning border-warning/40' :
    rank === 2 ? 'bg-fg/10 text-fg border-border' :
    'bg-brand/10 text-brand border-brand/30';
  return (
    <Card className="p-5 text-center hover:-translate-y-0.5 transition-transform">
      <div className={cx('mx-auto h-12 w-12 rounded-full border flex items-center justify-center', tone)}>
        <Trophy size={20} />
      </div>
      <div className="mt-3">
        <Avatar name={candidate.name} size={56} className="mx-auto" />
      </div>
      <Link to={`/mission-8/candidates/${candidate.id}`} className="mt-2 block text-sm font-semibold text-fg hover:text-brand">
        {candidate.name}
      </Link>
      <p className="text-[11px] text-muted">{candidate.roll} · {candidate.department}</p>
      <div className="mt-3">
        <p className="text-2xl font-semibold text-fg tabular-nums">{metric}</p>
        <p className="text-[10px] uppercase text-subtle">{metricLabel}</p>
      </div>
      <div className="mt-3">
        <RecommendationBadge status={candidate.status} />
      </div>
    </Card>
  );
}

function RowCard({ rank, candidate, metric, metricLabel }) {
  return (
    <Card className="p-4 flex items-center gap-4 hover:-translate-y-0.5 transition-transform">
      <div className="h-10 w-10 rounded-full border border-border bg-elevated flex items-center justify-center font-bold text-sm text-fg">
        #{rank}
      </div>
      <Avatar name={candidate.name} size={40} />
      <div className="min-w-0 flex-1">
        <Link to={`/mission-8/candidates/${candidate.id}`} className="text-sm font-semibold text-fg truncate hover:text-brand">
          {candidate.name}
        </Link>
        <p className="text-[11px] text-muted truncate">{candidate.roll} · {candidate.department}</p>
      </div>
      <Badge tone="neutral" className="hidden sm:inline-flex">{candidate.badge}</Badge>
      <div className="text-right shrink-0">
        <p className="text-sm font-semibold text-fg tabular-nums">{metric}</p>
        <p className="text-[10px] uppercase text-subtle">{metricLabel}</p>
      </div>
    </Card>
  );
}
