import { memo } from 'react';
import Card from '../common/Card.jsx';
import { cx } from '../../utils/index.js';
import { TrendingUp, TrendingDown } from 'lucide-react';

function KpiCard({ icon, label, value, delta, hint, tone = 'brand' }) {
  const positive = (delta ?? 0) >= 0;
  const toneCls = tone === 'danger' ? 'bg-danger/10 text-danger'
    : tone === 'success' ? 'bg-success/10 text-success'
    : tone === 'warning' ? 'bg-warning/10 text-warning'
    : 'bg-brand-soft text-brand';
  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-3">
        <div className={cx('h-8 w-8 rounded-lg flex items-center justify-center', toneCls)}>{icon}</div>
        {delta !== undefined && (
          <span className={cx('inline-flex items-center gap-1 text-[11px] font-medium', positive ? 'text-success' : 'text-danger')}>
            {positive ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
            {Math.abs(delta).toFixed(1)}%
          </span>
        )}
      </div>
      <p className="text-[11px] uppercase text-subtle">{label}</p>
      <p className="mt-1 text-xl font-semibold text-fg tracking-tight">{value}</p>
      {hint && <p className="mt-1 text-[11px] text-subtle">{hint}</p>}
    </Card>
  );
}

export default memo(KpiCard);
