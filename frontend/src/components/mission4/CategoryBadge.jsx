import { memo } from 'react';
import Badge from '../ui/Badge.jsx';
import { MISSION4_CATEGORIES } from '../../utils/missionApiMaps.js';

function CategoryBadge({ category }) {
  const c = MISSION4_CATEGORIES.find((x) => x.key === category) || MISSION4_CATEGORIES[0];
  if (!c) return null;
  const tone = c.type === 'income' ? 'success' : c.type === 'expense' ? 'danger' : 'neutral';
  return (
    <Badge tone={tone} size="sm">
      {c.icon && <span className="mr-1">{c.icon}</span>}
      {c.label}
    </Badge>
  );
}

export default memo(CategoryBadge);
