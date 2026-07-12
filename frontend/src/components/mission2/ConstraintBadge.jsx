import Badge from '../ui/Badge.jsx';
import { Eye, Ear, Lock, ArrowUpToLine, Target } from 'lucide-react';

const MAP = {
  vision:   { tone: 'brand',   label: 'Vision Priority',    Icon: Eye },
  hearing:  { tone: 'warning', label: 'Hearing Priority',   Icon: Ear },
  reserved: { tone: 'neutral', label: 'Reserved',           Icon: Lock },
  front:    { tone: 'success', label: 'Front Row',          Icon: ArrowUpToLine },
  los:      { tone: 'danger',  label: 'Teacher Visibility', Icon: Target },
};

export default function ConstraintBadge({ type, compact = false }) {
  const cfg = MAP[type];
  if (!cfg) return null;
  const { tone, label, Icon } = cfg;
  return (
    <Badge tone={tone} className="gap-1">
      <Icon size={11} aria-hidden />
      {!compact && label}
    </Badge>
  );
}
