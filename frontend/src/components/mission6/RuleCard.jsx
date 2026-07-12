import { Link } from 'react-router-dom';
import { Bookmark, ArrowUpRight } from 'lucide-react';
import Card from '../common/Card.jsx';
import { findCategory } from '../../mocks/data/mission6.js';
import { useState } from 'react';

export default function RuleCard({ rule }) {
  const cat = findCategory(rule.category);
  const [saved, setSaved] = useState(false);
  return (
    <Card className="p-4 hover:shadow-md transition group">
      <div className="flex items-start justify-between gap-2">
        <div
          className="inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-medium"
          style={{ background: `${cat.color}18`, color: cat.color }}
        >
          <span>{cat.icon}</span>{cat.label}
        </div>
        <button
          onClick={(e) => { e.preventDefault(); setSaved(!saved); }}
          className={saved ? 'text-brand' : 'text-muted hover:text-fg'}
          aria-label="Bookmark"
        >
          <Bookmark size={16} fill={saved ? 'currentColor' : 'none'} />
        </button>
      </div>
      <h3 className="mt-2 text-sm font-semibold text-fg leading-snug">{rule.title}</h3>
      <p className="text-xs text-muted mt-1 line-clamp-2">{rule.summary}</p>
      <div className="mt-3 flex items-center justify-between text-[11px] text-muted">
        <span className="font-mono">{rule.number}</span>
        <Link to={`/mission-6/rules/${rule.id}`} className="inline-flex items-center gap-1 text-brand hover:underline">
          View <ArrowUpRight size={12} />
        </Link>
      </div>
    </Card>
  );
}
