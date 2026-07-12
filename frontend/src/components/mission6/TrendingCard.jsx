import { TrendingUp, Users } from 'lucide-react';
import Card from '../common/Card.jsx';
import VerdictBadge from './VerdictBadge.jsx';

export default function TrendingCard({ item, onClick }) {
  return (
    <Card className="p-4 hover:shadow-md transition cursor-pointer" onClick={onClick}>
      <div className="flex items-start justify-between gap-2">
        <VerdictBadge verdict={item.verdict} />
        <span className="inline-flex items-center gap-1 text-[11px] text-success font-medium">
          <TrendingUp size={12} /> {item.delta}
        </span>
      </div>
      <p className="mt-3 text-sm text-fg font-medium leading-snug">"{item.claim}"</p>
      <div className="mt-3 flex items-center justify-between text-[11px] text-muted">
        <span className="inline-flex items-center gap-1"><Users size={12} /> {item.count} searches</span>
        <span>{item.conf}% confidence</span>
      </div>
    </Card>
  );
}
