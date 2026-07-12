import { cx } from '../../utils/index.js';

export default function PageContainer({ children, className = '' }) {
  return <div className={cx('mx-auto w-full max-w-7xl px-4 sm:px-6 py-6 sm:py-8', className)}>{children}</div>;
}
