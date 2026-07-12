import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, Star, CheckCircle2, Award, ArrowRight, Sparkles, BarChart3 } from 'lucide-react';
import PageContainer from '../../components/layout/PageContainer.jsx';
import PageHeader from '../../components/layout/PageHeader.jsx';
import Card from '../../components/common/Card.jsx';
import Button from '../../components/common/Button.jsx';
import SectionHeader from '../../components/ui/SectionHeader.jsx';
import KpiCard from '../../components/mission4/KpiCard.jsx';
import Mission7SubNav from '../../components/mission7/Mission7SubNav.jsx';
import LeaderboardCard from '../../components/mission7/LeaderboardCard.jsx';
import Avatar from '../../components/ui/Avatar.jsx';
import LoadingState from '../../components/feedback/Loading.jsx';
import ErrorState from '../../components/feedback/ErrorState.jsx';
import { getLeaderboard, getRoster, getMyRated } from '../../services/ratingsService.js';

const quickActions = [
  { to: '/mission-7/rate',        icon: <Star size={16} />, title: 'Rate a Student', desc: 'Submit an anonymous peer rating' },
  { to: '/mission-7/students',    icon: <Users size={16} />, title: 'Browse Students', desc: 'Search and filter classmates' },
  { to: '/mission-7/leaderboard', icon: <Award size={16} />, title: 'Leaderboard', desc: 'Top performers this term' },
  { to: '/mission-7/analytics',   icon: <BarChart3 size={16} />, title: 'Analytics', desc: 'Class-wide insights' },
];

export default function PeerRatingDashboard() {
  const [board, setBoard] = useState([]);
  const [roster, setRoster] = useState([]);
  const [myRatedCount, setMyRatedCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    Promise.all([getLeaderboard(), getRoster(), getMyRated()])
      .then(([boardData, rosterData, myRated]) => {
        if (!active) return;
        setBoard(Array.isArray(boardData) ? boardData : []);
        setRoster(Array.isArray(rosterData) ? rosterData : []);
        setMyRatedCount(Array.isArray(myRated) ? myRated.length : 0);
      })
      .catch((err) => { if (active) setError(err?.message || 'Unable to load peer rating dashboard'); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  const rated = board.filter((s) => s.ratingCount > 0);
  const totalRatings = board.reduce((a, s) => a + s.ratingCount, 0);
  const avgGiven = rated.length ? rated.reduce((a, s) => a + s.overall, 0) / rated.length : 0;
  const participationPct = board.length ? Math.round((rated.length / board.length) * 100) : 0;
  const topRated = [...rated].sort((a, b) => b.overall - a.overall).slice(0, 5);

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

      {loading ? (
        <LoadingState label="Loading dashboard..." />
      ) : error ? (
        <ErrorState title="Couldn't load dashboard" message={error} />
      ) : (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
            <KpiCard icon={<Star size={16} />} label="Ratings Submitted" value={totalRatings} />
            <KpiCard icon={<Star size={16} />} tone="warning" label="Avg Rating Given" value={avgGiven.toFixed(2)} />
            <KpiCard icon={<CheckCircle2 size={16} />} tone="success" label="You've Rated" value={myRatedCount} />
            <KpiCard icon={<Users size={16} />} tone="success" label="Participation" value={`${participationPct}%`} />
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
                {topRated.length === 0 ? (
                  <p className="text-sm text-muted">No ratings yet.</p>
                ) : (
                  <div className="space-y-2">
                    {topRated.map((s, i) => (
                      <LeaderboardCard key={s.id} rank={i + 1} student={s} metric={s.overall} />
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <SectionHeader title="Classmates" description={`${roster.length} in your class`} />
                <Card className="p-3">
                  <div className="flex flex-wrap gap-2">
                    {roster.slice(0, 12).map((s) => (
                      <Link key={s.id} to={`/mission-7/students/${s.id}`} title={s.name}>
                        <Avatar name={s.name} size={32} className="hover:ring-2 hover:ring-brand transition" />
                      </Link>
                    ))}
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </>
      )}
    </PageContainer>
  );
}
