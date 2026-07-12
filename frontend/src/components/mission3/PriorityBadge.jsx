import Badge from '../ui/Badge.jsx';
import { findPriority } from '../../mocks/data/mission3.js';

export default function PriorityBadge({ value }) {
  const p = findPriority(value);
  return <Badge tone={p.tone}>{p.label} priority</Badge>;
}
