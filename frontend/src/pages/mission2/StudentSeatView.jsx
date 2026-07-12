import PageContainer from '../../components/layout/PageContainer.jsx';
import PageHeader from '../../components/layout/PageHeader.jsx';
import Card from '../../components/common/Card.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { STUDENTS, CLASSROOM_SIZES, buildSeatingPlan, HIGHLIGHTED_STUDENT_ID } from '../../mocks/data/mission2.js';
import { cx } from '../../utils/index.js';

/**
 * Student-only view of the Seat Planner.
 * Shows the classroom grid but only highlights the current student's seat.
 * No edit controls. No other students' personal details.
 */
export default function StudentSeatView() {
  const { user } = useAuth();

  // Match by roll if available, else fall back to the demo highlight.
  const me =
    STUDENTS.find((s) => user?.rollId && s.roll === user.rollId) ||
    STUDENTS.find((s) => s.id === HIGHLIGHTED_STUDENT_ID) ||
    STUDENTS[0];

  const room = CLASSROOM_SIZES[1]; // 6x6
  const seats = buildSeatingPlan(room.rows, room.cols);
  const mySeat = seats.find((s) => s.student?.id === me.id);

  return (
    <PageContainer>
      <PageHeader
        eyebrow="File 02 · Seat Planner"
        title="My seat"
        subtitle="Your assigned seat in the current plan. View-only — the planner is managed by your captain and teachers."
      />


      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
        <Card eyebrow="Classroom · 6 × 6" ref={mySeat ? `SEAT ${mySeat.label}` : 'UNASSIGNED'}>
          <div className="p-5">
            <div className="mb-4 flex items-center justify-between">
              <p className="font-mono text-[10px] uppercase tracking-widest text-muted">Front · Board</p>
              <p className="font-mono text-[10px] uppercase tracking-widest text-muted">Podium →</p>
            </div>
            <div
              className="grid gap-1.5"
              style={{ gridTemplateColumns: `repeat(${room.cols}, minmax(0, 1fr))` }}
            >
              {seats.map((seat) => {
                const mine = seat.student?.id === me.id;
                const filled = !!seat.student;
                const firstName = seat.student?.name.split(' ')[0] || '';
                return (
                  <div
                    key={seat.id}
                    className={cx(
                      'aspect-square rounded-sm border flex flex-col items-center justify-center text-[9px] font-mono px-1 text-center leading-tight overflow-hidden',
                      mine
                        ? 'bg-brand text-brand-fg border-brand ring-2 ring-brand/40 font-bold'
                        : filled
                        ? 'bg-surface border-border text-fg'
                        : 'bg-transparent border-dashed border-border text-subtle/60'
                    )}
                    aria-label={mine ? `Your seat ${seat.label}` : filled ? `${seat.student.name} at ${seat.label}` : 'Empty seat'}
                    title={mine ? `Your seat: ${seat.label}` : filled ? `${seat.student.name} · ${seat.label}` : `Empty · ${seat.label}`}
                  >
                    <span className={cx('text-[8px]', mine ? 'opacity-90' : 'text-subtle')}>{seat.label}</span>
                    <span className="truncate w-full font-semibold">
                      {mine ? 'YOU' : filled ? firstName : ''}
                    </span>
                    {filled && (
                      <span className={cx('truncate w-full text-[8px]', mine ? 'opacity-80' : 'text-muted')}>
                        {seat.student.roll}
                      </span>
                    )}
                  </div>
                );
              })}

            </div>
            <p className="mt-4 text-xs text-muted">
              Your seat is highlighted. Names are shown for reference only — the plan is view-only.
            </p>

          </div>
        </Card>

        <Card eyebrow="Your details" ref={me.roll}>
          <div className="p-5 space-y-3 text-sm">
            <Field label="Name" value={me.name} />
            <Field label="Roll" value={me.roll} mono />
            <Field label="Seat" value={mySeat?.label || 'Unassigned'} mono />
            <Field label="Row" value={mySeat ? String.fromCharCode(65 + mySeat.row) : '—'} mono />
            <div className="pt-2 border-t border-border">
              <p className="font-mono text-[10px] uppercase tracking-widest text-muted mb-1">Priority</p>
              <ul className="space-y-1 text-xs text-fg">
                <li>Vision: <span className="font-medium">{me.vision}</span></li>
                <li>Hearing: <span className="font-medium">{me.hearing}</span></li>
                <li>Height: <span className="font-medium">{me.height} cm</span></li>
              </ul>
            </div>
            {me.notes && (
              <div className="pt-2 border-t border-border">
                <p className="font-mono text-[10px] uppercase tracking-widest text-muted mb-1">Note</p>
                <p className="text-xs text-muted italic">{me.notes}</p>
              </div>
            )}
          </div>
        </Card>
      </div>
    </PageContainer>
  );
}

function Field({ label, value, mono }) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <span className="font-mono text-[10px] uppercase tracking-widest text-muted">{label}</span>
      <span className={cx('text-fg', mono && 'font-mono text-xs')}>{value}</span>
    </div>
  );
}
