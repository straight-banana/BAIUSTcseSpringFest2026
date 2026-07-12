import Badge from '../ui/Badge.jsx';
import { findSeverity } from '../../mocks/data/mission5.js';

export default function SeverityBadge({ severity }) {
  const s = findSeverity(severity);
  return <Badge tone={s.tone}>{s.label}</Badge>;
}
