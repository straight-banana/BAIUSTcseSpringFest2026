import { Trash2, RotateCw, Clock } from 'lucide-react';
import Card from '../common/Card.jsx';
import VerdictBadge from './VerdictBadge.jsx';
import { findCategory } from '../../mocks/data/mission6.js';

const timeAgo = (iso) => {
  const diff = (Date.now() - new Date(iso).getTime()) / 1000;
  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
};

export default function HistoryCard({ item, onSearch, onDelete }) {
  const cat = findCategory(item.category);
  return (
    <Card className="p-4">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <VerdictBadge verdict={item.verdict} />
            <span
              className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px]"
              style={{ background: `${cat.color}18`, color: cat.color }}
            >
              {cat.icon} {cat.label}
            </span>
          </div>
          <p className="mt-2 text-sm text-fg font-medium truncate">{item.query}</p>
          <div className="mt-1 flex items-center gap-3 text-[11px] text-muted">
            <span className="inline-flex items-center gap-1"><Clock size={11} />{timeAgo(item.when)}</span>
            <span>{item.confidence}% confidence</span>
            <span className="font-mono hidden sm:inline">{item.id}</span>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={() => onSearch?.(item)} className="h-8 w-8 rounded-md hover:bg-elevated text-muted hover:text-fg inline-flex items-center justify-center" title="Search again">
            <RotateCw size={14} />
          </button>
          <button onClick={() => onDelete?.(item)} className="h-8 w-8 rounded-md hover:bg-elevated text-muted hover:text-danger inline-flex items-center justify-center" title="Delete">
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </Card>
  );
}
