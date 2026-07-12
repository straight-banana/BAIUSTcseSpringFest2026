import { Link } from 'react-router-dom';
import PageContainer from '../../components/layout/PageContainer.jsx';
import PageHeader from '../../components/layout/PageHeader.jsx';
import Mission1SubNav from '../../components/mission1/Mission1SubNav.jsx';
import StrikeDashboard from '../../components/mission1/StrikeDashboard.jsx';
import ComplaintCard from '../../components/mission1/ComplaintCard.jsx';
import StatusBadge from '../../components/mission1/StatusBadge.jsx';
import Card from '../../components/common/Card.jsx';
import Button from '../../components/common/Button.jsx';
import SectionHeader from '../../components/ui/SectionHeader.jsx';
import { StatCard } from '../../components/common/Cards.jsx';
import Timeline from '../../components/mission1/Timeline.jsx';
import { ShieldAlert, FileText, ClipboardList, Plus, ArrowRight } from 'lucide-react';
import { currentStudent } from '../../mocks/data/complaints.js';
import { useAuth } from '../../context/AuthContext.jsx';

export default function Mission1Overview() {
  const s = currentStudent;
  const { role } = useAuth();
  const canSubmit = role !== 'teacher' && role !== 'office';
  return (
    <PageContainer>
      <PageHeader
        title="Anonymous Whistleblower"
        subtitle="File, track and moderate anonymous complaints — with a strike-based accountability meter."
        icon={<ShieldAlert size={18} />}
        actions={canSubmit ? (
          <Link to="/mission-1/submit">
            <Button leftIcon={<Plus size={14} />}>File Complaint</Button>
          </Link>
        ) : null}
      />
      <Mission1SubNav />


      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard icon={<FileText size={16} />} label="Total Submitted" value={s.totalSubmitted} hint="Your lifetime submissions" />
        <StatCard icon={<ClipboardList size={16} />} label="Strikes Issued" value={`${s.strikesIssued}/3`} hint="Against Kuddus" trend={0} />
        <StatCard icon={<ShieldAlert size={16} />} label="Latest Status" value={<StatusBadge status={s.latest.status} />} hint={s.latest.id} />
        <StatCard icon={<ShieldAlert size={16} />} label="Anonymous Handle" value={<span className="font-mono text-lg">{s.anonymousHandle}</span>} hint="Rotated each term" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 mt-6">
        <div className={canSubmit ? 'xl:col-span-2' : 'xl:col-span-3'}>
          <StrikeDashboard strikes={s.strikesIssued} />
        </div>
        {canSubmit && (
          <Card className="p-5">
            <SectionHeader
              title="Quick Submit"
              description="Report anonymously in under 30 seconds."
            />
            <ul className="space-y-2 text-sm text-muted">
              <li className="flex gap-2"><span className="text-brand">1.</span> Pick a category</li>
              <li className="flex gap-2"><span className="text-brand">2.</span> Describe what happened</li>
              <li className="flex gap-2"><span className="text-brand">3.</span> Attach evidence (optional)</li>
            </ul>
            <Link to="/mission-1/submit" className="block mt-4">
              <Button className="w-full" rightIcon={<ArrowRight size={14} />}>Start a Complaint</Button>
            </Link>
          </Card>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4">
        <Card className="lg:col-span-2 p-5">
          <SectionHeader
            title="Your Recent Complaints"
            description="Latest submissions from this device."
            action={<Link to="/mission-1/history" className="text-xs text-brand hover:underline">View all</Link>}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {s.recent.map((c) => <ComplaintCard key={c.id} complaint={c} onClick={() => {}} />)}
          </div>
        </Card>

        <Card className="p-5">
          <SectionHeader title="Recent Activity" description="Updates on your reports" />
          <Timeline items={[
            { title: 'Complaint validated', body: s.latest.id, when: 'Today · 09:12', tone: 'success' },
            { title: 'Under review by teacher', body: 'ANON-2418', when: 'Yesterday', tone: 'warning' },
            { title: 'Complaint submitted', body: 'ANON-2411', when: '2 days ago', tone: 'brand' },
            { title: 'Rejected — insufficient evidence', body: 'ANON-2402', when: 'Last week', tone: 'danger' },
          ]} />
        </Card>
      </div>
    </PageContainer>
  );
}
