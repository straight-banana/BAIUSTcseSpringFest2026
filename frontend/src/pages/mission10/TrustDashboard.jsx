import PageContainer from '../../components/layout/PageContainer.jsx';
import PageHeader from '../../components/layout/PageHeader.jsx';
import Card from '../../components/common/Card.jsx';
import { Network, ShieldCheck, AlertTriangle } from 'lucide-react';

export default function TrustDashboard() {
  return (
    <PageContainer>
      <PageHeader
        eyebrow="Mission 10"
        title="Trust Graph"
        description="Aggregate trust score and network stats. Raw peer-to-peer trust data is never exposed."
        icon={Network}
      />
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <div className="flex items-center gap-2 text-muted text-xs mb-2"><ShieldCheck size={14} /> Trust score</div>
          <div className="text-3xl font-semibold text-fg">—</div>
          <div className="text-xs text-muted mt-1">Computed server-side</div>
        </Card>
        <Card>
          <div className="flex items-center gap-2 text-muted text-xs mb-2"><Network size={14} /> Network reach</div>
          <div className="text-3xl font-semibold text-fg">—</div>
          <div className="text-xs text-muted mt-1">Endorsements in / out</div>
        </Card>
        <Card>
          <div className="flex items-center gap-2 text-muted text-xs mb-2"><AlertTriangle size={14} /> Open flags</div>
          <div className="text-3xl font-semibold text-fg">—</div>
          <div className="text-xs text-muted mt-1">Awaiting resolution</div>
        </Card>
      </div>
      <p className="text-xs text-muted mt-6">Backend endpoints: <code>GET /mission-10</code>, <code>GET /mission-10/flags</code>.</p>
    </PageContainer>
  );
}
