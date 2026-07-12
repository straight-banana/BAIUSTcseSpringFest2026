import Card from '../common/Card.jsx';
import { LOCATIONS, MAP_PINS, findLocation } from '../../mocks/data/mission5.js';

export default function CampusMap() {
  return (
    <Card className="p-5">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-sm font-semibold text-fg">Campus Map</h3>
          <p className="text-xs text-muted">Placeholder — live location coming soon.</p>
        </div>
        <div className="flex items-center gap-3 text-[11px] text-muted">
          <span className="inline-flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-full bg-danger animate-pulse" /> Active</span>
          <span className="inline-flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-full bg-subtle" /> Idle</span>
        </div>
      </div>
      <div className="relative w-full aspect-[16/10] rounded-lg border border-border overflow-hidden bg-brand-soft/30">
        {/* Fake building shapes */}
        <svg className="absolute inset-0 h-full w-full" preserveAspectRatio="none" viewBox="0 0 100 60">
          <defs>
            <pattern id="grid5" width="5" height="5" patternUnits="userSpaceOnUse">
              <path d="M 5 0 L 0 0 0 5" fill="none" stroke="rgb(var(--border))" strokeWidth="0.2" />
            </pattern>
          </defs>
          <rect width="100" height="60" fill="url(#grid5)" />
          <rect x="10" y="10" width="18" height="14" fill="rgb(var(--surface))" stroke="rgb(var(--border))" strokeWidth="0.4" rx="1" />
          <rect x="45" y="8"  width="22" height="16" fill="rgb(var(--surface))" stroke="rgb(var(--border))" strokeWidth="0.4" rx="1" />
          <rect x="70" y="30" width="20" height="14" fill="rgb(var(--surface))" stroke="rgb(var(--border))" strokeWidth="0.4" rx="1" />
          <rect x="30" y="38" width="20" height="14" fill="rgb(var(--surface))" stroke="rgb(var(--border))" strokeWidth="0.4" rx="1" />
          <rect x="5"  y="45" width="20" height="12" fill="rgb(var(--surface))" stroke="rgb(var(--border))" strokeWidth="0.4" rx="1" />
        </svg>
        {MAP_PINS.map((p, i) => {
          const loc = findLocation(p.loc);
          return (
            <div key={i} className="absolute -translate-x-1/2 -translate-y-full" style={{ left: `${p.x}%`, top: `${p.y}%` }}>
              <div className="relative flex flex-col items-center">
                <span className={`text-[10px] px-1.5 py-0.5 rounded-md bg-elevated border border-border shadow-sm whitespace-nowrap mb-1 ${p.active ? 'text-danger' : 'text-muted'}`}>
                  {loc.icon} {loc.label}
                </span>
                <span className={`h-4 w-4 rounded-full ring-4 ${p.active ? 'bg-danger ring-danger/30 animate-pulse' : 'bg-subtle ring-subtle/20'}`} />
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-3 flex flex-wrap gap-2 text-[11px] text-muted">
        {LOCATIONS.map((l) => (
          <span key={l.key} className="px-2 py-1 rounded-md border border-border bg-surface">
            {l.icon} {l.label}
          </span>
        ))}
      </div>
    </Card>
  );
}
