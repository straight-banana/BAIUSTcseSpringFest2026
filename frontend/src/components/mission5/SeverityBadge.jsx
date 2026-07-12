import Badge from '../ui/Badge.jsx';
import { sosSeverityBadge } from '../../utils/missionApiMaps.js';

export default function SeverityBadge({ severity }) {
  const s = sosSeverityBadge(severity);
  return <Badge tone={s.tone}>{s.label}</Badge>;
}
