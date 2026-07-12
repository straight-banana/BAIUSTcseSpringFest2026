import { cx } from '../../utils/index.js';

export default function CircularScore({ value = 0, max = 100, size = 96, stroke = 8, label, tone = 'brand' }) {
  const pct = Math.max(0, Math.min(1, value / max));
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const dash = c * pct;
  const color =
    tone === 'success' ? 'rgb(var(--success))' :
    tone === 'warning' ? 'rgb(var(--warning))' :
    tone === 'danger'  ? 'rgb(var(--danger))'  : 'rgb(var(--brand))';
  return (
    <div className={cx('relative inline-flex items-center justify-center')} style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} strokeWidth={stroke} stroke="rgb(var(--elevated))" fill="none" />
        <circle
          cx={size / 2} cy={size / 2} r={r}
          strokeWidth={stroke}
          stroke={color}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={`${dash} ${c - dash}`}
          style={{ transition: 'stroke-dasharray 600ms ease-out' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-lg font-semibold text-fg tabular-nums">{Number(value).toFixed(0)}</span>
        {label && <span className="text-[10px] uppercase text-subtle">{label}</span>}
      </div>
    </div>
  );
}
