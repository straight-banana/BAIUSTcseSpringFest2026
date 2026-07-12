import PageContainer from '../../components/layout/PageContainer.jsx';
import PageHeader from '../../components/layout/PageHeader.jsx';
import Mission3SubNav from '../../components/mission3/Mission3SubNav.jsx';
import Card from '../../components/common/Card.jsx';
import SectionHeader from '../../components/ui/SectionHeader.jsx';
import { StatCard } from '../../components/common/Cards.jsx';
import { ProgressBar } from '../../components/ui/Progress.jsx';
import {
  BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, RadarChart, Radar,
  PolarGrid, PolarAngleAxis, PolarRadiusAxis, XAxis, YAxis, Tooltip, Legend,
  ResponsiveContainer, CartesianGrid,
} from 'recharts';
import { BarChart3, Clock, CheckCircle2, Flame, Target, Activity, ListChecks } from 'lucide-react';
import { STATS } from '../../mocks/data/mission3.js';

export default function StudyStatistics() {
  const s = STATS;
  return (
    <PageContainer>
      <PageHeader
        title="Study Statistics"
        subtitle="Analytics on your syllabus coverage, hours and streaks."
        icon={<BarChart3 size={18} />}
      />
      <Mission3SubNav />

      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3 mb-4">
        <StatCard icon={<ListChecks size={16} />} label="Topics covered" value={`${s.topicsCovered}/${s.topicsTotal}`} />
        <StatCard icon={<Clock size={16} />} label="Hours planned" value={`${s.hoursPlanned}h`} />
        <StatCard icon={<CheckCircle2 size={16} />} label="Hours done" value={`${s.hoursCompleted}h`} trend={6.4} />
        <StatCard icon={<Flame size={16} />} label="Streak" value={`${s.streak}d`} trend={20} />
        <StatCard icon={<Target size={16} />} label="Completion" value={`${s.completionRate}%`} />
        <StatCard icon={<Activity size={16} />} label="Avg daily" value={`${s.avgDaily}h`} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="p-5">
          <SectionHeader title="Weekly hours" description="Study hours logged per day this week." />
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={s.weekly}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="day" stroke="var(--muted)" fontSize={12} />
                <YAxis stroke="var(--muted)" fontSize={12} />
                <Tooltip contentStyle={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8 }} />
                <Bar dataKey="hours" fill="var(--brand)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-5">
          <SectionHeader title="Time distribution" description="Where your hours went by topic area." />
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={s.distribution} dataKey="value" nameKey="name" innerRadius={50} outerRadius={90} paddingAngle={2}>
                  {s.distribution.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Tooltip contentStyle={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8 }} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-5">
          <SectionHeader title="Planned vs actual" description="14-day trend line." />
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={s.trend}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="day" stroke="var(--muted)" fontSize={12} />
                <YAxis stroke="var(--muted)" fontSize={12} />
                <Tooltip contentStyle={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8 }} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Line type="monotone" dataKey="planned" stroke="var(--brand)" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="actual" stroke="var(--accent)" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-5">
          <SectionHeader title="Skill coverage" description="Radar view of study balance." />
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={s.radar}>
                <PolarGrid stroke="var(--border)" />
                <PolarAngleAxis dataKey="skill" stroke="var(--muted)" fontSize={12} />
                <PolarRadiusAxis stroke="var(--muted)" fontSize={10} />
                <Radar dataKey="A" stroke="var(--brand)" fill="var(--brand)" fillOpacity={0.35} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <Card className="p-5 mt-4">
        <SectionHeader title="Overall completion" description="Across all topics" />
        <div className="flex items-center justify-between text-xs text-muted mb-1">
          <span>{s.hoursCompleted}h of {s.hoursPlanned}h</span>
          <span className="font-mono text-fg">{s.completionRate}%</span>
        </div>
        <ProgressBar value={s.completionRate} />
      </Card>
    </PageContainer>
  );
}
