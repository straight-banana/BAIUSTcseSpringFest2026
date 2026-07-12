import { cx } from '../../utils/index.js';

export default function Skeleton({ className = '' }) {
  return <div className={cx('animate-pulse rounded-md bg-border/70', className)} />;
}
