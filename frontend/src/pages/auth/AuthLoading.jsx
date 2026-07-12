import { useEffect, useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldCheck } from 'lucide-react';
import AuthShell from '../../components/auth/AuthShell.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { ROLE_META } from '../../mocks/authUsers.js';

const STEPS = [
  'Verifying credentials…',
  'Loading permissions…',
  'Preparing your dashboard…',
];

export default function AuthLoading() {
  const nav = useNavigate();
  const { user, role } = useAuth();
  const [step, setStep] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!user || !role) return;
    const t1 = setInterval(() => setProgress((p) => Math.min(100, p + 4)), 60);
    const t2 = setInterval(() => setStep((s) => Math.min(STEPS.length - 1, s + 1)), 700);
    const done = setTimeout(() => nav(ROLE_META[role].path, { replace: true }), 2100);
    return () => { clearInterval(t1); clearInterval(t2); clearTimeout(done); };
  }, [user, role, nav]);

  if (!user) return <Navigate to="/auth/login" replace />;
  if (!role) return <Navigate to="/auth/role" replace />;

  return (
    <AuthShell centered>
      <div className="text-center">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="mx-auto h-20 w-20 rounded-2xl bg-brand/10 grid place-items-center relative"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2.4, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-0 rounded-2xl border-2 border-transparent border-t-brand"
          />
          <ShieldCheck className="text-brand" size={30} />
        </motion.div>
        <h1 className="mt-6 text-xl font-semibold text-fg">Welcome, {user.name.split(' ')[0]}</h1>
        <p className="mt-1 text-sm text-muted">Entering as {ROLE_META[role].label}</p>
        <div className="mt-8 mx-auto max-w-sm">
          <div className="h-1.5 rounded-full bg-elevated overflow-hidden">
            <motion.div
              className="h-full bg-brand"
              animate={{ width: `${progress}%` }}
              transition={{ ease: 'linear' }}
            />
          </div>
          <motion.p
            key={step}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-3 text-xs text-muted"
          >
            {STEPS[step]}
          </motion.p>
        </div>
      </div>
    </AuthShell>
  );
}
