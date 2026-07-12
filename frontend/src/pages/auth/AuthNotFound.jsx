import { Link } from 'react-router-dom';
import { Compass, Home } from 'lucide-react';
import AuthShell from '../../components/auth/AuthShell.jsx';

export default function AuthNotFound() {
  return (
    <AuthShell centered>
      <div className="text-center">
        <div className="mx-auto h-20 w-20 rounded-2xl bg-elevated text-brand grid place-items-center">
          <Compass size={30} />
        </div>
        <p className="mt-4 text-xs uppercase tracking-widest text-muted">Error 404</p>
        <h1 className="mt-1 text-2xl font-bold text-fg">You're off the map</h1>
        <p className="mt-2 text-sm text-muted max-w-sm mx-auto">
          This authentication page doesn't exist. Head back to the welcome screen
          and start over.
        </p>
        <Link
          to="/auth/welcome"
          className="mt-6 inline-flex items-center gap-1.5 h-10 px-5 rounded-lg bg-brand text-brand-fg text-sm font-medium hover:opacity-90 transition"
        >
          <Home size={14} /> Return home
        </Link>
      </div>
    </AuthShell>
  );
}
