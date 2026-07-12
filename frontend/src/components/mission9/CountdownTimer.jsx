import { useEffect, useState } from 'react';
import { Clock } from 'lucide-react';
import { cx } from '../../utils/index.js';

function diff(target) {
  const ms = Math.max(0, new Date(target).getTime() - Date.now());
  const d = Math.floor(ms / 86400000);
  const h = Math.floor((ms / 3600000) % 24);
  const m = Math.floor((ms / 60000) % 60);
  const s = Math.floor((ms / 1000) % 60);
  return { d, h, m, s, done: ms === 0 };
}

export default function CountdownTimer({ target, label = 'Voting closes in', compact = false, className = '' }) {
  const [t, setT] = useState(() => diff(target));
  useEffect(() => {
    const id = setInterval(() => setT(diff(target)), 1000);
    return () => clearInterval(id);
  }, [target]);

  if (compact) {
    return (
      <span className={cx('inline-flex items-center gap-1.5 text-xs text-muted tabular-nums', className)}>
        <Clock size={12} /> {t.d}d {t.h}h {t.m}m
      </span>
    );
  }

  return (
    <div className={cx('rounded-xl border border-border bg-surface p-4', className)}>
      <div className="flex items-center gap-2 text-xs uppercase text-subtle mb-3">
        <Clock size={12} /> {label}
      </div>
      <div className="grid grid-cols-4 gap-2 text-center" role="timer" aria-live="polite">
        <Cell value={t.d} label="Days" />
        <Cell value={t.h} label="Hours" />
        <Cell value={t.m} label="Min" />
        <Cell value={t.s} label="Sec" />
      </div>
    </div>
  );
}

function Cell({ value, label }) {
  return (
    <div className="rounded-lg bg-elevated py-2">
      <p className="text-xl sm:text-2xl font-semibold text-fg tabular-nums">{String(value).padStart(2, '0')}</p>
      <p className="text-[10px] uppercase text-subtle mt-0.5">{label}</p>
    </div>
  );
}
