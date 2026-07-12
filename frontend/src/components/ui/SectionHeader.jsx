import { cx } from '../../utils/index.js';

export default function SectionHeader({ title, description, action, className = '' }) {
  return (
    <div className={cx('flex items-start justify-between gap-4 mb-4', className)}>
      <div className="min-w-0">
        <h2 className="text-sm font-semibold text-fg tracking-tight">{title}</h2>
        {description && <p className="text-xs text-muted mt-0.5">{description}</p>}
      </div>
      {action}
    </div>
  );
}
