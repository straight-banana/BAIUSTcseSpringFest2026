import { useMemo, useState } from 'react';
import PageContainer from '../../components/layout/PageContainer.jsx';
import PageHeader from '../../components/layout/PageHeader.jsx';
import Mission2SubNav from '../../components/mission2/Mission2SubNav.jsx';
import Card from '../../components/common/Card.jsx';
import Select from '../../components/forms/Select.jsx';
import LineOfSightOverlay from '../../components/mission2/LineOfSightOverlay.jsx';
import Badge from '../../components/ui/Badge.jsx';
import { Target } from 'lucide-react';
import { CLASSROOM_SIZES, buildSeatingPlan, STUDENTS } from '../../mocks/data/mission2.js';

export default function LineOfSight() {
  const size = CLASSROOM_SIZES[1];
  const seats = useMemo(() => buildSeatingPlan(size.rows, size.cols, STUDENTS.slice(0, 30)), [size]);
  const seated = seats.filter((s) => s.student);
  const [targetId, setTargetId] = useState(seated[6]?.student.id);

  const target = seated.find((s) => s.student.id === targetId);

  return (
    <PageContainer>
      <PageHeader
        title="Line-of-Sight Visualization"
        subtitle="Draw sight-lines from the teacher podium to detect camouflaged students."
        icon={<Target size={18} />}
      />
      <Mission2SubNav />

      <Card className="p-4 mb-4">
        <div className="flex flex-col sm:flex-row sm:items-end gap-3">
          <div className="sm:max-w-sm w-full">
            <Select label="Highlight Student" value={targetId} onChange={(e) => setTargetId(e.target.value)}>
              {seated.map((s) => (
                <option key={s.student.id} value={s.student.id}>
                  {s.student.name} — seat {s.label}
                </option>
              ))}
            </Select>
          </div>
          {target && (
            <div className="flex flex-wrap items-center gap-2 sm:ml-auto">
              <Badge tone="brand">Seat {target.label}</Badge>
              <Badge tone="neutral">{target.student.height}cm</Badge>
              <Badge tone={target.row === 0 ? 'success' : target.row >= 4 ? 'danger' : 'warning'}>
                {target.row === 0 ? 'Front row · fully visible' : target.row >= 4 ? 'Rear · likely obstructed' : 'Mid · partial visibility'}
              </Badge>
            </div>
          )}
        </div>
      </Card>

      <LineOfSightOverlay
        rows={size.rows}
        cols={size.cols}
        seats={seats}
        highlightedId={targetId}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4">
        <Info title="Teacher Position" body="Podium fixed at the center of the front wall. Sight lines fan out symmetrically." />
        <Info title="Sight Lines" body="Dashed lines are visualization only — real occlusion checks land with the algorithm." />
        <Info title="Highlight Target" body="Solid red line + label indicates who you're currently checking for camouflage." />
      </div>
    </PageContainer>
  );
}

function Info({ title, body }) {
  return (
    <Card className="p-4">
      <p className="text-xs font-semibold text-fg">{title}</p>
      <p className="mt-1 text-xs text-muted">{body}</p>
    </Card>
  );
}
