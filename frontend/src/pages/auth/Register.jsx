import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Hash, ArrowRight, Loader2, Lock, User, GraduationCap, Users, Info, Ruler, Eye, Ear } from 'lucide-react';
import AuthShell from '../../components/auth/AuthShell.jsx';
import LoginCard from '../../components/auth/LoginCard.jsx';
import FormField from '../../components/forms/FormField.jsx';
import { useAuth } from '../../context/AuthContext.jsx';

const CLASSES = ['6', '7', '8', '9', '10'];
const SECTIONS = ['A', 'B', 'C', 'D'];
const IMPAIRMENT = [
  { value: 'None', label: 'None' },
  { value: 'Mild', label: 'Mild' },
  { value: 'Severe', label: 'Severe' },
];

export default function Register() {
  const nav = useNavigate();
  const { signUp } = useAuth();
  const [className, setClassName] = useState('9');
  const [section, setSection] = useState('C');
  // Students are the only self-serve role. Captains are promoted by teachers,
  // and teacher/office accounts are pre-seeded.
  const role = 'student';
  const [rollNumber, setRoll] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [height, setHeight] = useState('');
  const [vision, setVision] = useState('None');
  const [hearing, setHearing] = useState('None');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => { setError(''); }, [rollNumber, name, password, className, section, height, vision, hearing]);

  const heightNum = Number(height);
  const heightValid = height !== '' && Number.isFinite(heightNum) && heightNum >= 80 && heightNum <= 250;

  const canSubmit =
    rollNumber.trim().length >= 1 &&
    name.trim().length >= 1 &&
    password.length >= 6 &&
    heightValid &&
    !!vision &&
    !!hearing &&
    !loading;

  const submit = async (e) => {
    e.preventDefault();
    if (!canSubmit) return;
    setLoading(true);
    const composedRoll = `${className}${section}-${rollNumber.trim()}`;
    const res = await signUp({
      rollNumber: composedRoll,
      name: name.trim(),
      password,
      role,
      className,
      section,
      height: heightNum,
      vision,
      hearing,
    });
    setLoading(false);
    if (!res.success) { setError(res.error || 'Registration failed'); return; }
    nav('/auth/loading');
  };

  return (
    <AuthShell centered>
      <LoginCard
        title="Create student account"
        description="Only students can self-register. Class captains are promoted by teachers."
        footer={
          <span>
            Already registered?{' '}
            <Link to="/auth/login" className="text-brand hover:underline">Sign in</Link>
          </span>
        }
      >
        <form onSubmit={submit} className="space-y-4" noValidate>
          <div className="flex items-start gap-2 rounded-md border border-border bg-elevated/60 px-3 py-2 text-xs text-muted">
            <Info size={14} className="mt-0.5 text-brand" />
            <span>Teacher & office accounts are provisioned by the school and cannot be created here.</span>
          </div>
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
          <FormField
            label="Roll Number"
            name="rollNumber"
            placeholder="e.g. 005"
            value={rollNumber}
            onChange={(e) => setRoll(e.target.value)}
            leadingIcon={<Hash size={14} />}
            required
          />
          <FormField
            label="Full Name"
            name="name"
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            leadingIcon={<User size={14} />}
            required
          />
          <FormField
            label="Height (cm)"
            name="height"
            type="number"
            min={80}
            max={250}
            placeholder="e.g. 160"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            leadingIcon={<Ruler size={14} />}
            state={height !== '' && !heightValid ? 'error' : 'default'}
            message={height !== '' && !heightValid ? 'Enter a height between 80 and 250 cm' : ''}
            required
          />
          <div className="grid grid-cols-2 gap-3">
            <SelectField
              label="Eyesight"
              value={vision}
              onChange={(e) => setVision(e.target.value)}
              icon={<Eye size={14} />}
              options={IMPAIRMENT}
            />
            <SelectField
              label="Hearing"
              value={hearing}
              onChange={(e) => setHearing(e.target.value)}
              icon={<Ear size={14} />}
              options={IMPAIRMENT}
            />
          </div>
          <FormField
            label="Password"
            name="password"
            type="password"
            placeholder="At least 6 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            leadingIcon={<Lock size={14} />}
            state={error ? 'error' : 'default'}
            message={error || ''}
            required
            minLength={6}
          />
          <motion.button
            whileTap={{ scale: canSubmit ? 0.98 : 1 }}
            type="submit"
            disabled={!canSubmit}
            className="w-full inline-flex items-center justify-center gap-2 h-11 rounded-lg bg-brand text-brand-fg font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition"
          >
            {loading ? <><Loader2 size={16} className="animate-spin" /> Creating…</> : <>Create account <ArrowRight size={16} /></>}
          </motion.button>
          <div className="text-xs text-muted text-center">
            <Link to="/auth/welcome" className="hover:text-fg transition">← Back</Link>
          </div>
        </form>
      </LoginCard>
    </AuthShell>
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
