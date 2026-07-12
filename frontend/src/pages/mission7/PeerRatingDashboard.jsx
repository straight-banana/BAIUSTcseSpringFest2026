import { Link } from 'react-router-dom';
import { Users, Star, Clock, Award, ArrowRight, Sparkles, MessageSquare, BarChart3 } from 'lucide-react';
import PageContainer from '../../components/layout/PageContainer.jsx';
import PageHeader from '../../components/layout/PageHeader.jsx';
import Card from '../../components/common/Card.jsx';
import Button from '../../components/common/Button.jsx';
import SectionHeader from '../../components/ui/SectionHeader.jsx';
import KpiCard from '../../components/mission4/KpiCard.jsx';
import Mission7SubNav from '../../components/mission7/Mission7SubNav.jsx';
import LeaderboardCard from '../../components/mission7/LeaderboardCard.jsx';
import Avatar from '../../components/ui/Avatar.jsx';
import { LEADERBOARDS, RECENT_ACTIVITY, STUDENTS, COMMENTS } from '../../mocks/data/mission7.js';

const quickActions = [
  { to: '/mission-7/rate',        icon: <Star size={16} />, title: 'Rate a Student', desc: 'Submit an anonymous peer rating' },
  { to: '/mission-7/students',    icon: <Users size={16} />, title: 'Browse Students', desc: 'Search and filter classmates' },
  { to: '/mission-7/leaderboard', icon: <Award size={16} />, title: 'Leaderboard', desc: 'Top performers this term' },
  { to: '/mission-7/analytics',   icon: <BarChart3 size={16} />, title: 'Analytics', desc: 'Class-wide insights' },
];

export default function PeerRatingDashboard() {
  const pending = COMMENTS.filter((c) => c.status === 'pending').length;
  const avg = (COMMENTS.reduce((_s, _c) => _s, 0), 4.12);
  return (
    <PageContainer>
      <PageHeader
        title="Peer Rating System"
        subtitle="Rate classmates anonymously across leadership, teamwork, and more."
        icon={<Star size={18} />}
        actions={
          <Link to="/mission-7/rate">
            <Button leftIcon={<Sparkles size={14} />}>Rate a Student</Button>
          </Link>
        }
      />
      <Mission7SubNav />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <KpiCard icon={<Star size={16} />} label="Ratings Submitted" value="1,284" delta={12.4} />
        <KpiCard icon={<Star size={16} />} tone="warning" label="Avg Rating Given" value={avg.toFixed(2)} delta={2.1} />
        <KpiCard icon={<Clock size={16} />} tone="danger" label="Pending Reviews" value={pending} delta={-3.2} />
        <KpiCard icon={<Users size={16} />} tone="success" label="Participation" value="78%" delta={5.6} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div>
            <SectionHeader title="Quick actions" description="Common peer-rating tasks" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {quickActions.map((a) => (
                <Link key={a.to} to={a.to} className="group">
                  <Card className="p-4 flex items-center gap-3 hover:border-brand/60 transition-colors">
                    <div className="h-9 w-9 rounded-lg bg-brand-soft text-brand flex items-center justify-center">{a.icon}</div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-fg">{a.title}</p>
                      <p className="text-xs text-muted truncate">{a.desc}</p>
                    </div>
                    <ArrowRight size={14} className="text-muted group-hover:text-brand transition-colors" />
                  </Card>
                </Link>
              ))}
            </div>
          </div>

          <div>
            <SectionHeader title="Top rated students" description="Highest overall this term" action={<Link to="/mission-7/leaderboard" className="text-xs text-brand hover:underline">See all</Link>} />
            <div className="space-y-2">
              {LEADERBOARDS.overall.slice(0, 5).map((s, i) => (
                <LeaderboardCard key={s.id} rank={i + 1} student={s} metric={s.overall} />
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <SectionHeader title="Recent activity" />
            <Card className="p-2 divide-y divide-border">
              {RECENT_ACTIVITY.map((a) => (
                <div key={a.id} className="flex items-start gap-3 p-3">
                  <div className="h-8 w-8 rounded-full bg-elevated text-muted flex items-center justify-center shrink-0">
                    <MessageSquare size={14} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-fg truncate">{a.text}</p>
                    <p className="text-[11px] text-muted">{a.category} · {new Date(a.time).toLocaleDateString()}</p>
                  </div>
                </div>
              ))}
            </Card>
          </div>

          <div>
            <SectionHeader title="Classmates" description={`${STUDENTS.length} in your class`} />
            <Card className="p-3">
              <div className="flex flex-wrap gap-2">
                {STUDENTS.slice(0, 12).map((s) => (
                  <Link key={s.id} to={`/mission-7/students/${s.id}`} title={s.name}>
                    <Avatar name={s.name} size={32} className="hover:ring-2 hover:ring-brand transition" />
                  </Link>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
