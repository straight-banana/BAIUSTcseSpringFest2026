import { Link } from 'react-router-dom';
import { Clock, LogIn } from 'lucide-react';
import AuthShell from '../../components/auth/AuthShell.jsx';

export default function SessionExpired() {
  return (
    <AuthShell centered>
      <div className="text-center">
        <div className="mx-auto h-20 w-20 rounded-2xl bg-warning/10 text-warning grid place-items-center">
          <Clock size={30} />
        </div>
        <h1 className="mt-6 text-2xl font-bold text-fg">Session expired</h1>
        <p className="mt-2 text-sm text-muted max-w-sm mx-auto">
          You've been signed out for security. Log in again with your roll number
          to continue where you left off.
        </p>
        <Link
          to="/auth/login"
          className="mt-6 inline-flex items-center gap-1.5 h-10 px-5 rounded-lg bg-brand text-brand-fg text-sm font-medium hover:opacity-90 transition"
        >
          <LogIn size={14} /> Login again
        </Link>
      </div>
    </AuthShell>
  );
}
