import { useMemo, useState, useSyncExternalStore } from 'react';
import { Award, Search, ShieldCheck, GraduationCap, Users } from 'lucide-react';
import PageContainer from '../../components/layout/PageContainer.jsx';
import PageHeader from '../../components/layout/PageHeader.jsx';
import Card from '../../components/common/Card.jsx';
import Button from '../../components/common/Button.jsx';
import SectionHeader from '../../components/ui/SectionHeader.jsx';
import Mission8SubNav from '../../components/mission8/Mission8SubNav.jsx';
import { useToast } from '../../components/feedback/Toast.jsx';
import {
  getStudents,
  getVersion,
  subscribe,
  setCaptain,
  CLASS_OPTIONS,
  SECTION_OPTIONS,
} from '../../mocks/rosterStore.js';

export default function AssignCaptain() {
  useSyncExternalStore(subscribe, getVersion, getVersion);
  const students = getStudents();
  const [query, setQuery] = useState('');
  const [cls, setCls] = useState('all');
  const [sec, setSec] = useState('all');
  const toast = useToast?.() ?? { push: () => {} };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return students.filter((s) => {
      if (cls !== 'all' && s.className !== cls) return false;
      if (sec !== 'all' && s.section !== sec) return false;
      if (q && !s.name.toLowerCase().includes(q) && !s.roll.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [students, query, cls, sec]);

  const captainCount = students.filter((s) => s.isCaptain).length;
  const totalSections = CLASS_OPTIONS.length * SECTION_OPTIONS.length;

  const handleToggle = (student) => {
    const next = !student.isCaptain;
    setCaptain(student.id, next);
    toast.push?.({
      title: next ? 'Captain assigned' : 'Captain removed',
      message: next
        ? `${student.name} is now captain of Class ${student.className}-${student.section}.`
        : `${student.name} is no longer a captain.`,
      tone: next ? 'success' : 'info',
    });
  };

  return (
    <PageContainer>
      <PageHeader
        title="Assign Class Captain"
        subtitle="Search students by class and section, then promote one captain per section."
        icon={<Award size={18} />}
      />
      <Mission8SubNav />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        <StatTile icon={<Users size={16} />} label="Students" value={students.length} />
        <StatTile icon={<ShieldCheck size={16} />} label="Captains assigned" value={`${captainCount} / ${totalSections}`} />
        <StatTile icon={<GraduationCap size={16} />} label="Classes" value={CLASS_OPTIONS.length} />
        <StatTile icon={<Users size={16} />} label="Sections / class" value={SECTION_OPTIONS.length} />
      </div>

      <Card className="p-4 mb-4">
        <SectionHeader title="Filter roster" description="One captain is allowed per section." />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div className="md:col-span-2">
            <label className="block text-xs font-medium text-fg mb-1.5">Search</label>
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Name or roll number…"
                className="w-full h-10 pl-9 pr-3 rounded-lg border border-border bg-surface text-fg text-sm focus:outline-none focus:ring-2 focus:ring-brand/40"
              />
            </div>
          </div>
          <SelectBox label="Class" value={cls} onChange={setCls} options={[['all','All classes'], ...CLASS_OPTIONS.map((c)=>[c,`Class ${c}`])]} />
          <SelectBox label="Section" value={sec} onChange={setSec} options={[['all','All sections'], ...SECTION_OPTIONS.map((s)=>[s,`Section ${s}`])]} />
        </div>
      </Card>

      <Card className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-surface text-muted text-xs uppercase tracking-wider">
              <tr>
                <th className="px-4 py-2.5 font-medium">Student</th>
                <th className="px-4 py-2.5 font-medium">Roll</th>
                <th className="px-4 py-2.5 font-medium">Class</th>
                <th className="px-4 py-2.5 font-medium">Section</th>
                <th className="px-4 py-2.5 font-medium">Captain</th>
                <th className="px-4 py-2.5 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={6} className="px-4 py-10 text-center text-muted">No students match these filters.</td></tr>
              ) : filtered.map((s) => (
                <tr key={s.id} className="border-t border-border hover:bg-surface/60">
                  <td className="px-4 py-3 text-fg">{s.name}</td>
                  <td className="px-4 py-3 text-xs text-muted font-mono">{s.roll}</td>
                  <td className="px-4 py-3">{s.className}</td>
                  <td className="px-4 py-3">{s.section}</td>
                  <td className="px-4 py-3">
                    <Toggle checked={s.isCaptain} onChange={() => handleToggle(s)} />
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Button
                      size="sm"
                      variant={s.isCaptain ? 'outline' : 'primary'}
                      onClick={() => handleToggle(s)}
                    >
                      {s.isCaptain ? 'Remove captain' : 'Make captain'}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </PageContainer>
  );
}

function StatTile({ icon, label, value }) {
  return (
    <Card className="p-3">
      <div className="flex items-center gap-2 text-muted text-xs">{icon}{label}</div>
      <p className="mt-1 text-lg font-semibold text-fg">{value}</p>
    </Card>
  );
}

function SelectBox({ label, value, onChange, options }) {
  return (
    <label className="block">
      <span className="block text-xs font-medium text-fg mb-1.5">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-10 px-3 rounded-lg border border-border bg-surface text-fg text-sm focus:outline-none focus:ring-2 focus:ring-brand/40"
      >
        {options.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
      </select>
    </label>
  );
}

function Toggle({ checked, onChange }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={onChange}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${checked ? 'bg-brand' : 'bg-elevated border border-border'}`}
    >
      <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition ${checked ? 'translate-x-6' : 'translate-x-1'}`} />
    </button>
  );
}
