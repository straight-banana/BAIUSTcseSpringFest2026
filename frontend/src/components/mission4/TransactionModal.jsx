import { useState } from 'react';
import Modal from '../common/Modal.jsx';
import Button from '../common/Button.jsx';
import { CATEGORIES, PAYMENT_METHODS } from '../../mocks/data/mission4.js';
import { Paperclip } from 'lucide-react';

const field = 'w-full h-10 rounded-md border border-border bg-surface px-3 text-sm text-fg focus:border-brand outline-none';
const label = 'text-[11px] uppercase text-subtle font-medium';

export default function TransactionModal({ open, onClose, onSave }) {
  const [type, setType] = useState('expense');
  const [category, setCategory] = useState('tiffin');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [method, setMethod] = useState('cash');
  const [remarks, setRemarks] = useState('');

  const filtered = CATEGORIES.filter((c) => c.type === type);

  const handleSave = () => {
    onSave?.({ type, category, amount: Number(amount) || 0, description, date, method, remarks });
    onClose?.();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Add Transaction"
      footer={
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave}>Save Transaction</Button>
        </div>
      }
    >
      <div className="space-y-4">
        <div>
          <span className={label}>Type</span>
          <div className="mt-1 grid grid-cols-2 gap-2">
            {['income', 'expense'].map((t) => (
              <button
                key={t}
                onClick={() => { setType(t); setCategory(CATEGORIES.find((c) => c.type === t).key); }}
                className={`h-10 rounded-md border text-sm font-medium capitalize transition-colors ${
                  type === t ? 'border-brand bg-brand-soft text-brand' : 'border-border bg-surface text-muted hover:text-fg'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={label}>Category</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)} className={field + ' mt-1'}>
              {filtered.map((c) => <option key={c.key} value={c.key}>{c.icon} {c.label}</option>)}
            </select>
          </div>
          <div>
            <label className={label}>Amount (৳)</label>
            <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0" className={field + ' mt-1'} />
          </div>
        </div>

        <div>
          <label className={label}>Description</label>
          <input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="What was this for?" className={field + ' mt-1'} />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={label}>Date</label>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className={field + ' mt-1'} />
          </div>
          <div>
            <label className={label}>Payment Method</label>
            <select value={method} onChange={(e) => setMethod(e.target.value)} className={field + ' mt-1'}>
              {PAYMENT_METHODS.map((p) => <option key={p.key} value={p.key}>{p.icon} {p.label}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label className={label}>Remarks</label>
          <textarea value={remarks} onChange={(e) => setRemarks(e.target.value)} rows={2} placeholder="Optional notes"
            className="mt-1 w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-fg focus:border-brand outline-none resize-none" />
        </div>

        <button className="w-full h-10 rounded-md border border-dashed border-border text-xs text-muted hover:text-fg hover:border-brand flex items-center justify-center gap-2">
          <Paperclip size={14} /> Attach receipt (placeholder)
        </button>
      </div>
    </Modal>
  );
}
