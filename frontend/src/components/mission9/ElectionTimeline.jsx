import { Check, Circle, Loader2 } from 'lucide-react';
import { cx } from '../../utils/index.js';

export default function ElectionTimeline({ items = [] }) {
  return (
    <ol className="relative border-l border-border pl-5 space-y-4">
      {items.map((it, i) => {
        const done = it.status === 'done';
        const active = it.status === 'active';
        return (
          <li key={i} className="relative">
            <span
              className={cx(
                'absolute -left-[27px] top-0.5 h-4 w-4 rounded-full border-2 flex items-center justify-center',
                done && 'bg-success border-success text-white',
                active && 'bg-brand border-brand text-white',
                !done && !active && 'bg-surface border-border text-muted'
              )}
              aria-hidden
            >
              {done && <Check size={10} />}
              {active && <Loader2 size={10} className="animate-spin" />}
              {!done && !active && <Circle size={6} />}
            </span>
            <p className="text-sm font-medium text-fg">{it.label}</p>
            <p className="text-xs text-muted mt-0.5">
              {new Date(it.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
              {active && <span className="text-brand ml-2">· In progress</span>}
            </p>
          </li>
        );
      })}
    </ol>
  );
}
