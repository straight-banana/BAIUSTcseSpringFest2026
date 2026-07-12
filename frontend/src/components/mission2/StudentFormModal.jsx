import { useEffect, useState } from 'react';
import Modal from '../common/Modal.jsx';
import Button from '../common/Button.jsx';
import Input from '../forms/Input.jsx';
import Select from '../forms/Select.jsx';
import Textarea from '../forms/Textarea.jsx';

const EMPTY = { name: '', roll: '', height: 165, gender: 'Male', vision: 'None', hearing: 'None', notes: '' };

export default function StudentFormModal({ open, onClose, onSave, initial }) {
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});

  useEffect(() => { setForm(initial ? { ...EMPTY, ...initial } : EMPTY); setErrors({}); }, [initial, open]);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.roll.trim()) e.roll = 'Roll number is required';
    const h = Number(form.height);
    if (!h || h < 120 || h > 220) e.height = 'Height must be between 120 and 220 cm';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    onSave?.({ ...form, height: Number(form.height) });
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={initial ? 'Edit Student' : 'Add Student'}
      footer={
        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave}>{initial ? 'Save Changes' : 'Add Student'}</Button>
        </div>
      }
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Input label="Student Name" name="name" value={form.name} onChange={set('name')} error={errors.name} placeholder="e.g. Sadia Rashid" />
        <Input label="Roll Number" name="roll" value={form.roll} onChange={set('roll')} error={errors.roll} placeholder="e.g. 220145" />
        <Input label="Height (cm)" name="height" type="number" min={120} max={220} value={form.height} onChange={set('height')} error={errors.height} />
        <Select label="Gender" name="gender" value={form.gender} onChange={set('gender')}>
          <option>Male</option><option>Female</option><option>Other</option>
        </Select>
        <Select label="Vision Impairment" name="vision" value={form.vision} onChange={set('vision')}>
          <option>None</option><option>Mild</option><option>Severe</option>
        </Select>
        <Select label="Hearing Impairment" name="hearing" value={form.hearing} onChange={set('hearing')}>
          <option>None</option><option>Mild</option><option>Severe</option>
        </Select>
        <div className="sm:col-span-2">
          <Textarea label="Special Notes" name="notes" value={form.notes} onChange={set('notes')} placeholder="Any additional seating requirements…" rows={3} />
        </div>
      </div>
    </Modal>
  );
}
