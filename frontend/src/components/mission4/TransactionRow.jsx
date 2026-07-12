import { memo } from 'react';
import CategoryBadge from './CategoryBadge.jsx';
import StatusPill from './StatusPill.jsx';
import { formatBDT } from '../../mocks/data/mission4.js';
import { MoreHorizontal, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';

function TransactionRow({ tx, onClick }) {
  const { role } = useAuth();
  const canEdit = role !== 'student';
  return (
    <tr onClick={() => onClick?.(tx)} className="border-t border-border hover:bg-surface/60 cursor-pointer transition-colors">
      <td className="px-4 py-3 text-xs text-muted whitespace-nowrap">{new Date(tx.date).toLocaleDateString()}</td>
      <td className="px-4 py-3">
        <p className="text-sm text-fg font-medium">{tx.description}</p>
        <p className="text-[11px] text-subtle font-mono">{tx.id}</p>
      </td>
      <td className="px-4 py-3"><CategoryBadge category={tx.category} /></td>
      <td className="px-4 py-3">
        <span className={`inline-flex items-center gap-1 text-xs font-medium ${tx.type === 'income' ? 'text-success' : 'text-danger'}`}>
          {tx.type === 'income' ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
          {tx.type}
        </span>
      </td>
      <td className={`px-4 py-3 text-sm font-semibold whitespace-nowrap ${tx.type === 'income' ? 'text-success' : 'text-fg'}`}>
        {tx.type === 'income' ? '+' : '−'} {formatBDT(tx.amount)}
      </td>
      <td className="px-4 py-3 text-xs text-muted whitespace-nowrap">{tx.addedBy}</td>
      <td className="px-4 py-3"><StatusPill status={tx.status} /></td>
      <td className="px-4 py-3 text-right">
        {canEdit ? (
          <button className="text-muted hover:text-fg p-1 rounded-md hover:bg-elevated" onClick={(e) => e.stopPropagation()} aria-label="Actions">
            <MoreHorizontal size={14} />
          </button>
        ) : null}
      </td>
    </tr>
  );
}

export default memo(TransactionRow);
