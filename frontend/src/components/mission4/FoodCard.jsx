import { memo } from 'react';
import Card from '../common/Card.jsx';
import Badge from '../ui/Badge.jsx';
import { formatBDT } from '../../mocks/data/mission4.js';

const popTone = { top: 'brand', high: 'success', medium: 'warning', low: 'neutral' };
const popLabel = { top: '🔥 Top', high: 'Popular', medium: 'Medium', low: 'Low demand' };

function FoodCard({ item, students = 40 }) {
  const totalCost = item.qty * item.price;
  const perStudent = Math.round((totalCost / students) * 10) / 10;
  return (
    <Card className="p-4 hover:border-brand/40 transition-colors flex flex-col">
      <div className="h-24 rounded-lg bg-brand-soft/70 flex items-center justify-center text-4xl mb-3">
        {item.emoji}
      </div>
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <h3 className="text-sm font-semibold text-fg truncate">{item.name}</h3>
          <p className="text-[11px] text-subtle mt-0.5">{item.calories} kcal · qty {item.qty}</p>
        </div>
        <Badge tone={popTone[item.popularity]}>{popLabel[item.popularity]}</Badge>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
        <div className="rounded-md bg-surface px-2 py-1.5">
          <p className="text-subtle text-[10px] uppercase">Unit</p>
          <p className="font-semibold text-fg">{formatBDT(item.price)}</p>
        </div>
        <div className="rounded-md bg-surface px-2 py-1.5">
          <p className="text-subtle text-[10px] uppercase">Per student</p>
          <p className="font-semibold text-fg">{formatBDT(perStudent)}</p>
        </div>
      </div>
    </Card>
  );
}

export default memo(FoodCard);
