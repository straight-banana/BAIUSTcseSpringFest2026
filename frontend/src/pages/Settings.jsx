import { useEffect, useMemo, useState } from 'react';
import PageContainer from '../components/layout/PageContainer.jsx';
import PageHeader from '../components/layout/PageHeader.jsx';
import Card from '../components/common/Card.jsx';
import Input from '../components/forms/Input.jsx';
import Select from '../components/forms/Select.jsx';
import Button from '../components/common/Button.jsx';
import { Switch } from '../components/forms/Controls.jsx';
import { useTheme } from '../context/ThemeContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { Settings as SettingsIcon, User, Check } from 'lucide-react';

const PROFILE_KEY = 'akp:profile';

export default function Settings() {
  const { theme, toggle } = useTheme();
  const { user, role } = useAuth();
  const isStaff = role === 'teacher' || role === 'office';

  // Build defaults from the logged-in user — not a hardcoded student.
  const defaults = useMemo(() => ({
    name: user?.name || '',
    roll: user?.rollNumber || user?.roll || '',
    className: user?.className || '',
    section: user?.section || '',
    height: user?.height || '',
    gender: user?.gender || 'Male',
    vision: user?.vision || 'None',
    hearing: user?.hearing || 'None',
    email: user?.email || '',
    phone: user?.phone || '',
    subject: user?.subject || '',
    staffRole: user?.staffRole || (role === 'office' ? 'Office Staff' : 'Class Teacher'),
  }), [user, role]);

  const [profile, setProfile] = useState(defaults);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(PROFILE_KEY);
      const stored = raw ? JSON.parse(raw) : {};
      // Only reuse stored profile if it matches the current logged-in user
      if (stored && stored.roll && stored.roll === defaults.roll) {
        setProfile({ ...defaults, ...stored });
      } else {
        setProfile(defaults);
      }
    } catch {
      setProfile(defaults);
    }
  }, [defaults]);

  const set = (k) => (e) => setProfile((p) => ({ ...p, [k]: e.target.value }));

  const save = () => {
    try { localStorage.setItem(PROFILE_KEY, JSON.stringify(profile)); } catch {}
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <PageContainer>
      <PageHeader title="Settings" subtitle="Update your profile and preferences." icon={<SettingsIcon size={18} />} />

      <Card className="p-5 space-y-4 mb-4">
        <div className="flex items-center gap-2">
          <User size={16} className="text-ink/70" />
          <h3 className="text-sm font-semibold text-fg">My Profile</h3>
        </div>
        <p className="text-xs text-muted">
          {isStaff
            ? 'These details identify your teaching role and subject.'
            : 'These details help teachers seat you correctly and reach you when needed.'}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input label="Full name" value={profile.name} onChange={set('name')} />
          <Input label={isStaff ? 'Staff ID' : 'Roll number'} value={profile.roll} onChange={set('roll')} disabled />

          {isStaff ? (
            <>
              <Input label="Subject" value={profile.subject} onChange={set('subject')} placeholder="e.g. Mathematics" />
              <Select label="Role" value={profile.staffRole} onChange={set('staffRole')}>
                <option>Class Teacher</option>
                <option>Subject Teacher</option>
                <option>Head of Department</option>
                <option>Vice Principal</option>
                <option>Principal</option>
                <option>Office Staff</option>
              </Select>
            </>
          ) : (
            <>
              <Input label="Class" value={profile.className} onChange={set('className')} placeholder="e.g. 9" />
              <Input label="Section" value={profile.section} onChange={set('section')} placeholder="e.g. C" />
              <Input label="Height (cm)" type="number" min={100} max={220} value={profile.height} onChange={set('height')} />
              <Select label="Gender" value={profile.gender} onChange={set('gender')}>
                <option>Male</option><option>Female</option><option>Other</option>
              </Select>
              <Select label="Eyesight" value={profile.vision} onChange={set('vision')} hint="Do you have trouble seeing the board?">
                <option value="None">No problem</option>
                <option value="Mild">A little trouble</option>
                <option value="Severe">Lots of trouble</option>
              </Select>
              <Select label="Hearing" value={profile.hearing} onChange={set('hearing')} hint="Do you have trouble hearing the teacher?">
                <option value="None">No problem</option>
                <option value="Mild">A little trouble</option>
                <option value="Severe">Lots of trouble</option>
              </Select>
            </>
          )}

          <Input label="Email" type="email" value={profile.email} onChange={set('email')} placeholder="you@example.com" />
          <Input label="Phone" value={profile.phone} onChange={set('phone')} placeholder="+880 …" />
        </div>

        <div className="flex items-center gap-3 pt-2">
          <Button onClick={save} leftIcon={<Check size={14} />}>Save profile</Button>
          {saved && <span className="text-xs text-success">Saved!</span>}
        </div>
      </Card>

      <Card className="p-5 space-y-4">
        <h3 className="text-sm font-semibold text-fg">Appearance</h3>
        <Switch label="Dark mode" checked={theme === 'dark'} onChange={toggle} />
      </Card>
    </PageContainer>
  );
}
