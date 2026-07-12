import { Link } from 'react-router-dom';
import { Star, GraduationCap, Users } from 'lucide-react';
import Card from '../common/Card.jsx';
import Avatar from '../ui/Avatar.jsx';
import CircularScore from './CircularScore.jsx';
import RecommendationBadge from './RecommendationBadge.jsx';

export default function CandidateCard({ candidate, rank, variant = 'grid' }) {
  const isList = variant === 'list';
  return (
    <Card className={isList ? 'p-4 flex items-center gap-4' : 'p-4'}>
      <div className={isList ? 'flex items-center gap-3 min-w-0 flex-1' : 'flex items-start gap-3'}>
        {rank !== undefined && (
          <div className="h-9 w-9 rounded-lg bg-elevated flex items-center justify-center text-sm font-bold text-fg shrink-0">
            #{rank}
          </div>
        )}
        <Avatar name={candidate.name} size={isList ? 40 : 44} />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-fg truncate">{candidate.name}</p>
          <p className="text-xs text-muted truncate">
            {candidate.roll} · {candidate.department} · Sec {candidate.section}
          </p>
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            <RecommendationBadge status={candidate.status} />
          </div>
        </div>
      </div>

      {!isList && (
        <div className="mt-4 grid grid-cols-4 gap-2 text-center">
          <Metric label="Overall" value={candidate.scores.overall} />
          <Metric label="Lead" value={candidate.scores.leadership} />
          <Metric label="Peer" value={candidate.peerRating.toFixed(1)} suffix="/5" />
          <Metric label="Attn" value={`${candidate.attendancePct}%`} />
        </div>
      )}

      {isList && (
        <div className="hidden sm:flex items-center gap-6 shrink-0">
          <CircularScore value={candidate.scores.overall} size={54} stroke={6} label="Overall" />
          <Metric label="Leadership" value={candidate.scores.leadership} />
          <Metric label="Peer" value={candidate.peerRating.toFixed(1)} suffix="/5" />
          <Metric label="Participation" value={candidate.scores.participation} />
        </div>
      )}

      <div className={isList ? 'flex gap-2 shrink-0' : 'mt-4 flex gap-2'}>
        <Link
          to={`/mission-8/candidates/${candidate.id}`}
          className="flex-1 inline-flex items-center justify-center h-8 px-3 text-xs rounded-md gap-1.5 bg-transparent text-fg border border-border hover:bg-elevated font-medium transition-colors"
        >
          Profile
        </Link>
        <Link
          to={`/mission-8/candidates/${candidate.id}/breakdown`}
          className="flex-1 inline-flex items-center justify-center h-8 px-3 text-xs rounded-md gap-1.5 bg-brand text-brand-fg hover:brightness-110 shadow-sm font-medium transition-colors"
        >
          Breakdown
        </Link>
      </div>
    </Card>
  );
}

function Metric({ label, value, suffix = '' }) {
  return (
    <div>
      <p className="text-sm font-semibold text-fg tabular-nums">{value}{suffix}</p>
      <p className="text-[10px] uppercase text-subtle">{label}</p>
    </div>
  );
}
