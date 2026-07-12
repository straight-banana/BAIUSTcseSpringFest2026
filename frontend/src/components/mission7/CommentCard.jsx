import { Flag, ThumbsUp, Calendar } from 'lucide-react';
import Card from '../common/Card.jsx';
import Badge from '../ui/Badge.jsx';
import Button from '../common/Button.jsx';
import AnonymousBadge from './AnonymousBadge.jsx';

function fmt(d) {
  try { return new Date(d).toLocaleDateString(); } catch { return ''; }
}

export default function CommentCard({ comment, showStudent = false }) {
  const tone = comment.status === 'flagged' ? 'danger' : comment.status === 'pending' ? 'warning' : 'success';
  return (
    <Card className="p-4">
      <div className="flex flex-wrap items-center gap-2">
        <AnonymousBadge />
        <Badge tone="neutral">{comment.categoryLabel}</Badge>
        <Badge tone={tone} className="capitalize">{comment.status}</Badge>
        <span className="ml-auto text-[11px] text-muted inline-flex items-center gap-1">
          <Calendar size={11} /> {fmt(comment.createdAt)}
        </span>
      </div>
      {showStudent && (
        <p className="mt-2 text-xs text-muted">
          For <span className="text-fg font-medium">{comment.studentName}</span>
        </p>
      )}
      <p className="mt-3 text-sm text-fg leading-relaxed">{comment.body}</p>
      <div className="mt-3 flex items-center justify-between">
        <span className="inline-flex items-center gap-1 text-xs text-muted">
          <ThumbsUp size={12} /> {comment.helpful} found helpful
        </span>
        <Button variant="ghost" size="sm" leftIcon={<Flag size={13} />}>Report</Button>
      </div>
    </Card>
  );
}
