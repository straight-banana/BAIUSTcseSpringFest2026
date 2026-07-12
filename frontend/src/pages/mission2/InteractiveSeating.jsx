import { useMemo, useState } from 'react';
import PageContainer from '../../components/layout/PageContainer.jsx';
import PageHeader from '../../components/layout/PageHeader.jsx';
import Mission2SubNav from '../../components/mission2/Mission2SubNav.jsx';
import Card from '../../components/common/Card.jsx';
import Button from '../../components/common/Button.jsx';
import ClassroomGrid from '../../components/mission2/ClassroomGrid.jsx';
import ClassroomLegend from '../../components/mission2/ClassroomLegend.jsx';
import { useToast } from '../../components/feedback/Toast.jsx';
import { MousePointerClick, RotateCcw, Save } from 'lucide-react';
import { CLASSROOM_SIZES, buildSeatingPlan, STUDENTS } from '../../mocks/data/mission2.js';

export default function InteractiveSeating() {
  const toast = useToast();
  const size = CLASSROOM_SIZES[1]; // 6x6
  const [seats, setSeats] = useState(() => buildSeatingPlan(size.rows, size.cols, STUDENTS.slice(0, 30)));
  const [dragging, setDragging] = useState(null);
  const [selected, setSelected] = useState(null);

  const emptyCount = useMemo(() => seats.filter((s) => !s.student).length, [seats]);

  const onDragStart = (e, seat) => {
    setDragging(seat);
    e.dataTransfer?.setData('text/plain', seat.id);
    e.dataTransfer.effectAllowed = 'move';
  };
  const onDrop = (_, target) => {
    if (!dragging || dragging.id === target.id) return;
    setSeats((prev) => prev.map((s) => {
      if (s.id === dragging.id) return { ...s, student: target.student, constraints: target.constraints };
      if (s.id === target.id) return { ...s, student: dragging.student, constraints: dragging.constraints };
      return s;
    }));
    toast.push({ tone: 'success', title: 'Seat swapped', message: `${dragging.label} ↔ ${target.label}` });
    setDragging(null);
  };
  const reset = () => {
    setSeats(buildSeatingPlan(size.rows, size.cols, STUDENTS.slice(0, 30)));
    toast.push({ tone: 'info', title: 'Layout reset' });
  };

  return (
    <PageContainer>
      <PageHeader
        title="Seating Preview"
        subtitle="Click a seat to view its assigned student. Assignments are automated."
        icon={<MousePointerClick size={18} />}
      />
      <Mission2SubNav />

      <Card className="p-3 mb-4 text-xs text-muted flex flex-wrap items-center gap-x-4 gap-y-1">
        <span>Room · {size.label}</span>
        <span>Occupied · {seats.length - emptyCount}</span>
        <span>Empty · {emptyCount}</span>
      </Card>


      <div className="grid grid-cols-1 xl:grid-cols-[1fr_280px] gap-4">
        <ClassroomGrid
          seats={seats}
          rows={size.rows}
          cols={size.cols}
          selectedId={selected?.id}
          onSeatClick={setSelected}
          draggable={false}
        />

        <ClassroomLegend />
      </div>
    </PageContainer>
  );
}
