import { cx } from '../../utils/index.js';

const tones = {
  info: 'bg-brand-soft/60 text-brand border-brand/20',
  success: 'bg-success/10 text-success border-success/20',
  warning: 'bg-warning/10 text-warning border-warning/20',
  danger: 'bg-danger/10 text-danger border-danger/20',
};

export default function Alert({ tone = 'info', title, children, className = '' }) {
  return (
    <div className={cx('rounded-lg border px-3.5 py-3 text-sm', tones[tone], className)}>
      {title && <p className="font-medium mb-0.5">{title}</p>}
      {children && <p className="opacity-90">{children}</p>}
    </div>
  );
}
