import Badge from '../ui/Badge.jsx';
import { sosStatusBadge } from '../../utils/missionApiMaps.js';

export default function SosStatusBadge({ status }) {
  const s = sosStatusBadge(status);
  return <Badge tone={s.tone}>{s.label}</Badge>;
}
