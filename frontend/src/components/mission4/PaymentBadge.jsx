import { memo } from 'react';
import Badge from '../ui/Badge.jsx';
import { findPayment } from '../../mocks/data/mission4.js';

function PaymentBadge({ method }) {
  const p = findPayment(method);
  return (
    <Badge tone="neutral">
      <span className="mr-1">{p.icon}</span>
      {p.label}
    </Badge>
  );
}

export default memo(PaymentBadge);
