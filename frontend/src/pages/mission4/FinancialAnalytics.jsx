import {
  ResponsiveContainer, LineChart, Line, AreaChart, Area, BarChart, Bar,
  PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from 'recharts';
import { BarChart3, TrendingUp, TrendingDown, Wallet, Utensils, Award, Sigma, PiggyBank } from 'lucide-react';
import PageContainer from '../../components/layout/PageContainer.jsx';
import PageHeader from '../../components/layout/PageHeader.jsx';
import Mission4SubNav from '../../components/mission4/Mission4SubNav.jsx';
import KpiCard from '../../components/mission4/KpiCard.jsx';
import ChartContainer from '../../components/mission4/ChartContainer.jsx';
import { SUMMARY, TRANSACTIONS, MONTHLY_TREND, CATEGORY_BREAKDOWN, WEEKLY_SPEND, BALANCE_TREND, formatBDT, TIFFIN_STATS } from '../../mocks/data/mission4.js';

const COLORS = ['#FF8F00', '#FBC02D', '#C62828', '#4C8C2B', '#8B5CF6', '#0891B2', '#EC4899', '#F97316'];
const axisStyle = { fontSize: 11, fill: 'rgb(var(--muted))' };
const gridStyle = { stroke: 'rgb(var(--border))', strokeDasharray: '3 3' };
const tooltipStyle = { background: 'rgb(var(--elevated))', border: '1px solid rgb(var(--border))', borderRadius: 8, fontSize: 12, color: 'rgb(var(--fg))' };

export default function FinancialAnalytics() {
  const expenses = TRANSACTIONS.filter((t) => t.type === 'expense');
  const incomes  = TRANSACTIONS.filter((t) => t.type === 'income');
  const avgExpense = Math.round(SUMMARY.expense / Math.max(1, expenses.length));
  const avgIncome  = Math.round(SUMMARY.income / Math.max(1, incomes.length));
  const largestExpense = Math.max(...expenses.map((t) => t.amount));
  const highestIncome  = Math.max(...incomes.map((t) => t.amount));
  const savingsRate = Math.round(((SUMMARY.income - SUMMARY.expense) / Math.max(1, SUMMARY.income)) * 100);
  const topMonth = [...MONTHLY_TREND].sort((a, b) => b.expense - a.expense)[0];
  const topCats = [...CATEGORY_BREAKDOWN].sort((a, b) => b.value - a.value).slice(0, 5);

  const daily = Array.from({ length: 14 }, (_, i) => ({ day: `D${i + 1}`, amount: 200 + Math.round(Math.random() * 900) }));

  return (
    <PageContainer>
      <PageHeader
        title="Financial Analytics"
        subtitle="Deep-dive into the class economy — trends, KPIs and savings rate."
        icon={<BarChart3 size={18} />}
      />
      <Mission4SubNav />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <KpiCard icon={<TrendingDown size={14} />} label="Avg Expense" value={formatBDT(avgExpense)} delta={-3.4} tone="danger" />
        <KpiCard icon={<TrendingUp size={14} />} label="Avg Income" value={formatBDT(avgIncome)} delta={5.2} tone="success" />
        <KpiCard icon={<Award size={14} />} label="Largest Expense" value={formatBDT(largestExpense)} tone="warning" />
        <KpiCard icon={<Award size={14} />} label="Highest Income" value={formatBDT(highestIncome)} tone="success" />
        <KpiCard icon={<Wallet size={14} />} label="Remaining Budget" value={formatBDT(SUMMARY.tiffinBudget - SUMMARY.tiffinSpent)} />
        <KpiCard icon={<Utensils size={14} />} label="Food / Student" value={formatBDT(TIFFIN_STATS.perStudent)} tone="warning" />
        <KpiCard icon={<Sigma size={14} />} label="Expense Growth" value="+12.4%" delta={12.4} tone="danger" />
        <KpiCard icon={<PiggyBank size={14} />} label="Savings Rate" value={`${savingsRate}%`} delta={savingsRate} tone="success" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
        <ChartContainer title="Income vs Expense" description={`Peak: ${topMonth.month} (${formatBDT(topMonth.expense)} expense)`}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={MONTHLY_TREND}>
              <defs>
                <linearGradient id="inc" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#4C8C2B" stopOpacity={0.5} /><stop offset="100%" stopColor="#4C8C2B" stopOpacity={0} /></linearGradient>
                <linearGradient id="exp" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#C62828" stopOpacity={0.5} /><stop offset="100%" stopColor="#C62828" stopOpacity={0} /></linearGradient>
              </defs>
              <CartesianGrid {...gridStyle} />
              <XAxis dataKey="month" tick={axisStyle} />
              <YAxis tick={axisStyle} />
              <Tooltip contentStyle={tooltipStyle} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Area type="monotone" dataKey="income" stroke="#4C8C2B" fill="url(#inc)" strokeWidth={2} />
              <Area type="monotone" dataKey="expense" stroke="#C62828" fill="url(#exp)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>

        <ChartContainer title="Balance Growth" description="Running class balance">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={BALANCE_TREND}>
              <CartesianGrid {...gridStyle} />
              <XAxis dataKey="month" tick={axisStyle} />
              <YAxis tick={axisStyle} />
              <Tooltip contentStyle={tooltipStyle} />
              <Line type="monotone" dataKey="balance" stroke="#FF8F00" strokeWidth={2.5} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>

        <ChartContainer title="Category Breakdown" description="Expense share by category">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={CATEGORY_BREAKDOWN} dataKey="value" nameKey="name" innerRadius={50} outerRadius={95} paddingAngle={2}>
                {CATEGORY_BREAKDOWN.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>

        <ChartContainer title="Weekly Spending" description="Rolling 7-day totals">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={WEEKLY_SPEND}>
              <CartesianGrid {...gridStyle} />
              <XAxis dataKey="day" tick={axisStyle} />
              <YAxis tick={axisStyle} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="amount" fill="#FBC02D" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>

        <ChartContainer title="Daily Spending" description="Last 14 days">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={daily}>
              <CartesianGrid {...gridStyle} />
              <XAxis dataKey="day" tick={axisStyle} />
              <YAxis tick={axisStyle} />
              <Tooltip contentStyle={tooltipStyle} />
              <Line type="monotone" dataKey="amount" stroke="#8B5CF6" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>

        <ChartContainer title="Top Expense Categories" description="Ranked by amount">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={topCats} layout="vertical" margin={{ left: 20 }}>
              <CartesianGrid {...gridStyle} />
              <XAxis type="number" tick={axisStyle} />
              <YAxis type="category" dataKey="name" tick={axisStyle} width={110} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="value" fill="#FF8F00" radius={[0,4,4,0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>
    </PageContainer>
  );
}
