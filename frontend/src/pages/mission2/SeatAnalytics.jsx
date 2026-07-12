import PageContainer from '../../components/layout/PageContainer.jsx';
import PageHeader from '../../components/layout/PageHeader.jsx';
import Mission2SubNav from '../../components/mission2/Mission2SubNav.jsx';
import Card from '../../components/common/Card.jsx';
import SectionHeader from '../../components/ui/SectionHeader.jsx';
import { StatCard } from '../../components/common/Cards.jsx';
import { BarChart3, PieChart as PieIcon, LineChart as LineIcon, LayoutGrid, Users, Sparkles } from 'lucide-react';
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid,
  PieChart, Pie, Cell, Legend, LineChart, Line,
} from 'recharts';
import { HEIGHT_BUCKETS, CONSTRAINT_DISTRIBUTION, UTILIZATION_TREND, FRONT_ROW_ALLOCATION, SUMMARY } from '../../mocks/data/mission2.js';

export default function SeatAnalytics() {
  return (
    <PageContainer>
      <PageHeader
        title="Seat Planner Analytics"
        subtitle="How the classroom fills up over time — utilization, constraints and heights."
        icon={<BarChart3 size={18} />}
      />
      <Mission2SubNav />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard icon={<LayoutGrid size={16} />} label="Seat Utilization" value={`${Math.round((SUMMARY.totalStudents / SUMMARY.capacity) * 100)}%`} hint="Occupied vs capacity" trend={5.4} />
        <StatCard icon={<Users size={16} />} label="Front Row Allocation" value={SUMMARY.frontRow} hint="Students in row 1" />
        <StatCard icon={<Sparkles size={16} />} label="Plans Generated" value={SUMMARY.generatedPlans} hint="This term" trend={12.4} />
        <StatCard icon={<PieIcon size={16} />} label="Constraint Coverage" value="100%" hint="All priorities honored" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 mt-4">
        <Card className="p-5">
          <SectionHeader title="Student Height Distribution" description="Bucketed by 10 cm ranges." />
          <div className="h-64">
            <ResponsiveContainer>
              <BarChart data={HEIGHT_BUCKETS}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border, #e5e5e5)" />
                <XAxis dataKey="range" stroke="var(--color-muted, #999)" fontSize={11} />
                <YAxis stroke="var(--color-muted, #999)" fontSize={11} allowDecimals={false} />
                <Tooltip contentStyle={{ background: 'var(--color-elevated, #fff)', border: '1px solid var(--color-border, #eee)', borderRadius: 8, fontSize: 12 }} />
                <Bar dataKey="count" fill="var(--color-brand, #FF8F00)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-5">
          <SectionHeader title="Constraint Distribution" description="How priorities split across the roster." />
          <div className="h-64">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={CONSTRAINT_DISTRIBUTION} dataKey="value" nameKey="name" innerRadius={50} outerRadius={90} paddingAngle={2}>
                  {CONSTRAINT_DISTRIBUTION.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Tooltip contentStyle={{ background: 'var(--color-elevated, #fff)', border: '1px solid var(--color-border, #eee)', borderRadius: 8, fontSize: 12 }} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-5">
          <SectionHeader title="Utilization Trend" description="Weekly seat occupancy percentage." />
          <div className="h-64">
            <ResponsiveContainer>
              <LineChart data={UTILIZATION_TREND}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border, #e5e5e5)" />
                <XAxis dataKey="week" stroke="var(--color-muted, #999)" fontSize={11} />
                <YAxis stroke="var(--color-muted, #999)" fontSize={11} domain={[50, 100]} unit="%" />
                <Tooltip contentStyle={{ background: 'var(--color-elevated, #fff)', border: '1px solid var(--color-border, #eee)', borderRadius: 8, fontSize: 12 }} />
                <Line type="monotone" dataKey="utilization" stroke="var(--color-brand, #FF8F00)" strokeWidth={2.5} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-5">
          <SectionHeader title="Front-Row Allocation by Height" description="Short / medium / tall spread per row." />
          <div className="h-64">
            <ResponsiveContainer>
              <BarChart data={FRONT_ROW_ALLOCATION} stackOffset="sign">
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border, #e5e5e5)" />
                <XAxis dataKey="row" stroke="var(--color-muted, #999)" fontSize={11} />
                <YAxis stroke="var(--color-muted, #999)" fontSize={11} allowDecimals={false} />
                <Tooltip contentStyle={{ background: 'var(--color-elevated, #fff)', border: '1px solid var(--color-border, #eee)', borderRadius: 8, fontSize: 12 }} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="short" stackId="a" fill="#0F9D58" radius={[0, 0, 0, 0]} />
                <Bar dataKey="medium" stackId="a" fill="#FBBC04" />
                <Bar dataKey="tall" stackId="a" fill="#C62828" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <Card className="p-5 mt-4">
        <SectionHeader title="Seating Statistics" description="Snapshot of the current classroom state." />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
          <Stat label="Total Students" value={SUMMARY.totalStudents} />
          <Stat label="Classroom Capacity" value={SUMMARY.capacity} />
          <Stat label="Empty Seats" value={SUMMARY.emptySeats} />
          <Stat label="Reserved Seats" value={SUMMARY.reserved} />
          <Stat label="Vision Priority" value={SUMMARY.visionPriority} />
          <Stat label="Hearing Priority" value={SUMMARY.hearingPriority} />
          <Stat label="Front-Row Required" value={SUMMARY.frontRow} />
          <Stat label="Generated Plans" value={SUMMARY.generatedPlans} />
        </div>
      </Card>
    </PageContainer>
  );
}

function Stat({ label, value }) {
  return (
    <div className="rounded-lg border border-border bg-elevated p-3">
      <p className="text-xs text-muted">{label}</p>
      <p className="mt-1 text-lg font-semibold text-fg tabular-nums">{value}</p>
    </div>
  );
}
