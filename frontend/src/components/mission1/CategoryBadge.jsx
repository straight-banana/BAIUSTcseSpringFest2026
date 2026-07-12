import Badge from '../ui/Badge.jsx';
import { findCategory } from '../../mocks/data/complaints.js';

export default function CategoryBadge({ category }) {
  const c = findCategory(category);
  return <Badge tone={c.tone}>{c.label}</Badge>;
}
