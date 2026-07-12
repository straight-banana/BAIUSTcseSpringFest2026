import { useMemo, useState } from 'react';
import PageContainer from '../../components/layout/PageContainer.jsx';
import PageHeader from '../../components/layout/PageHeader.jsx';
import Mission2SubNav from '../../components/mission2/Mission2SubNav.jsx';
import Card from '../../components/common/Card.jsx';
import Button from '../../components/common/Button.jsx';
import Input from '../../components/forms/Input.jsx';
import Select from '../../components/forms/Select.jsx';
import StudentCard from '../../components/mission2/StudentCard.jsx';
import StudentFormModal from '../../components/mission2/StudentFormModal.jsx';
import Modal from '../../components/common/Modal.jsx';
import EmptyState from '../../components/feedback/EmptyState.jsx';
import HeightBadge from '../../components/mission2/HeightBadge.jsx';
import ConstraintBadge from '../../components/mission2/ConstraintBadge.jsx';
import { useToast } from '../../components/feedback/Toast.jsx';
import { Users, Plus, Search, Download, Upload, ChevronLeft, ChevronRight } from 'lucide-react';
import { STUDENTS } from '../../mocks/data/mission2.js';

const PAGE_SIZE = 8;

export default function StudentManagement() {
  const toast = useToast();
  const [students, setStudents] = useState(STUDENTS);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const [sort, setSort] = useState('name');
  const [page, setPage] = useState(1);
  const [editing, setEditing] = useState(undefined); // undefined = closed; null = add; obj = edit
  const [deleteTarget, setDeleteTarget] = useState(null);

  const filtered = useMemo(() => {
    let list = students.filter((s) => {
      const q = query.trim().toLowerCase();
      if (q && !s.name.toLowerCase().includes(q) && !s.roll.includes(q)) return false;
      if (filter === 'vision' && s.vision === 'None') return false;
      if (filter === 'hearing' && s.hearing === 'None') return false;
      if (filter === 'tall' && s.height < 180) return false;
      if (filter === 'short' && s.height >= 160) return false;
      return true;
    });
    list.sort((a, b) => {
      if (sort === 'name') return a.name.localeCompare(b.name);
      if (sort === 'roll') return a.roll.localeCompare(b.roll);
      if (sort === 'height-asc') return a.height - b.height;
      if (sort === 'height-desc') return b.height - a.height;
      return 0;
    });
    return list;
  }, [students, query, filter, sort]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const view = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleSave = (data) => {
    if (data.id) {
      setStudents((xs) => xs.map((s) => (s.id === data.id ? data : s)));
      toast.push({ tone: 'success', title: 'Student updated', message: data.name });
    } else {
      const id = `S-${String(1000 + students.length + 1).padStart(4, '0')}`;
      setStudents((xs) => [{ ...data, id }, ...xs]);
      toast.push({ tone: 'success', title: 'Student added', message: data.name });
    }
    setEditing(undefined);
  };
  const handleDelete = () => {
    setStudents((xs) => xs.filter((s) => s.id !== deleteTarget.id));
    toast.push({ tone: 'warning', title: 'Student removed', message: deleteTarget.name });
    setDeleteTarget(null);
  };

  return (
    <PageContainer>
      <PageHeader
        title="Student Roster"
        subtitle="Read-only roster used by the automated seating engine."
        icon={<Users size={18} />}
      />
      <Mission2SubNav />


      <Card className="p-4 mb-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div className="md:col-span-2">
            <Input leftIcon={<Search size={14} />} placeholder="Search by name or roll…" value={query} onChange={(e) => { setQuery(e.target.value); setPage(1); }} />
          </div>
          <Select value={filter} onChange={(e) => { setFilter(e.target.value); setPage(1); }}>
            <option value="all">All students</option>
            <option value="vision">Vision priority</option>
            <option value="hearing">Hearing priority</option>
            <option value="tall">Tall (≥ 180cm)</option>
            <option value="short">Short (&lt; 160cm)</option>
          </Select>
          <Select value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="name">Sort: Name</option>
            <option value="roll">Sort: Roll</option>
            <option value="height-asc">Sort: Height ↑</option>
            <option value="height-desc">Sort: Height ↓</option>
          </Select>
        </div>
      </Card>

      {/* Table on desktop, cards on mobile */}
      <Card className="p-0 overflow-hidden hidden md:block">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-surface text-left">
              <tr className="text-xs uppercase tracking-wide text-muted">
                <th className="px-4 py-3">Student</th>
                <th className="px-4 py-3">Roll</th>
                <th className="px-4 py-3">Height</th>
                <th className="px-4 py-3">Gender</th>
                <th className="px-4 py-3">Priorities</th>
              </tr>

            </thead>
            <tbody>
              {view.map((s) => (
                <tr key={s.id} className="border-t border-border hover:bg-surface/60">
                  <td className="px-4 py-3">
                    <p className="font-medium text-fg">{s.name}</p>
                    {s.notes && <p className="text-xs text-muted truncate max-w-[280px]">{s.notes}</p>}
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-muted">{s.roll}</td>
                  <td className="px-4 py-3"><HeightBadge height={s.height} /></td>
                  <td className="px-4 py-3 text-muted">{s.gender}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {s.vision !== 'None' && <ConstraintBadge type="vision" compact />}
                      {s.hearing !== 'None' && <ConstraintBadge type="hearing" compact />}
                      {s.vision === 'None' && s.hearing === 'None' && <span className="text-xs text-subtle">—</span>}
                    </div>
                  </td>


                </tr>
              ))}
            </tbody>
          </table>
          {view.length === 0 && (
            <div className="p-6">
              <EmptyState title="No students match" message="Try clearing filters or searching a different term." />
            </div>
          )}
        </div>
      </Card>

      <div className="md:hidden grid grid-cols-1 sm:grid-cols-2 gap-3">
        {view.map((s) => (
          <StudentCard key={s.id} student={s} />
        ))}

        {view.length === 0 && (
          <div className="sm:col-span-2"><EmptyState title="No students match" /></div>
        )}
      </div>

      {/* Pagination */}
      <div className="mt-4 flex items-center justify-between text-xs text-muted">
        <span>Showing {view.length} of {filtered.length} students</span>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="secondary" disabled={page <= 1} onClick={() => setPage((p) => p - 1)} leftIcon={<ChevronLeft size={12} />}>Prev</Button>
          <span className="tabular-nums">Page {page} / {pageCount}</span>
          <Button size="sm" variant="secondary" disabled={page >= pageCount} onClick={() => setPage((p) => p + 1)} rightIcon={<ChevronRight size={12} />}>Next</Button>
        </div>
      </div>

      <StudentFormModal
        open={editing !== undefined}
        onClose={() => setEditing(undefined)}
        onSave={handleSave}
        initial={editing || null}
      />

      <Modal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Remove student?"
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setDeleteTarget(null)}>Cancel</Button>
            <Button variant="danger" onClick={handleDelete}>Delete</Button>
          </div>
        }
      >
        This will remove <span className="font-medium text-fg">{deleteTarget?.name}</span> from the current roster. You can re-add them later.
      </Modal>
    </PageContainer>
  );
}
