import { AlertTriangle } from 'lucide-react';

export default function ErrorState({ title = 'Something went wrong', message = '', action }) {
  return (
    <div className="rounded-xl border border-danger/30 bg-danger/5 p-8 text-center">
      <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-danger/10 text-danger">
        <AlertTriangle size={18} />
      </div>
      <p className="text-sm font-medium text-danger">{title}</p>
      {message && <p className="mt-1 text-xs text-danger/80">{message}</p>}
      {action && <div className="mt-4 flex justify-center">{action}</div>}
    </div>
  );
}
