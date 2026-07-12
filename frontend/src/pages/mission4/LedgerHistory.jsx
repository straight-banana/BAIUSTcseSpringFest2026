import { useMemo, useState } from 'react';
import { Search, Filter, Coins, ChevronLeft, ChevronRight } from 'lucide-react';
import PageContainer from '../../components/layout/PageContainer.jsx';
import PageHeader from '../../components/layout/PageHeader.jsx';
import Card from '../../components/common/Card.jsx';
import Button from '../../components/common/Button.jsx';
import Mission4SubNav from '../../components/mission4/Mission4SubNav.jsx';
import TransactionRow from '../../components/mission4/TransactionRow.jsx';
import TransactionDrawer from '../../components/mission4/TransactionDrawer.jsx';
import { TRANSACTIONS, CATEGORIES, PAYMENT_METHODS } from '../../mocks/data/mission4.js';

const PAGE_SIZE = 10;

export default function LedgerHistory() {
  const [q, setQ] = useState('');
  const [cat, setCat] = useState('all');
  const [type, setType] = useState('all');
  const [method, setMethod] = useState('all');
  const [sort, setSort] = useState('date-desc');
  const [page, setPage] = useState(1);
  const [drawerTx, setDrawerTx] = useState(null);

  const filtered = useMemo(() => {
    let list = TRANSACTIONS.filter((t) => {
      if (cat !== 'all' && t.category !== cat) return false;
      if (type !== 'all' && t.type !== type) return false;
      if (method !== 'all' && t.method !== method) return false;
      if (q && !(`${t.description} ${t.id} ${t.addedBy}`.toLowerCase().includes(q.toLowerCase()))) return false;
      return true;
    });
    if (sort === 'date-desc') list = list.sort((a, b) => new Date(b.date) - new Date(a.date));
    if (sort === 'date-asc')  list = list.sort((a, b) => new Date(a.date) - new Date(b.date));
    if (sort === 'amount-desc') list = list.sort((a, b) => b.amount - a.amount);
    if (sort === 'amount-asc')  list = list.sort((a, b) => a.amount - b.amount);
    return list;
  }, [q, cat, type, method, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageRows = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const selectCls = 'h-9 rounded-md border border-border bg-surface px-2 text-xs text-fg focus:border-brand outline-none';

  return (
    <PageContainer>
      <PageHeader
        title="Ledger History"
        subtitle="Search, filter and audit every recorded transaction."
        icon={<Coins size={18} />}
      />
      <Mission4SubNav />

      <Card className="p-4 mb-4">
        <div className="flex flex-col md:flex-row gap-3 md:items-center">
          <div className="relative flex-1">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <input
              value={q}
              onChange={(e) => { setQ(e.target.value); setPage(1); }}
              placeholder="Search by description, ID, or user…"
              className="w-full h-9 rounded-md border border-border bg-surface pl-9 pr-3 text-sm text-fg focus:border-brand outline-none"
            />
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Filter size={14} className="text-muted" />
            <select value={cat} onChange={(e) => { setCat(e.target.value); setPage(1); }} className={selectCls}>
              <option value="all">All Categories</option>
              {CATEGORIES.map((c) => <option key={c.key} value={c.key}>{c.icon} {c.label}</option>)}
            </select>
            <select value={type} onChange={(e) => { setType(e.target.value); setPage(1); }} className={selectCls}>
              <option value="all">All Types</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
            <select value={method} onChange={(e) => { setMethod(e.target.value); setPage(1); }} className={selectCls}>
              <option value="all">All Methods</option>
              {PAYMENT_METHODS.map((p) => <option key={p.key} value={p.key}>{p.icon} {p.label}</option>)}
            </select>
            <select value={sort} onChange={(e) => setSort(e.target.value)} className={selectCls}>
              <option value="date-desc">Newest</option>
              <option value="date-asc">Oldest</option>
              <option value="amount-desc">Amount ↓</option>
              <option value="amount-asc">Amount ↑</option>
            </select>
          </div>
        </div>
      </Card>

      <Card className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-surface text-muted text-xs uppercase tracking-wider">
              <tr>
                {['Date','Description','Category','Type','Amount','Added By','Status',''].map((h) => (
                  <th key={h} className="px-4 py-2.5 font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {pageRows.length === 0 ? (
                <tr><td colSpan={8} className="px-4 py-12 text-center text-muted">No transactions match your filters.</td></tr>
              ) : pageRows.map((tx) => <TransactionRow key={tx.id} tx={tx} onClick={setDrawerTx} />)}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between px-4 py-3 border-t border-border text-xs text-muted">
          <span>Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}</span>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>
              <ChevronLeft size={14} /> Prev
            </Button>
            <span>Page {page} / {totalPages}</span>
            <Button size="sm" variant="outline" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}>
              Next <ChevronRight size={14} />
            </Button>
          </div>
        </div>
      </Card>

      <TransactionDrawer tx={drawerTx} onClose={() => setDrawerTx(null)} />
    </PageContainer>
  );
}
