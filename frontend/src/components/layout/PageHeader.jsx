import { cx } from '../../utils/index.js';

/**
 * Page header — editorial style: mono eyebrow + big Archivo Black title,
 * with an ink hairline underscore. No filled icon tiles, no rounded chips.
 */
export default function PageHeader({ title, subtitle, actions, eyebrow, className = '' }) {
  return (
    <div className={cx('mb-6 border-b rule-ink pb-5', className)}>
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-end gap-4">
        <div className="min-w-0">
          {eyebrow && <p className="eyebrow mb-1.5">{eyebrow}</p>}
          <h1 className="font-display text-2xl sm:text-3xl leading-[1.05] text-ink truncate">
            {title}
          </h1>
          {subtitle && <p className="mt-2 text-sm text-muted max-w-2xl">{subtitle}</p>}
        </div>
        {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
      </div>
    </div>
  );
}
