import { memo } from 'react';
import Card from '../common/Card.jsx';
import StatusBadge from './StatusBadge.jsx';
import CategoryBadge from './CategoryBadge.jsx';
import { Paperclip, ChevronRight } from 'lucide-react';

function ComplaintCard({ complaint, onClick, action }) {
  return (
    <Card className="p-4 hover:border-brand/40 transition-colors">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="font-mono text-[11px] text-muted">{complaint.id}</p>
          <p className="text-sm font-medium text-fg mt-0.5 truncate">{complaint.title}</p>
        </div>
        <StatusBadge status={complaint.status} />
      </div>
      <p className="mt-2 text-xs text-muted line-clamp-2">{complaint.description}</p>
      <div className="mt-3 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 flex-wrap">
          <CategoryBadge category={complaint.category} />
          {complaint.hasEvidence && (
            <span className="inline-flex items-center gap-1 text-[11px] text-muted">
              <Paperclip size={11} /> {complaint.evidenceCount || 1}
            </span>
          )}
        </div>
        {action || (
          <button
            onClick={onClick}
            className="inline-flex items-center gap-1 text-xs text-brand hover:underline"
          >
            View <ChevronRight size={12} />
          </button>
        )}
      </div>
    </Card>
  );
}

export default memo(ComplaintCard);
