import { cx } from '../../utils/index.js';

/**
 * Card = a case file on the bulletin. Sharp corners, single ink hairline,
 * no drop shadow. Optional top eyebrow rail encodes what kind of record
 * this is (STRIKE / SOS / LEDGER / VOTE …) so cards don't all look alike.
 */
export default function Card({
  children,
  className = '',
  as: Tag = 'div',
  eyebrow,
  ref,           // stamped case-file reference, e.g. "CASE #2417"
  tone = 'default', // 'default' | 'ink' | 'ochre' | 'stamp'
  ...rest
}) {
  const toneRail = {
    default: 'bg-ink/15',
    ink: 'bg-ink',
    ochre: 'bg-ochre',
    stamp: 'bg-danger',
  }[tone];

  return (
    <Tag
      className={cx(
        'relative border border-ink/15 bg-elevated rounded-sm',
        className
      )}
      {...rest}
    >
      {(eyebrow || ref) && (
        <div className="flex items-center justify-between gap-4 border-b border-ink/10 px-4 py-2">
          <p className="eyebrow truncate">{eyebrow}</p>
          {ref && <p className="font-mono text-[10px] tracking-wider text-ink/60">{ref}</p>}
        </div>
      )}
      <div aria-hidden className={cx('absolute left-0 top-0 h-full w-[3px]', toneRail)} />
      {children}
    </Tag>
  );
}

export function CardHeader({ children, className = '' }) {
  return <div className={cx('px-5 pt-5 pb-3', className)}>{children}</div>;
}
export function CardBody({ children, className = '' }) {
  return <div className={cx('px-5 py-4', className)}>{children}</div>;
}
export function CardFooter({ children, className = '' }) {
  return <div className={cx('px-5 py-3 border-t border-ink/10', className)}>{children}</div>;
}
