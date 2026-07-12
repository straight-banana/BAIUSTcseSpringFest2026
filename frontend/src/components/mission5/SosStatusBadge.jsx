import Badge from '../ui/Badge.jsx';
import { findStatus } from '../../mocks/data/mission5.js';

export default function SosStatusBadge({ status }) {
  const s = findStatus(status);
  return <Badge tone={s.tone}>{s.label}</Badge>;
}
