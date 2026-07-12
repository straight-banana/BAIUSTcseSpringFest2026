import Card from '../common/Card.jsx';
import Badge from '../ui/Badge.jsx';
import { Sparkles } from 'lucide-react';
import { cx } from '../../utils/index.js';

export default function AIResponseCard({ title, subtitle, children, actions, className = '' }) {
  return (
    <Card
      className={cx(
        'relative overflow-hidden p-5 sm:p-6',
        'bg-gradient-to-br from-brand-soft/40 via-surface to-surface',
        className
      )}
    >
      <div className="pointer-events-none absolute -top-20 -right-20 h-56 w-56 rounded-full bg-brand/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-16 h-56 w-56 rounded-full bg-accent/20 blur-3xl" />
      <div className="relative">
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-start gap-3 min-w-0">
            <div className="h-9 w-9 rounded-lg bg-brand text-brand-fg flex items-center justify-center shrink-0">
              <Sparkles size={16} />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold text-fg">{title}</h3>
                <Badge tone="brand">AI</Badge>
              </div>
              {subtitle && <p className="text-xs text-muted mt-0.5">{subtitle}</p>}
            </div>
          </div>
          {actions}
        </div>
        <div className="text-sm text-fg/90 leading-relaxed">{children}</div>
      </div>
    </Card>
  );
}
