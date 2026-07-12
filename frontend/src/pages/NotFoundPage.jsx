import { Link } from 'react-router-dom';
import Button from '../components/common/Button.jsx';

export default function NotFoundPage() {
  return (
    <main className="min-h-dvh flex items-center justify-center text-center px-6 bg-bg text-fg">
      <div>
        <p className="text-xs font-mono uppercase tracking-widest text-muted">Error 404</p>
        <h1 className="mt-2 text-4xl font-semibold tracking-tight">Page not found</h1>
        <p className="mt-2 text-sm text-muted">The page you're looking for doesn't exist.</p>
        <div className="mt-6">
          <Link to="/"><Button>Back to dashboard</Button></Link>
        </div>
      </div>
    </main>
  );
}
