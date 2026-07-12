import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import PageContainer from '../../components/layout/PageContainer.jsx';
import PageHeader from '../../components/layout/PageHeader.jsx';
import Card from '../../components/common/Card.jsx';
import Badge from '../../components/ui/Badge.jsx';
import { StatCard } from '../../components/common/Cards.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { ROLE_META } from '../../mocks/authUsers.js';

const ROLE_CODE = { student: 'STU', captain: 'CPT', office: 'OFC', teacher: 'TCH' };

export default function RoleDashboardShell({ role, title, subtitle, stats, actions }) {
  const { user } = useAuth();
  const meta = ROLE_META[role] || { label: role };
  const firstName = user?.name?.split(' ')[0] || 'Friend';
  const code = ROLE_CODE[role] || '00';

  return (
    <PageContainer>
      <PageHeader
        eyebrow={`File ${code} · ${meta.label} · Class 9C`}
        title={`${firstName} — ${title}`}
        subtitle={subtitle}
        actions={<Badge tone={role === 'office' ? 'live' : 'neutral'}>{meta.label}</Badge>}
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {stats.map((s) => (
          <StatCard key={s.label} label={s.label} value={s.value} hint={s.hint} />
        ))}
      </div>

      <Card eyebrow="Quick actions · this desk" ref="ACT //" tone="ochre" className="overflow-hidden">
        <ul className="divide-y divide-ink/10">
          {actions.map((a) => (
            <li key={a.label}>
              <Link
                to={a.to}
                className="group grid grid-cols-[40px_minmax(0,1fr)_auto] items-center gap-4 px-5 py-4 hover:bg-ink/[0.03] transition-colors"
              >
                <span className="h-9 w-9 border border-ink/25 grid place-items-center text-ink/70 group-hover:text-ink group-hover:border-ink/50">
                  <a.icon size={16} />
                </span>
                <div className="min-w-0">
                  <p className="font-display text-base text-ink truncate">{a.label}</p>
                  <p className="text-xs text-muted mt-0.5 truncate">{a.description}</p>
                </div>
                <ArrowRight size={14} className="text-ink/40 group-hover:text-ochre group-hover:translate-x-0.5 transition" />
              </Link>
            </li>
          ))}
        </ul>
        <div className="border-t border-ink/10 bg-paper/70 px-5 py-3">
          <p className="font-mono text-[10px] tracking-widest uppercase text-ink/60">
            Role-scoped desk · access gated by registration
          </p>
        </div>
      </Card>
    </PageContainer>
  );
}
