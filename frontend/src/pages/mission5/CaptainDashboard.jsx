import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, Activity, Clock, CheckCircle2, AlertTriangle } from 'lucide-react';
import PageContainer from '../../components/layout/PageContainer.jsx';
import PageHeader from '../../components/layout/PageHeader.jsx';
import Card from '../../components/common/Card.jsx';
import Button from '../../components/common/Button.jsx';
import SectionHeader from '../../components/ui/SectionHeader.jsx';
import { StatCard } from '../../components/common/Cards.jsx';
import Mission5SubNav from '../../components/mission5/Mission5SubNav.jsx';
import SosStatusBadge from '../../components/mission5/SosStatusBadge.jsx';
import SeverityBadge from '../../components/mission5/SeverityBadge.jsx';
import AlertDrawer from '../../components/mission5/AlertDrawer.jsx';
import CampusMap from '../../components/mission5/CampusMap.jsx';
import { ALERTS, SUMMARY, findLocation, findType } from '../../mocks/data/mission5.js';

export default function CaptainDashboard() {
  const [tab, setTab] = useState('active');
  const [drawer, setDrawer] = useState(null);

  const filtered = useMemo(() => {
    if (tab === 'active')   return ALERTS.filter((a) => ['pending','received','responding'].includes(a.status));
    if (tab === 'pending')  return ALERTS.filter((a) => a.status === 'pending');
    if (tab === 'resolved') return ALERTS.filter((a) => a.status === 'resolved');
    return ALERTS;
  }, [tab]);

  return (
    <PageContainer>
      <PageHeader
        title="Captain Emergency Dashboard"
        subtitle="Monitor incoming SOS alerts and coordinate responses."
        icon={<ShieldAlert size={18} />}
      />
      <Mission5SubNav />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard icon={<Activity size={16} />}      label="Active Alerts"    value={SUMMARY.active} hint="Needs attention" trend={12} />
        <StatCard icon={<AlertTriangle size={16} />} label="Pending"          value={SUMMARY.pending} hint="Not yet accepted" />
        <StatCard icon={<CheckCircle2 size={16} />}  label="Resolved"         value={SUMMARY.resolved} hint="This term" trend={4.1} />
        <StatCard icon={<Clock size={16} />}         label="Avg Response"     value={SUMMARY.avgResponse} hint="Rolling 7 days" trend={-8} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 mt-6">
        <div className="xl:col-span-2">
          <Card className="p-5">
            <SectionHeader
              title="Incoming Alerts"
              description="Prioritized by severity and recency"
              action={
                <div className="flex gap-1 rounded-md border border-border p-0.5 bg-surface">
                  {[['active','Active'],['pending','Pending'],['resolved','Resolved'],['all','All']].map(([k, l]) => (
                    <button key={k} onClick={() => setTab(k)}
                      className={`text-xs px-2 py-1 rounded ${tab === k ? 'bg-elevated text-fg font-medium shadow-xs' : 'text-muted hover:text-fg'}`}>
                      {l}
                    </button>
                  ))}
                </div>
              }
            />
            <div className="overflow-x-auto rounded-lg border border-border">
              <table className="w-full text-left text-sm">
                <thead className="bg-surface text-muted text-xs uppercase tracking-wider">
                  <tr>
                    {['Alert','Student','Location','Time','Priority','Status','Actions'].map((h) => (
                      <th key={h} className="px-4 py-2.5 font-medium">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence>
                    {filtered.length === 0 ? (
                      <tr><td colSpan={7} className="px-4 py-10 text-center text-muted">No alerts here right now.</td></tr>
                    ) : filtered.map((a) => (
                      <motion.tr
                        key={a.id}
                        initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                        className="border-t border-border hover:bg-surface/60"
                      >
                        <td className="px-4 py-3">
                          <p className="text-xs font-mono text-fg">{a.id}</p>
                          <p className="text-[11px] text-subtle">{findType(a.type).icon} {findType(a.type).label}</p>
                        </td>
                        <td className="px-4 py-3 text-xs text-muted font-mono">{a.student}</td>
                        <td className="px-4 py-3 text-sm">{findLocation(a.location).icon} {findLocation(a.location).label}</td>
                        <td className="px-4 py-3 text-xs text-muted whitespace-nowrap">{new Date(a.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                        <td className="px-4 py-3"><SeverityBadge severity={a.severity} /></td>
                        <td className="px-4 py-3"><SosStatusBadge status={a.status} /></td>
                        <td className="px-4 py-3 text-right">
                          <div className="inline-flex gap-1">
                            <Button size="sm" variant="outline" onClick={() => setDrawer(a)}>View</Button>
                            <Button size="sm" variant="secondary">Accept</Button>
                            <Button size="sm">Resolve</Button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        <div className="space-y-4">
          <CampusMap />
        </div>
      </div>

      <AlertDrawer alert={drawer} onClose={() => setDrawer(null)} />
    </PageContainer>
  );
}
