import { cx } from '../../utils/index.js';

export function ProgressBar({ value = 0, max = 100, tone = 'brand', className = '' }) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  const bg = { brand: 'bg-brand', success: 'bg-success', warning: 'bg-warning', danger: 'bg-danger' }[tone];
  return (
    <div className={cx('h-1.5 w-full rounded-full bg-border overflow-hidden', className)}>
      <div className={cx('h-full rounded-full transition-all', bg)} style={{ width: `${pct}%` }} />
    </div>
  );
}

export function CircularProgress({ value = 0, size = 44, stroke = 4 }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const dash = (value / 100) * c;
  return (
    <svg width={size} height={size} className="-rotate-90">
      <circle cx={size / 2} cy={size / 2} r={r} stroke="currentColor" className="text-border" strokeWidth={stroke} fill="none" />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        stroke="currentColor"
        className="text-brand transition-all"
        strokeWidth={stroke}
        fill="none"
        strokeDasharray={`${dash} ${c}`}
        strokeLinecap="round"
      />
    </svg>
  );
}
