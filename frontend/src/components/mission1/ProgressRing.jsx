import { motion } from 'framer-motion';
import { cx } from '../../utils/index.js';

/**
 * Circular progress indicator used by the Strike Counter dashboard.
 * `tone` maps to the semantic color tokens (brand / success / warning / danger).
 */
export default function ProgressRing({
  value = 0,
  max = 100,
  size = 180,
  stroke = 14,
  tone = 'brand',
  label,
  sublabel,
}) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const dash = (pct / 100) * c;

  const strokeClass = {
    brand: 'text-brand',
    success: 'text-success',
    warning: 'text-warning',
    danger: 'text-danger',
  }[tone];

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2} cy={size / 2} r={r}
          stroke="currentColor" className="text-border"
          strokeWidth={stroke} fill="none"
        />
        <motion.circle
          cx={size / 2} cy={size / 2} r={r}
          stroke="currentColor" className={cx(strokeClass, 'transition-colors')}
          strokeWidth={stroke} fill="none" strokeLinecap="round"
          initial={{ strokeDasharray: `0 ${c}` }}
          animate={{ strokeDasharray: `${dash} ${c}` }}
          transition={{ duration: 0.9, ease: 'easeOut' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
        <span className={cx('text-3xl font-semibold tabular-nums', strokeClass)}>
          {Math.round(pct)}%
        </span>
        {label && <span className="text-xs font-medium text-fg mt-1">{label}</span>}
        {sublabel && <span className="text-[11px] text-muted mt-0.5">{sublabel}</span>}
      </div>
    </div>
  );
}
