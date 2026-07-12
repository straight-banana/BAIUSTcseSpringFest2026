import { cx } from '../../utils/index.js';

export default function HeightBadge({ height, className = '' }) {
  const tone =
    height < 155 ? 'bg-success/10 text-success'
    : height < 170 ? 'bg-brand-soft text-brand'
    : height < 185 ? 'bg-warning/10 text-warning'
    : 'bg-danger/10 text-danger';
  return (
    <span
      className={cx(
        'inline-flex items-center rounded-md px-1.5 py-0.5 text-[11px] font-medium tabular-nums',
        tone,
        className
      )}
      aria-label={`Height ${height} centimeters`}
    >
      {height}<span className="ml-0.5 opacity-70">cm</span>
    </span>
  );
}
