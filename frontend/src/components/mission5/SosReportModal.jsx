import { useState } from 'react';
import Modal from '../common/Modal.jsx';
import Button from '../common/Button.jsx';
import { LOCATIONS, EMERGENCY_TYPES, SEVERITIES } from '../../mocks/data/mission5.js';
import { AlertTriangle } from 'lucide-react';

const field = 'w-full h-10 rounded-md border border-border bg-surface px-3 text-sm text-fg focus:border-brand outline-none';
const label = 'text-[11px] uppercase text-subtle font-medium';

export default function SosReportModal({ open, onClose, onSubmit }) {
  const [location, setLocation] = useState('classroom');
  const [type, setType] = useState('injury');
  const [severity, setSeverity] = useState('high');
  const [description, setDescription] = useState('');
  const [note, setNote] = useState('');
  const [confirm, setConfirm] = useState(false);

  const handleSend = () => {
    onSubmit?.({ location, type, severity, description, note });
    onClose?.();
    setConfirm(false);
  };

  return (
    <Modal
      open={open}
      onClose={() => { setConfirm(false); onClose?.(); }}
      title="Report Emergency"
      footer={
        confirm ? (
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setConfirm(false)}>Back</Button>
            <Button variant="danger" onClick={handleSend} leftIcon={<AlertTriangle size={14} />}>Confirm & Send</Button>
          </div>
        ) : (
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button variant="danger" onClick={() => setConfirm(true)}>Send SOS</Button>
          </div>
        )
      }
    >
      {confirm ? (
        <div className="text-sm">
          <div className="rounded-lg border border-danger/40 bg-danger/10 p-4 text-fg">
            <p className="font-semibold text-danger flex items-center gap-2">
              <AlertTriangle size={16} /> Confirm emergency alert
            </p>
            <p className="text-xs text-muted mt-1">
              This will notify all captains and teachers immediately. False alarms may be logged.
            </p>
          </div>
          <ul className="mt-4 space-y-1.5 text-sm text-fg">
            <li><span className="text-subtle text-xs uppercase mr-2">Location:</span> {LOCATIONS.find(l=>l.key===location).label}</li>
            <li><span className="text-subtle text-xs uppercase mr-2">Type:</span> {EMERGENCY_TYPES.find(t=>t.key===type).label}</li>
            <li><span className="text-subtle text-xs uppercase mr-2">Severity:</span> {SEVERITIES.find(s=>s.key===severity).label}</li>
          </ul>
        </div>
      ) : (
        <div className="space-y-4">
          <div>
            <label className={label}>Location</label>
            <select value={location} onChange={(e) => setLocation(e.target.value)} className={field + ' mt-1'}>
              {LOCATIONS.map((l) => <option key={l.key} value={l.key}>{l.icon} {l.label}</option>)}
            </select>
          </div>
          <div>
            <label className={label}>Emergency Type</label>
            <select value={type} onChange={(e) => setType(e.target.value)} className={field + ' mt-1'}>
              {EMERGENCY_TYPES.map((t) => <option key={t.key} value={t.key}>{t.icon} {t.label}</option>)}
            </select>
          </div>
          <div>
            <span className={label}>Severity Level</span>
            <div className="mt-1 grid grid-cols-4 gap-2">
              {SEVERITIES.map((s) => (
                <button
                  key={s.key}
                  onClick={() => setSeverity(s.key)}
                  className={`h-10 rounded-md border text-xs font-semibold transition-colors ${
                    severity === s.key ? 'border-brand bg-brand-soft text-brand' : 'border-border bg-surface text-muted hover:text-fg'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className={label}>Short Description</label>
            <textarea
              rows={2} value={description} onChange={(e) => setDescription(e.target.value)}
              placeholder="What is happening?"
              className="mt-1 w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-fg focus:border-brand outline-none resize-none"
            />
          </div>
          <div>
            <label className={label}>Optional Note</label>
            <input value={note} onChange={(e) => setNote(e.target.value)} placeholder="E.g. second floor, near stairs" className={field + ' mt-1'} />
          </div>
        </div>
      )}
    </Modal>
  );
}
