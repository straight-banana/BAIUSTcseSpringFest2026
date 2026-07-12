import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Siren, History, ShieldAlert, Phone, HeartPulse } from 'lucide-react';
import PageContainer from '../../components/layout/PageContainer.jsx';
import PageHeader from '../../components/layout/PageHeader.jsx';
import Card from '../../components/common/Card.jsx';
import SectionHeader from '../../components/ui/SectionHeader.jsx';
import Mission5SubNav from '../../components/mission5/Mission5SubNav.jsx';
import SosButton from '../../components/mission5/SosButton.jsx';
import SosReportModal from '../../components/mission5/SosReportModal.jsx';
import AlertCard from '../../components/mission5/AlertCard.jsx';
import { CURRENT_STUDENT_HISTORY, EMERGENCY_TIPS } from '../../mocks/data/mission5.js';

export default function Mission5Landing() {
  const [modal, setModal] = useState(false);
  const nav = useNavigate();

  const onSubmit = (payload) => {
    nav('/mission-5/success', { state: payload });
  };

  return (
    <PageContainer>
      <PageHeader
        title="SOS Rescue Flare"
        subtitle="One tap to alert captains and teachers when you need help — fast."
        icon={<Siren size={18} />}
      />
      <Mission5SubNav />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2 p-8 flex flex-col items-center text-center bg-gradient-to-br from-danger/5 to-brand-soft/50">
          <div className="text-[64px] mb-2" aria-hidden>🚨</div>
          <h2 className="text-xl font-semibold text-fg">Need immediate help?</h2>
          <p className="text-sm text-muted mt-1 max-w-md">
            Press the button below to notify all captains and teachers instantly. Only use for genuine emergencies.
          </p>
          <div className="my-8">
            <SosButton onClick={() => setModal(true)} />
          </div>
          <Link to="/mission-5/history" className="text-xs text-brand hover:underline inline-flex items-center gap-1">
            <History size={12} /> View previous alerts
          </Link>
        </Card>

        <div className="space-y-4">
          <Card className="p-5">
            <SectionHeader title="Emergency Info" description="Quick reference" />
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2 text-fg"><Phone size={14} className="text-brand" /> Captain hotline: 01700-000000</li>
              <li className="flex items-center gap-2 text-fg"><HeartPulse size={14} className="text-danger" /> Nurse office: Ground floor</li>
              <li className="flex items-center gap-2 text-fg"><ShieldAlert size={14} className="text-warning" /> Rashid Sir: Staff room</li>
            </ul>
          </Card>
          <Card className="p-5">
            <SectionHeader title="Emergency Tips" description="Stay calm, act fast" />
            <ul className="space-y-2">
              {EMERGENCY_TIPS.map((t, i) => (
                <li key={i} className="flex gap-2 text-xs text-muted"><span className="text-brand">{i + 1}.</span> {t}</li>
              ))}
            </ul>
          </Card>
        </div>
      </div>

      <Card className="p-5 mt-4">
        <SectionHeader
          title="Your Recent Alerts"
          description="Latest SOS you've triggered"
          action={<Link to="/mission-5/history" className="text-xs text-brand hover:underline">View all</Link>}
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {CURRENT_STUDENT_HISTORY.slice(0, 3).map((a) => <AlertCard key={a.id} alert={a} onClick={() => {}} />)}
        </div>
      </Card>

      <SosReportModal open={modal} onClose={() => setModal(false)} onSubmit={onSubmit} />
    </PageContainer>
  );
}
