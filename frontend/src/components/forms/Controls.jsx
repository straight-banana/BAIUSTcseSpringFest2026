import { cx } from '../../utils/index.js';

export function Checkbox({ label, className = '', id, ...props }) {
  const cid = id || props.name;
  return (
    <label htmlFor={cid} className={cx('inline-flex items-center gap-2 cursor-pointer text-sm text-fg', className)}>
      <input
        id={cid}
        type="checkbox"
        className="h-4 w-4 rounded border-border text-brand focus:ring-brand/40"
        {...props}
      />
      {label}
    </label>
  );
}

export function Radio({ label, className = '', id, ...props }) {
  const rid = id || props.name;
  return (
    <label htmlFor={rid} className={cx('inline-flex items-center gap-2 cursor-pointer text-sm text-fg', className)}>
      <input
        id={rid}
        type="radio"
        className="h-4 w-4 border-border text-brand focus:ring-brand/40"
        {...props}
      />
      {label}
    </label>
  );
}

export function Switch({ label, checked, onChange, className = '' }) {
  return (
    <label className={cx('inline-flex items-center gap-2 cursor-pointer text-sm text-fg', className)}>
      <span
        role="switch"
        aria-checked={!!checked}
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === ' ') onChange?.(!checked); }}
        onClick={() => onChange?.(!checked)}
        className={cx(
          'relative inline-flex h-5 w-9 items-center rounded-full transition-colors',
          checked ? 'bg-brand' : 'bg-border'
        )}
      >
        <span
          className={cx(
            'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
            checked ? 'translate-x-4' : 'translate-x-0.5'
          )}
        />
      </span>
      {label}
    </label>
  );
}

export default Checkbox;
