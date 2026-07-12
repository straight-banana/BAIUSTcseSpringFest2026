import { Link } from 'react-router-dom';
import PageContainer from '../../components/layout/PageContainer.jsx';
import PageHeader from '../../components/layout/PageHeader.jsx';
import Mission2SubNav from '../../components/mission2/Mission2SubNav.jsx';
import Card from '../../components/common/Card.jsx';
import Button from '../../components/common/Button.jsx';
import SectionHeader from '../../components/ui/SectionHeader.jsx';
import { StatCard, FeatureCard } from '../../components/common/Cards.jsx';
import ConstraintBadge from '../../components/mission2/ConstraintBadge.jsx';
import { Grid3X3, Users, Sofa, LayoutGrid, Sparkles, Eye, Ear, ArrowUpToLine, Lock, Target, Plus, PlayCircle } from 'lucide-react';
import { SUMMARY } from '../../mocks/data/mission2.js';
import { useAuth } from '../../context/AuthContext.jsx';

export default function Mission2Overview() {
  const { role } = useAuth();
  const isCaptain = role === 'captain';
  const canEdit = role === 'teacher' || role === 'office';

  return (
    <PageContainer>
      <PageHeader
        title="Anti-Camouflage Seat Planner"
        subtitle={isCaptain
          ? 'Choose a saved classroom layout for your section. Only teachers can create new layouts or edit rosters.'
          : 'Plan classrooms with height, accessibility and line-of-sight constraints — so nobody hides.'}
        icon={<Grid3X3 size={18} />}
        actions={canEdit ? (
          <div className="flex gap-2">
            <Link to="/mission-2/students"><Button variant="secondary" leftIcon={<Users size={14} />}>Manage Students</Button></Link>
            <Link to="/mission-2/plan"><Button leftIcon={<Sparkles size={14} />}>Generate Plan</Button></Link>
          </div>
        ) : null}
      />
      <Mission2SubNav />

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <StatCard icon={<Users size={16} />} label="Total Students" value={SUMMARY.totalStudents} hint="Across all sections" />
        <StatCard icon={<LayoutGrid size={16} />} label="Classroom Capacity" value={SUMMARY.capacity} hint="Current layout 7×8" />
        <StatCard icon={<Sofa size={16} />} label="Empty Seats" value={SUMMARY.emptySeats} hint="Available to assign" />
        <StatCard icon={<Sparkles size={16} />} label="Generated Plans" value={SUMMARY.generatedPlans} hint="Saved arrangements" trend={12.4} />
        <StatCard icon={<Grid3X3 size={16} />} label="Utilization" value={`${Math.round((SUMMARY.totalStudents / SUMMARY.capacity) * 100)}%`} hint="Seats occupied" trend={4.1} />
      </div>

      <div className={`grid grid-cols-1 ${isCaptain ? '' : 'xl:grid-cols-3'} gap-4 mt-6`}>
        <Card className={`${isCaptain ? '' : 'xl:col-span-2'} p-5`}>
          <SectionHeader title="Constraint Summary" description="Live view of who needs what before you press Generate." />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <ConstraintStat icon={<Eye size={14} />} label="Vision Priority" value={SUMMARY.visionPriority} />
            <ConstraintStat icon={<Ear size={14} />} label="Hearing Priority" value={SUMMARY.hearingPriority} />
            <ConstraintStat icon={<Lock size={14} />} label="Reserved Seats" value={SUMMARY.reserved} />
            <ConstraintStat icon={<ArrowUpToLine size={14} />} label="Front Row Required" value={SUMMARY.frontRow} />
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            <ConstraintBadge type="vision" />
            <ConstraintBadge type="hearing" />
            <ConstraintBadge type="reserved" />
            <ConstraintBadge type="front" />
            <ConstraintBadge type="los" />
          </div>
        </Card>

        {!isCaptain && (
          <Card className="p-5">
            <SectionHeader title="Quick Actions" description="Jump straight into planning." />
            <div className="space-y-2">
              <Link to="/mission-2/students"><Button variant="secondary" className="w-full justify-start" leftIcon={<Plus size={14} />}>Add Student</Button></Link>
              <Link to="/mission-2/classroom"><Button variant="secondary" className="w-full justify-start" leftIcon={<LayoutGrid size={14} />}>Configure Classroom</Button></Link>
              <Link to="/mission-2/interactive"><Button variant="secondary" className="w-full justify-start" leftIcon={<Grid3X3 size={14} />}>Interactive Seating</Button></Link>
              <Link to="/mission-2/line-of-sight"><Button variant="secondary" className="w-full justify-start" leftIcon={<Target size={14} />}>Line-of-Sight View</Button></Link>
              <Link to="/mission-2/plan"><Button className="w-full justify-start" leftIcon={<PlayCircle size={14} />}>Generate Seating Plan</Button></Link>
            </div>
          </Card>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        <FeatureCard icon={<Users size={16} />} title="Students" description="Import a roster, edit heights and impairments, and lock reserved seats before the algorithm runs." />
        <FeatureCard icon={<LayoutGrid size={16} />} title="Classroom Layout" description="Choose 5×6, 6×6, or 7×8 layouts with automatic aisle, podium, and entrance markers." />
        <FeatureCard icon={<Target size={16} />} title="Line of Sight" description="Visualize whether Kuddus is hiding — sight lines from the podium reveal camouflaged seats." />
      </div>
    </PageContainer>
  );
}


function ConstraintStat({ icon, label, value }) {
  return (
    <div className="rounded-lg border border-border bg-elevated p-3">
      <div className="flex items-center gap-2 text-muted">
        <span className="text-brand">{icon}</span>
        <span className="text-xs">{label}</span>
      </div>
      <p className="mt-1 text-xl font-semibold text-fg tabular-nums">{value}</p>
    </div>
  );
}
