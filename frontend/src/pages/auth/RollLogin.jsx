import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Hash, ArrowRight, Loader2, Lock, GraduationCap, Users, IdCard } from 'lucide-react';
import AuthShell from '../../components/auth/AuthShell.jsx';
import LoginCard from '../../components/auth/LoginCard.jsx';
import FormField from '../../components/forms/FormField.jsx';
import { useAuth } from '../../context/AuthContext.jsx';

const CLASSES = ['6', '7', '8', '9', '10'];
const SECTIONS = ['A', 'B', 'C', 'D'];

const ROLE_TABS = [
  { value: 'student', label: 'Student' },
  { value: 'captain', label: 'Class Captain' },
  { value: 'teacher', label: 'Teacher' },
];

export default function RollLogin() {
  const nav = useNavigate();
  const { signIn } = useAuth();
  const [role, setRole] = useState('student');
  const [className, setClassName] = useState('9');
  const [section, setSection] = useState('C');
  const [rollNumber, setRoll] = useState('');
  const [teacherId, setTeacherId] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => { setError(''); }, [rollNumber, teacherId, password, className, section, role]);

  const isTeacher = role === 'teacher';
  const canSubmit =
    (isTeacher ? teacherId.trim().length >= 1 : rollNumber.trim().length >= 1) &&
    password.length >= 1 && !loading;

  const submit = async (e) => {
    e.preventDefault();
    if (!canSubmit) return;
    setLoading(true);
    const composedRoll = isTeacher
      ? teacherId.trim()
      : `${className}${section}-${rollNumber.trim()}`;
    const authRole = role;
    const res = await signIn({ rollNumber: composedRoll, password, role: authRole });
    setLoading(false);
    if (!res.success) { setError(res.error || 'Login failed'); return; }
    nav('/auth/loading');
  };

  return (
    <AuthShell centered>
      <LoginCard
        title="Sign in"
        description={
          isTeacher
            ? 'Teachers sign in with their assigned Teacher ID.'
            : 'Enter your class, section, roll number and password to continue.'
        }
        footer={
          <span>
            {isTeacher ? (
              'Teacher accounts are provisioned by the school.'
            ) : (
              <>
                Don't have an account?{' '}
                <Link to="/auth/register" className="text-brand hover:underline">Register as student</Link>
              </>
            )}
          </span>
        }
      >
        <RoleTabs value={role} onChange={setRole} />

        <form onSubmit={submit} className="space-y-4" noValidate>
          {!isTeacher && (
            <div className="grid grid-cols-2 gap-3">
              <SelectField
                label="Class"
                value={className}
                onChange={(e) => setClassName(e.target.value)}
                icon={<GraduationCap size={14} />}
                options={CLASSES.map((c) => ({ value: c, label: `Class ${c}` }))}
              />
              <SelectField
                label="Section"
                value={section}
                onChange={(e) => setSection(e.target.value)}
                icon={<Users size={14} />}
                options={SECTIONS.map((s) => ({ value: s, label: s }))}
              />
            </div>
          )}

          {isTeacher ? (
            <FormField
              label="Teacher ID"
              name="teacherId"
              placeholder="e.g. T001"
              autoComplete="username"
              value={teacherId}
              onChange={(e) => setTeacherId(e.target.value)}
              leadingIcon={<IdCard size={14} />}
              maxLength={32}
            />
          ) : (
            <FormField
              label="Roll Number"
              name="rollNumber"
              placeholder="e.g. 005"
              autoComplete="username"
              value={rollNumber}
              onChange={(e) => setRoll(e.target.value)}
              leadingIcon={<Hash size={14} />}
              maxLength={32}
            />
          )}

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

function RoleTabs({ value, onChange }) {
  return (
    <div className="grid grid-cols-3 gap-1 rounded-lg border border-border bg-elevated p-1 mb-2">
      {ROLE_TABS.map((r) => (
        <button
          key={r.value}
          type="button"
          onClick={() => onChange(r.value)}
          className={
            'text-xs font-medium h-8 rounded-md transition ' +
            (value === r.value
              ? 'bg-surface text-fg shadow-xs'
              : 'text-muted hover:text-fg')
          }
        >
          {r.label}
        </button>
      ))}
    </div>
  );
}

function SelectField({ label, value, onChange, icon, options }) {
  return (
    <label className="block">
      <span className="block text-xs font-medium text-fg mb-1.5">{label}</span>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted">{icon}</span>
        <select
          value={value}
          onChange={onChange}
          className="w-full h-11 pl-9 pr-3 rounded-lg border border-ink/15 bg-paper text-fg text-sm focus:outline-none focus:ring-2 focus:ring-brand/40"
        >
          {options.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>
    </label>
  );
}
