import { cx } from '../../utils/index.js';

/**
 * SIGNATURE COMPONENT — 3-Slot Warning Meter.
 *
 * Physical impeachment slots. Reused as the visual backbone across
 * every mission: complaints dashboard, captain header, mission tiles,
 * strike counter, profile pages, moderation queues.
 *
 * Rules of use:
 *  - Slots 1 & 2 fill in ochre. Slot 3 fills in the reserved stamp red
 *    because reaching 3/3 IS the live/urgent signal the palette reserves.
 *  - Empty slots are hatched ink outlines so they read as unfilled cells
 *    on Rashid Sir's register — not decorative placeholders.
 *  - Numbers are Archivo Black. Labels are JetBrains Mono uppercase.
 */
export default function WarningMeter({
  count = 0,
  total = 3,
  label = 'Warnings',
  subject,
  size = 'md',      // 'sm' | 'md' | 'lg'
  showNumber = true,
  animated = true,
  className = '',
}) {
  const filled = Math.max(0, Math.min(total, count));
  const impeached = filled >= total;

  const dims = {
    sm: { slot: 'h-6 w-6', num: 'text-2xl', gap: 'gap-1' },
    md: { slot: 'h-9 w-9', num: 'text-4xl', gap: 'gap-1.5' },
    lg: { slot: 'h-14 w-14', num: 'text-6xl sm:text-7xl', gap: 'gap-2' },
  }[size];

  return (
    <div className={cx('inline-flex flex-col', className)}>
      <div className="flex items-center justify-between mb-1.5">
        <p className="eyebrow">{label}</p>
        {showNumber && (
          <p
            className={cx(
              'font-mono text-[10px] tracking-widest uppercase',
              impeached ? 'text-danger' : 'text-muted'
            )}
          >
            {filled} / {total} {impeached && '· IMPEACHED'}
          </p>
        )}
      </div>

      <div className={cx('flex', dims.gap)}>
        {Array.from({ length: total }).map((_, i) => {
          const isFilled = i < filled;
          const isLastSlot = i === total - 1;
          const fillClass = isLastSlot
            ? 'bg-danger' // slot 3 uses the reserved LIVE red
            : 'bg-ochre';
          return (
            <div
              key={i}
              className={cx(
                'relative overflow-hidden border rule-ink-strong',
                dims.slot
              )}
              aria-label={`Slot ${i + 1} of ${total}${isFilled ? ' filled' : ''}`}
            >
              {/* hatched empty state */}
              {!isFilled && (
                <div
                  aria-hidden
                  className="absolute inset-0 opacity-25"
                  style={{
                    backgroundImage:
                      'repeating-linear-gradient(45deg, rgb(var(--rule)) 0 1px, transparent 1px 5px)',
                  }}
                />
              )}
              {/* filled state */}
              {isFilled && (
                <div
                  className={cx(
                    'absolute inset-0',
                    fillClass,
                    animated && 'slot-fill'
                  )}
                  style={animated ? { animationDelay: `${i * 90}ms` } : undefined}
                />
              )}
              {/* slot ordinal — the ledger reference */}
              <span
                className={cx(
                  'absolute inset-0 flex items-end justify-end pr-1 pb-0.5 font-mono text-[9px] font-bold tracking-wider',
                  isFilled ? (isLastSlot ? 'text-white/80' : 'text-ink/70') : 'text-ink/40'
                )}
              >
                {String(i + 1).padStart(2, '0')}
              </span>
            </div>
          );
        })}
      </div>

      {(subject || size === 'lg') && (
        <div className="mt-3 flex items-baseline gap-3">
          {size === 'lg' && (
            <p className={cx('font-display tabular-nums leading-none', dims.num, impeached ? 'text-danger' : 'text-ink')}>
              {filled}
              <span className="text-ink/25">/{total}</span>
            </p>
          )}
          {subject && (
            <p className="text-sm text-muted">
              <span className="text-ink font-semibold">{subject}</span>
              {impeached ? ' — case closed for impeachment review.' : ` — ${total - filled} slot${total - filled === 1 ? '' : 's'} remaining before impeachment.`}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
