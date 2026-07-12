import { useState, useRef, useEffect } from 'react';
import { Search, X, Sparkles } from 'lucide-react';
import { cx } from '../../utils/index.js';
import { SUGGESTIONS } from '../../mocks/data/mission6.js';

export default function SearchBar({ value, onChange, onSubmit, autoFocus = false, size = 'lg', placeholder }) {
  const [q, setQ] = useState(value ?? '');
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);

  useEffect(() => {
    const onDoc = (e) => { if (!wrapRef.current?.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);

  const filtered = q
    ? SUGGESTIONS.filter((s) => s.toLowerCase().includes(q.toLowerCase())).slice(0, 5)
    : SUGGESTIONS.slice(0, 5);

  const submit = (val) => {
    const s = (val ?? q).trim();
    if (!s) return;
    setOpen(false);
    onSubmit?.(s);
  };

  return (
    <div ref={wrapRef} className="relative w-full">
      <div
        className={cx(
          'flex items-center gap-2 rounded-full border border-border bg-surface shadow-xs focus-within:ring-2 focus-within:ring-brand/40 focus-within:border-brand transition-all',
          size === 'lg' ? 'h-14 px-5' : 'h-11 px-4'
        )}
      >
        <Search size={size === 'lg' ? 20 : 16} className="text-muted shrink-0" />
        <input
          autoFocus={autoFocus}
          value={q}
          onChange={(e) => { setQ(e.target.value); onChange?.(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          onKeyDown={(e) => e.key === 'Enter' && submit()}
          placeholder={placeholder ?? 'Ask anything about university rules, notices, or campus rumors...'}
          className={cx('flex-1 bg-transparent outline-none text-fg placeholder:text-muted', size === 'lg' ? 'text-base' : 'text-sm')}
          aria-label="Fact check search"
        />
        {q && (
          <button onClick={() => { setQ(''); onChange?.(''); }} className="text-muted hover:text-fg" aria-label="Clear">
            <X size={16} />
          </button>
        )}
        <button
          onClick={() => submit()}
          className={cx(
            'inline-flex items-center gap-1.5 rounded-full bg-brand text-brand-fg font-medium hover:brightness-110 transition',
            size === 'lg' ? 'h-10 px-5 text-sm' : 'h-8 px-3 text-xs'
          )}
        >
          <Sparkles size={size === 'lg' ? 14 : 12} /> Verify
        </button>
      </div>

      {open && filtered.length > 0 && (
        <div className="absolute z-20 left-0 right-0 mt-2 rounded-xl border border-border bg-surface shadow-lg overflow-hidden animate-fade-in">
          <div className="px-4 py-2 text-[10px] uppercase tracking-wider text-muted border-b border-border">Suggestions</div>
          {filtered.map((s) => (
            <button
              key={s}
              onClick={() => { setQ(s); submit(s); }}
              className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-fg hover:bg-elevated text-left"
            >
              <Search size={14} className="text-muted shrink-0" />
              <span className="truncate">{s}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
