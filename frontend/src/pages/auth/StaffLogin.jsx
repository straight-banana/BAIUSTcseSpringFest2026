import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { UserCog, ArrowRight, Loader2, Lock, ShieldCheck } from 'lucide-react';
import AuthShell from '../../components/auth/AuthShell.jsx';
import LoginCard from '../../components/auth/LoginCard.jsx';
import FormField from '../../components/forms/FormField.jsx';
import { useAuth } from '../../context/AuthContext.jsx';

// Teacher / office accounts sign in with their own ID and password —
// unlike the student RollLogin page, this does NOT prepend class/section
// to what's typed. Staff roll numbers (e.g. "t101") are stored as-is on
// the backend (role: ADMIN), so composing "9C-t101" would never match.
export default function StaffLogin() {
  const nav = useNavigate();
  const { signIn } = useAuth();
  const [rollNumber, setRoll] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => { setError(''); }, [rollNumber, password]);

  const canSubmit = rollNumber.trim().length >= 1 && password.length >= 1 && !loading;

  const submit = async (e) => {
    e.preventDefault();
    if (!canSubmit) return;
    setLoading(true);
    const res = await signIn({ rollNumber: rollNumber.trim(), password });
    setLoading(false);
    if (!res.success) { setError(res.error || 'Login failed'); return; }
    nav('/auth/loading');
  };

  return (
    <AuthShell centered>
      <LoginCard
        title="Teacher / Office sign in"
        description="Enter your staff ID and password to continue."
        footer={
          <span>
            Signing in as a student?{' '}
            <Link to="/auth/login" className="text-brand hover:underline">Go to student login</Link>
          </span>
        }
      >
        <div className="flex items-center gap-2 rounded-lg border border-border bg-elevated px-3 py-2 text-xs text-muted mb-2">
          <ShieldCheck size={14} className="shrink-0" />
          Staff console — full moderation, analytics, and election oversight.
        </div>

        <form onSubmit={submit} className="space-y-4" noValidate>
          <FormField
            label="Staff ID"
            name="rollNumber"
            placeholder="e.g. t101"
            autoComplete="username"
            value={rollNumber}
            onChange={(e) => setRoll(e.target.value)}
            leadingIcon={<UserCog size={14} />}
            maxLength={32}
          />

          <FormField
            label="Password"
            name="password"
            type="password"
            placeholder="••••••••"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            leadingIcon={<Lock size={14} />}
            state={error ? 'error' : 'default'}
            message={error || ''}
          />
          <motion.button
            whileTap={{ scale: canSubmit ? 0.98 : 1 }}
            type="submit"
            disabled={!canSubmit}
            className="w-full inline-flex items-center justify-center gap-2 h-11 rounded-lg bg-brand text-brand-fg font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition"
          >
            {loading ? <><Loader2 size={16} className="animate-spin" /> Signing in…</> : <>Continue <ArrowRight size={16} /></>}
          </motion.button>
          <div className="flex items-center justify-between text-xs text-muted">
            <Link to="/auth/welcome" className="hover:text-fg transition">← Back</Link>
            <Link to="/auth/expired" className="hover:text-fg transition">Session expired?</Link>
          </div>
        </form>
      </LoginCard>
    </AuthShell>
  );
}
