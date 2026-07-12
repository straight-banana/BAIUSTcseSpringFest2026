import { cx } from '../../utils/index.js';

export default function Select({ label, hint, error, children, className = '', id, ...props }) {
  const sid = id || props.name;
  return (
    <div className="space-y-1.5">
      {label && <label htmlFor={sid} className="block text-xs font-medium text-fg">{label}</label>}
      <select
        id={sid}
        className={cx(
          'w-full h-9 rounded-md border bg-surface px-3 text-sm text-fg',
          'focus:outline-none focus:ring-2 focus:ring-brand/40 focus:border-brand',
          error ? 'border-danger' : 'border-border',
          className
        )}
        {...props}
      >
        {children}
      </select>
      {(hint || error) && (
        <p className={cx('text-xs', error ? 'text-danger' : 'text-muted')}>{error || hint}</p>
      )}
    </div>
  );
}
