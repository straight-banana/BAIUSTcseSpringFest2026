import { useState, Children } from 'react';
import { cx } from '../../utils/index.js';

export function Tabs({ tabs = [], defaultValue, onChange, className = '' }) {
  const [active, setActive] = useState(defaultValue ?? tabs[0]?.value);
  return (
    <div className={className}>
      <div className="flex gap-1 border-b border-border">
        {tabs.map((t) => (
          <button
            key={t.value}
            onClick={() => { setActive(t.value); onChange?.(t.value); }}
            className={cx(
              'px-3 py-2 text-sm font-medium -mb-px border-b-2 transition-colors',
              active === t.value
                ? 'border-brand text-fg'
                : 'border-transparent text-muted hover:text-fg'
            )}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div className="pt-4">{tabs.find((t) => t.value === active)?.content}</div>
    </div>
  );
}

export function Accordion({ items = [] }) {
  const [open, setOpen] = useState(null);
  return (
    <div className="rounded-lg border border-border divide-y divide-border">
      {items.map((it, i) => (
        <div key={i}>
          <button
            onClick={() => setOpen(open === i ? null : i)}
            className="w-full flex items-center justify-between px-4 py-3 text-sm text-fg hover:bg-surface"
          >
            <span className="font-medium">{it.title}</span>
            <span className="text-muted text-xs">{open === i ? '−' : '+'}</span>
          </button>
          {open === i && <div className="px-4 pb-4 text-sm text-muted">{it.content}</div>}
        </div>
      ))}
    </div>
  );
}

export default Tabs;
