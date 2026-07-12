import { ShieldCheck, Star, Eye, Clock, XCircle } from 'lucide-react';
import Badge from '../ui/Badge.jsx';

const MAP = {
  recommended:  { tone: 'success', icon: <ShieldCheck size={11} className="mr-1" />, label: 'Recommended' },
  watch:        { tone: 'warning', icon: <Eye size={11} className="mr-1" />,         label: 'Watchlist' },
  pending:      { tone: 'neutral', icon: <Clock size={11} className="mr-1" />,       label: 'Pending' },
  'not-eligible': { tone: 'danger', icon: <XCircle size={11} className="mr-1" />,    label: 'Not eligible' },
  approved:     { tone: 'success', icon: <ShieldCheck size={11} className="mr-1" />, label: 'Approved' },
  rejected:     { tone: 'danger',  icon: <XCircle size={11} className="mr-1" />,     label: 'Rejected' },
  elite:        { tone: 'brand',   icon: <Star size={11} className="mr-1" />,        label: 'Elite Leader' },
};

export default function RecommendationBadge({ status, label, className = '' }) {
  const m = MAP[status] || { tone: 'neutral', label: label || status };
  return (
    <Badge tone={m.tone} className={className}>
      {m.icon}{label || m.label}
    </Badge>
  );
}
