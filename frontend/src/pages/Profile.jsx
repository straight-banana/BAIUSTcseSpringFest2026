import PageContainer from '../components/layout/PageContainer.jsx';
import PageHeader from '../components/layout/PageHeader.jsx';
import Card from '../components/common/Card.jsx';
import Avatar from '../components/ui/Avatar.jsx';
import Badge from '../components/ui/Badge.jsx';
import { User, Mail, IdCard, GraduationCap, Phone, MapPin } from 'lucide-react';

const user = {
  name: 'Abdus Salam',
  role: 'Student',
  roll: '2026-09-014',
  className: 'Class 9C',
  email: 'abdus.salam@baiust.edu.bd',
  phone: '+880 1700 000000',
  address: 'Cumilla, Bangladesh',
};

export default function Profile() {
  return (
    <PageContainer>
      <PageHeader title="Profile" subtitle="Your personal record." icon={<User size={18} />} />

      <Card className="p-6 flex items-center gap-5">
        <Avatar name={user.name} size={72} />
        <div className="min-w-0">
          <p className="font-display text-xl text-ink truncate">{user.name}</p>
          <div className="mt-1 flex flex-wrap items-center gap-2">
            <Badge tone="brand">{user.role}</Badge>
            <Badge tone="neutral">{user.className}</Badge>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
        <InfoRow icon={<IdCard size={16} />} label="Roll" value={user.roll} />
        <InfoRow icon={<GraduationCap size={16} />} label="Class" value={user.className} />
        <InfoRow icon={<Mail size={16} />} label="Email" value={user.email} />
        <InfoRow icon={<Phone size={16} />} label="Phone" value={user.phone} />
        <InfoRow icon={<MapPin size={16} />} label="Address" value={user.address} />
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
        <p className="text-sm text-ink truncate">{value}</p>
      </div>
    </Card>
  );
}
