import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Coins, Plus, Wallet, ArrowUpRight, ArrowDownRight, Receipt, PieChart as PieIcon, Download, BarChart3, FileText, Utensils } from 'lucide-react';
import PageContainer from '../../components/layout/PageContainer.jsx';
import PageHeader from '../../components/layout/PageHeader.jsx';
import Card from '../../components/common/Card.jsx';
import Button from '../../components/common/Button.jsx';
import SectionHeader from '../../components/ui/SectionHeader.jsx';
import { StatCard } from '../../components/common/Cards.jsx';
import Mission4SubNav from '../../components/mission4/Mission4SubNav.jsx';
import BudgetProgress from '../../components/mission4/BudgetProgress.jsx';
import TransactionRow from '../../components/mission4/TransactionRow.jsx';
import TransactionDrawer from '../../components/mission4/TransactionDrawer.jsx';
import TransactionModal from '../../components/mission4/TransactionModal.jsx';
import { SUMMARY, TRANSACTIONS, formatBDT } from '../../mocks/data/mission4.js';
import { useAuth } from '../../context/AuthContext.jsx';


export default function Mission4Overview() {
  const { role } = useAuth();
  const canEdit = role !== 'student';
  const [drawerTx, setDrawerTx] = useState(null);
  const [modal, setModal] = useState(false);
  const [modalType, setModalType] = useState('expense');

  const recent = TRANSACTIONS.slice(0, 6);

  const openAdd = (t) => { setModalType(t); setModal(true); };

  return (
    <PageContainer>
      <PageHeader
        title="Corrupt Economy Ledger"
        subtitle={canEdit
          ? 'Transparent class finances — track income, expenses, and tiffin costs in real time.'
          : 'Transparent class finances — view only for students.'}
        icon={<Coins size={18} />}
        actions={canEdit ? (
          <div className="flex gap-2">
            <Button variant="outline" leftIcon={<Download size={14} />}>Export</Button>
            <Button leftIcon={<Plus size={14} />} onClick={() => openAdd('expense')}>Add Transaction</Button>
          </div>
        ) : null}
      />
      <Mission4SubNav />

      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
        <StatCard icon={<Wallet size={16} />} label="Current Balance" value={formatBDT(SUMMARY.balance)} hint="Live class balance" trend={4.2} />
        <StatCard icon={<ArrowUpRight size={16} />} label="Total Income" value={formatBDT(SUMMARY.income)} hint="All time" trend={8.1} />
        <StatCard icon={<ArrowDownRight size={16} />} label="Total Expenses" value={formatBDT(SUMMARY.expense)} hint="All time" trend={-2.4} />
        <StatCard icon={<Receipt size={16} />} label="Transactions" value={SUMMARY.total} hint="Logged" />
        <StatCard icon={<Utensils size={16} />} label="Tiffin Budget" value={formatBDT(SUMMARY.tiffinBudget)} hint="Monthly cap" />
        <StatCard icon={<PieIcon size={16} />} label="Remaining" value={formatBDT(SUMMARY.tiffinBudget - SUMMARY.tiffinSpent)} hint="After tiffin" trend={-1.3} />
      </div>

      {/* Budget progress + Quick actions */}
      <div className={`grid grid-cols-1 ${canEdit ? 'lg:grid-cols-3' : ''} gap-4 mt-6`}>
        <Card className={`p-5 ${canEdit ? 'lg:col-span-2' : ''}`}>
          <SectionHeader title="Budget Overview" description="Where the class fund is going right now." />
          <div className="grid sm:grid-cols-2 gap-5">
            <BudgetProgress label="Tiffin Budget" spent={SUMMARY.tiffinSpent} budget={SUMMARY.tiffinBudget} />
            <BudgetProgress label="Event Fund" spent={4200} budget={8000} tone="success" />
            <BudgetProgress label="Stationery" spent={1800} budget={2500} />
            <BudgetProgress label="Emergency" spent={900} budget={3000} tone="success" />
          </div>
        </Card>
        {canEdit && (
          <Card className="p-5">
            <SectionHeader title="Quick Actions" description="Common tasks" />
            <div className="grid grid-cols-2 gap-2">
              <QuickBtn icon={<ArrowUpRight size={14} />} label="Add Income" onClick={() => openAdd('income')} />
              <QuickBtn icon={<ArrowDownRight size={14} />} label="Add Expense" onClick={() => openAdd('expense')} />
              <QuickBtn icon={<Utensils size={14} />} label="Add Tiffin" onClick={() => openAdd('expense')} />
              <Link to="/mission-4/analytics"><QuickBtn icon={<BarChart3 size={14} />} label="Analytics" /></Link>
              <Link to="/mission-4/exports"><QuickBtn icon={<FileText size={14} />} label="Report" /></Link>
              <Link to="/mission-4/exports"><QuickBtn icon={<Download size={14} />} label="Export" /></Link>
            </div>
          </Card>
        )}
      </div>


      {/* Recent transactions moved up — charts live on the Analytics tab */}


      {/* Recent transactions */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card className="p-5 mt-4">
          <SectionHeader
            title="Recent Transactions"
            description="Latest ledger activity"
            action={<Link to="/mission-4/history" className="text-xs text-brand hover:underline">View all</Link>}
          />
          <div className="overflow-x-auto rounded-lg border border-border">
            <table className="w-full text-left text-sm">
              <thead className="bg-surface text-muted text-xs uppercase tracking-wider">
                <tr>
                  {['Date','Description','Category','Type','Amount','Added By','Status',''].map((h) => (
                    <th key={h} className="px-4 py-2.5 font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recent.map((tx) => <TransactionRow key={tx.id} tx={tx} onClick={setDrawerTx} />)}
              </tbody>
            </table>
          </div>
        </Card>
      </motion.div>

      <TransactionDrawer tx={drawerTx} onClose={() => setDrawerTx(null)} />
      <TransactionModal open={modal} onClose={() => setModal(false)} onSave={() => {}} initialType={modalType} />
    </PageContainer>
  );
}

function QuickBtn({ icon, label, onClick }) {
  return (
    <button
      onClick={onClick}
      className="w-full h-16 rounded-lg border border-border bg-surface hover:border-brand hover:bg-brand-soft/50 transition-colors flex flex-col items-center justify-center gap-1 text-xs font-medium text-fg"
    >
      <span className="text-brand">{icon}</span>
      {label}
    </button>
  );
}

