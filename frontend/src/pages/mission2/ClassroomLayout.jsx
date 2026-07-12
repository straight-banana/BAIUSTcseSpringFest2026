import { useMemo, useState, useEffect } from 'react';
import PageContainer from '../../components/layout/PageContainer.jsx';
import PageHeader from '../../components/layout/PageHeader.jsx';
import Mission2SubNav from '../../components/mission2/Mission2SubNav.jsx';
import Card from '../../components/common/Card.jsx';
import Select from '../../components/forms/Select.jsx';
import Input from '../../components/forms/Input.jsx';
import ClassroomGrid from '../../components/mission2/ClassroomGrid.jsx';
import ClassroomLegend from '../../components/mission2/ClassroomLegend.jsx';
import Button from '../../components/common/Button.jsx';
import { LayoutGrid, Save, Sparkles, Plus } from 'lucide-react';
import { useToast } from '../../components/feedback/Toast.jsx';
import { getLatestPlan } from '../../services/seatsService.js';
import { mapSeatPlanFromApi } from '../../utils/missionApiMaps.js';
import { useAuth } from '../../context/AuthContext.jsx';

const CUSTOM_KEY = 'akp:customLayouts';

// fallback classroom sizes
const CLASSROOM_SIZES = [
  { id: '5x6', label: '5 × 6', rows: 5, cols: 6 },
  { id: '6x6', label: '6 × 6', rows: 6, cols: 6 },
  { id: '7x8', label: '7 × 8', rows: 7, cols: 8 },
];

function buildSeatingPlan(rows, cols, students = []) {
  const seats = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const id = `${r}-${c}`;
      const idx = r * cols + c;
      seats.push({
        id,
        row: r,
        col: c,
        label: `${String.fromCharCode(65 + r)}${c + 1}`,
        student: students[idx] || null,
      });
    }
  }
  return seats;
}

export default function ClassroomLayout() {
  const toast = useToast();
  const { role } = useAuth();
  const isCaptain = role === 'captain';
  const canEdit = role === 'teacher' || role === 'office';

  const [custom, setCustom] = useState(() => {
    try { return JSON.parse(localStorage.getItem(CUSTOM_KEY) || '[]'); } catch { return []; }
  });
  useEffect(() => { try { localStorage.setItem(CUSTOM_KEY, JSON.stringify(custom)); } catch {} }, [custom]);

  const allSizes = useMemo(() => [...CLASSROOM_SIZES, ...custom], [custom]);
  const [sizeId, setSizeId] = useState('7x8');
  const size = allSizes.find((s) => s.id === sizeId) || allSizes[0];
  const [apiPlan, setApiPlan] = useState(null);
  const seats = useMemo(() => {
    if (apiPlan) return apiPlan.seats || [];
    return buildSeatingPlan(size.rows, size.cols, []);
  }, [size, apiPlan]);

    useEffect(() => {
      let alive = true;
      (async () => {
        try {
          const res = await getLatestPlan();
          if (!alive) return;
          const plan = mapSeatPlanFromApi(res?.data || res);
          if (plan) {
            setApiPlan(plan);
            // if plan contains grid info, try to set a matching size id
            const grows = plan.summary?.gridRows || plan.gridRows || (plan.seats?.length ? Math.max(...plan.seats.map(s => s.row)) + 1 : null);
            const gcols = plan.summary?.gridCols || plan.gridCols || (plan.seats?.length ? Math.max(...plan.seats.map(s => s.col)) + 1 : null);
            if (grows && gcols) {
              const matchId = `${grows}x${gcols}`;
              if (!allSizes.find((s) => s.id === matchId)) setSizeId(matchId);
            }
          }
        } catch {
          // ignore and keep local fallback
        }
      })();
      return () => { alive = false; };
    }, []);
  const [selected, setSelected] = useState(null);

  const [showNew, setShowNew] = useState(false);
  const [newLayout, setNewLayout] = useState({ label: '', rows: 6, cols: 6 });

  const addCustomLayout = () => {
    if (!newLayout.label.trim()) return;
    const id = `custom-${Date.now()}`;
    const rows = Math.max(2, Math.min(12, Number(newLayout.rows) || 6));
    const cols = Math.max(2, Math.min(12, Number(newLayout.cols) || 6));
    const entry = { id, label: `${newLayout.label} (${rows}×${cols})`, rows, cols };
    setCustom((c) => [...c, entry]);
    setSizeId(id);
    setShowNew(false);
    setNewLayout({ label: '', rows: 6, cols: 6 });
    toast.push({ tone: 'success', title: 'Layout added', message: entry.label });
  };

  return (
    <PageContainer>
      <PageHeader
        title="Classroom Layout"
        subtitle={isCaptain
          ? 'Select a layout for your section. Teachers manage the layout catalog.'
          : 'Pick a room size and preview desks, podium, aisle, and entrance.'}
        icon={<LayoutGrid size={18} />}
        actions={canEdit ? (
          <div className="flex gap-2">
            <Button variant="secondary" leftIcon={<Plus size={14} />} onClick={() => setShowNew((v) => !v)}>Add Layout</Button>
            <Button variant="secondary" leftIcon={<Save size={14} />} onClick={() => toast.push({ tone: 'success', title: 'Layout saved (mock)' })}>Save Layout</Button>
            <Button leftIcon={<Sparkles size={14} />} onClick={() => toast.push({ tone: 'info', title: 'Generation queued (mock)' })}>Generate Plan</Button>
          </div>
        ) : null}
      />
      <Mission2SubNav />

      <Card className="p-4 mb-4">
        <div className="flex flex-col sm:flex-row sm:items-end gap-3">
          <div className="sm:max-w-xs w-full">
            <Select label="Classroom Size" value={sizeId} onChange={(e) => setSizeId(e.target.value)}>
              {allSizes.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
            </Select>
          </div>
          <div className="text-xs text-muted sm:ml-auto">
            {size.rows} rows · {size.cols} columns · {size.rows * size.cols} seats · center aisle{size.cols >= 6 ? ' enabled' : ' hidden'}
          </div>
        </div>

        {canEdit && showNew && (
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-4 gap-3 items-end border-t border-border pt-4">
            <div className="sm:col-span-2">
              <Input label="Layout name" value={newLayout.label} onChange={(e) => setNewLayout((p) => ({ ...p, label: e.target.value }))} placeholder="e.g. Lab room A" />
            </div>
            <Input label="Rows" type="number" min={2} max={12} value={newLayout.rows} onChange={(e) => setNewLayout((p) => ({ ...p, rows: e.target.value }))} />
            <Input label="Columns" type="number" min={2} max={12} value={newLayout.cols} onChange={(e) => setNewLayout((p) => ({ ...p, cols: e.target.value }))} />
            <div className="sm:col-span-4 flex justify-end gap-2">
              <Button variant="ghost" onClick={() => setShowNew(false)}>Cancel</Button>
              <Button leftIcon={<Plus size={14} />} onClick={addCustomLayout}>Add layout</Button>
            </div>
          </div>
        )}
      </Card>


      <div className="grid grid-cols-1 xl:grid-cols-[1fr_280px] gap-4">
        <ClassroomGrid
          seats={seats}
          rows={size.rows}
          cols={size.cols}
          selectedId={selected?.id}
          onSeatClick={(s) => setSelected(s)}
        />
        <div className="space-y-4">
          <Card className="p-4">
            <p className="text-xs font-semibold text-fg mb-2">Selected Seat</p>
            {selected ? (
              <div className="text-sm">
                <p className="font-mono text-muted">{selected.label}</p>
                {selected.student ? (
                  <>
                    <p className="mt-2 text-fg font-medium">{selected.student.name}</p>
                    <p className="text-xs text-muted">{selected.student.roll} · {selected.student.height}cm</p>
                  </>
                ) : (
                  <p className="mt-2 text-xs text-muted">Empty seat — drag a student in from the interactive view.</p>
                )}
              </div>
            ) : (
              <p className="text-xs text-muted">Tap any desk to inspect it.</p>
            )}
          </Card>
          <ClassroomLegend />
        </div>
      </div>
    </PageContainer>
  );
}
