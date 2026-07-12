import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, Clock, User, ShieldCheck } from 'lucide-react';
import Button from '../common/Button.jsx';
import SosStatusBadge from './SosStatusBadge.jsx';
import SeverityBadge from './SeverityBadge.jsx';
import { findLocation, findType } from '../../mocks/data/mission5.js';

export default function AlertDrawer({ alert, onClose, onAccept, onResolve }) {
  return (
    <AnimatePresence>
      {alert && (
        <motion.div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.aside
            role="dialog"
            aria-modal="true"
            onClick={(e) => e.stopPropagation()}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.25 }}
            className="absolute right-0 top-0 h-full w-full max-w-md bg-elevated border-l border-border shadow-xl flex flex-col"
          >
            <div className="flex items-center justify-between border-b border-border px-5 py-3">
              <div>
                <p className="text-[11px] uppercase text-subtle">Alert</p>
                <h3 className="text-sm font-semibold text-fg font-mono">{alert.id}</h3>
              </div>
              <button aria-label="Close" onClick={onClose} className="text-muted hover:text-fg rounded-md p-1 hover:bg-surface">
                <X size={16} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-4 text-sm">
              <div className="rounded-lg border border-border bg-surface p-4">
                <div className="flex items-center justify-between">
                  <p className="text-lg font-semibold text-fg">
                    {findType(alert.type).icon} {findType(alert.type).label}
                  </p>
                  <SeverityBadge severity={alert.severity} />
                </div>
                <p className="text-sm text-muted mt-1">{alert.description}</p>
              </div>

              <Row icon={<MapPin size={13} />} label="Location" value={`${findLocation(alert.location).icon} ${findLocation(alert.location).label}`} />
              <Row icon={<Clock size={13} />}  label="Time" value={new Date(alert.time).toLocaleString()} />
              <Row icon={<User size={13} />}   label="Reported by" value={alert.student} />
              <Row icon={<ShieldCheck size={13} />} label="Captain" value={alert.captain || '— unassigned —'} />
              <Row icon={<MapPin size={13} />} label="Note" value={alert.note} />

              <div>
                <p className="text-[11px] uppercase text-subtle mb-2">Timeline</p>
                <ol className="relative border-l-2 border-border pl-4 space-y-3">
                  {timeline(alert).map((t, i) => (
                    <li key={i} className="relative">
                      <span className={`absolute -left-[19px] top-1 h-3 w-3 rounded-full ring-2 ring-elevated ${t.color}`} />
                      <p className="text-xs font-medium text-fg">{t.title}</p>
                      <p className="text-[11px] text-subtle">{t.when}</p>
                    </li>
                  ))}
                </ol>
              </div>

              <div className="pt-2">
                <SosStatusBadge status={alert.status} />
              </div>
            </div>

            <div className="border-t border-border p-4 flex gap-2">
              <Button variant="outline" onClick={onClose} className="flex-1">Close</Button>
              <Button variant="secondary" onClick={() => onAccept?.(alert)} className="flex-1">Accept</Button>
              <Button onClick={() => onResolve?.(alert)} className="flex-1">Resolve</Button>
            </div>
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Row({ icon, label, value }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-border pb-2">
      <span className="text-[11px] uppercase text-subtle w-28 shrink-0 inline-flex items-center gap-1">{icon} {label}</span>
      <span className="text-sm text-fg text-right">{value}</span>
    </div>
  );
}

function timeline(a) {
  const base = new Date(a.time);
  const t = (m) => new Date(base.getTime() + m * 60000).toLocaleString();
  const items = [
    { title: 'Alert triggered', when: t(0), color: 'bg-danger' },
    { title: 'Alert received by captains', when: t(1), color: 'bg-brand' },
  ];
  if (['responding','resolved'].includes(a.status)) items.push({ title: `Captain responding · ${a.captain}`, when: t(3), color: 'bg-warning' });
  if (a.status === 'resolved') items.push({ title: 'Marked resolved', when: t(11), color: 'bg-success' });
  if (a.status === 'cancelled') items.push({ title: 'Cancelled by student', when: t(4), color: 'bg-subtle' });
  return items;
}
