import { useState, useEffect } from 'react';
import Modal from '../common/Modal.jsx';
import Button from '../common/Button.jsx';
import Textarea from '../forms/Textarea.jsx';
import CategoryBadge from './CategoryBadge.jsx';
import StatusBadge from './StatusBadge.jsx';
import { CheckCircle2, XCircle, MessageSquareWarning, Plus, Image as ImageIcon, FileText } from 'lucide-react';

export default function ModerationModal({ complaint, open, onClose, onDecide }) {
  const [notes, setNotes] = useState('');
  useEffect(() => { if (!open) setNotes(''); }, [open]);

  if (!complaint) return null;
  const send = (decision) => onDecide?.({ decision, notes });

  const meta = [
    ['Reference',   complaint.id],
    ['Course',      `${complaint.courseCode} · ${complaint.course}`],
    ['Teacher',     complaint.teacher || '—'],
    ['Classroom',   complaint.classroom],
    ['Incident',    `${complaint.incidentDate} · ${complaint.incidentTime}`],
    ['Submitted',   new Date(complaint.submittedAt).toLocaleString()],
    ['Last update', new Date(complaint.lastUpdated).toLocaleString()],
    ['Strike wt.',  complaint.strikeWeight || 0],
  ];

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={`Review · ${complaint.id}`}
      footer={
        <div className="flex flex-wrap justify-end gap-2">
          <Button variant="ghost"   leftIcon={<MessageSquareWarning size={14} />} onClick={() => send('under_review')}>Request Review</Button>
          <Button variant="danger"  leftIcon={<XCircle size={14} />}              onClick={() => send('rejected')}>Reject</Button>
          <Button variant="success" leftIcon={<CheckCircle2 size={14} />}         onClick={() => send('resolved')}>Mark Resolved</Button>
        </div>
      }
    >
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <CategoryBadge category={complaint.category} />
          <StatusBadge status={complaint.status} />
          <span className="text-[11px] text-subtle font-mono ml-auto">
            {new Date(complaint.submittedAt).toLocaleString()}
          </span>
        </div>

        <div>
          <p className="text-sm font-semibold text-fg">{complaint.subject || complaint.title}</p>
          <p className="text-sm text-muted mt-1 leading-relaxed">{complaint.description}</p>
        </div>

        <dl className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs">
          {meta.map(([k, v]) => (
            <div key={k} className="flex items-center justify-between border-b border-border/60 pb-1">
              <dt className="text-muted">{k}</dt>
              <dd className="font-mono text-fg truncate ml-2">{v}</dd>
            </div>
          ))}
        </dl>

        <div>
          <p className="text-xs font-medium text-fg mb-1.5">Attached evidence</p>
          {complaint.hasEvidence ? (
            <div className="grid grid-cols-3 gap-2">
              {Array.from({ length: complaint.evidenceCount || 1 }).map((_, i) => (
                <div key={i} className="aspect-video rounded-lg border border-border bg-elevated flex items-center justify-center text-muted">
                  {i % 2 === 0 ? <ImageIcon size={20} /> : <FileText size={20} />}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-muted italic">No evidence attached.</p>
          )}
        </div>

        <Textarea
          label="Teacher remark"
          rows={3}
          placeholder="Add your remark — recorded with the decision."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </div>
    </Modal>
  );
}
