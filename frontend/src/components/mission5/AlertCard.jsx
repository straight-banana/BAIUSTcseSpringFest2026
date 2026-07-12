import Card from '../common/Card.jsx';
import SosStatusBadge from './SosStatusBadge.jsx';
import SeverityBadge from './SeverityBadge.jsx';
import { findLocation, findType } from '../../mocks/data/mission5.js';
import { Clock, MapPin } from 'lucide-react';

export default function AlertCard({ alert, onClick }) {
  const loc = findLocation(alert.location);
  const type = findType(alert.type);
  return (
    <Card
      onClick={() => onClick?.(alert)}
      className="p-4 cursor-pointer hover:border-brand/60 transition-colors"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-[11px] font-mono text-subtle">{alert.id}</p>
          <h4 className="text-sm font-semibold text-fg truncate mt-0.5">
            <span className="mr-1">{type.icon}</span>{type.label}
          </h4>
        </div>
        <SeverityBadge severity={alert.severity} />
      </div>
      <p className="text-xs text-muted mt-2 line-clamp-2">{alert.description}</p>
      <div className="mt-3 flex items-center justify-between text-[11px] text-subtle">
        <span className="inline-flex items-center gap-1"><MapPin size={11} /> {loc.icon} {loc.label}</span>
        <span className="inline-flex items-center gap-1"><Clock size={11} /> {new Date(alert.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
      </div>
      <div className="mt-2"><SosStatusBadge status={alert.status} /></div>
    </Card>
  );
}
