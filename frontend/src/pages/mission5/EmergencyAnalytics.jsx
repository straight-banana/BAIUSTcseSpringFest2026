import { ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { BarChart3, Activity, Clock, TrendingUp, MapPin } from 'lucide-react';
import PageContainer from '../../components/layout/PageContainer.jsx';
import PageHeader from '../../components/layout/PageHeader.jsx';
import Card from '../../components/common/Card.jsx';
import SectionHeader from '../../components/ui/SectionHeader.jsx';
import { StatCard } from '../../components/common/Cards.jsx';
import Mission5SubNav from '../../components/mission5/Mission5SubNav.jsx';
import { getSosAnalytics } from '../../services/sosService.js';
import { useEffect, useState } from 'react';

const COLORS = ['#C62828', '#FF8F00', '#FBC02D', '#4C8C2B', '#8B5CF6', '#0891B2', '#EC4899', '#F97316'];
const axisStyle = { fontSize: 11, fill: 'rgb(var(--muted))' };
const gridStyle = { stroke: 'rgb(var(--border))', strokeDasharray: '3 3' };
const tooltipStyle = { background: 'rgb(var(--elevated))', border: '1px solid rgb(var(--border))', borderRadius: 8, fontSize: 12, color: 'rgb(var(--fg))' };

export default function EmergencyAnalytics() {
  const [summary, setSummary] = useState({ total: 0, avgResponse: '—' });
  const [byLocation, setByLocation] = useState([]);
  const [byType, setByType] = useState([]);
  const [responseTime, setResponseTime] = useState([]);
  const [peakHours, setPeakHours] = useState([]);
  const [monthlyTrend, setMonthlyTrend] = useState([]);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await getSosAnalytics();
        if (!alive) return;
        const data = res?.data || res || {};
        setSummary({ total: data.total || 0, avgResponse: data.avgResponse || '—' });
        setByLocation(data.byLocation || []);
        setByType(data.byType || []);
        setResponseTime(data.responseTime || []);
        setPeakHours(data.peakHours || []);
        setMonthlyTrend(data.monthlyTrend || []);
      } catch {
        if (alive) {
          setSummary({ total: 0, avgResponse: '—' });
          setByLocation([]); setByType([]); setResponseTime([]); setPeakHours([]); setMonthlyTrend([]);
        }
      }
    })();
    return () => { alive = false; };
  }, []);

  const peak = [...peakHours].sort((a, b) => (b.alerts || 0) - (a.alerts || 0))[0] || { hour: '—', alerts: 0 };
  return (
    <PageContainer>
      <PageHeader title="Emergency Analytics" subtitle="Trends, hotspots and response performance." icon={<BarChart3 size={18} />} />
      <Mission5SubNav />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard icon={<Activity size={16} />} label="Total Alerts" value={summary.total} hint="All time" trend={9.4} />
        <StatCard icon={<Clock size={16} />}    label="Avg Response" value={summary.avgResponse} hint="Rolling 7d" trend={-6.2} />
        <StatCard icon={<TrendingUp size={16} />} label="Peak Hour" value={peak.hour} hint={`${peak.alerts} alerts`} />
        <StatCard icon={<MapPin size={16} />}   label="Top Location" value={[...(byLocation || [])].sort((a,b)=>b.value-a.value)[0]?.name || '—'} hint="Most reports" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
        <Card className="p-5">
          <SectionHeader title="Alerts by Location" description="Hotspots on campus" />
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={byLocation}>
                <CartesianGrid {...gridStyle} />
                <XAxis dataKey="name" tick={axisStyle} />
                <YAxis tick={axisStyle} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="value" fill="#FF8F00" radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-5">
          <SectionHeader title="Alerts by Type" description="Emergency categories" />
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={byType} dataKey="value" nameKey="name" innerRadius={50} outerRadius={90} paddingAngle={2}>
                  {byType.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-5">
          <SectionHeader title="Response Time" description="Average minutes to accept" />
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={responseTime}>
                <CartesianGrid {...gridStyle} />
                <XAxis dataKey="day" tick={axisStyle} />
                <YAxis tick={axisStyle} />
                <Tooltip contentStyle={tooltipStyle} />
                <Line type="monotone" dataKey="minutes" stroke="#4C8C2B" strokeWidth={2.5} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-5">
          <SectionHeader title="Peak Hours" description="Alerts by hour of day" />
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={peakHours}>
                <defs>
                  <linearGradient id="peak" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#C62828" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="#C62828" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid {...gridStyle} />
                <XAxis dataKey="hour" tick={axisStyle} />
                <YAxis tick={axisStyle} />
                <Tooltip contentStyle={tooltipStyle} />
                <Area type="monotone" dataKey="alerts" stroke="#C62828" strokeWidth={2} fill="url(#peak)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <Card className="p-5 mt-4">
        <SectionHeader title="Monthly Trend" description="Alerts vs resolved" />
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyTrend}>
              <CartesianGrid {...gridStyle} />
              <XAxis dataKey="month" tick={axisStyle} />
              <YAxis tick={axisStyle} />
              <Tooltip contentStyle={tooltipStyle} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="alerts" fill="#C62828" radius={[4,4,0,0]} />
              <Bar dataKey="resolved" fill="#4C8C2B" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </PageContainer>
  );
}
