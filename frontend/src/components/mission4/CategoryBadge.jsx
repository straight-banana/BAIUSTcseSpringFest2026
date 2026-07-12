import { memo } from 'react';
import Badge from '../ui/Badge.jsx';
import { findCategory } from '../../mocks/data/mission4.js';

function CategoryBadge({ category }) {
  const c = findCategory(category);
  if (!c) return null;
  return (
    <Badge tone={c.tone} size="sm">
      {c.icon && <span className="mr-1">{c.icon}</span>}
      {c.label}
    </Badge>
  );
}

export default memo(CategoryBadge);
