import { motion, AnimatePresence } from 'framer-motion';
import { X, Paperclip, ShieldCheck } from 'lucide-react';
import CategoryBadge from './CategoryBadge.jsx';
import PaymentBadge from './PaymentBadge.jsx';
import StatusPill from './StatusPill.jsx';
import { formatBDT, AUDIT_TRAIL } from '../../mocks/data/mission4.js';

export default function TransactionDrawer({ tx, onClose }) {
  return (
    <AnimatePresence>
      {tx && (
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
                <p className="text-[11px] uppercase text-subtle">Transaction</p>
                <h3 className="text-sm font-semibold text-fg font-mono">{tx.id}</h3>
              </div>
              <button aria-label="Close" onClick={onClose} className="text-muted hover:text-fg rounded-md p-1 hover:bg-surface">
                <X size={16} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-4 text-sm">
              <div className="rounded-lg border border-border bg-surface p-4">
                <p className="text-[11px] uppercase text-subtle">Amount</p>
                <p className={`text-3xl font-semibold tracking-tight ${tx.type === 'income' ? 'text-success' : 'text-danger'}`}>
                  {tx.type === 'income' ? '+' : '−'} {formatBDT(tx.amount)}
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  <CategoryBadge category={tx.category} />
                  <PaymentBadge method={tx.method} />
                  <StatusPill status={tx.status} />
                </div>
              </div>

              <Row label="Description" value={tx.description} />
              <Row label="Created by" value={tx.addedBy} />
              <Row label="Date" value={new Date(tx.date).toLocaleString()} />
              <Row label="Remarks" value={tx.remarks || '—'} />

              <div>
                <p className="text-[11px] uppercase text-subtle mb-1">Attachment</p>
                <div className="rounded-md border border-dashed border-border p-3 text-xs text-muted flex items-center gap-2">
                  <Paperclip size={14} /> receipt-{tx.id}.jpg (placeholder)
                </div>
              </div>

              <div>
                <p className="text-[11px] uppercase text-subtle mb-2 flex items-center gap-1"><ShieldCheck size={12} /> Audit Trail</p>
                <ol className="space-y-2">
                  {AUDIT_TRAIL.map((a, i) => (
                    <li key={i} className="rounded-md border border-border bg-surface px-3 py-2">
                      <p className="text-xs font-medium text-fg">{a.action}</p>
                      <p className="text-[11px] text-subtle">{a.who} · {a.when}</p>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-border pb-2">
      <span className="text-[11px] uppercase text-subtle w-28 shrink-0">{label}</span>
      <span className="text-sm text-fg text-right">{value}</span>
    </div>
  );
}
