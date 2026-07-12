import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageContainer from '../../components/layout/PageContainer.jsx';
import PageHeader from '../../components/layout/PageHeader.jsx';
import Mission1SubNav from '../../components/mission1/Mission1SubNav.jsx';
import Card from '../../components/common/Card.jsx';
import Button from '../../components/common/Button.jsx';
import Input from '../../components/forms/Input.jsx';
import Textarea from '../../components/forms/Textarea.jsx';
import Select from '../../components/forms/Select.jsx';
import { Switch } from '../../components/forms/Controls.jsx';
import AnonymousNotice from '../../components/mission1/AnonymousNotice.jsx';
import EvidenceUpload from '../../components/mission1/EvidenceUpload.jsx';
import ConfirmationDialog from '../../components/mission1/ConfirmationDialog.jsx';
import { useToast } from '../../components/feedback/Toast.jsx';
import {
  CATEGORIES, COURSES, TEACHERS, CLASSROOMS, generateReferenceId,
} from '../../mocks/data/complaints.js';
import { ShieldAlert, Send, EyeOff } from 'lucide-react';

const SUBJECT_MAX = 120;
const DESC_MAX = 1200;

const today = () => new Date().toISOString().slice(0, 10);
const nowTime = () => {
  const d = new Date();
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
};

export default function ComplaintSubmit() {
  const nav = useNavigate();
  const toast = useToast();
  const [form, setForm] = useState({
    category: '',
    subject: '',
    description: '',
    course: '',
    courseCode: '',
    teacher: '',
    classroom: '',
    incidentDate: today(),
    incidentTime: nowTime(),
    anonymous: true,
  });
  const [files, setFiles] = useState([]);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  // When the course name is picked, auto-fill the code (still editable).
  const pickCourse = (name) => {
    const match = COURSES.find((c) => c.name === name);
    setForm((f) => ({ ...f, course: name, courseCode: match?.code || f.courseCode }));
  };

  const errors = useMemo(() => {
    const e = {};
    if (!form.category) e.category = 'Choose a category';
    if (form.subject.length > SUBJECT_MAX) e.subject = `Max ${SUBJECT_MAX} characters`;
    if (!form.description.trim() || form.description.trim().length < 20)
      e.description = 'Describe the incident in at least 20 characters';
    else if (form.description.length > DESC_MAX) e.description = `Max ${DESC_MAX} characters`;
    if (!form.course.trim()) e.course = 'Course name required';
    if (!form.courseCode.trim()) e.courseCode = 'Course code required';
    if (!form.classroom.trim()) e.classroom = 'Classroom required';
    if (!form.incidentDate) e.incidentDate = 'Date required';
    if (!form.incidentTime) e.incidentTime = 'Time required';
    return e;
  }, [form]);

  const valid = Object.keys(errors).length === 0;

  const submit = () => {
    setConfirmOpen(false);
    const ref = generateReferenceId();
    toast.push({ tone: 'success', title: 'Complaint submitted', message: ref });
    nav('/mission-1/submitted', {
      state: { referenceId: ref, category: form.category, anonymous: form.anonymous },
    });
  };

  return (
    <PageContainer>
      <PageHeader
        title="File an Anonymous Complaint"
        subtitle="Your identity will remain anonymous. Only authorized reviewers can access complaint details."
        icon={<ShieldAlert size={18} />}
      />
      <Mission1SubNav />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <form
          onSubmit={(e) => { e.preventDefault(); if (valid) setConfirmOpen(true); }}
          className="lg:col-span-2 space-y-4"
          noValidate
        >
          {/* Section 1 — What happened */}
          <Card className="p-5 space-y-4">
            <h3 className="text-sm font-semibold text-fg">Incident details</h3>

            <Select
              label="Complaint category *"
              name="category"
              value={form.category}
              onChange={(e) => set('category', e.target.value)}
              error={errors.category}
              aria-required="true"
            >
              <option value="">Select a category…</option>
              {CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </Select>

            <div>
              <Input
                label="Subject (optional)"
                name="subject"
                placeholder="Short headline — helps reviewers scan quickly"
                value={form.subject}
                onChange={(e) => set('subject', e.target.value.slice(0, SUBJECT_MAX))}
                error={errors.subject}
                maxLength={SUBJECT_MAX}
              />
              <p className="mt-1 text-[11px] text-subtle text-right font-mono">
                {form.subject.length}/{SUBJECT_MAX}
              </p>
            </div>

            <div>
              <Textarea
                label="Description *"
                name="description"
                rows={7}
                placeholder="What happened? When? Any witnesses? Do not include names of victims."
                value={form.description}
                onChange={(e) => set('description', e.target.value.slice(0, DESC_MAX))}
                error={errors.description}
                aria-required="true"
              />
              <p className="mt-1 text-[11px] text-subtle text-right font-mono">
                {form.description.length}/{DESC_MAX}
              </p>
            </div>
          </Card>

          {/* Section 2 — Context */}
          <Card className="p-5 space-y-4">
            <h3 className="text-sm font-semibold text-fg">Context</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Select
                label="Course name *"
                value={form.course}
                onChange={(e) => pickCourse(e.target.value)}
                error={errors.course}
              >
                <option value="">Select course…</option>
                {COURSES.map((c) => (
                  <option key={c.code} value={c.name}>{c.name}</option>
                ))}
              </Select>
              <Input
                label="Course code *"
                placeholder="e.g. CSE 2101"
                value={form.courseCode}
                onChange={(e) => set('courseCode', e.target.value)}
                error={errors.courseCode}
              />
              <Select
                label="Teacher (optional)"
                value={form.teacher}
                onChange={(e) => set('teacher', e.target.value)}
              >
                <option value="">Prefer not to say</option>
                {TEACHERS.map((t) => <option key={t} value={t}>{t}</option>)}
              </Select>
              <Select
                label="Classroom *"
                value={form.classroom}
                onChange={(e) => set('classroom', e.target.value)}
                error={errors.classroom}
              >
                <option value="">Select classroom…</option>
                {CLASSROOMS.map((r) => <option key={r} value={r}>{r}</option>)}
              </Select>
              <Input
                label="Date *"
                type="date"
                value={form.incidentDate}
                onChange={(e) => set('incidentDate', e.target.value)}
                error={errors.incidentDate}
              />
              <Input
                label="Time *"
                type="time"
                value={form.incidentTime}
                onChange={(e) => set('incidentTime', e.target.value)}
                error={errors.incidentTime}
              />
            </div>
          </Card>

          {/* Section 3 — Evidence */}
          <Card className="p-5">
            <div className="mb-3 flex items-start justify-between gap-3 flex-wrap">
              <div>
                <h3 className="text-sm font-semibold text-fg">Evidence (optional)</h3>
                <p className="text-xs text-muted mt-0.5">
                  Images or PDFs. Metadata (EXIF, timestamps, GPS) is stripped before storage.
                </p>
              </div>
              <span className="inline-flex items-center gap-1.5 text-[11px] text-muted">
                <EyeOff size={12} /> Evidence is securely processed
              </span>
            </div>
            <EvidenceUpload files={files} onChange={setFiles} />
          </Card>

          {/* Section 4 — Anonymity + submit */}
          <Card className="p-5 flex flex-wrap items-center justify-between gap-4">
            <Switch
              label="Submit anonymously (recommended)"
              checked={form.anonymous}
              onChange={(v) => set('anonymous', v)}
            />
            <div className="flex gap-2 ml-auto">
              <Button variant="ghost" type="button" onClick={() => nav('/mission-1')}>
                Cancel
              </Button>
              <Button type="submit" disabled={!valid} leftIcon={<Send size={14} />}>
                Submit Complaint
              </Button>
            </div>
          </Card>
        </form>

        <aside className="space-y-4">
          <AnonymousNotice />
          <Card className="p-5">
            <h3 className="text-sm font-semibold text-fg">Tips for a strong report</h3>
            <ul className="mt-2 space-y-2 text-xs text-muted">
              <li>• Stick to what you personally witnessed.</li>
              <li>• Include the exact time and classroom.</li>
              <li>• Photos help but are never required.</li>
              <li>• Avoid naming victims — only the accused.</li>
              <li>• You can attach multiple files.</li>
            </ul>
          </Card>
        </aside>
      </div>

      <ConfirmationDialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={submit}
        title="Submit this complaint anonymously?"
        message="Once submitted, you cannot edit it. A random reference ID will be generated so you can track its status."
        confirmLabel="Yes, submit"
      />
    </PageContainer>
  );
}
