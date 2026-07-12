import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, ShieldCheck, Users, Sparkles } from 'lucide-react';
import AuthShell from '../../components/auth/AuthShell.jsx';

function AsideArt() {
  return (
    <div className="relative w-full max-w-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="rounded-3xl border border-border bg-surface/80 backdrop-blur p-6 shadow-xl"
      >
        <div className="flex items-center gap-3">
          <div className="h-11 w-11 rounded-2xl bg-brand text-brand-fg grid place-items-center">
            <ShieldCheck size={22} />
          </div>
          <div className="min-w-0">
            <p className="text-xs uppercase tracking-widest text-muted">University Console</p>
            <h3 className="text-lg font-semibold text-fg truncate">Kuddus Portal</h3>
          </div>
        </div>
        <ul className="mt-5 space-y-3 text-sm text-fg/90">
          <li className="flex items-start gap-2"><Sparkles size={16} className="text-accent mt-0.5" /> Anonymous whistleblower pipeline</li>
          <li className="flex items-start gap-2"><Users size={16} className="text-brand mt-0.5" /> Peer ratings and captain elections</li>
          <li className="flex items-start gap-2"><ShieldCheck size={16} className="text-danger mt-0.5" /> Realtime SOS distress network</li>
        </ul>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.5 }}
        className="mt-4 rounded-2xl border border-border bg-surface/60 backdrop-blur p-4 text-xs text-muted"
      >
        <p className="font-mono">Roll-number authentication · Zero-knowledge complaints · Three roles.</p>
      </motion.div>
    </div>
  );
}

export default function Welcome() {
  return (
    <AuthShell aside={<AsideArt />} centered>
      <div className="text-center lg:text-left">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-elevated px-2.5 py-1 text-xs text-muted">
          <span className="h-1.5 w-1.5 rounded-full bg-success" /> Phase 2 · Authentication
        </span>
        <h1 className="mt-4 text-3xl sm:text-4xl font-bold tracking-tight text-fg">
          Welcome to the <span className="text-brand">Anti Kuddus Protocol</span>
        </h1>
        <p className="mt-3 text-muted">
          A secure portal for students, class captains, and teachers. Sign in with your
          university roll number to continue.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:justify-start justify-center">
          <Link
            to="/auth/login"
            className="inline-flex items-center justify-center gap-2 h-11 px-6 rounded-lg bg-brand text-brand-fg font-medium shadow-sm hover:opacity-90 transition"
          >
            Continue <ArrowRight size={16} />
          </Link>
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 h-11 px-6 rounded-lg border border-border text-fg hover:bg-elevated transition"
          >
            Explore console
          </Link>
        </div>
        <p className="mt-6 text-xs text-muted">
          Trouble signing in? Contact your class captain or department office.
        </p>
      </div>
    </AuthShell>
  );
}
