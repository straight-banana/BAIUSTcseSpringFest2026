import Badge from '../ui/Badge.jsx';
import { normalizeComplaintStatus } from '../../utils/missionApiMaps.js';

export default function StatusBadge({ status }) {
  const s = normalizeComplaintStatus(status);
  return <Badge tone={s.tone}>{s.label}</Badge>;
}
