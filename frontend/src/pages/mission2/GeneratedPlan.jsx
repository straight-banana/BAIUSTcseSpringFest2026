import { useEffect, useMemo, useState } from 'react';
import PageContainer from '../../components/layout/PageContainer.jsx';
import PageHeader from '../../components/layout/PageHeader.jsx';
import Mission2SubNav from '../../components/mission2/Mission2SubNav.jsx';
import Card from '../../components/common/Card.jsx';
import Button from '../../components/common/Button.jsx';
import SectionHeader from '../../components/ui/SectionHeader.jsx';
import { StatCard } from '../../components/common/Cards.jsx';
import ClassroomGrid from '../../components/mission2/ClassroomGrid.jsx';
import ClassroomLegend from '../../components/mission2/ClassroomLegend.jsx';
import ConstraintBadge from '../../components/mission2/ConstraintBadge.jsx';
import { useToast } from '../../components/feedback/Toast.jsx';
import { Sparkles, Printer, Download, Save, Eye, Ear, ArrowUpToLine, Users } from 'lucide-react';
import { getLatestPlan } from '../../services/seatsService.js';
import { mapSeatPlanFromApi } from '../../utils/missionApiMaps.js';

export default function GeneratedPlan() {
  const toast = useToast();
  const [plan, setPlan] = useState(null);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await getLatestPlan();
        if (alive) setPlan(mapSeatPlanFromApi(res?.data || res));
      } catch {
        if (alive) setPlan(null);
      }
    })();
    return () => { alive = false; };
  }, []);

  const size = useMemo(() => ({ rows: plan?.gridRows || 7, cols: plan?.gridCols || 8 }), [plan]);
  const seats = useMemo(() => plan?.seats || [], [plan]);

  return (
    <PageContainer>
      <PageHeader
        title="Generated Seating Plan"
        subtitle="Latest arrangement respecting all active constraints."
        icon={<Sparkles size={18} />}
        actions={
          <div className="flex flex-wrap gap-2">
            <Button variant="secondary" leftIcon={<Printer size={14} />} onClick={() => window.print()}>Print</Button>
            <Button variant="secondary" leftIcon={<Download size={14} />} onClick={() => toast.push({ tone: 'info', title: 'Exported (mock)' })}>Export</Button>
          </div>
        }

      />
      <Mission2SubNav />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard icon={<Users size={16} />} label="Seated" value={seats.length} hint="From the latest plan" />
        <StatCard icon={<Eye size={16} />} label="Vision Placed" value={seats.filter((seat) => seat.hasVisionProblem).length} hint="Front 2 rows" />
        <StatCard icon={<Ear size={16} />} label="Hearing Placed" value={seats.filter((seat) => seat.hasHearingProblem).length} hint="Within earshot" />
        <StatCard icon={<ArrowUpToLine size={16} />} label="Constraint Satisfaction" value="100%" hint="All rules honored" trend={2.1} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_300px] gap-4 mt-4">
        <ClassroomGrid
          seats={seats}
          rows={size.rows}
          cols={size.cols}
          selectedId={selected?.id}
          onSeatClick={setSelected}
        />

        <div className="space-y-4">
          <Card className="p-4">
            <SectionHeader title="Constraint Summary" />
            <ul className="space-y-2 text-xs text-muted">
              <li className="flex items-center justify-between"><span>Vision Priority</span><ConstraintBadge type="vision" compact /></li>
              <li className="flex items-center justify-between"><span>Hearing Priority</span><ConstraintBadge type="hearing" compact /></li>
              <li className="flex items-center justify-between"><span>Front Row Required</span><ConstraintBadge type="front" compact /></li>
              <li className="flex items-center justify-between"><span>Reserved Seats</span><ConstraintBadge type="reserved" compact /></li>
              <li className="flex items-center justify-between"><span>Teacher Visibility</span><ConstraintBadge type="los" compact /></li>
            </ul>
          </Card>
          <ClassroomLegend />
        </div>
      </div>
    </PageContainer>
  );
}
