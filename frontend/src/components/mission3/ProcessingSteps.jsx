import { Check, Loader2 } from 'lucide-react';
import { cx } from '../../utils/index.js';

export default function ProcessingSteps({ steps, activeIndex }) {
  return (
    <ol className="space-y-3">
      {steps.map((s, i) => {
        const done = i < activeIndex;
        const active = i === activeIndex;
        const pending = i > activeIndex;
        return (
          <li
            key={s.key}
            className={cx(
              'flex items-start gap-3 rounded-lg border p-3 transition-colors',
              done && 'border-success/40 bg-success/5',
              active && 'border-brand/60 bg-brand-soft/40',
              pending && 'border-border bg-surface'
            )}
          >
            <div
              className={cx(
                'h-8 w-8 rounded-lg flex items-center justify-center shrink-0',
                done && 'bg-success text-white',
                active && 'bg-brand text-brand-fg',
                pending && 'bg-elevated text-muted'
              )}
            >
              {done ? <Check size={16} /> : active ? <Loader2 size={16} className="animate-spin" /> : <span className="text-xs font-mono">{i + 1}</span>}
            </div>
            <div className="min-w-0 flex-1">
              <p className={cx('text-sm font-medium', pending ? 'text-muted' : 'text-fg')}>{s.label}</p>
              <p className="text-xs text-muted mt-0.5">{s.detail}</p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
