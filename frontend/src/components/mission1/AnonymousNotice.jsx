import { ShieldCheck } from 'lucide-react';

export default function AnonymousNotice() {
  return (
    <div className="rounded-xl border border-brand/30 bg-brand-soft/40 p-4 flex gap-3">
      <div className="h-9 w-9 shrink-0 rounded-lg bg-brand text-brand-fg flex items-center justify-center">
        <ShieldCheck size={18} />
      </div>
      <div className="min-w-0">
        <p className="text-sm font-semibold text-fg">Your identity stays hidden.</p>
        <p className="text-xs text-muted mt-1 leading-relaxed">
          Complaints are stored in a separate, unlinkable table from your student
          record. Image metadata (EXIF, GPS, timestamps) is stripped before
          storage. Even administrators cannot trace this submission back to you.
        </p>
      </div>
    </div>
  );
}
