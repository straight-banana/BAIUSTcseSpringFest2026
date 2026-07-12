import PageContainer from '../components/layout/PageContainer.jsx';
import PageHeader from '../components/layout/PageHeader.jsx';
import Card from '../components/common/Card.jsx';
import Avatar from '../components/ui/Avatar.jsx';
import Badge from '../components/ui/Badge.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useEffect, useState } from 'react';
import { User, Mail, IdCard, GraduationCap, Phone, MapPin, BookOpen, Briefcase } from 'lucide-react';

const PROFILE_KEY = 'akp:profile';

const ROLE_LABEL = {
  student: 'Student',
  captain: 'Class Captain',
  teacher: 'Teacher',
  office: 'Office',
};

export default function Profile() {
  const { user, role } = useAuth();
  const [saved, setSaved] = useState({});

  useEffect(() => {
    try {
      const raw = localStorage.getItem(PROFILE_KEY);
      if (raw) setSaved(JSON.parse(raw) || {});
    } catch {}
  }, []);

  const isStaff = role === 'teacher' || role === 'office';
  const roleLabel = ROLE_LABEL[role] || 'Member';

  const name = saved.name || user?.name || user?.rollNumber || 'Guest';
  const roll = user?.rollNumber || user?.roll || saved.roll || '—';
  const className = saved.className || user?.className || '—';
  const section = saved.section || user?.section || '';
  const classDisplay = isStaff
    ? '—'
    : className && className !== '—'
      ? `Class ${className}${section ? ` · Section ${section}` : ''}`
      : '—';
  const email = saved.email || user?.email || '—';
  const phone = saved.phone || user?.phone || '—';
  const address = saved.address || user?.address || '—';
  const subject = saved.subject || user?.subject || '—';
  const staffRole = saved.staffRole || user?.staffRole || roleLabel;

  return (
    <PageContainer>
      <PageHeader title="Profile" subtitle="Your personal record." icon={<User size={18} />} />

      <Card className="p-6 flex items-center gap-5">
        <Avatar name={name} size={72} />
        <div className="min-w-0">
          <p className="font-display text-xl text-ink truncate">{name}</p>
          <div className="mt-1 flex flex-wrap items-center gap-2">
            <Badge tone="brand">{roleLabel}</Badge>
            {!isStaff && classDisplay !== '—' && <Badge tone="neutral">{classDisplay}</Badge>}
            {isStaff && subject !== '—' && <Badge tone="neutral">{subject}</Badge>}
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
        <InfoRow icon={<IdCard size={16} />} label={isStaff ? 'Staff ID' : 'Roll'} value={roll} />
        {isStaff ? (
          <>
            <InfoRow icon={<BookOpen size={16} />} label="Subject" value={subject} />
            <InfoRow icon={<Briefcase size={16} />} label="Role" value={staffRole} />
          </>
        ) : (
          <InfoRow icon={<GraduationCap size={16} />} label="Class" value={classDisplay} />
        )}
        <InfoRow icon={<Mail size={16} />} label="Email" value={email} />
        <InfoRow icon={<Phone size={16} />} label="Phone" value={phone} />
        <InfoRow icon={<MapPin size={16} />} label="Address" value={address} />
      </div>
    </PageContainer>
  );
}

function InfoRow({ icon, label, value }) {
  return (
    <Card className="p-4 flex items-center gap-3">
      <span className="h-9 w-9 grid place-items-center border border-ink/15 text-ink/70">{icon}</span>
      <div className="min-w-0">
        <p className="font-mono text-[10px] uppercase tracking-widest text-ink/50">{label}</p>
        <p className="text-sm text-ink truncate">{value || '—'}</p>
      </div>
    </Card>
  );
}
