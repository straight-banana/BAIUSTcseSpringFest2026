import { memo } from 'react';
import { cx } from '../../utils/index.js';
import { formatBDT } from '../../mocks/data/mission4.js';

function BudgetProgress({ label, spent, budget, tone = 'brand' }) {
  const pct = Math.min(100, Math.round((spent / budget) * 100));
  const overshoot = pct >= 90;
  return (
    <div>
      <div className="flex items-baseline justify-between mb-1.5">
        <span className="text-xs font-medium text-muted">{label}</span>
        <span className="text-xs text-subtle">
          <span className="font-semibold text-fg">{formatBDT(spent)}</span>
          {' / '}{formatBDT(budget)}
        </span>
      </div>
      <div className="h-2 w-full rounded-full bg-border overflow-hidden">
        <div
          className={cx(
            'h-full rounded-full transition-all',
            overshoot ? 'bg-danger' : tone === 'success' ? 'bg-success' : 'bg-brand'
          )}
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="mt-1 text-[11px] text-subtle">{pct}% used</p>
    </div>
  );
}

export default memo(BudgetProgress);
