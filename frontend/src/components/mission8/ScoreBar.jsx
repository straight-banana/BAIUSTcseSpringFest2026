import { cx } from '../../utils/index.js';

export default function ScoreBar({ label, value, max = 100, tone = 'brand' }) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  const bar =
    tone === 'success' ? 'bg-success' :
    tone === 'warning' ? 'bg-warning' :
    tone === 'danger'  ? 'bg-danger'  : 'bg-brand';
  return (
    <div>
      <div className="flex items-center justify-between text-xs mb-1">
        <span className="text-fg">{label}</span>
        <span className="tabular-nums text-muted">{Number(value).toFixed(0)}<span className="text-subtle">/{max}</span></span>
      </div>
      <div className="h-2 rounded-full bg-elevated overflow-hidden">
        <div className={cx('h-full transition-all duration-500', bar)} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
