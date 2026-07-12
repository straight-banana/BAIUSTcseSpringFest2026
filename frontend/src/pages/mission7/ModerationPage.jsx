import { useEffect, useMemo, useState } from 'react';
import { Shield, Clock, Flag, CheckCircle2 } from 'lucide-react';
import PageContainer from '../../components/layout/PageContainer.jsx';
import PageHeader from '../../components/layout/PageHeader.jsx';
import Mission7SubNav from '../../components/mission7/Mission7SubNav.jsx';
import SectionHeader from '../../components/ui/SectionHeader.jsx';
import Select from '../../components/forms/Select.jsx';
import KpiCard from '../../components/mission4/KpiCard.jsx';
import ModerationCard from '../../components/mission7/ModerationCard.jsx';
import EmptyState from '../../components/feedback/EmptyState.jsx';
import LoadingState from '../../components/feedback/Loading.jsx';
import ErrorState from '../../components/feedback/ErrorState.jsx';
import { useToast } from '../../components/feedback/Toast.jsx';
import { getModerationQueue, getAnalytics, moderateRating } from '../../services/ratingsService.js';

const ACTION_MAP = { approve: 'approve', flag: 'flag', remove: 'reject', hide: 'flag' };

export default function ModerationPage() {
  const [filter, setFilter] = useState('');
  const { push } = useToast();
  const [queue, setQueue] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    Promise.all([getModerationQueue(), getAnalytics()])
      .then(([queueData, analyticsData]) => {
        if (!active) return;
        setQueue((queueData || []).map((item) => ({
          id: item.id,
          status: (item.status || 'PENDING').toLowerCase(),
          categoryLabel: 'Peer rating',
          studentName: item.ratee?.name,
          body: item.comment || '(no written comment)',
          helpful: 0,
        })));
        setAnalytics(analyticsData);
      })
      .catch((err) => { if (active) setError(err?.message || 'Unable to load moderation queue'); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  const filtered = useMemo(
    () => queue.filter((c) => !filter || c.status === filter),
    [queue, filter]
  );

  const act = async (action, comment) => {
    const backendAction = ACTION_MAP[action];
    if (!backendAction) {
      push({ tone: 'info', title: 'Rating detail', message: comment.body });
      return;
    }
    try {
      await moderateRating(comment.id, backendAction);
      push({
        tone: action === 'remove' ? 'error' : action === 'approve' ? 'success' : 'info',
        title: `Rating ${action}d`,
        message: `Ticket ${comment.id.slice(0, 8).toUpperCase()} — action recorded.`,
      });
      setQueue((q) => q.filter((c) => c.id !== comment.id));
    } catch (err) {
      push({ tone: 'error', title: 'Action failed', message: err?.message || '' });
    }
  };

  const byStatus = analytics?.byStatus || {};

  return (
    <PageContainer>
      <PageHeader title="Moderation Dashboard" subtitle="Review flagged and pending anonymous ratings." icon={<Shield size={18} />} />
      <Mission7SubNav />

      {loading ? (
        <LoadingState label="Loading moderation queue..." />
      ) : error ? (
        <ErrorState title="Couldn't load moderation queue" message={error} />
      ) : (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
            <KpiCard icon={<Clock size={16} />} tone="warning" label="Pending Reviews" value={byStatus.PENDING || 0} />
            <KpiCard icon={<Flag size={16} />} tone="danger" label="Flagged Ratings" value={byStatus.FLAGGED || 0} />
            <KpiCard icon={<CheckCircle2 size={16} />} tone="success" label="Approved" value={byStatus.APPROVED || 0} />
            <KpiCard icon={<Shield size={16} />} label="Rejected" value={byStatus.REJECTED || 0} />
          </div>

          <div className="flex items-end justify-between gap-3 mb-4">
            <SectionHeader title="Moderation queue" description={`${filtered.length} items awaiting action`} className="!mb-0" />
            <Select label="Status" value={filter} onChange={(e) => setFilter(e.target.value)} className="min-w-[140px]">
              <option value="">All</option>
              <option value="pending">Pending</option>
              <option value="flagged">Flagged</option>
            </Select>
          </div>

          {filtered.length === 0 ? (
            <EmptyState title="Queue is clear" message="All comments have been reviewed. Nice work!" />
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {filtered.map((c) => <ModerationCard key={c.id} comment={c} onAction={act} />)}
            </div>
          )}
        </>
      )}
    </PageContainer>
  );
}
