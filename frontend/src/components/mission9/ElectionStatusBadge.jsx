import { Play, Pause, CheckCircle2, Clock, FileText } from 'lucide-react';
import Badge from '../ui/Badge.jsx';

const MAP = {
  draft:     { tone: 'neutral', icon: <FileText size={11} className="mr-1" />, label: 'Draft' },
  active:    { tone: 'success', icon: <Play size={11} className="mr-1" />,     label: 'Live' },
  paused:    { tone: 'warning', icon: <Pause size={11} className="mr-1" />,    label: 'Paused' },
  closed:    { tone: 'neutral', icon: <Clock size={11} className="mr-1" />,    label: 'Closed' },
  published: { tone: 'brand',   icon: <CheckCircle2 size={11} className="mr-1" />, label: 'Published' },
};

export default function ElectionStatusBadge({ status, className = '' }) {
  const m = MAP[status] || MAP.draft;
  return (
    <Badge tone={m.tone} className={className}>
      {m.icon}{m.label}
    </Badge>
  );
}
