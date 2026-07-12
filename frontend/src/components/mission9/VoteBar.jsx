import { cx } from '../../utils/index.js';

export default function VoteBar({ label, value, max = 100, suffix = '', tone = 'brand', highlight = false }) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  const barCls = tone === 'success' ? 'bg-success' : tone === 'warning' ? 'bg-warning' : tone === 'danger' ? 'bg-danger' : 'bg-brand';
  return (
    <div>
      <div className="flex items-center justify-between text-xs mb-1">
        <span className={cx('text-muted', highlight && 'text-success font-semibold')}>{label}</span>
        <span className={cx('tabular-nums text-fg font-medium', highlight && 'text-success')}>{value}{suffix}</span>
      </div>
      <div className="h-1.5 rounded-full bg-elevated overflow-hidden">
        <div className={cx('h-full rounded-full transition-all', highlight ? 'bg-success' : barCls)} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
