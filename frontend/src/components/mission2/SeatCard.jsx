import { memo } from 'react';
import { cx } from '../../utils/index.js';
import ConstraintBadge from './ConstraintBadge.jsx';
import { UserRound, Plus } from 'lucide-react';

function SeatCard({
  seat,
  onClick,
  selected = false,
  highlighted = false,
  draggable = false,
  onDragStart,
  onDragOver,
  onDrop,
}) {
  const empty = !seat.student;
  return (
    <button
      type="button"
      onClick={onClick}
      draggable={draggable && !empty}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDrop={onDrop}
      className={cx(
        'group relative flex flex-col items-start justify-between gap-1 rounded-lg border p-2 text-left transition-all min-h-[70px]',
        'focus:outline-none focus:ring-2 focus:ring-brand/40',
        empty
          ? 'border-dashed border-border bg-surface/50 hover:bg-elevated'
          : 'border-border bg-elevated hover:border-brand/60 hover:shadow-sm',
        selected && 'ring-2 ring-brand border-brand',
        highlighted && 'ring-2 ring-warning border-warning bg-warning/5',
      )}
      aria-label={empty ? `Empty seat ${seat.label}` : `Seat ${seat.label}, ${seat.student.name}`}
    >
      <div className="flex w-full items-center justify-between">
        <span className="text-[10px] font-mono text-subtle">{seat.label}</span>
        {seat.constraints?.length > 0 && (
          <div className="flex gap-0.5">
            {seat.constraints.slice(0, 2).map((c) => <ConstraintBadge key={c} type={c} compact />)}
          </div>
        )}
      </div>
      {empty ? (
        <div className="flex w-full flex-1 items-center justify-center text-subtle group-hover:text-brand">
          <Plus size={16} />
        </div>
      ) : (
        <div className="flex w-full items-center gap-1.5">
          <div className="h-6 w-6 shrink-0 rounded-full bg-brand-soft text-brand flex items-center justify-center">
            <UserRound size={12} />
          </div>
          <div className="min-w-0">
            <p className="truncate text-[11px] font-medium text-fg leading-tight">{seat.student.name.split(' ')[0]}</p>
            <p className="truncate text-[10px] text-muted leading-tight">{seat.student.height}cm</p>
          </div>
        </div>
      )}
    </button>
  );
}

export default memo(SeatCard);
