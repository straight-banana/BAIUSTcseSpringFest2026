import Badge from '../ui/Badge.jsx';
import { normalizeComplaintCategory } from '../../utils/missionApiMaps.js';

export default function CategoryBadge({ category }) {
  const c = normalizeComplaintCategory(category);
  return <Badge tone={c.tone}>{c.label}</Badge>;
}
