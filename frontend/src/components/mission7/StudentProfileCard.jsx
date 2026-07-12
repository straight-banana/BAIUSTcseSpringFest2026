import { Link } from 'react-router-dom';
import { Star, ShieldCheck } from 'lucide-react';
import Card from '../common/Card.jsx';
import Button from '../common/Button.jsx';
import Badge from '../ui/Badge.jsx';
import Avatar from '../ui/Avatar.jsx';
import StarRating from './StarRating.jsx';

export default function StudentProfileCard({ student, variant = 'grid' }) {
  const isList = variant === 'list';
  return (
    <Card className={isList ? 'p-4 flex items-center gap-4' : 'p-5'}>
      <div className={isList ? 'flex items-center gap-3 min-w-0 flex-1' : 'flex items-start gap-3'}>
        <Avatar name={student.name} size={isList ? 40 : 48} />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-fg truncate">{student.name}</p>
          <p className="text-xs text-muted truncate">
            {student.roll} · {student.department} · Sec {student.section}
          </p>
          {!isList && student.leadershipBadge && (
            <Badge tone="brand" className="mt-2">
              <ShieldCheck size={11} className="mr-1" /> {student.leadershipBadge}
            </Badge>
          )}
        </div>
      </div>

      <div className={isList ? 'flex items-center gap-6 shrink-0' : 'mt-4 flex items-center justify-between'}>
        <div>
          <div className="flex items-center gap-1.5">
            <Star size={14} className="text-warning" fill="currentColor" />
            <span className="text-sm font-semibold text-fg tabular-nums">{student.overall.toFixed(2)}</span>
            <span className="text-[11px] text-muted">/ 5</span>
          </div>
          <p className="text-[11px] text-muted mt-0.5">{student.totalRatings} ratings</p>
        </div>
        {!isList && <StarRating value={Math.round(student.overall)} readOnly size={14} />}
      </div>

      <div className={isList ? 'flex gap-2 shrink-0' : 'mt-4 flex gap-2'}>
        <Link
          to={`/mission-7/students/${student.id}`}
          className="flex-1 inline-flex items-center justify-center h-8 px-3 text-xs rounded-md gap-1.5 bg-transparent text-fg border border-border hover:bg-elevated font-medium transition-colors"
        >
          View
        </Link>
        <Link
          to={`/mission-7/rate?student=${student.id}`}
          className="flex-1 inline-flex items-center justify-center h-8 px-3 text-xs rounded-md gap-1.5 bg-brand text-brand-fg hover:brightness-110 shadow-sm font-medium transition-colors"
        >
          Rate
        </Link>
      </div>
    </Card>
  );
}
