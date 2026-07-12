// Mission 4 — Corrupt Economy & Tiffin Ledger mock data
// All values in BDT unless noted.

export const CATEGORIES = [
  // Income
  { key: 'class_fund',        label: 'Class Fund',         type: 'income',  tone: 'brand',   icon: '🏫' },
  { key: 'donation',          label: 'Donation',           type: 'income',  tone: 'success', icon: '🎁' },
  { key: 'event_collection',  label: 'Event Collection',   type: 'income',  tone: 'success', icon: '🎉' },
  { key: 'student_contrib',   label: 'Student Contrib.',   type: 'income',  tone: 'brand',   icon: '👥' },
  // Expense
  { key: 'tiffin',            label: 'Tiffin',             type: 'expense', tone: 'warning', icon: '🥪' },
  { key: 'stationery',        label: 'Stationery',         type: 'expense', tone: 'neutral', icon: '✏️' },
  { key: 'printing',          label: 'Printing',           type: 'expense', tone: 'neutral', icon: '🖨️' },
  { key: 'decoration',        label: 'Decoration',         type: 'expense', tone: 'warning', icon: '🎈' },
  { key: 'event_expense',     label: 'Event Expense',      type: 'expense', tone: 'danger',  icon: '🎪' },
  { key: 'emergency',         label: 'Emergency Fund',     type: 'expense', tone: 'danger',  icon: '🚨' },
];

export const PAYMENT_METHODS = [
  { key: 'cash',   label: 'Cash',   icon: '💵' },
  { key: 'bkash',  label: 'Bkash',  icon: '📱' },
  { key: 'nagad',  label: 'Nagad',  icon: '📲' },
  { key: 'bank',   label: 'Bank',   icon: '🏦' },
];

export const STATUSES = [
  { key: 'completed', label: 'Completed', tone: 'success' },
  { key: 'success',   label: 'Success',   tone: 'success' },
  { key: 'pending',   label: 'Pending',   tone: 'warning' },
  { key: 'cancelled', label: 'Cancelled', tone: 'neutral' },
  { key: 'refunded',  label: 'Refunded',  tone: 'brand' },
];

export const findCategory = (k) => CATEGORIES.find((c) => c.key === k) ?? CATEGORIES[0];
export const findPayment  = (k) => PAYMENT_METHODS.find((c) => c.key === k) ?? PAYMENT_METHODS[0];
export const findStatus   = (k) => STATUSES.find((c) => c.key === k) ?? STATUSES[0];

const users = ['Kuddus (Captain)', 'Sadia (V-Captain)', 'Ishtiak', 'Hrithik', 'Rashid Sir', 'Abdus Salam'];

const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

function seed() {
  const list = [];
  const now = new Date('2026-03-14');
  for (let i = 0; i < 42; i++) {
    const isIncome = Math.random() < 0.42;
    const cat = pick(CATEGORIES.filter((c) => c.type === (isIncome ? 'income' : 'expense')));
    const d = new Date(now);
    d.setDate(now.getDate() - i * 2 - rand(0, 1));
    list.push({
      id: `TXN-2026-${(1000 + i).toString()}`,
      date: d.toISOString(),
      description: descFor(cat.key),
      category: cat.key,
      type: cat.type,
      amount: isIncome ? rand(200, 4000) : rand(50, 2200),
      addedBy: pick(users),
      method: pick(PAYMENT_METHODS).key,
      status: pick(['completed','completed','completed','pending','success','refunded','cancelled']),
      remarks: pick(['Verified receipt','Awaiting slip','Cross-checked','Weekly close','—','Photo attached']),
    });
  }
  return list;
}

function descFor(key) {
  const map = {
    class_fund:       ['Monthly class fund', 'Term collection round 2', 'Roll 21-40 fund'],
    donation:         ['Anonymous donation', 'Alumni contribution', 'Rashid Sir donation'],
    event_collection: ['Farewell contribution', 'Picnic collection', 'Cultural night fund'],
    student_contrib:  ['Kuddus toll (2tk)', 'Late fee collection', 'Notebook contribution'],
    tiffin:           ['Samosa + tea (30 students)', 'Singara batch', 'Biscuit + juice', 'Jhalmuri pack'],
    stationery:       ['Chalk box', 'Whiteboard markers', 'A4 ream'],
    printing:         ['Class notes 40 sets', 'Model test printing', 'Notice photocopy'],
    decoration:       ['Ribbons + balloons', 'Farewell banner', 'Bulletin board'],
    event_expense:    ['Sound system rent', 'Photographer', 'Snacks for judges'],
    emergency:        ['Broken window fix', 'First-aid restock', 'Fan repair'],
  };
  return pick(map[key] || ['Misc']);
}

export const TRANSACTIONS = seed();

export const SUMMARY = (() => {
  const income = TRANSACTIONS.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const expense = TRANSACTIONS.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  return {
    balance: income - expense,
    income,
    expense,
    total: TRANSACTIONS.length,
    tiffinBudget: 12000,
    tiffinSpent: TRANSACTIONS.filter((t) => t.category === 'tiffin').reduce((s, t) => s + t.amount, 0),
  };
})();

export const MONTHLY_TREND = [
  { month: 'Oct', income: 8200,  expense: 6100 },
  { month: 'Nov', income: 9400,  expense: 7300 },
  { month: 'Dec', income: 7800,  expense: 8900 },
  { month: 'Jan', income: 10200, expense: 6700 },
  { month: 'Feb', income: 11400, expense: 8100 },
  { month: 'Mar', income: SUMMARY.income, expense: SUMMARY.expense },
];

export const CATEGORY_BREAKDOWN = CATEGORIES
  .filter((c) => c.type === 'expense')
  .map((c) => ({
    name: c.label,
    key: c.key,
    value: TRANSACTIONS.filter((t) => t.category === c.key).reduce((s, t) => s + t.amount, 0) || rand(300, 2400),
  }));

export const WEEKLY_SPEND = [
  { day: 'Sat', amount: 480 },
  { day: 'Sun', amount: 620 },
  { day: 'Mon', amount: 950 },
  { day: 'Tue', amount: 720 },
  { day: 'Wed', amount: 1100 },
  { day: 'Thu', amount: 860 },
  { day: 'Fri', amount: 340 },
];

export const BALANCE_TREND = MONTHLY_TREND.reduce((acc, m, i) => {
  const prev = i === 0 ? 5000 : acc[i - 1].balance;
  acc.push({ month: m.month, balance: prev + m.income - m.expense });
  return acc;
}, []);

export const CASHFLOW = MONTHLY_TREND.map((m) => ({
  month: m.month,
  net: m.income - m.expense,
}));

// ------------- Tiffin / food -------------

export const TODAY_MENU = [
  { id: 'f1', name: 'Chicken Singara', calories: 210, qty: 40, price: 15, popularity: 'top',    emoji: '🥟' },
  { id: 'f2', name: 'Vegetable Samosa', calories: 170, qty: 40, price: 10, popularity: 'high',   emoji: '🥠' },
  { id: 'f3', name: 'Milk Tea',        calories: 90,  qty: 40, price: 12, popularity: 'top',    emoji: '🍵' },
  { id: 'f4', name: 'Jhalmuri Pack',   calories: 240, qty: 25, price: 20, popularity: 'medium', emoji: '🌶️' },
  { id: 'f5', name: 'Banana',          calories: 105, qty: 30, price: 8,  popularity: 'low',    emoji: '🍌' },
];

export const TIFFIN_STATS = (() => {
  const students = 40;
  const totalCost = TODAY_MENU.reduce((s, f) => s + f.qty * f.price, 0);
  const totalCalories = TODAY_MENU.reduce((s, f) => s + f.qty * f.calories, 0);
  return {
    students,
    totalCost,
    perStudent: Math.round((totalCost / students) * 10) / 10,
    remaining: SUMMARY.tiffinBudget - SUMMARY.tiffinSpent,
    caloriesPerMeal: Math.round(totalCalories / students),
    totalCalories,
  };
})();

export const FOOD_WEEK = [
  { day: 'Sat', cost: 480 },
  { day: 'Sun', cost: 520 },
  { day: 'Mon', cost: 610 },
  { day: 'Tue', cost: 700 },
  { day: 'Wed', cost: 810 },
  { day: 'Thu', cost: 640 },
  { day: 'Fri', cost: 0 },
];

export const CALORIE_DISTRIBUTION = TODAY_MENU.map((f) => ({
  name: f.name,
  value: f.calories * f.qty,
}));

// Currency conversion (mock rates)
export const RATES = { BDT: 1, USD: 0.0091, EUR: 0.0084, INR: 0.76, GBP: 0.0072 };

// Notifications
export const NOTIFICATIONS = [
  { id: 'n1', kind: 'expense',  title: 'New expense added',        body: 'Tiffin — ৳600',              when: '2 min ago',  tone: 'brand'   },
  { id: 'n2', kind: 'warning',  title: 'Budget threshold at 78%',   body: 'Tiffin budget nearly used',  when: '1 hr ago',   tone: 'warning' },
  { id: 'n3', kind: 'low',      title: 'Low balance warning',       body: 'Balance below ৳2,000',       when: '3 hr ago',   tone: 'danger'  },
  { id: 'n4', kind: 'report',   title: 'Monthly report ready',      body: 'February 2026 closed',       when: 'Yesterday',  tone: 'success' },
  { id: 'n5', kind: 'income',   title: 'Tiffin payment received',   body: '৳1,200 by Bkash',            when: 'Yesterday',  tone: 'success' },
  { id: 'n6', kind: 'approved', title: 'Expense approved',          body: 'Printing — ৳340',            women: '2 d ago',   when: '2 d ago', tone: 'brand' },
];

export const AUDIT_TRAIL = [
  { when: '2026-03-14 09:12', who: 'Kuddus (Captain)', action: 'Created transaction' },
  { when: '2026-03-14 09:14', who: 'Rashid Sir',       action: 'Reviewed transaction' },
  { when: '2026-03-14 10:02', who: 'Sadia (V-Captain)',action: 'Marked as completed' },
];

export const formatBDT = (n) =>
  '৳' + new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(Math.round(n));
