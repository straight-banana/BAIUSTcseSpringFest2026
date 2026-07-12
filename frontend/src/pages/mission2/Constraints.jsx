import PageContainer from '../../components/layout/PageContainer.jsx';
import PageHeader from '../../components/layout/PageHeader.jsx';
import Mission2SubNav from '../../components/mission2/Mission2SubNav.jsx';
import Card from '../../components/common/Card.jsx';
import SectionHeader from '../../components/ui/SectionHeader.jsx';
import ConstraintBadge from '../../components/mission2/ConstraintBadge.jsx';
import ClassroomLegend from '../../components/mission2/ClassroomLegend.jsx';
import { CONSTRAINT_TYPES, STUDENTS } from '../../mocks/data/mission2.js';
import { Layers } from 'lucide-react';

export default function Constraints() {
  const rows = STUDENTS.filter((s) => s.vision !== 'None' || s.hearing !== 'None').slice(0, 12);

  return (
    <PageContainer>
      <PageHeader
        title="Constraint Visualization"
        subtitle="Every seating rule the planner will respect before generating a plan."
        icon={<Layers size={18} />}
      />
      <Mission2SubNav />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <Card className="xl:col-span-2 p-5">
          <SectionHeader title="Active Constraints" description="Grouped by type. Each rule maps to a colored badge shown on the seating grid." />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {CONSTRAINT_TYPES.map((c) => (
              <div key={c.id} className="rounded-xl border border-border bg-elevated p-4">
                <div className="flex items-center justify-between">
                  <ConstraintBadge type={c.id} />
                  <span className="text-xs text-muted">Active</span>
                </div>
                <p className="mt-3 text-sm text-fg font-medium">{c.label}</p>
                <p className="mt-1 text-xs text-muted">{c.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-6">
            <SectionHeader title="Students affected" description="Priority students who will be pinned in front rows." />
            <div className="overflow-x-auto rounded-lg border border-border">
              <table className="w-full text-sm">
                <thead className="bg-surface text-xs uppercase tracking-wide text-muted">
                  <tr>
                    <th className="px-4 py-2 text-left">Student</th>
                    <th className="px-4 py-2 text-left">Roll</th>
                    <th className="px-4 py-2 text-left">Priorities</th>
                    <th className="px-4 py-2 text-left">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((s) => (
                    <tr key={s.id} className="border-t border-border">
                      <td className="px-4 py-2 font-medium text-fg">{s.name}</td>
                      <td className="px-4 py-2 font-mono text-xs text-muted">{s.roll}</td>
                      <td className="px-4 py-2">
                        <div className="flex gap-1 flex-wrap">
                          {s.vision !== 'None' && <ConstraintBadge type="vision" compact />}
                          {s.hearing !== 'None' && <ConstraintBadge type="hearing" compact />}
                        </div>
                      </td>
                      <td className="px-4 py-2 text-xs text-muted">{s.notes || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </Card>

        <ClassroomLegend />
      </div>
    </PageContainer>
  );
}
