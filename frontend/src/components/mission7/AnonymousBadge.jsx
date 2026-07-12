import { EyeOff } from 'lucide-react';
import { cx } from '../../utils/index.js';

export default function AnonymousBadge({ className = '' }) {
  return (
    <span
      className={cx(
        'inline-flex items-center gap-1 rounded-full border border-border bg-elevated px-2 py-0.5 text-[11px] font-medium text-muted',
        className
      )}
    >
      <EyeOff size={11} /> Anonymous
    </span>
  );
}
