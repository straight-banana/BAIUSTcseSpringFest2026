import Card from '../common/Card.jsx';
import Badge from '../ui/Badge.jsx';
import { AlertTriangle, Gavel } from 'lucide-react';
import { cx } from '../../utils/index.js';

const tone = (strikes) => {
  if (strikes <= 0) return { text: 'text-success', bg: 'bg-success', label: 'Clean record', chip: 'success' };
  if (strikes === 1) return { text: 'text-warning', bg: 'bg-warning', label: 'First warning', chip: 'warning' };
  if (strikes === 2) return { text: 'text-warning', bg: 'bg-warning', label: 'Second warning — final', chip: 'warning' };
  return { text: 'text-danger', bg: 'bg-danger', label: 'Impeachment triggered', chip: 'danger' };
};

export default function StrikeDashboard({ strikes = 0, max = 3, subject = 'Kuddus' }) {
  const t = tone(strikes);
  const left = Math.max(0, max - strikes);
  const pct = Math.min(100, (strikes / max) * 100);

  return (
    <Card className="p-5 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-start gap-3 min-w-0">
          <div className={cx('h-11 w-11 rounded-xl flex items-center justify-center text-white shrink-0', t.bg)}>
            <Gavel size={20} />
          </div>
          <div className="min-w-0">
            <p className="text-xs uppercase tracking-wider text-muted font-mono">Impeachment Meter</p>
            <h3 className="text-lg font-semibold text-fg mt-0.5">
              Warnings: <span className={t.text}>{strikes}</span>
              <span className="text-muted"> / {max}</span>
            </h3>
            <p className="text-xs text-muted mt-1">Tracked against captain: <span className="text-fg font-medium">{subject}</span></p>
          </div>
        </div>
        <Badge tone={t.chip}>{t.label}</Badge>
      </div>

      <div className="mt-5">
        <div className="h-3 w-full rounded-full bg-elevated overflow-hidden">
          <div
            className={cx('h-full rounded-full transition-all duration-500', t.bg)}
            style={{ width: `${pct}%` }}
          />
        </div>
        <div className="mt-2 flex justify-between text-[11px] text-muted font-mono">
          <span>0</span><span>1</span><span>2</span><span>3 · Impeachment</span>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between text-sm">
        <span className="text-muted">Strikes left until impeachment</span>
        <span className={cx('font-semibold', t.text)}>{left}</span>
      </div>

      <div className="mt-4 rounded-lg border border-border bg-surface p-3 flex gap-2.5">
        <AlertTriangle size={14} className="text-warning mt-0.5 shrink-0" />
        <p className="text-xs text-muted leading-relaxed">
          Strikes are issued only after a complaint is <span className="text-fg font-medium">validated</span>{' '}
          by a teacher. At 3 validated strikes, an impeachment vote opens automatically.
        </p>
      </div>
    </Card>
  );
}
