import Card from '../common/Card.jsx';
import { cx } from '../../utils/index.js';

export default function ElectionStatCard({ icon, label, value, hint, tone = 'brand' }) {
  const toneCls = tone === 'danger' ? 'bg-danger/10 text-danger'
    : tone === 'success' ? 'bg-success/10 text-success'
    : tone === 'warning' ? 'bg-warning/10 text-warning'
    : 'bg-brand-soft text-brand';
  return (
    <Card className="p-4">
      {icon && <div className={cx('h-8 w-8 rounded-lg flex items-center justify-center mb-3', toneCls)}>{icon}</div>}
      <p className="text-[11px] uppercase text-subtle">{label}</p>
      <p className="mt-1 text-xl font-semibold text-fg tracking-tight tabular-nums">{value}</p>
      {hint && <p className="mt-1 text-[11px] text-subtle">{hint}</p>}
    </Card>
  );
}
