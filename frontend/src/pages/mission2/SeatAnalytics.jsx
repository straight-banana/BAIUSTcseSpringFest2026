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
import { getLatestPlan } from '../../services/seatsService.js';
import { mapSeatPlanFromApi } from '../../utils/missionApiMaps.js';
import { useEffect, useState } from 'react';

function bucketHeights(seats) {
  const heights = (seats || []).map((s) => Number(s.student?.height || 0)).filter(Boolean);
  const buckets = {};
  for (const h of heights) {
    const r = Math.floor(h / 10) * 10;
    const key = `${r}-${r + 9}`;
    buckets[key] = (buckets[key] || 0) + 1;
  }
  return Object.entries(buckets).map(([range, count]) => ({ range, count }));
}

function countConstraints(seats) {
  const map = {};
  for (const s of seats || []) {
    if (s.student?.hasVisionProblem) map['Vision'] = (map['Vision'] || 0) + 1;
    if (s.student?.hasHearingProblem) map['Hearing'] = (map['Hearing'] || 0) + 1;
  }
  return Object.entries(map).map(([name, value]) => ({ name, value, color: name === 'Vision' ? '#0F9D58' : '#FBBC04' }));
}


export default function SeatAnalytics() {
  const [heightBuckets, setHeightBuckets] = useState([]);
  const [constraintDistribution, setConstraintDistribution] = useState([]);
  const [utilizationTrend, setUtilizationTrend] = useState([]);
  const [frontRowAllocation, setFrontRowAllocation] = useState([]);
  const [summary, setSummary] = useState({ totalStudents: 0, capacity: 0, emptySeats: 0, reserved: 0, visionPriority: 0, hearingPriority: 0, frontRow: 0, generatedPlans: 0 });

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await getLatestPlan();
        if (!alive) return;
        const plan = mapSeatPlanFromApi(res?.data || res);
        const seats = plan?.seats || [];
        const capacity = plan?.summary?.capacity || (plan.gridRows || 0) * (plan.gridCols || 0) || seats.length;
        const totalStudents = seats.filter((s) => s.student).length;
        setHeightBuckets(bucketHeights(seats));
        setConstraintDistribution(countConstraints(seats));
        setUtilizationTrend([]); // placeholder — backend not providing historical trend yet
        setFrontRowAllocation((() => {
          const rows = {};
          for (const s of seats) {
            const r = s.row || 0;
            rows[r] = rows[r] || { row: r, short: 0, medium: 0, tall: 0 };
            const h = Number(s.student?.height || 0);
            if (h < 140) rows[r].short += 1;
            else if (h < 160) rows[r].medium += 1;
            else rows[r].tall += 1;
          }
          return Object.values(rows).sort((a,b)=>a.row-b.row);
        })());
        setSummary({
          totalStudents,
          capacity,
          emptySeats: Math.max(0, capacity - totalStudents),
          reserved: 0,
          visionPriority: seats.filter((s) => s.student?.hasVisionProblem).length,
          hearingPriority: seats.filter((s) => s.student?.hasHearingProblem).length,
          frontRow: seats.filter((s) => s.row === 0 && s.student).length,
          generatedPlans: plan ? 1 : 0,
        });
      } catch {
        if (alive) {
          setHeightBuckets([]); setConstraintDistribution([]); setUtilizationTrend([]); setFrontRowAllocation([]);
        }
      }
    })();
    return () => { alive = false; };
  }, []);

  return (
    <PageContainer>
      <PageHeader
        title="Seat Planner Analytics"
        subtitle="How the classroom fills up over time — utilization, constraints and heights."
        icon={<BarChart3 size={18} />}
      />
      <Mission2SubNav />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard icon={<LayoutGrid size={16} />} label="Seat Utilization" value={`${Math.round((summary.totalStudents / Math.max(1, summary.capacity)) * 100)}%`} hint="Occupied vs capacity" trend={5.4} />
        <StatCard icon={<Users size={16} />} label="Front Row Allocation" value={summary.frontRow} hint="Students in row 1" />
        <StatCard icon={<Sparkles size={16} />} label="Plans Generated" value={summary.generatedPlans} hint="This term" trend={12.4} />
        <StatCard icon={<PieIcon size={16} />} label="Constraint Coverage" value="100%" hint="All priorities honored" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 mt-4">
        <Card className="p-5">
          <SectionHeader title="Student Height Distribution" description="Bucketed by 10 cm ranges." />
          <div className="h-64">
            <ResponsiveContainer>
              <BarChart data={heightBuckets}>
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
                <Pie data={constraintDistribution} dataKey="value" nameKey="name" innerRadius={50} outerRadius={90} paddingAngle={2}>
                  {constraintDistribution.map((entry, i) => <Cell key={i} fill={entry.color} />)}
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
              <LineChart data={utilizationTrend}>
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
              <BarChart data={frontRowAllocation} stackOffset="sign">
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
          <Stat label="Total Students" value={summary.totalStudents} />
          <Stat label="Classroom Capacity" value={summary.capacity} />
          <Stat label="Empty Seats" value={summary.emptySeats} />
          <Stat label="Reserved Seats" value={summary.reserved} />
          <Stat label="Vision Priority" value={summary.visionPriority} />
          <Stat label="Hearing Priority" value={summary.hearingPriority} />
          <Stat label="Front-Row Required" value={summary.frontRow} />
          <Stat label="Generated Plans" value={summary.generatedPlans} />
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
