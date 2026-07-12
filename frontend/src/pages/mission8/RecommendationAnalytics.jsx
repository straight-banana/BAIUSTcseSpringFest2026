import { BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { BarChart3, Users, Award, TrendingUp } from 'lucide-react';
import PageContainer from '../../components/layout/PageContainer.jsx';
import PageHeader from '../../components/layout/PageHeader.jsx';
import Mission8SubNav from '../../components/mission8/Mission8SubNav.jsx';
import Card from '../../components/common/Card.jsx';
import SectionHeader from '../../components/ui/SectionHeader.jsx';
import KpiCard from '../../components/mission4/KpiCard.jsx';
import { SCORE_DISTRIBUTION, LEADERSHIP_TREND, DEPT_STATS, SELECTION_STATS, SCORE_WEIGHTS, CANDIDATES } from '../../mocks/data/mission8.js';

const PIE = ['rgb(var(--brand))','rgb(var(--warning))','rgb(var(--accent))','rgb(var(--danger))','rgb(var(--success))'];
const tt = { background: 'rgb(var(--elevated))', border: '1px solid rgb(var(--border))', borderRadius: 8, fontSize: 12, color: 'rgb(var(--fg))' };

export default function RecommendationAnalytics() {
  const radar = SCORE_WEIGHTS.map((w) => ({
    subject: w.label,
    score: +(CANDIDATES.reduce((s, c) => s + c.scores[w.key], 0) / CANDIDATES.length).toFixed(1),
  }));

  return (
    <PageContainer>
      <PageHeader title="Recommendation Analytics" subtitle="Selection insights across the cohort." icon={<BarChart3 size={18} />} />
      <Mission8SubNav />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <KpiCard icon={<Users size={16} />} label="Candidates" value={CANDIDATES.length} delta={4.5} />
        <KpiCard icon={<Award size={16} />} tone="success" label="Avg Overall" value={(CANDIDATES.reduce((s,c) => s+c.scores.overall,0)/CANDIDATES.length).toFixed(1)} delta={2.7} />
        <KpiCard icon={<TrendingUp size={16} />} tone="warning" label="Approval Rate" value="61%" delta={5.1} />
        <KpiCard icon={<Users size={16} />} tone="danger" label="Departments" value={DEPT_STATS.length} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card className="p-4">
          <SectionHeader title="Score distribution" description="How many candidates fall in each band" />
          <div style={{ width: '100%', height: 260 }}>
            <ResponsiveContainer>
              <BarChart data={SCORE_DISTRIBUTION}>
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
          <SectionHeader title="Selection statistics" description="Where candidates currently stand" />
          <div style={{ width: '100%', height: 260 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie data={SELECTION_STATS} dataKey="value" nameKey="name" innerRadius={55} outerRadius={95} paddingAngle={2}>
                  {SELECTION_STATS.map((_, i) => <Cell key={i} fill={PIE[i % PIE.length]} />)}
                </Pie>
                <Tooltip contentStyle={tt} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-4">
          <SectionHeader title="Leadership trends" description="Rolling monthly averages" />
          <div style={{ width: '100%', height: 260 }}>
            <ResponsiveContainer>
              <LineChart data={LEADERSHIP_TREND}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgb(var(--border))" vertical={false} />
                <XAxis dataKey="day" stroke="rgb(var(--muted))" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                <YAxis stroke="rgb(var(--muted))" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} domain={[50, 100]} />
                <Tooltip contentStyle={tt} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Line type="monotone" dataKey="score" stroke="rgb(var(--brand))" strokeWidth={2} dot={{ r: 3 }} name="Leadership" />
                <Line type="monotone" dataKey="participation" stroke="rgb(var(--accent))" strokeWidth={2} dot={{ r: 3 }} name="Participation" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-4">
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

      <Card className="p-4 mb-6">
        <SectionHeader title="Top departments" description="Candidate count and average score" />
        <div style={{ width: '100%', height: 260 }}>
          <ResponsiveContainer>
            <BarChart data={DEPT_STATS}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgb(var(--border))" vertical={false} />
              <XAxis dataKey="name" stroke="rgb(var(--muted))" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
              <YAxis stroke="rgb(var(--muted))" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={tt} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="candidates" fill="rgb(var(--brand))" radius={[6, 6, 0, 0]} name="Candidates" />
              <Bar dataKey="avgScore" fill="rgb(var(--accent))" radius={[6, 6, 0, 0]} name="Avg score" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card className="p-4 overflow-x-auto">
        <SectionHeader title="Score heatmap" description="Individual candidates by factor" />
        <table className="w-full text-xs min-w-[720px]">
          <thead>
            <tr className="text-left text-muted">
              <th className="px-2 py-2 font-medium">Candidate</th>
              {SCORE_WEIGHTS.map((w) => <th key={w.key} className="px-2 py-2 font-medium">{w.label}</th>)}
            </tr>
          </thead>
          <tbody>
            {CANDIDATES.slice(0, 8).map((c) => (
              <tr key={c.id} className="border-t border-border">
                <td className="px-2 py-2 font-medium text-fg">{c.name.split(' ')[0]}</td>
                {SCORE_WEIGHTS.map((w) => {
                  const pct = c.scores[w.key] / 100;
                  return (
                    <td key={w.key} className="px-1 py-1">
                      <div className="h-8 rounded-md flex items-center justify-center text-[11px] font-semibold text-fg" style={{ background: `rgba(var(--brand), ${0.15 + pct * 0.55})` }}>
                        {c.scores[w.key]}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </PageContainer>
  );
}
