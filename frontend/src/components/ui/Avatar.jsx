import { cx } from '../../utils/index.js';

export default function Avatar({ name = '?', src, size = 32, className = '' }) {
  const initials = name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase();
  return (
    <div
      style={{ width: size, height: size }}
      className={cx(
        'inline-flex items-center justify-center rounded-full bg-brand-soft text-brand text-xs font-semibold overflow-hidden',
        className
      )}
    >
      {src ? <img src={src} alt={name} className="h-full w-full object-cover" /> : initials}
    </div>
  );
}
