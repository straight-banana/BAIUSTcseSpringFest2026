import Badge from '../ui/Badge.jsx';
import { findStatus } from '../../mocks/data/complaints.js';

export default function StatusBadge({ status }) {
  const s = findStatus(status);
  return <Badge tone={s.tone}>{s.label}</Badge>;
}
