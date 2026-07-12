import { cx } from '../../utils/index.js';

export default function Input({ label, hint, error, className = '', id, leftIcon, ...props }) {
  const inputId = id || props.name;
  return (
    <div className="space-y-1.5">
      {label && (
        <label htmlFor={inputId} className="block text-xs font-medium text-fg">
          {label}
        </label>
      )}
      <div className="relative">
        {leftIcon && (
          <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted">{leftIcon}</span>
        )}
        <input
          id={inputId}
          className={cx(
            'w-full h-9 rounded-md border bg-surface px-3 text-sm text-fg placeholder:text-subtle',
            'transition-colors focus:outline-none focus:ring-2 focus:ring-brand/40 focus:border-brand',
            leftIcon && 'pl-8',
            error ? 'border-danger' : 'border-border',
            className
          )}
          {...props}
        />
      </div>
      {(hint || error) && (
        <p className={cx('text-xs', error ? 'text-danger' : 'text-muted')}>{error || hint}</p>
      )}
    </div>
  );
}
