import { useMemo, useState } from 'react';
import { Search, Filter, History, ChevronLeft, ChevronRight } from 'lucide-react';
import PageContainer from '../../components/layout/PageContainer.jsx';
import PageHeader from '../../components/layout/PageHeader.jsx';
import Card from '../../components/common/Card.jsx';
import Button from '../../components/common/Button.jsx';
import Mission5SubNav from '../../components/mission5/Mission5SubNav.jsx';
import AlertCard from '../../components/mission5/AlertCard.jsx';
import AlertDrawer from '../../components/mission5/AlertDrawer.jsx';
import SosStatusBadge from '../../components/mission5/SosStatusBadge.jsx';
import SeverityBadge from '../../components/mission5/SeverityBadge.jsx';
import { CURRENT_STUDENT_HISTORY, LOCATIONS, STATUSES, findLocation, findType } from '../../mocks/data/mission5.js';

const PAGE = 8;

export default function SosHistory() {
  const [q, setQ] = useState('');
  const [loc, setLoc] = useState('all');
  const [status, setStatus] = useState('all');
  const [page, setPage] = useState(1);
  const [drawer, setDrawer] = useState(null);

  const list = useMemo(() => {
    // Pad with mock data to have more rows
    const combined = [...CURRENT_STUDENT_HISTORY, ...CURRENT_STUDENT_HISTORY.map((a, i) => ({ ...a, id: a.id + '-B' + i }))];
    return combined.filter((a) => {
      if (loc !== 'all' && a.location !== loc) return false;
      if (status !== 'all' && a.status !== status) return false;
      if (q && !(`${a.id} ${a.description}`.toLowerCase().includes(q.toLowerCase()))) return false;
      return true;
    });
  }, [q, loc, status]);

  const totalPages = Math.max(1, Math.ceil(list.length / PAGE));
  const rows = list.slice((page - 1) * PAGE, page * PAGE);

  const selectCls = 'h-9 rounded-md border border-border bg-surface px-2 text-xs text-fg focus:border-brand outline-none';

  return (
    <PageContainer>
      <PageHeader title="Your SOS History" subtitle="Every alert you've triggered." icon={<History size={18} />} />
      <Mission5SubNav />

      <Card className="p-4 mb-4">
        <div className="flex flex-col md:flex-row gap-3 md:items-center">
          <div className="relative flex-1">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <input
              value={q} onChange={(e) => { setQ(e.target.value); setPage(1); }}
              placeholder="Search alerts…"
              className="w-full h-9 rounded-md border border-border bg-surface pl-9 pr-3 text-sm text-fg focus:border-brand outline-none"
            />
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Filter size={14} className="text-muted" />
            <select value={loc} onChange={(e) => { setLoc(e.target.value); setPage(1); }} className={selectCls}>
              <option value="all">All Locations</option>
              {LOCATIONS.map((l) => <option key={l.key} value={l.key}>{l.icon} {l.label}</option>)}
            </select>
            <select value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }} className={selectCls}>
              <option value="all">All Statuses</option>
              {STATUSES.map((s) => <option key={s.key} value={s.key}>{s.label}</option>)}
            </select>
          </div>
        </div>
      </Card>

      {/* Desktop table */}
      <Card className="p-0 hidden md:block">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-surface text-muted text-xs uppercase tracking-wider">
              <tr>
                {['Alert ID','Date','Location','Type','Severity','Status','Captain'].map((h) => (
                  <th key={h} className="px-4 py-2.5 font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr><td colSpan={7} className="px-4 py-12 text-center text-muted">No alerts match your filters.</td></tr>
              ) : rows.map((a) => (
                <tr key={a.id} onClick={() => setDrawer(a)} className="border-t border-border hover:bg-surface/60 cursor-pointer">
                  <td className="px-4 py-3 text-xs font-mono text-fg">{a.id}</td>
                  <td className="px-4 py-3 text-xs text-muted">{new Date(a.time).toLocaleString()}</td>
                  <td className="px-4 py-3 text-sm">{findLocation(a.location).icon} {findLocation(a.location).label}</td>
                  <td className="px-4 py-3 text-sm">{findType(a.type).icon} {findType(a.type).label}</td>
                  <td className="px-4 py-3"><SeverityBadge severity={a.severity} /></td>
                  <td className="px-4 py-3"><SosStatusBadge status={a.status} /></td>
                  <td className="px-4 py-3 text-xs text-muted">{a.captain || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between px-4 py-3 border-t border-border text-xs text-muted">
          <span>{list.length} alerts</span>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}><ChevronLeft size={14} /> Prev</Button>
            <span>Page {page} / {totalPages}</span>
            <Button size="sm" variant="outline" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}>Next <ChevronRight size={14} /></Button>
          </div>
        </div>
      </Card>

      {/* Mobile cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:hidden">
        {rows.map((a) => <AlertCard key={a.id} alert={a} onClick={setDrawer} />)}
      </div>

      <AlertDrawer alert={drawer} onClose={() => setDrawer(null)} />
    </PageContainer>
  );
}
