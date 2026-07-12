import { memo } from 'react';
import Badge from '../ui/Badge.jsx';
import { normalizeTrackerStatus } from '../../utils/missionApiMaps.js';

function StatusPill({ status }) {
  const key = normalizeTrackerStatus(status);
  const map = {
    completed: { label: 'Completed', tone: 'success' },
    pending: { label: 'Pending', tone: 'warning' },
    cancelled: { label: 'Cancelled', tone: 'neutral' },
    refunded: { label: 'Refunded', tone: 'neutral' },
  };
  const s = map[key] || { label: String(status || '').toUpperCase(), tone: 'neutral' };
  return <Badge tone={s.tone}>{s.label}</Badge>;
}

export default memo(StatusPill);
