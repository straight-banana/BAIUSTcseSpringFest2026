import { Link } from 'react-router-dom';
import { Lock, ArrowLeft } from 'lucide-react';
import AuthShell from '../../components/auth/AuthShell.jsx';

export default function AccessDenied() {
  return (
    <AuthShell centered>
      <div className="text-center">
        <div className="mx-auto h-20 w-20 rounded-2xl bg-danger/10 text-danger grid place-items-center">
          <Lock size={30} />
        </div>
        <h1 className="mt-6 text-2xl font-bold text-fg">Access denied</h1>
        <p className="mt-2 text-sm text-muted max-w-sm mx-auto">
          Your role doesn't have permission to view this area. If this looks like
          a mistake, contact your class captain or Rashid Sir.
        </p>
        <div className="mt-6 flex items-center justify-center gap-3">
          <Link to="/" className="inline-flex items-center gap-1.5 h-10 px-4 rounded-lg border border-border text-fg hover:bg-elevated transition text-sm">
            <ArrowLeft size={14} /> Return home
          </Link>
          <Link to="/auth/login" className="inline-flex items-center gap-1.5 h-10 px-4 rounded-lg bg-brand text-brand-fg text-sm font-medium hover:opacity-90 transition">
            Sign in with a different account
          </Link>
        </div>
      </div>
    </AuthShell>
  );
}
