import { cx } from '../../utils/index.js';

// Simple month calendar with day cells + task dots.
export default function CalendarGrid({ tasksByDate = {}, monthOffset = 0, onSelect, selected }) {
  const today = new Date();
  const view = new Date(today.getFullYear(), today.getMonth() + monthOffset, 1);
  const year = view.getFullYear();
  const month = view.getMonth();
  const firstWeekday = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells = [];
  for (let i = 0; i < firstWeekday; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const dayLabels = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  const monthLabel = view.toLocaleDateString(undefined, { month: 'long', year: 'numeric' });

  return (
    <div>
      <p className="text-sm font-semibold text-fg mb-3">{monthLabel}</p>
      <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-mono uppercase text-subtle mb-1">
        {dayLabels.map((l, i) => <div key={i}>{l}</div>)}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {cells.map((d, i) => {
          if (d === null) return <div key={i} />;
          const dateKey = new Date(year, month, d).toISOString().slice(0, 10);
          const tasks = tasksByDate[dateKey] || [];
          const isToday = today.getFullYear() === year && today.getMonth() === month && today.getDate() === d;
          const isSelected = selected === dateKey;
          return (
            <button
              key={i}
              onClick={() => onSelect?.(dateKey)}
              className={cx(
                'aspect-square rounded-md text-xs flex flex-col items-center justify-center gap-1 border transition-colors',
                isSelected
                  ? 'border-brand bg-brand-soft text-brand'
                  : isToday
                  ? 'border-brand/50 bg-surface text-fg font-semibold'
                  : 'border-transparent text-muted hover:bg-elevated hover:text-fg'
              )}
              aria-label={`${dateKey}, ${tasks.length} tasks`}
            >
              <span>{d}</span>
              {tasks.length > 0 && (
                <div className="flex gap-0.5">
                  {tasks.slice(0, 3).map((t, j) => (
                    <span key={j} className={cx('h-1 w-1 rounded-full', t.done ? 'bg-success' : 'bg-brand')} />
                  ))}
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
