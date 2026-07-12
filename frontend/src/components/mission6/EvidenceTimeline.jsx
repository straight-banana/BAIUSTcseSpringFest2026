import Badge from '../ui/Badge.jsx';
import { EVIDENCE_KINDS } from '../../mocks/data/mission6.js';

const relTone = { high: 'success', medium: 'warning', low: 'danger' };

export default function EvidenceTimeline({ items = [] }) {
  return (
    <ol className="relative border-l-2 border-border pl-5 space-y-4">
      {items.map((it, i) => {
        const k = EVIDENCE_KINDS[it.kind] ?? EVIDENCE_KINDS.notice;
        return (
          <li key={i} className="relative">
            <span className="absolute -left-[29px] top-1 flex h-6 w-6 items-center justify-center rounded-full bg-brand-soft text-brand text-xs border border-border">
              {k.icon}
            </span>
            <div className="rounded-lg border border-border bg-surface p-4">
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div>
                  <div className="text-sm font-semibold text-fg">{it.title}</div>
                  <div className="text-xs text-muted mt-0.5">{k.label} · {it.date}</div>
                </div>
                <Badge tone={relTone[k.reliability]}>{k.reliability} reliability</Badge>
              </div>
              <p className="text-xs text-muted mt-2 leading-relaxed">{it.desc}</p>
              <button className="mt-3 text-xs text-brand hover:underline">Read source →</button>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
