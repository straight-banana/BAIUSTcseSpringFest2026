import { useEffect, useState } from 'react';
import PageContainer from '../../components/layout/PageContainer.jsx';
import PageHeader from '../../components/layout/PageHeader.jsx';
import Card from '../../components/common/Card.jsx';
import LoadingState from '../../components/feedback/Loading.jsx';
import ErrorState from '../../components/feedback/ErrorState.jsx';
import { Network, ShieldCheck, AlertTriangle } from 'lucide-react';
import { getDashboard } from '../../services/trustService.js';

export default function TrustDashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    getDashboard()
      .then((data) => {
        if (!active) return;
        setDashboard(data);
      })
      .catch((err) => {
        if (!active) return;
        setError(err?.message || 'Unable to load trust dashboard');
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, []);

  return (
    <PageContainer>
      <PageHeader
        eyebrow="Mission 10"
        title="Trust Graph"
        description="Aggregate trust score and network stats. Raw peer-to-peer trust data is never exposed."
        icon={Network}
      />
      {loading ? (
        <LoadingState label="Loading trust dashboard..." />
      ) : error ? (
        <ErrorState title="Couldn't load trust dashboard" message={error} />
      ) : (
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <div className="flex items-center gap-2 text-muted text-xs mb-2"><ShieldCheck size={14} /> Avg trust score</div>
            <div className="text-3xl font-semibold text-fg">{dashboard.averageScore}</div>
            <div className="text-xs text-muted mt-1">Computed server-side, across {dashboard.scoredUserCount} students</div>
          </Card>
          <Card>
            <div className="flex items-center gap-2 text-muted text-xs mb-2"><Network size={14} /> Flagged users</div>
            <div className="text-3xl font-semibold text-fg">{dashboard.flaggedUserCount}</div>
            <div className="text-xs text-muted mt-1">Currently carrying an unresolved flag</div>
          </Card>
          <Card>
            <div className="flex items-center gap-2 text-muted text-xs mb-2"><AlertTriangle size={14} /> Open flags</div>
            <div className="text-3xl font-semibold text-fg">{dashboard.openFlags}</div>
            <div className="text-xs text-muted mt-1">Awaiting resolution</div>
          </Card>
        </div>
      )}
    </PageContainer>
  );
}
