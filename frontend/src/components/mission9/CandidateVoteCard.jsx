import { Link } from 'react-router-dom';
import { Star, GraduationCap, CheckCircle2, ArrowRight } from 'lucide-react';
import Card from '../common/Card.jsx';
import Avatar from '../ui/Avatar.jsx';
import Badge from '../ui/Badge.jsx';
import { cx } from '../../utils/index.js';

const RECMAP = {
  strong:    { tone: 'success', label: 'Strong pick' },
  endorsed:  { tone: 'brand',   label: 'Endorsed' },
  reviewing: { tone: 'warning', label: 'Under review' },
};

export default function CandidateVoteCard({ candidate: c, variant = 'grid', selected = false, onSelect, showActions = true }) {
  const isList = variant === 'list';
  const rec = RECMAP[c.recommendation] || RECMAP.reviewing;

  return (
    <Card
      className={cx(
        'transition-all',
        selected ? 'ring-2 ring-brand border-brand' : 'hover:border-brand/60',
        isList ? 'p-4 flex items-center gap-4' : 'p-4 flex flex-col'
      )}
    >
      <div className={isList ? 'flex items-center gap-3 min-w-0 flex-1' : 'flex items-start gap-3'}>
        <Avatar name={c.name} size={isList ? 44 : 52} />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-fg truncate">{c.name}</p>
          <p className="text-xs text-muted truncate">Class {c.className} · Sec {c.section} · Roll {c.roll}</p>
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            <Badge tone={rec.tone}>{rec.label}</Badge>
            {selected && <Badge tone="success"><CheckCircle2 size={10} className="mr-1" />Selected</Badge>}
          </div>
        </div>
      </div>

      {!isList && (
        <>
          <p className="mt-3 text-xs text-muted line-clamp-3 min-h-[3rem]">{c.manifesto}</p>
          <div className="mt-3 grid grid-cols-3 gap-2 text-center">
            <Metric icon={<GraduationCap size={12} />} label="Lead" value={c.scores.leadership} />
            <Metric icon={<Star size={12} />} label="Peer" value={`${c.scores.peer.toFixed(1)}/5`} />
            <Metric label="Overall" value={c.overallScore} />
          </div>
        </>
      )}

      {isList && (
        <div className="hidden md:flex items-center gap-6 shrink-0">
          <Metric label="Leadership" value={c.scores.leadership} />
          <Metric label="Peer" value={`${c.scores.peer.toFixed(1)}/5`} />
          <Metric label="Overall" value={c.overallScore} />
        </div>
      )}

      {showActions && (
        <div className={isList ? 'flex gap-2 shrink-0' : 'mt-4 flex gap-2'}>
          <Link
            to={`/mission-9/candidates/${c.id}`}
            className="flex-1 inline-flex items-center justify-center h-8 px-3 text-xs rounded-md gap-1.5 bg-transparent text-fg border border-border hover:bg-elevated font-medium transition-colors"
          >
            View Profile
          </Link>
          {onSelect ? (
            <button
              onClick={() => onSelect(c.id)}
              className={cx(
                'flex-1 inline-flex items-center justify-center h-8 px-3 text-xs rounded-md gap-1.5 font-medium transition-colors',
                selected
                  ? 'bg-success text-white hover:brightness-110'
                  : 'bg-brand text-brand-fg hover:brightness-110 shadow-sm'
              )}
              aria-pressed={selected}
            >
              {selected ? 'Selected' : 'Select'}
            </button>
          ) : (
            <Link
              to={`/mission-9/ballot?candidate=${c.id}`}
              className="flex-1 inline-flex items-center justify-center h-8 px-3 text-xs rounded-md gap-1.5 bg-brand text-brand-fg hover:brightness-110 shadow-sm font-medium transition-colors"
            >
              Select <ArrowRight size={12} />
            </Link>
          )}
        </div>
      )}
    </Card>
  );
}

function Metric({ label, value, icon }) {
  return (
    <div>
      <p className="text-sm font-semibold text-fg tabular-nums inline-flex items-center gap-1">{icon}{value}</p>
      <p className="text-[10px] uppercase text-subtle">{label}</p>
    </div>
  );
}
