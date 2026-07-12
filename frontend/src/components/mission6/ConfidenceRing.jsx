import { findVerdict } from '../../mocks/data/mission6.js';

export default function ConfidenceRing({ value = 0, verdict = 'unverified', size = 120, label = 'Confidence' }) {
  const v = findVerdict(verdict);
  const r = (size - 14) / 2;
  const c = 2 * Math.PI * r;
  const dash = (value / 100) * c;

  return (
    <div className="inline-flex flex-col items-center gap-1">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle cx={size / 2} cy={size / 2} r={r} strokeWidth="8" fill="none" className="stroke-border" />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
            stroke={v.color}
            strokeDasharray={`${dash} ${c}`}
            style={{ transition: 'stroke-dasharray 0.6s ease' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold text-fg leading-none">{value}%</span>
          <span className="text-[10px] uppercase tracking-wider text-muted mt-1">{label}</span>
        </div>
      </div>
    </div>
  );
}
