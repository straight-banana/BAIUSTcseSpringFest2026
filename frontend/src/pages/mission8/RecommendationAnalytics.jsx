import { useEffect, useState } from 'react';
import { BarChart, Bar, PieChart, Pie, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { BarChart3, Users, Award } from 'lucide-react';
import PageContainer from '../../components/layout/PageContainer.jsx';
import PageHeader from '../../components/layout/PageHeader.jsx';
import Mission8SubNav from '../../components/mission8/Mission8SubNav.jsx';
import Card from '../../components/common/Card.jsx';
import SectionHeader from '../../components/ui/SectionHeader.jsx';
import KpiCard from '../../components/mission4/KpiCard.jsx';
import LoadingState from '../../components/feedback/Loading.jsx';
import ErrorState from '../../components/feedback/ErrorState.jsx';
import { getCurrentRound, getRankedCandidates, getAnalytics, weightsToList } from '../../services/candidatesService.js';

const PIE = ['rgb(var(--brand))','rgb(var(--warning))','rgb(var(--accent))','rgb(var(--danger))','rgb(var(--success))'];
const tt = { background: 'rgb(var(--elevated))', border: '1px solid rgb(var(--border))', borderRadius: 8, fontSize: 12, color: 'rgb(var(--fg))' };

export default function RecommendationAnalytics() {
  const [candidates, setCandidates] = useState([]);
  const [weights, setWeights] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    getCurrentRound()
      .then((round) => {
        if (!active || !round) return null;
        setWeights(weightsToList(round.weights));
        return Promise.all([getRankedCandidates(round.id), getAnalytics(round.id)]);
      })
      .then((result) => {
        if (!active || !result) return;
        const [ranked, analyticsData] = result;
        setCandidates(ranked || []);
        setAnalytics(analyticsData);
      })
      .catch((err) => { if (active) setError(err?.message || 'Unable to load analytics'); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  if (loading) {
    return (
      <PageContainer>
        <PageHeader title="Recommendation Analytics" subtitle="Selection insights across the cohort." icon={<BarChart3 size={18} />} />
        <Mission8SubNav />
        <LoadingState label="Loading analytics..." />
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer>
        <PageHeader title="Recommendation Analytics" subtitle="Selection insights across the cohort." icon={<BarChart3 size={18} />} />
        <Mission8SubNav />
        <ErrorState title="Couldn't load analytics" message={error} />
      </PageContainer>
    );
  }

  const radar = weights.map((w) => ({
    subject: w.label,
    score: candidates.length ? +(candidates.reduce((s, c) => s + (c.scores?.[w.key] || 0), 0) / candidates.length).toFixed(1) : 0,
  }));

  const scoreDistribution = (() => {
    const buckets = { '90-100': 0, '80-89': 0, '70-79': 0, '60-69': 0, '<60': 0 };
    candidates.forEach((c) => {
      const v = c.scores?.overall ?? 0;
      if (v >= 90) buckets['90-100']++;
      else if (v >= 80) buckets['80-89']++;
      else if (v >= 70) buckets['70-79']++;
      else if (v >= 60) buckets['60-69']++;
      else buckets['<60']++;
    });
    return Object.entries(buckets).map(([name, value]) => ({ name, value }));
  })();

  const byBadge = analytics?.byBadge || {};
  const selectionStats = Object.entries(byBadge).map(([name, value]) => ({ name, value }));

  return (
    <PageContainer>
      <PageHeader title="Recommendation Analytics" subtitle="Selection insights across the cohort." icon={<BarChart3 size={18} />} />
      <Mission8SubNav />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <KpiCard icon={<Users size={16} />} label="Candidates" value={analytics?.total ?? candidates.length} />
        <KpiCard icon={<Award size={16} />} tone="success" label="Avg Overall" value={analytics?.avgScore ?? 0} />
        <KpiCard icon={<Users size={16} />} tone="warning" label="Manual Overrides" value={analytics?.overrideCount ?? 0} />
        <KpiCard icon={<Users size={16} />} tone="danger" label="Categories" value={weights.length} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card className="p-4">
          <SectionHeader title="Score distribution" description="How many candidates fall in each band" />
          <div style={{ width: '100%', height: 260 }}>
            <ResponsiveContainer>
              <BarChart data={scoreDistribution}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgb(var(--border))" vertical={false} />
                <XAxis dataKey="name" stroke="rgb(var(--muted))" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                <YAxis stroke="rgb(var(--muted))" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={tt} />
                <Bar dataKey="value" fill="rgb(var(--brand))" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-4">
          <SectionHeader title="Selection statistics" description="Badge distribution across candidates" />
          {selectionStats.length === 0 ? (
            <p className="text-sm text-muted">No candidates yet.</p>
          ) : (
            <div style={{ width: '100%', height: 260 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie data={selectionStats} dataKey="value" nameKey="name" innerRadius={55} outerRadius={95} paddingAngle={2}>
                    {selectionStats.map((_, i) => <Cell key={i} fill={PIE[i % PIE.length]} />)}
                  </Pie>
                  <Tooltip contentStyle={tt} />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </Card>

        <Card className="p-4 lg:col-span-2">
          <SectionHeader title="Cohort radar" description="Average profile across factors" />
          <div style={{ width: '100%', height: 260 }}>
            <ResponsiveContainer>
              <RadarChart data={radar}>
                <PolarGrid stroke="rgb(var(--border))" />
                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fill: 'rgb(var(--muted))' }} />
                <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 10 }} />
                <Radar dataKey="score" stroke="rgb(var(--brand))" fill="rgb(var(--brand))" fillOpacity={0.35} />
                <Tooltip contentStyle={tt} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {candidates.length > 0 && (
        <Card className="p-4 overflow-x-auto">
          <SectionHeader title="Score heatmap" description="Individual candidates by factor" />
          <table className="w-full text-xs min-w-[720px]">
            <thead>
              <tr className="text-left text-muted">
                <th className="px-2 py-2 font-medium">Candidate</th>
                {weights.map((w) => <th key={w.key} className="px-2 py-2 font-medium">{w.label}</th>)}
              </tr>
            </thead>
            <tbody>
              {candidates.slice(0, 8).map((c) => (
                <tr key={c.id} className="border-t border-border">
                  <td className="px-2 py-2 font-medium text-fg">{c.name?.split(' ')[0]}</td>
                  {weights.map((w) => {
                    const val = c.scores?.[w.key] ?? 0;
                    const pct = val / 100;
                    return (
                      <td key={w.key} className="px-1 py-1">
                        <div className="h-8 rounded-md flex items-center justify-center text-[11px] font-semibold text-fg" style={{ background: `rgba(var(--brand), ${0.15 + pct * 0.55})` }}>
                          {val}
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
    </PageContainer>
  );
}
