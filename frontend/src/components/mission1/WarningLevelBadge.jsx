import Badge from '../ui/Badge.jsx';
import { ShieldCheck, Eye, AlertTriangle, Siren } from 'lucide-react';

const ICONS = {
  safe: <ShieldCheck size={12} />,
  observation: <Eye size={12} />,
  warning: <AlertTriangle size={12} />,
  critical: <Siren size={12} />,
};

export default function WarningLevelBadge({ level }) {
  if (!level) return null;
  return (
    <Badge tone={level.tone}>
      <span className="inline-flex items-center gap-1">
        {ICONS[level.key]} {level.label}
      </span>
    </Badge>
  );
}
