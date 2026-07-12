import ConstraintBadge from './ConstraintBadge.jsx';
import { CONSTRAINT_TYPES } from '../../mocks/data/mission2.js';

export default function ClassroomLegend() {
  return (
    <div className="rounded-xl border border-border bg-surface p-4">
      <p className="text-xs font-semibold text-fg mb-3">Legend</p>
      <ul className="space-y-2">
        {CONSTRAINT_TYPES.map((c) => (
          <li key={c.id} className="flex items-start gap-2">
            <ConstraintBadge type={c.id} />
            <span className="text-xs text-muted">{c.desc}</span>
          </li>
        ))}
        <li className="flex items-start gap-2 pt-2 border-t border-border">
          <span className="mt-0.5 inline-block h-3 w-6 rounded border border-dashed border-border bg-surface/50" />
          <span className="text-xs text-muted">Empty seat</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="mt-0.5 inline-block h-3 w-6 rounded border border-warning bg-warning/10" />
          <span className="text-xs text-muted">Highlighted (line-of-sight target)</span>
        </li>
      </ul>
    </div>
  );
}
