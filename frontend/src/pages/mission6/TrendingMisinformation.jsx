import { useNavigate } from 'react-router-dom';
import { TrendingUp, CheckCircle2, XCircle, HelpCircle, Percent, Zap } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, CartesianGrid } from 'recharts';
import PageContainer from '../../components/layout/PageContainer.jsx';
import PageHeader from '../../components/layout/PageHeader.jsx';
import Card from '../../components/common/Card.jsx';
import SectionHeader from '../../components/ui/SectionHeader.jsx';
import Mission6SubNav from '../../components/mission6/Mission6SubNav.jsx';
import TrendingCard from '../../components/mission6/TrendingCard.jsx';
import { TRENDING, SEARCH_STATS, DAILY_SEARCHES, CATEGORY_DIST, SAMPLE_CLAIMS } from '../../mocks/data/mission6.js';

const stat = (icon, label, value, tone = 'text-brand') => (
  <Card className="p-4">
    <div className={`inline-flex items-center gap-1.5 text-xs ${tone}`}>
      {icon}<span className="text-muted">{label}</span>
    </div>
    <div className="mt-2 text-2xl font-bold text-fg">{value}</div>
  </Card>
);

export default function TrendingMisinformation() {
  const nav = useNavigate();
  const go = (q) => nav(`/mission-6/result?q=${encodeURIComponent(q)}`);

  return (
    <PageContainer>
      <PageHeader
        title="Trending & Analytics"
        subtitle="What claims are spreading, and what's actually true."
        icon={<TrendingUp size={18} />}
      />
      <Mission6SubNav />

      {/* STATS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
        {stat(<Zap size={14} />,          'Total Searches',   SEARCH_STATS.total.toLocaleString())}
        {stat(<CheckCircle2 size={14} />, 'Verified True',    SEARCH_STATS.trueCount, 'text-success')}
        {stat(<XCircle size={14} />,      'False Claims',     SEARCH_STATS.falseCount, 'text-danger')}
        {stat(<Percent size={14} />,      'Avg Confidence',   `${SEARCH_STATS.avgConfidence}%`, 'text-accent')}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2 p-5">
          <SectionHeader title="Trending misinformation" description="Most searched claims this week" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {TRENDING.map((t) => <TrendingCard key={t.id} item={t} onClick={() => go(t.claim)} />)}
          </div>
        </Card>

        <div className="space-y-4">
          <Card className="p-5">
            <SectionHeader title="Daily searches" description="Last 7 days" />
            <div className="h-40">
              <ResponsiveContainer>
                <LineChart data={DAILY_SEARCHES}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                  <XAxis dataKey="day" tick={{ fontSize: 10 }} stroke="var(--color-muted)" />
                  <YAxis tick={{ fontSize: 10 }} stroke="var(--color-muted)" />
                  <Tooltip contentStyle={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', fontSize: 12 }} />
                  <Line type="monotone" dataKey="count" stroke="#FF8F00" strokeWidth={2} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card className="p-5">
            <SectionHeader title="Weekly / Monthly" />
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg bg-elevated p-3">
                <div className="text-[11px] text-muted">Weekly</div>
                <div className="text-lg font-bold text-fg">{SEARCH_STATS.weekly}</div>
              </div>
              <div className="rounded-lg bg-elevated p-3">
                <div className="text-[11px] text-muted">Monthly</div>
                <div className="text-lg font-bold text-fg">{SEARCH_STATS.monthly}</div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
        <Card className="p-5">
          <SectionHeader title="By category" description="Where questions come from" />
          <div className="h-64">
            <ResponsiveContainer>
              <BarChart data={CATEGORY_DIST} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} stroke="var(--color-muted)" angle={-25} textAnchor="end" height={60} />
                <YAxis tick={{ fontSize: 10 }} stroke="var(--color-muted)" />
                <Tooltip contentStyle={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', fontSize: 12 }} />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {CATEGORY_DIST.map((c, i) => <Cell key={i} fill={c.color} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-5">
          <SectionHeader title="Verdict distribution" description="From all checks" />
          <div className="h-64">
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={[
                    { name: 'True',       value: SEARCH_STATS.trueCount,  color: '#4C8C2B' },
                    { name: 'False',      value: SEARCH_STATS.falseCount, color: '#C62828' },
                    { name: 'Partial',    value: 180,                     color: '#FBC02D' },
                    { name: 'Misleading', value: 140,                     color: '#FF8F00' },
                    { name: 'Unverified', value: 242,                     color: '#808080' },
                  ]}
                  dataKey="value"
                  outerRadius={90}
                  label={{ fontSize: 10 }}
                >
                  {[0,1,2,3,4].map((i) => <Cell key={i} fill={['#4C8C2B','#C62828','#FBC02D','#FF8F00','#808080'][i]} />)}
                </Pie>
                <Tooltip contentStyle={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <Card className="p-5 mt-4">
        <SectionHeader title="Frequently misunderstood rules" description="Tap to fact-check" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {SAMPLE_CLAIMS.slice(0, 12).map((s) => (
            <button
              key={s.q}
              onClick={() => go(s.q)}
              className="text-left rounded-lg border border-border bg-surface p-3 text-sm text-fg hover:bg-elevated hover:border-brand/50 transition inline-flex items-start gap-2"
            >
              <HelpCircle size={14} className="text-brand shrink-0 mt-0.5" />
              <span className="truncate">"{s.q}"</span>
            </button>
          ))}
        </div>
      </Card>
    </PageContainer>
  );
}
