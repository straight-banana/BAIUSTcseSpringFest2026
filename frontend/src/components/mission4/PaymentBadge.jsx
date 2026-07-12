import { memo } from 'react';
import Badge from '../ui/Badge.jsx';
import { MISSION4_PAYMENT_METHODS } from '../../utils/missionApiMaps.js';

function PaymentBadge({ method }) {
  const p = MISSION4_PAYMENT_METHODS.find((m) => m.key === method) || MISSION4_PAYMENT_METHODS[0];
  return (
    <Badge tone="neutral">
      <span className="mr-1">{p.icon}</span>
      {p.label}
    </Badge>
  );
}

export default memo(PaymentBadge);
