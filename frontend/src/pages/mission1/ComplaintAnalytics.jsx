import PageContainer from '../../components/layout/PageContainer.jsx';
import PageHeader from '../../components/layout/PageHeader.jsx';
import Mission1SubNav from '../../components/mission1/Mission1SubNav.jsx';
import Card from '../../components/common/Card.jsx';
import Button from '../../components/common/Button.jsx';
import Input from '../../components/forms/Input.jsx';
import Select from '../../components/forms/Select.jsx';
import { StatCard } from '../../components/common/Cards.jsx';
import SectionHeader from '../../components/ui/SectionHeader.jsx';
import CategoryBadge from '../../components/mission1/CategoryBadge.jsx';
import { ProgressBar } from '../../components/ui/Progress.jsx';
import {
  BarChart3, TrendingUp, ClipboardCheck, Clock, Download,
} from 'lucide-react';
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, LineChart, Line, AreaChart, Area,
} from 'recharts';
import {
  complaintStats, categoryDistribution, statusDistribution,
  complaintsOverTime, monthlyTrend, strikeDistribution, resolutionRate,
  CATEGORIES,
} from '../../mocks/data/complaints.js';

const CAT_COLORS = ['#FBC02D', '#FF8F00', '#C62828', '#6366f1', '#3B82F6', '#EF4444', '#10B981', '#94A3B8'];
const STAT_COLORS = ['#94A3B8', '#FBC02D', '#3B82F6', '#10B981', '#C62828'];
const STRIKE_COLORS = ['#94A3B8', '#3B82F6', '#FBC02D', '#C62828'];

const axis = { stroke: 'rgb(var(--muted))', tick: { fontSize: 11 }, tickLine: false, axisLine: false };
const tooltipStyle = {
  background: 'rgb(var(--elevated))', border: '1px solid rgb(var(--border))',
  borderRadius: 8, fontSize: 12, color: 'rgb(var(--fg))',
};

export default function ComplaintAnalytics() {
  const topCats = [...categoryDistribution].sort((a, b) => b.value - a.value).slice(0, 5);
  const maxCat = topCats[0]?.value || 1;

  return (
    <PageContainer>
      <PageHeader
        title="Complaint Analytics"
        subtitle="Aggregate insights across all anonymous reports — never linked to individuals."
        icon={<BarChart3 size={18} />}
        actions={
          <Button variant="outline" leftIcon={<Download size={14} />}>Export</Button>
        }
      />
      <Mission1SubNav />

      {/* Filter bar */}
      <Card className="p-4 mb-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 items-end">
          <Input label="From" type="date" defaultValue="2026-01-01" />
          <Input label="To"   type="date" defaultValue="2026-03-31" />
          <Select label="Category" defaultValue="">
            <option value="">All categories</option>
            {CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
          </Select>
          <Select label="Granularity" defaultValue="daily">
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </Select>
        </div>
      </Card>

      {/* Top-line stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard icon={<BarChart3 size={16} />}      label="Total Complaints"         value={complaintStats.total} trend={7.2} />
        <StatCard icon={<Clock size={16} />}          label="Avg. Resolution Time"     value={`${complaintStats.avgResolutionHours}h`} trend={-3.1} />
        <StatCard icon={<TrendingUp size={16} />}     label="Pending Cases"            value={complaintStats.pending + complaintStats.underReview} trend={2.4} />
        <StatCard icon={<ClipboardCheck size={16} />} label="Resolved Cases"           value={complaintStats.resolved} trend={5.6} />
      </div>

      {/* Row 1 — trends */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 mt-6">
        <Card className="xl:col-span-2 p-5">
          <SectionHeader title="Complaint Trends" description="Last 14 days · intake vs resolved" />
          <div style={{ width: '100%', height: 260 }}>
            <ResponsiveContainer>
              <AreaChart data={complaintsOverTime} margin={{ top: 8, right: 12, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="gA" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%"  stopColor="rgb(var(--brand))"   stopOpacity={0.5} />
                    <stop offset="100%" stopColor="rgb(var(--brand))"   stopOpacity={0}   />
                  </linearGradient>
                  <linearGradient id="gB" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%"  stopColor="rgb(var(--success))" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="rgb(var(--success))" stopOpacity={0}   />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgb(var(--border))" vertical={false} />
                <XAxis dataKey="day" {...axis} />
                <YAxis {...axis} />
                <Tooltip contentStyle={tooltipStyle} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Area type="monotone" dataKey="complaints" stroke="rgb(var(--brand))"   fill="url(#gA)" strokeWidth={2} />
                <Area type="monotone" dataKey="resolved"   stroke="rgb(var(--success))" fill="url(#gB)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-5">
          <SectionHeader title="Complaint Categories" />
          <div style={{ width: '100%', height: 260 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie data={categoryDistribution} dataKey="value" nameKey="name" innerRadius={50} outerRadius={90} paddingAngle={2}>
                  {categoryDistribution.map((_, i) => <Cell key={i} fill={CAT_COLORS[i % CAT_COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Row 2 — monthly + strike + resolution */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 mt-4">
        <Card className="p-5">
          <SectionHeader title="Monthly Reports" description="Filed vs resolved" />
          <div style={{ width: '100%', height: 240 }}>
            <ResponsiveContainer>
              <BarChart data={monthlyTrend} margin={{ top: 8, right: 12, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgb(var(--border))" vertical={false} />
                <XAxis dataKey="month" {...axis} />
                <YAxis {...axis} />
                <Tooltip contentStyle={tooltipStyle} cursor={{ fill: 'rgb(var(--elevated))' }} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="count"    fill="rgb(var(--brand))"   radius={[6, 6, 0, 0]} />
                <Bar dataKey="resolved" fill="rgb(var(--success))" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-5">
          <SectionHeader title="Resolution Rate" description="% of complaints resolved" />
          <div style={{ width: '100%', height: 240 }}>
            <ResponsiveContainer>
              <LineChart data={resolutionRate} margin={{ top: 8, right: 12, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgb(var(--border))" vertical={false} />
                <XAxis dataKey="month" {...axis} />
                <YAxis {...axis} unit="%" />
                <Tooltip contentStyle={tooltipStyle} />
                <Line type="monotone" dataKey="rate" stroke="rgb(var(--success))" strokeWidth={2} dot />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-5">
          <SectionHeader title="Strike Distribution" description="Points assigned per complaint" />
          <div style={{ width: '100%', height: 240 }}>
            <ResponsiveContainer>
              <BarChart data={strikeDistribution} margin={{ top: 8, right: 12, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgb(var(--border))" vertical={false} />
                <XAxis dataKey="weight" {...axis} />
                <YAxis {...axis} />
                <Tooltip contentStyle={tooltipStyle} cursor={{ fill: 'rgb(var(--elevated))' }} />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {strikeDistribution.map((_, i) => <Cell key={i} fill={STRIKE_COLORS[i]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Row 3 — status + top categories */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 mt-4">
        <Card className="p-5">
          <SectionHeader title="Status Distribution" />
          <div style={{ width: '100%', height: 240 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie data={statusDistribution} dataKey="value" nameKey="name" innerRadius={45} outerRadius={85} paddingAngle={2}>
                  {statusDistribution.map((_, i) => <Cell key={i} fill={STAT_COLORS[i % STAT_COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="xl:col-span-2 p-5">
          <SectionHeader title="Top Categories" description="Ranked by volume" />
          <ul className="space-y-3 mt-1">
            {topCats.map((c) => {
              const meta = CATEGORIES.find((x) => x.value === c.key);
              return (
                <li key={c.key}>
                  <div className="flex items-center justify-between mb-1.5">
                    <CategoryBadge category={c.key} />
                    <span className="text-xs font-mono text-muted">{c.value}</span>
                  </div>
                  <ProgressBar
                    value={(c.value / maxCat) * 100}
                    tone={meta?.tone === 'danger' ? 'danger' : meta?.tone === 'warning' ? 'warning' : 'brand'}
                  />
                </li>
              );
            })}
          </ul>
        </Card>
      </div>
    </PageContainer>
  );
}
