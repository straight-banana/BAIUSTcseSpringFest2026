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
import { TODAY_MENU, FOOD_WEEK, CALORIE_DISTRIBUTION, SUMMARY, formatBDT } from '../../mocks/data/mission4.js';
import { getTodayMenu } from '../../services/trackerService.js';

const COLORS = ['#FF8F00', '#FBC02D', '#C62828', '#4C8C2B', '#8B5CF6', '#0891B2'];
const axisStyle = { fontSize: 11, fill: 'rgb(var(--muted))' };
const gridStyle = { stroke: 'rgb(var(--border))', strokeDasharray: '3 3' };
const tooltipStyle = { background: 'rgb(var(--elevated))', border: '1px solid rgb(var(--border))', borderRadius: 8, fontSize: 12, color: 'rgb(var(--fg))' };

export default function TiffinDashboard() {
  const [menu, setMenu] = useState({ items: TODAY_MENU });
  const [menuLoading, setMenuLoading] = useState(true);
  const [menuError, setMenuError] = useState('');

  useEffect(() => {
    let active = true;
    getTodayMenu()
      .then((data) => {
        if (!active) return;
        setMenu(data?.items ? data : { items: TODAY_MENU });
      })
      .catch((err) => {
        if (!active) return;
        setMenu({ items: TODAY_MENU });
        setMenuError(err?.message || 'Unable to load menu');
      })
      .finally(() => {
        if (active) setMenuLoading(false);
      });
    return () => { active = false; };
  }, []);

  const items = menu.items || TODAY_MENU;
  const totalCost = items.reduce((sum, item) => sum + (item.qty || 0) * (item.price || 0), 0);
  const totalCalories = items.reduce((sum, item) => sum + (item.qty || 0) * (item.calories || 0), 0);
  const stats = {
    students: 40,
    totalCost,
    perStudent: totalCost ? Math.round((totalCost / 40) * 10) / 10 : 0,
    remaining: SUMMARY.tiffinBudget - SUMMARY.tiffinSpent,
    caloriesPerMeal: totalCalories ? Math.round(totalCalories / 40) : 0,
    totalCalories,
  };

  return (
    <PageContainer>
      <PageHeader
        title="Tiffin & Calorie Dashboard"
        subtitle="Today's menu, per-student cost and nutrition summary."
        icon={<Utensils size={18} />}
      />
      <Mission4SubNav />

      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
        <StatCard icon={<Users size={16} />}    label="Students"       value={stats.students} hint="Participating today" />
        <StatCard icon={<Wallet size={16} />}   label="Total Cost"     value={formatBDT(stats.totalCost)} hint="Today's meal" />
        <StatCard icon={<PieIcon size={16} />}  label="Per Student"    value={formatBDT(stats.perStudent)} hint="Cost split evenly" />
        <StatCard icon={<Wallet size={16} />}   label="Remaining"      value={formatBDT(stats.remaining)} hint="Of monthly budget" />
        <StatCard icon={<Flame size={16} />}    label="Calories / Meal" value={`${stats.caloriesPerMeal} kcal`} hint="Per student" />
        <StatCard icon={<Flame size={16} />}    label="Total Calories" value={stats.totalCalories.toLocaleString()} hint="All meals combined" />
      </div>

      <Card className="p-5 mt-6">
        <SectionHeader title="Today's Menu" description="Food items served in today's tiffin" />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {items.map((f) => <FoodCard key={f.id} item={f} students={stats.students} />)}
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4">
        <Card className="p-5 lg:col-span-2">
          <SectionHeader title="Budget Overview" description="Tiffin spending vs monthly cap" />
          <div className="grid sm:grid-cols-2 gap-5">
            <BudgetProgress label="Tiffin Monthly" spent={SUMMARY.tiffinSpent} budget={SUMMARY.tiffinBudget} />
            <BudgetProgress label="Beverages" spent={780} budget={1500} tone="success" />
            <BudgetProgress label="Snacks" spent={2200} budget={3000} />
            <BudgetProgress label="Fresh Fruit" spent={420} budget={1000} tone="success" />
          </div>
        </Card>
        <CurrencyWidget initialAmount={stats.totalCost} />
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
              <Pie data={CALORIE_DISTRIBUTION} dataKey="value" nameKey="name" outerRadius={95} innerRadius={45} paddingAngle={2}>
                {CALORIE_DISTRIBUTION.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
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
