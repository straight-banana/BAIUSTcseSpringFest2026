import Card from '../common/Card.jsx';
import Badge from '../ui/Badge.jsx';
import { cx } from '../../utils/index.js';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

/**
 * StatCard — editorial ledger stat.
 * Mono eyebrow label, giant Archivo Black number, delta printed as a
 * signed data point. No filled tinted icon tile.
 */
export function StatCard({ icon, label, value, trend, hint }) {
  const positive = (trend ?? 0) >= 0;
  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-3">
        <p className="eyebrow">{label}</p>
        {icon && <span className="text-ink/40">{icon}</span>}
      </div>
      <p className="font-display text-3xl sm:text-4xl leading-none text-ink tabular-nums">{value}</p>
      <div className="mt-3 flex items-center justify-between">
        {trend !== undefined ? (
          <span className={cx('inline-flex items-center gap-1 font-mono text-[11px] tracking-wide', positive ? 'text-success' : 'text-danger')}>
            {positive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
            {positive ? '+' : '−'}{Math.abs(trend).toFixed(1)}%
          </span>
        ) : <span />}
        {hint && <p className="text-[11px] text-ink/50 truncate">{hint}</p>}
      </div>
    </Card>
  );
}

export function FeatureCard({ icon, title, description, action }) {
  return (
    <Card className="p-5 flex flex-col gap-4 h-full">
      <div className="text-ochre">{icon}</div>
      <div>
        <h3 className="font-display text-base text-ink">{title}</h3>
        <p className="text-sm text-muted mt-1 leading-relaxed">{description}</p>
      </div>
      {action && <div className="mt-auto pt-2">{action}</div>}
    </Card>
  );
}

export function InfoCard({ title, badge, children, footer }) {
  return (
    <Card>
      <div className="flex items-center justify-between px-5 pt-5 pb-3">
        <h3 className="font-display text-sm uppercase tracking-wide text-ink">{title}</h3>
        {badge && <Badge tone="neutral">{badge}</Badge>}
      </div>
      <div className="px-5 pb-4 text-sm text-muted">{children}</div>
      {footer && <div className="border-t border-ink/10 px-5 py-3 text-xs text-muted">{footer}</div>}
    </Card>
  );
}
