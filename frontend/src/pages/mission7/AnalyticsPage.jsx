import { useEffect, useMemo, useState } from 'react';
import { BarChart3, TrendingUp, Users, Star } from 'lucide-react';
import { BarChart, Bar, PieChart, Pie, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import PageContainer from '../../components/layout/PageContainer.jsx';
import PageHeader from '../../components/layout/PageHeader.jsx';
import Mission7SubNav from '../../components/mission7/Mission7SubNav.jsx';
import Card from '../../components/common/Card.jsx';
import SectionHeader from '../../components/ui/SectionHeader.jsx';
import KpiCard from '../../components/mission4/KpiCard.jsx';
import LeaderboardCard from '../../components/mission7/LeaderboardCard.jsx';
import LoadingState from '../../components/feedback/Loading.jsx';
import ErrorState from '../../components/feedback/ErrorState.jsx';
import { getLeaderboard, getAnalytics, RATING_CATEGORIES } from '../../services/ratingsService.js';

const PIE_COLORS = ['rgb(var(--brand))','rgb(var(--accent))','rgb(var(--success))','rgb(var(--warning))','rgb(var(--danger))'];

const tooltipStyle = { background: 'rgb(var(--elevated))', border: '1px solid rgb(var(--border))', borderRadius: 8, fontSize: 12, color: 'rgb(var(--fg))' };

export default function AnalyticsPage() {
  const [board, setBoard] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    Promise.all([getLeaderboard(), getAnalytics()])
      .then(([boardData, analyticsData]) => {
        if (!active) return;
        setBoard(Array.isArray(boardData) ? boardData : []);
        setAnalytics(analyticsData);
      })
      .catch((err) => { if (active) setError(err?.message || 'Unable to load analytics'); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  const rated = useMemo(() => board.filter((s) => s.ratingCount > 0), [board]);

  const avgRating = rated.length ? rated.reduce((a, s) => a + s.overall, 0) / rated.length : 0;
  const participationPct = board.length ? Math.round((rated.length / board.length) * 100) : 0;

  const categoryPerformance = RATING_CATEGORIES.map((c) => ({
    name: c.label,
    score: rated.length ? +(rated.reduce((a, s) => a + (s.breakdown?.[c.key] || 0), 0) / rated.length).toFixed(2) : 0,
  }));

  const ratingDistribution = useMemo(() => {
    const buckets = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    rated.forEach((s) => { buckets[Math.min(5, Math.max(1, Math.round(s.overall)))] += 1; });
    return [5, 4, 3, 2, 1].map((n) => ({ name: `${n} ★`, value: buckets[n] }));
  }, [rated]);

  const heatmap = rated.slice(0, 8).map((s) => ({
    name: s.name.split(' ')[0],
    values: RATING_CATEGORIES.map((c) => ({ key: c.key, label: c.label, v: s.breakdown?.[c.key] || 0 })),
  }));

  const topRated = [...rated].sort((a, b) => b.overall - a.overall).slice(0, 6);

  if (loading) {
    return (
      <PageContainer>
        <PageHeader title="Rating Analytics" subtitle="Class-wide participation and performance insights." icon={<BarChart3 size={18} />} />
        <Mission7SubNav />
        <LoadingState label="Loading analytics..." />
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer>
        <PageHeader title="Rating Analytics" subtitle="Class-wide participation and performance insights." icon={<BarChart3 size={18} />} />
        <Mission7SubNav />
        <ErrorState title="Couldn't load analytics" message={error} />
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <PageHeader title="Rating Analytics" subtitle="Class-wide participation and performance insights." icon={<BarChart3 size={18} />} />
      <Mission7SubNav />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <KpiCard icon={<Star size={16} />} label="Average Rating" value={avgRating.toFixed(2)} />
        <KpiCard icon={<Users size={16} />} tone="success" label="Participation" value={`${participationPct}%`} />
        <KpiCard icon={<TrendingUp size={16} />} tone="warning" label="Categories Tracked" value={String(RATING_CATEGORIES.length)} />
        <KpiCard icon={<Users size={16} />} tone="danger" label="Total Ratings" value={analytics?.total ?? 0} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card className="p-4">
          <SectionHeader title="Category performance" description="Average score per category" />
          <div style={{ width: '100%', height: 260 }}>
            <ResponsiveContainer>
              <BarChart data={categoryPerformance}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgb(var(--border))" vertical={false} />
                <XAxis dataKey="name" stroke="rgb(var(--muted))" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} interval={0} angle={-15} textAnchor="end" height={60} />
                <YAxis stroke="rgb(var(--muted))" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} domain={[0, 5]} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="score" fill="rgb(var(--brand))" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-4">
          <SectionHeader title="Rating distribution" description="How the class is rating overall" />
          <div style={{ width: '100%', height: 260 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie data={ratingDistribution} dataKey="value" nameKey="name" innerRadius={60} outerRadius={95} paddingAngle={2}>
                  {ratingDistribution.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-4 lg:col-span-2">
          <SectionHeader title="Category radar" description="Class-average profile" />
          <div style={{ width: '100%', height: 260 }}>
            <ResponsiveContainer>
              <RadarChart data={categoryPerformance}>
                <PolarGrid stroke="rgb(var(--border))" />
                <PolarAngleAxis dataKey="name" tick={{ fontSize: 10, fill: 'rgb(var(--muted))' }} />
                <PolarRadiusAxis angle={90} domain={[0, 5]} tick={{ fontSize: 10 }} />
                <Radar dataKey="score" stroke="rgb(var(--brand))" fill="rgb(var(--brand))" fillOpacity={0.35} />
                <Tooltip contentStyle={tooltipStyle} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {heatmap.length > 0 && (
        <Card className="p-4 mb-6 overflow-x-auto">
          <SectionHeader title="Rating heatmap" description="Individual scores by category" />
          <table className="w-full text-xs min-w-[720px]">
            <thead>
              <tr className="text-left text-muted">
                <th className="px-2 py-2 font-medium">Student</th>
                {RATING_CATEGORIES.map((c) => (<th key={c.key} className="px-2 py-2 font-medium">{c.label}</th>))}
              </tr>
            </thead>
            <tbody>
              {heatmap.map((row) => (
                <tr key={row.name} className="border-t border-border">
                  <td className="px-2 py-2 font-medium text-fg">{row.name}</td>
                  {row.values.map((v) => {
                    const pct = v.v / 5;
                    return (
                      <td key={v.key} className="px-1 py-1">
                        <div
                          className="h-8 rounded-md flex items-center justify-center text-[11px] font-semibold text-fg"
                          style={{ background: `rgba(var(--brand), ${0.15 + pct * 0.6})` }}
                        >
                          {v.v.toFixed(1)}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}

      <div>
        <SectionHeader title="Highest rated students" />
        {topRated.length === 0 ? (
          <p className="text-sm text-muted">No ratings yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {topRated.map((s, i) => (
              <LeaderboardCard key={s.id} rank={i + 1} student={s} metric={s.overall} />
            ))}
          </div>
        )}
      </div>
    </PageContainer>
  );
}
