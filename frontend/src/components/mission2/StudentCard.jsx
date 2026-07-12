import { memo } from 'react';
import Card from '../common/Card.jsx';
import Badge from '../ui/Badge.jsx';
import HeightBadge from './HeightBadge.jsx';
import ConstraintBadge from './ConstraintBadge.jsx';
import Button from '../common/Button.jsx';
import { Pencil, Trash2, User } from 'lucide-react';

function StudentCard({ student, onEdit, onDelete, compact = false }) {
  const s = student;
  const priorityTags = [
    s.vision !== 'None' && 'vision',
    s.hearing !== 'None' && 'hearing',
  ].filter(Boolean);
  return (
    <Card className="p-4 hover:border-brand/40 transition-colors">
      <div className="flex items-start gap-3">
        <div className="h-10 w-10 shrink-0 rounded-full bg-brand-soft text-brand flex items-center justify-center">
          <User size={16} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <p className="text-sm font-semibold text-fg truncate">{s.name}</p>
            <HeightBadge height={s.height} />
          </div>
          <p className="text-xs text-muted mt-0.5 font-mono">{s.roll}</p>
          <div className="mt-2 flex flex-wrap items-center gap-1.5">
            <Badge tone="neutral">{s.gender}</Badge>
            {priorityTags.map((t) => <ConstraintBadge key={t} type={t} compact />)}
          </div>
          {!compact && s.notes && (
            <p className="mt-2 text-xs text-muted line-clamp-2">{s.notes}</p>
          )}
          {(onEdit || onDelete) && (
            <div className="mt-3 flex items-center gap-2">
              {onEdit && (
                <Button size="sm" variant="secondary" leftIcon={<Pencil size={12} />} onClick={() => onEdit(s)}>
                  Edit
                </Button>
              )}
              {onDelete && (
                <Button size="sm" variant="ghost" leftIcon={<Trash2 size={12} />} onClick={() => onDelete(s)}>
                  Delete
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}

export default memo(StudentCard);
