import { useState } from 'react';
import { Trophy, Award, Users, MessageSquare, TrendingUp } from 'lucide-react';
import PageContainer from '../../components/layout/PageContainer.jsx';
import PageHeader from '../../components/layout/PageHeader.jsx';
import Mission7SubNav from '../../components/mission7/Mission7SubNav.jsx';
import LeaderboardCard from '../../components/mission7/LeaderboardCard.jsx';
import { cx } from '../../utils/index.js';
import { LEADERBOARDS } from '../../mocks/data/mission7.js';

const TABS = [
  { key: 'overall',       label: 'Overall',        icon: <Trophy size={14} />, metricLabel: 'Overall',        get: (s) => s.overall },
  { key: 'leadership',    label: 'Leadership',     icon: <Award size={14} />,  metricLabel: 'Leadership',     get: (s) => s.ratings.leadership },
  { key: 'teamwork',      label: 'Teamwork',       icon: <Users size={14} />,  metricLabel: 'Teamwork',       get: (s) => s.ratings.teamwork },
  { key: 'communication', label: 'Most Helpful',   icon: <MessageSquare size={14} />, metricLabel: 'Communication', get: (s) => s.ratings.communication },
  { key: 'mostImproved',  label: 'Most Improved',  icon: <TrendingUp size={14} />, metricLabel: 'Growth',        get: (s) => s.ratings.discipline },
];

export default function LeaderboardPage() {
  const [tab, setTab] = useState('overall');
  const active = TABS.find((t) => t.key === tab);
  const list = LEADERBOARDS[tab] || [];

  return (
    <PageContainer>
      <PageHeader title="Class Leaderboard" subtitle="Celebrating top-rated classmates each term." icon={<Trophy size={18} />} />
      <Mission7SubNav />

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

      {/* Podium */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
        {list.slice(0, 3).map((s, i) => (
          <div key={s.id} className={cx('transition-transform', i === 0 && 'sm:-translate-y-2')}>
            <LeaderboardCard rank={i + 1} student={s} metric={active.get(s)} metricLabel={active.metricLabel} />
          </div>
        ))}
      </div>

      <div className="space-y-2">
        {list.slice(3).map((s, i) => (
          <LeaderboardCard key={s.id} rank={i + 4} student={s} metric={active.get(s)} metricLabel={active.metricLabel} />
        ))}
      </div>
    </PageContainer>
  );
}
