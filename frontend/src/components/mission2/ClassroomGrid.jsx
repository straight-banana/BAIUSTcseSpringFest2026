import { Fragment } from 'react';
import { cx } from '../../utils/index.js';
import SeatCard from './SeatCard.jsx';
import { Presentation, DoorOpen } from 'lucide-react';

/**
 * ClassroomGrid — renders podium, front-row indicator, center aisle, entrance and desks.
 */
export default function ClassroomGrid({
  seats,
  rows,
  cols,
  selectedId,
  highlightedId,
  onSeatClick,
  draggable = false,
  onSeatDragStart,
  onSeatDrop,
}) {
  const aisleCol = cols >= 6 ? Math.ceil(cols / 2) : null;
  const gridCols = aisleCol ? `repeat(${aisleCol}, minmax(0,1fr)) 12px repeat(${cols - aisleCol}, minmax(0,1fr))` : `repeat(${cols}, minmax(0,1fr))`;

  return (
    <div className="rounded-2xl border border-border bg-surface p-4 sm:p-6">
      {/* Podium */}
      <div className="mb-4 flex items-center justify-center">
        <div className="inline-flex items-center gap-2 rounded-full bg-brand text-brand-fg px-4 py-1.5 text-xs font-semibold shadow-sm">
          <Presentation size={14} />
          Teacher Podium
        </div>
      </div>

      {/* Front row indicator */}
      <div className="mb-2 text-center text-[10px] font-medium uppercase tracking-wider text-subtle">
        ↑ Front of Classroom ↑
      </div>

      {/* Grid */}
      <div className="space-y-2">
        {Array.from({ length: rows }).map((_, r) => (
          <div
            key={r}
            className="grid gap-2 items-stretch"
            style={{ gridTemplateColumns: gridCols }}
          >
            {Array.from({ length: cols }).map((_, c) => {
              const seat = seats.find((s) => s.row === r && s.col === c);
              const cell = (
                <SeatCard
                  key={`${r}-${c}`}
                  seat={seat || { id: `${r}-${c}`, row: r, col: c, label: `${String.fromCharCode(65 + r)}${c + 1}`, student: null, constraints: [] }}
                  selected={selectedId === seat?.id}
                  highlighted={highlightedId && seat?.student?.id === highlightedId}
                  onClick={() => onSeatClick?.(seat)}
                  draggable={draggable}
                  onDragStart={(e) => onSeatDragStart?.(e, seat)}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => onSeatDrop?.(e, seat)}
                />
              );
              if (aisleCol && c === aisleCol) {
                return (
                  <Fragment key={`cell-${r}-${c}`}>
                    <div className={cx('w-full')}>
                      <div className="h-full w-full rounded bg-bg border border-dashed border-border/70" aria-hidden />
                    </div>
                    {cell}
                  </Fragment>
                );
              }
              return cell;
            })}
          </div>
        ))}
      </div>

      {/* Entrance */}
      <div className="mt-5 flex items-center justify-end">
        <div className="inline-flex items-center gap-2 rounded-md border border-border bg-elevated px-3 py-1.5 text-xs text-muted">
          <DoorOpen size={12} />
          Entrance
        </div>
      </div>
    </div>
  );
}
