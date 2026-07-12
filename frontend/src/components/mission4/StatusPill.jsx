import { memo } from 'react';
import Badge from '../ui/Badge.jsx';
import { findStatus } from '../../mocks/data/mission4.js';

function StatusPill({ status }) {
  const s = findStatus(status);
  return <Badge tone={s.tone}>{s.label}</Badge>;
}

export default memo(StatusPill);
