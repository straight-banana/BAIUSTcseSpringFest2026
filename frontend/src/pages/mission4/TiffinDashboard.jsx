import { useEffect, useState } from 'react';
import { ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Utensils, Users, Flame, Wallet, PieChart as PieIcon } from 'lucide-react';
import PageContainer from '../../components/layout/PageContainer.jsx';
import PageHeader from '../../components/layout/PageHeader.jsx';
import Card from '../../components/common/Card.jsx';
import SectionHeader from '../../components/ui/SectionHeader.jsx';
import { StatCard } from '../../components/common/Cards.jsx';
import Mission4SubNav from '../../components/mission4/Mission4SubNav.jsx';
import FoodCard from '../../components/mission4/FoodCard.jsx';
import BudgetProgress from '../../components/mission4/BudgetProgress.jsx';
import CurrencyWidget from '../../components/mission4/CurrencyWidget.jsx';
import ChartContainer from '../../components/mission4/ChartContainer.jsx';
import { getBudgets, getMenu } from '../../services/trackerService.js';
import { formatBDT } from '../../utils/missionApiMaps.js';

const COLORS = ['#FF8F00', '#FBC02D', '#C62828', '#4C8C2B', '#8B5CF6', '#0891B2'];
const axisStyle = { fontSize: 11, fill: 'rgb(var(--muted))' };
const gridStyle = { stroke: 'rgb(var(--border))', strokeDasharray: '3 3' };
const tooltipStyle = { background: 'rgb(var(--elevated))', border: '1px solid rgb(var(--border))', borderRadius: 8, fontSize: 12, color: 'rgb(var(--fg))' };

export default function TiffinDashboard() {
  const [menu, setMenu] = useState(null);
  const [budgets, setBudgets] = useState([]);
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const [budgetsRes, menuRes] = await Promise.all([getBudgets(), getMenu()]);
        if (!alive) return;
        setBudgets(budgetsRes?.data || budgetsRes || []);
        setMenu(menuRes?.data || menuRes || null);
      } catch {
        if (alive) { setBudgets([]); setMenu(null); }
      }
    })();
    return () => { alive = false; };
  }, []);

  const items = Array.isArray(menu?.items) ? menu.items : [];
  const tiffinBudget = budgets.find((b) => b.type === 'TIFFIN')?.amount || 12000;
  const totalCost = items.reduce((sum, item) => sum + Number(item.price || 0) * Number(item.qty || 0), 0);
  const students = Math.max(1, items.reduce((sum, item) => sum + Number(item.qty || 0), 0));
  const perStudent = Math.round((totalCost / students) * 10) / 10;

  return (
    <PageContainer>
      <PageHeader
        title="Tiffin & Calorie Dashboard"
        subtitle="Today's menu, per-student cost and nutrition summary."
        icon={<Utensils size={18} />}
      />
      <Mission4SubNav />

      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
        <StatCard icon={<Users size={16} />}    label="Students"       value={students} hint="Participating today" />
        <StatCard icon={<Wallet size={16} />}   label="Total Cost"     value={formatBDT(totalCost)} hint="Today's meal" />
        <StatCard icon={<PieIcon size={16} />}  label="Per Student"    value={formatBDT(perStudent)} hint="Cost split evenly" />
        <StatCard icon={<Wallet size={16} />}   label="Remaining"      value={formatBDT(Math.max(0, tiffinBudget - totalCost))} hint="Of monthly budget" />
        <StatCard icon={<Flame size={16} />}    label="Calories / Meal" value={`${items.reduce((sum, item) => sum + Number(item.calories || 0) * Number(item.qty || 0), 0) / Math.max(1, students)} kcal`} hint="Per student" />
        <StatCard icon={<Flame size={16} />}    label="Total Calories" value={items.reduce((sum, item) => sum + Number(item.calories || 0) * Number(item.qty || 0), 0).toLocaleString()} hint="All meals combined" />
      </div>

      <Card className="p-5 mt-6">
        <SectionHeader title="Today's Menu" description="Food items served in today's tiffin" />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {items.length === 0 ? <p className="text-sm text-muted">No menu items have been configured yet.</p> : items.map((f) => <FoodCard key={f.id || f.name} item={{ id: f.id || f.name, name: f.name, price: Number(f.price || 0), calories: Number(f.calories || 0), qty: Number(f.qty || 0), emoji: '🥪' }} students={students} />)}
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4">
        <Card className="p-5 lg:col-span-2">
          <SectionHeader title="Budget Overview" description="Tiffin spending vs monthly cap" />
          <div className="grid sm:grid-cols-2 gap-5">
            <BudgetProgress label="Tiffin Monthly" spent={totalCost} budget={tiffinBudget} />
            <BudgetProgress label="Beverages" spent={780} budget={1500} tone="success" />
            <BudgetProgress label="Snacks" spent={2200} budget={3000} />
            <BudgetProgress label="Fresh Fruit" spent={420} budget={1000} tone="success" />
          </div>
        </Card>
        <CurrencyWidget initialAmount={totalCost} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
        <ChartContainer title="Weekly Food Spending" description="This week">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={FOOD_WEEK}>
              <CartesianGrid {...gridStyle} />
              <XAxis dataKey="day" tick={axisStyle} />
              <YAxis tick={axisStyle} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="cost" fill="#FF8F00" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>

        <ChartContainer title="Calorie Distribution" description="Where the kcal are coming from">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={items.map((f) => ({ name: f.name, value: Number(f.calories || 0) * Number(f.qty || 0) }))} dataKey="value" nameKey="name" outerRadius={95} innerRadius={45} paddingAngle={2}>
                {items.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>
    </PageContainer>
  );
}
