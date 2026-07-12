import { cx } from '../../utils/index.js';

export default function Spinner({ className = '', size = 20 }) {
  return (
    <div
      style={{ width: size, height: size }}
      className={cx('inline-block animate-spin rounded-full border-2 border-border border-t-brand', className)}
    />
  );
}
