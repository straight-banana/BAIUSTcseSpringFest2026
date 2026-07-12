import PageContainer from '../../components/layout/PageContainer.jsx';
import PageHeader from '../../components/layout/PageHeader.jsx';
import Mission1SubNav from '../../components/mission1/Mission1SubNav.jsx';
import Card from '../../components/common/Card.jsx';
import Button from '../../components/common/Button.jsx';
import { StatCard } from '../../components/common/Cards.jsx';
import SectionHeader from '../../components/ui/SectionHeader.jsx';
import Table from '../../components/common/Table.jsx';
import StatusBadge from '../../components/mission1/StatusBadge.jsx';
import CategoryBadge from '../../components/mission1/CategoryBadge.jsx';
import {
  FileText, Clock, ClipboardCheck, Flame, ShieldCheck,
  Eye, BarChart3, Download,
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, LineChart, Line,
} from 'recharts';
import {
  complaints, complaintStats, categoryDistribution,
  complaintsOverTime, statusDistribution,
} from '../../mocks/data/complaints.js';

const CAT_COLORS = ['#FBC02D', '#FF8F00', '#C62828', '#6366f1', '#3B82F6', '#EF4444', '#10B981', '#94A3B8'];
const STAT_COLORS = ['#94A3B8', '#FBC02D', '#3B82F6', '#10B981', '#C62828'];
const axis = { stroke: 'rgb(var(--muted))', tick: { fontSize: 11 }, tickLine: false, axisLine: false };
const tooltipStyle = {
  background: 'rgb(var(--elevated))', border: '1px solid rgb(var(--border))',
  borderRadius: 8, fontSize: 12, color: 'rgb(var(--fg))',
};

export default function CaptainDashboard() {
  return (
    <PageContainer>
      <PageHeader
        title="Captain Dashboard"
        subtitle="Monitoring queue for class captains — view-only. Rater identities remain hidden."
        icon={<ShieldCheck size={18} />}
        actions={
          <div className="flex gap-2">
            <Button variant="outline" leftIcon={<Eye size={14} />}>View Reports</Button>
            <Button variant="outline" leftIcon={<Download size={14} />}>Export Summary</Button>
            <Button leftIcon={<BarChart3 size={14} />}>Analytics</Button>
          </div>
        }
      />
      <Mission1SubNav />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard icon={<FileText size={16} />}      label="Total Complaints" value={complaintStats.total} trend={4.1}  hint="All time" />
        <StatCard icon={<Clock size={16} />}         label="Pending Reviews"  value={complaintStats.pending + complaintStats.underReview} trend={-2.3} hint="Awaiting teacher" />
        <StatCard icon={<ClipboardCheck size={16} />} label="Resolved Cases"   value={complaintStats.resolved} trend={6.5} hint="Validated" />
        <StatCard icon={<Flame size={16} />}         label="Critical Cases"   value={complaintStats.critical} trend={1.8} hint="Strike weight ≥ 3" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 mt-6">
        <Card className="xl:col-span-2 p-5">
          <SectionHeader title="Complaints per Week" description="Rolling 14-day intake vs resolved." />
          <div style={{ width: '100%', height: 260 }}>
            <ResponsiveContainer>
              <LineChart data={complaintsOverTime} margin={{ top: 8, right: 12, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgb(var(--border))" vertical={false} />
                <XAxis dataKey="day" {...axis} />
                <YAxis {...axis} />
                <Tooltip contentStyle={tooltipStyle} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Line type="monotone" dataKey="complaints" stroke="rgb(var(--brand))"   strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="resolved"   stroke="rgb(var(--success))" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-5">
          <SectionHeader title="Category Distribution" />
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

      <Card className="p-5 mt-4">
        <SectionHeader title="Status Overview" description="Volume by moderation state." />
        <div style={{ width: '100%', height: 240 }}>
          <ResponsiveContainer>
            <BarChart data={statusDistribution} margin={{ top: 8, right: 12, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgb(var(--border))" vertical={false} />
              <XAxis dataKey="name" {...axis} />
              <YAxis {...axis} />
              <Tooltip contentStyle={tooltipStyle} cursor={{ fill: 'rgb(var(--elevated))' }} />
              <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                {statusDistribution.map((_, i) => <Cell key={i} fill={STAT_COLORS[i % STAT_COLORS.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card className="p-5 mt-4">
        <SectionHeader
          title="Recent Complaints"
          description="Anonymized — no rater identity is ever exposed to captains."
        />
        <Table
          columns={[
            { key: 'id',          label: 'Complaint ID', render: (r) => <span className="font-mono text-xs">{r.id}</span> },
            { key: 'category',    label: 'Category',     render: (r) => <CategoryBadge category={r.category} /> },
            { key: 'submittedAt', label: 'Date',         render: (r) => new Date(r.submittedAt).toLocaleDateString() },
            { key: 'status',      label: 'Status',       render: (r) => <StatusBadge status={r.status} /> },
          ]}
          rows={complaints.slice(0, 8)}
        />
      </Card>
    </PageContainer>
  );
}
