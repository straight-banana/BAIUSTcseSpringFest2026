import { cx } from '../../utils/index.js';

export default function Timeline({ items = [] }) {
  return (
    <ol className="relative border-l border-border ml-2">
      {items.map((it, i) => (
        <li key={i} className="pl-4 pb-4 last:pb-0 relative">
          <span
            className={cx(
              'absolute -left-[5px] top-1 h-2.5 w-2.5 rounded-full ring-2 ring-bg',
              it.tone === 'success' ? 'bg-success' :
              it.tone === 'danger' ? 'bg-danger' :
              it.tone === 'warning' ? 'bg-warning' : 'bg-brand'
            )}
          />
          <p className="text-sm text-fg">{it.title}</p>
          {it.body && <p className="text-xs text-muted mt-0.5">{it.body}</p>}
          {it.when && <p className="text-[11px] text-subtle mt-1 font-mono">{it.when}</p>}
        </li>
      ))}
    </ol>
  );
}
