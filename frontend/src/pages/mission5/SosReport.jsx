import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Siren } from 'lucide-react';
import PageContainer from '../../components/layout/PageContainer.jsx';
import PageHeader from '../../components/layout/PageHeader.jsx';
import Card from '../../components/common/Card.jsx';
import Button from '../../components/common/Button.jsx';
import SectionHeader from '../../components/ui/SectionHeader.jsx';
import Mission5SubNav from '../../components/mission5/Mission5SubNav.jsx';
import SosReportModal from '../../components/mission5/SosReportModal.jsx';
import { LOCATIONS, EMERGENCY_TYPES, SEVERITIES } from '../../mocks/data/mission5.js';

const field = 'w-full h-10 rounded-md border border-border bg-surface px-3 text-sm text-fg focus:border-brand outline-none';
const label = 'text-[11px] uppercase text-subtle font-medium';

export default function SosReport() {
  const nav = useNavigate();
  const [location, setLocation] = useState('classroom');
  const [type, setType] = useState('injury');
  const [severity, setSeverity] = useState('high');
  const [description, setDescription] = useState('');
  const [note, setNote] = useState('');
  const [confirmOpen, setConfirmOpen] = useState(false);

  return (
    <PageContainer>
      <PageHeader
        title="Report Emergency"
        subtitle="Fill in a few details — the alert reaches captains instantly on submit."
        icon={<Siren size={18} />}
      />
      <Mission5SubNav />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2 p-6">
          <SectionHeader title="Emergency Details" description="Only submit for genuine emergencies." />
          <div className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-3">
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
            </div>
            <div>
              <span className={label}>Severity Level</span>
              <div className="mt-1 grid grid-cols-2 sm:grid-cols-4 gap-2">
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
              <label className={label}>Description</label>
              <textarea rows={3} value={description} onChange={(e) => setDescription(e.target.value)}
                placeholder="What is happening?"
                className="mt-1 w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-fg focus:border-brand outline-none resize-none" />
            </div>
            <div>
              <label className={label}>Optional Note</label>
              <input value={note} onChange={(e) => setNote(e.target.value)} placeholder="Room number, floor, landmark" className={field + ' mt-1'} />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => nav('/mission-5')}>Cancel</Button>
              <Button variant="danger" onClick={() => setConfirmOpen(true)}>Send SOS</Button>
            </div>
          </div>
        </Card>

        <Card className="p-5 h-fit">
          <SectionHeader title="Preview" description="What captains will see" />
          <div className="rounded-lg border border-border bg-surface p-4 text-sm space-y-2">
            <p><span className="text-subtle text-xs uppercase mr-2">Location:</span> {LOCATIONS.find(l=>l.key===location).icon} {LOCATIONS.find(l=>l.key===location).label}</p>
            <p><span className="text-subtle text-xs uppercase mr-2">Type:</span> {EMERGENCY_TYPES.find(t=>t.key===type).icon} {EMERGENCY_TYPES.find(t=>t.key===type).label}</p>
            <p><span className="text-subtle text-xs uppercase mr-2">Severity:</span> {SEVERITIES.find(s=>s.key===severity).label}</p>
            <p><span className="text-subtle text-xs uppercase mr-2">Note:</span> {note || '—'}</p>
            <p className="text-muted text-xs">{description || 'Add a short description above.'}</p>
          </div>
        </Card>
      </div>

      <SosReportModal
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onSubmit={(payload) => nav('/mission-5/success', { state: { location, type, severity, note, description, ...payload } })}
      />
    </PageContainer>
  );
}
