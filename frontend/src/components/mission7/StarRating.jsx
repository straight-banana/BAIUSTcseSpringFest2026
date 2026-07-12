import { useState } from 'react';
import { Star } from 'lucide-react';
import { cx } from '../../utils/index.js';

export default function StarRating({
  value = 0,
  onChange,
  size = 20,
  readOnly = false,
  showValue = false,
  ariaLabel = 'Rating',
}) {
  const [hover, setHover] = useState(0);
  const display = hover || value;
  return (
    <div className="inline-flex items-center gap-1" role="group" aria-label={ariaLabel}>
      {[1, 2, 3, 4, 5].map((n) => {
        const active = n <= display;
        const partial = !active && n - 0.5 <= display;
        return (
          <button
            key={n}
            type="button"
            disabled={readOnly}
            onMouseEnter={() => !readOnly && setHover(n)}
            onMouseLeave={() => !readOnly && setHover(0)}
            onClick={() => !readOnly && onChange?.(n)}
            aria-label={`${n} star${n > 1 ? 's' : ''}`}
            className={cx(
              'transition-transform',
              !readOnly && 'hover:scale-110 cursor-pointer',
              readOnly && 'cursor-default'
            )}
          >
            <Star
              size={size}
              className={cx(
                active || partial ? 'text-warning' : 'text-border',
                'transition-colors'
              )}
              fill={active ? 'currentColor' : partial ? 'currentColor' : 'none'}
              strokeWidth={1.5}
            />
          </button>
        );
      })}
      {showValue && (
        <span className="ml-1.5 text-sm font-medium text-fg tabular-nums">
          {Number(value).toFixed(1)}
        </span>
      )}
    </div>
  );
}
