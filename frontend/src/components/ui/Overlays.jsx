import { useState } from 'react';
import { cx } from '../../utils/index.js';

export function Tooltip({ label, children, className = '' }) {
  const [open, setOpen] = useState(false);
  return (
    <span
      className={cx('relative inline-flex', className)}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
    >
      {children}
      {open && (
        <span className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-fg text-bg text-xs px-2 py-1 shadow-md z-40">
          {label}
        </span>
      )}
    </span>
  );
}

export function Dropdown({ trigger, items = [], align = 'right' }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative inline-block">
      <button onClick={() => setOpen((v) => !v)} className="inline-flex">{trigger}</button>
      {open && (
        <>
          <div className="fixed inset-0 z-30" onClick={() => setOpen(false)} />
          <div
            className={cx(
              'absolute z-40 mt-2 min-w-[180px] rounded-lg border border-border bg-elevated shadow-lg py-1',
              align === 'right' ? 'right-0' : 'left-0'
            )}
          >
            {items.map((it, i) => (
              <button
                key={i}
                onClick={() => { it.onClick?.(); setOpen(false); }}
                className="w-full text-left px-3 py-1.5 text-sm text-fg hover:bg-surface flex items-center gap-2"
              >
                {it.icon}{it.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export function Popover({ trigger, children }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative inline-block">
      <button onClick={() => setOpen((v) => !v)}>{trigger}</button>
      {open && (
        <>
          <div className="fixed inset-0 z-30" onClick={() => setOpen(false)} />
          <div className="absolute z-40 mt-2 right-0 w-72 rounded-lg border border-border bg-elevated shadow-lg p-3">
            {children}
          </div>
        </>
      )}
    </div>
  );
}
