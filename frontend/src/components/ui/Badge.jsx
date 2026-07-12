import { cx } from '../../utils/index.js';

const tones = {
  neutral: 'bg-elevated text-ink border-ink/20',
  brand: 'bg-brand-soft text-ink border-ochre/40',
  ochre: 'bg-ochre text-white border-transparent',
  success: 'bg-success/12 text-success border-success/30',
  warning: 'bg-brand-soft text-ink border-ochre/40',
  danger: 'bg-danger text-white border-transparent',
  live: 'bg-danger text-white border-transparent',
};

export default function Badge({ children, tone = 'neutral', className = '' }) {
  const live = tone === 'live';
  return (
    <span
      className={cx(
        'inline-flex items-center gap-1.5 border px-2 py-0.5 rounded-sm font-mono text-[10px] uppercase tracking-widest font-medium',
        tones[tone] || tones.neutral,
        className
      )}
    >
      {live && <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-white stamp-live" />}
      {children}
    </span>
  );
}
