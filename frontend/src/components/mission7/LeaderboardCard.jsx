import { Link } from 'react-router-dom';
import { Trophy, Star } from 'lucide-react';
import Card from '../common/Card.jsx';
import Avatar from '../ui/Avatar.jsx';
import { cx } from '../../utils/index.js';

export default function LeaderboardCard({ rank, student, metricLabel = 'Overall', metric }) {
  const podium = rank <= 3;
  const podiumTone =
    rank === 1 ? 'bg-warning/20 text-warning border-warning/40'
    : rank === 2 ? 'bg-fg/10 text-fg border-border'
    : rank === 3 ? 'bg-brand/10 text-brand border-brand/30'
    : 'bg-elevated text-muted border-border';

  return (
    <Card
      className={cx(
        'p-4 flex items-center gap-4 transition-transform hover:-translate-y-0.5',
        podium && 'ring-1 ring-brand/20'
      )}
    >
      <div className={cx('h-10 w-10 rounded-full border flex items-center justify-center font-bold text-sm', podiumTone)}>
        {podium ? <Trophy size={16} /> : `#${rank}`}
      </div>
      <Avatar name={student.name} size={40} />
      <div className="min-w-0 flex-1">
        <Link to={`/mission-7/students/${student.id}`} className="text-sm font-semibold text-fg truncate hover:text-brand">
          {student.name}
        </Link>
        <p className="text-[11px] text-muted truncate">{student.roll} · Sec {student.section}</p>
      </div>
      <div className="text-right shrink-0">
        <div className="inline-flex items-center gap-1">
          <Star size={13} className="text-warning" fill="currentColor" />
          <span className="text-sm font-semibold text-fg tabular-nums">{Number(metric).toFixed(2)}</span>
        </div>
        <p className="text-[10px] uppercase text-subtle mt-0.5">{metricLabel}</p>
      </div>
    </Card>
  );
}
