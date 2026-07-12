import { Eye, Check, EyeOff, Trash2, Flag } from 'lucide-react';
import Card from '../common/Card.jsx';
import Button from '../common/Button.jsx';
import Badge from '../ui/Badge.jsx';
import AnonymousBadge from './AnonymousBadge.jsx';

export default function ModerationCard({ comment, onAction }) {
  const tone = comment.status === 'flagged' ? 'danger' : 'warning';
  return (
    <Card className="p-4">
      <div className="flex items-center gap-2 flex-wrap">
        <Badge tone={tone} className="capitalize">{comment.status}</Badge>
        <Badge tone="neutral">{comment.categoryLabel}</Badge>
        <AnonymousBadge />
        <span className="ml-auto text-[11px] text-muted">
          For <span className="text-fg font-medium">{comment.studentName}</span>
        </span>
      </div>
      <p className="mt-3 text-sm text-fg line-clamp-3">{comment.body}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        <Button size="sm" variant="success" leftIcon={<Check size={13} />} onClick={() => onAction?.('approve', comment)}>
          Approve
        </Button>
        <Button size="sm" variant="secondary" leftIcon={<EyeOff size={13} />} onClick={() => onAction?.('hide', comment)}>
          Hide
        </Button>
        <Button size="sm" variant="danger" leftIcon={<Trash2 size={13} />} onClick={() => onAction?.('remove', comment)}>
          Remove
        </Button>
        <Button size="sm" variant="outline" leftIcon={<Flag size={13} />} onClick={() => onAction?.('flag', comment)}>
          Flag
        </Button>
        <Button size="sm" variant="ghost" leftIcon={<Eye size={13} />} onClick={() => onAction?.('view', comment)}>
          Details
        </Button>
      </div>
    </Card>
  );
}
