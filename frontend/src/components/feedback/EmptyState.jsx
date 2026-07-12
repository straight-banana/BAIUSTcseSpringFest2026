import { Inbox } from 'lucide-react';

export default function EmptyState({ title = 'Nothing here yet', message = '', icon, action }) {
  return (
    <div className="rounded-xl border border-dashed border-border p-10 text-center bg-surface">
      <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-elevated text-muted">
        {icon || <Inbox size={18} />}
      </div>
      <p className="text-sm font-medium text-fg">{title}</p>
      {message && <p className="mt-1 text-xs text-muted">{message}</p>}
      {action && <div className="mt-4 flex justify-center">{action}</div>}
    </div>
  );
}
