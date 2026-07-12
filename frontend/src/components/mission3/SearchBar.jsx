import { Search } from 'lucide-react';
import { cx } from '../../utils/index.js';

export default function SearchBar({ value, onChange, placeholder = 'Search...', className = '' }) {
  return (
    <div className={cx('relative', className)}>
      <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="h-9 w-full rounded-md border border-border bg-surface pl-9 pr-3 text-sm text-fg placeholder:text-subtle focus:outline-none focus:ring-2 focus:ring-brand/40"
      />
    </div>
  );
}
