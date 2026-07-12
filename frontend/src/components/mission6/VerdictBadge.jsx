import Badge from '../ui/Badge.jsx';
import { findVerdict } from '../../mocks/data/mission6.js';
import { cx } from '../../utils/index.js';

export default function VerdictBadge({ verdict, size = 'md', className = '' }) {
  const v = findVerdict(verdict);
  if (size === 'lg') {
    return (
      <div
        className={cx('inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-semibold border', className)}
        style={{ background: `${v.color}18`, color: v.color, borderColor: `${v.color}40` }}
      >
        <span className="text-base leading-none">{v.icon}</span>
        {v.label}
      </div>
    );
  }
  return (
    <Badge tone={v.tone} className={className}>
      <span className="mr-1">{v.icon}</span>{v.label}
    </Badge>
  );
}
