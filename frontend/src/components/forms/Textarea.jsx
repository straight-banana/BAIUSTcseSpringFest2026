import { cx } from '../../utils/index.js';

export default function Textarea({ label, hint, error, className = '', id, ...props }) {
  const tid = id || props.name;
  return (
    <div className="space-y-1.5">
      {label && (
        <label htmlFor={tid} className="block text-xs font-medium text-fg">{label}</label>
      )}
      <textarea
        id={tid}
        rows={4}
        className={cx(
          'w-full rounded-md border bg-surface px-3 py-2 text-sm text-fg placeholder:text-subtle',
          'transition-colors focus:outline-none focus:ring-2 focus:ring-brand/40 focus:border-brand',
          error ? 'border-danger' : 'border-border',
          className
        )}
        {...props}
      />
      {(hint || error) && (
        <p className={cx('text-xs', error ? 'text-danger' : 'text-muted')}>{error || hint}</p>
      )}
    </div>
  );
}
