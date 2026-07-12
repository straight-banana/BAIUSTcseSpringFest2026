import { useState, useEffect } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { GraduationCap, Shield, UserCog, ArrowRight } from 'lucide-react';
import AuthShell from '../../components/auth/AuthShell.jsx';
import RoleCard from '../../components/auth/RoleCard.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { ROLE_META } from '../../mocks/authUsers.js';

const ICONS = { student: GraduationCap, captain: Shield, teacher: UserCog };

export default function RoleSelect() {
  const nav = useNavigate();
  const { user, roles, chooseRole } = useAuth();
  const [selected, setSelected] = useState(null);
  const availableRoles = roles?.length ? roles : ['student'];

  useEffect(() => {
    if (availableRoles.length === 1) setSelected(availableRoles[0]);
  }, [availableRoles.length]);

  if (!user) return <Navigate to="/auth/login" replace />;

  const proceed = (r) => {
    chooseRole(r);
    nav('/auth/loading');
  };

  return (
    <AuthShell centered>
      <div className="w-full">
        <div className="text-center mb-8">
          <p className="text-sm text-muted">Signed in as</p>
          <h1 className="text-2xl font-bold text-fg mt-1">{user.name}</h1>
          <p className="text-xs text-muted mt-1">Roll {user.rollNumber || user.roll}</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {availableRoles.map((r, i) => {
            const meta = ROLE_META[r] || ROLE_META.student;
            return (
              <motion.div
                key={r}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06, duration: 0.3 }}
              >
                <RoleCard
                  icon={ICONS[r] || GraduationCap}
                  title={meta.label}
                  description={meta.description}
                  tone={meta.tone}
                  selected={selected === r}
                  onSelect={() => setSelected(r)}
                  onContinue={() => proceed(r)}
                />
              </motion.div>
            );
          })}
        </div>
        <div className="mt-8 flex justify-center">
          <button
            disabled={!selected}
            onClick={() => proceed(selected)}
            className="inline-flex items-center gap-2 h-11 px-6 rounded-lg bg-fg text-bg font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 transition"
          >
            Enter as {selected ? (ROLE_META[selected]?.label || selected) : '…'} <ArrowRight size={16} />
          </button>
        </div>
        {availableRoles.length === 1 && (
          <p className="mt-4 text-center text-xs text-muted">
            Your account only has one role assigned.
          </p>
        )}
      </div>
    </AuthShell>
  );
}
