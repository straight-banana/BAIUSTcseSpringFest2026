import { cx } from '../../utils/index.js';

export default function Pagination({ page = 1, total = 1, onChange }) {
  const pages = Array.from({ length: total }, (_, i) => i + 1);
  return (
    <nav className="inline-flex items-center gap-1" aria-label="Pagination">
      <button
        onClick={() => onChange?.(Math.max(1, page - 1))}
        disabled={page === 1}
        className="px-2 h-8 rounded-md text-sm text-muted hover:text-fg disabled:opacity-40"
      >
        Prev
      </button>
      {pages.map((p) => (
        <button
          key={p}
          onClick={() => onChange?.(p)}
          className={cx(
            'h-8 min-w-8 px-2 rounded-md text-sm',
            p === page ? 'bg-brand text-brand-fg' : 'text-muted hover:text-fg hover:bg-surface'
          )}
        >
          {p}
        </button>
      ))}
      <button
        onClick={() => onChange?.(Math.min(total, page + 1))}
        disabled={page === total}
        className="px-2 h-8 rounded-md text-sm text-muted hover:text-fg disabled:opacity-40"
      >
        Next
      </button>
    </nav>
  );
}
