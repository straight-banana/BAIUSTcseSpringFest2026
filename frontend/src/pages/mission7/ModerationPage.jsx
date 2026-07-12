import { useMemo, useState } from 'react';
import { Shield, Clock, Flag, AlertTriangle } from 'lucide-react';
import PageContainer from '../../components/layout/PageContainer.jsx';
import PageHeader from '../../components/layout/PageHeader.jsx';
import Mission7SubNav from '../../components/mission7/Mission7SubNav.jsx';
import Card from '../../components/common/Card.jsx';
import SectionHeader from '../../components/ui/SectionHeader.jsx';
import Select from '../../components/forms/Select.jsx';
import KpiCard from '../../components/mission4/KpiCard.jsx';
import ModerationCard from '../../components/mission7/ModerationCard.jsx';
import EmptyState from '../../components/feedback/EmptyState.jsx';
import { useToast } from '../../components/feedback/Toast.jsx';
import { MODERATION_QUEUE, COMMENTS } from '../../mocks/data/mission7.js';

export default function ModerationPage() {
  const [filter, setFilter] = useState('');
  const { push } = useToast();
  const [queue, setQueue] = useState(MODERATION_QUEUE);

  const filtered = useMemo(
    () => queue.filter((c) => !filter || c.status === filter),
    [queue, filter]
  );

  const act = (action, comment) => {
    push({
      tone: action === 'remove' ? 'error' : action === 'approve' ? 'success' : 'info',
      title: `Comment ${action}d`,
      message: `Ticket ${comment.id.toUpperCase()} — action recorded.`,
    });
    if (action !== 'view') setQueue((q) => q.filter((c) => c.id !== comment.id));
  };

  return (
    <PageContainer>
      <PageHeader title="Moderation Dashboard" subtitle="Review flagged and pending anonymous ratings." icon={<Shield size={18} />} />
      <Mission7SubNav />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <KpiCard icon={<Clock size={16} />} tone="warning" label="Pending Reviews" value={COMMENTS.filter((c) => c.status === 'pending').length} />
        <KpiCard icon={<Flag size={16} />} tone="danger" label="Reported Comments" value={COMMENTS.filter((c) => c.status === 'flagged').length} />
        <KpiCard icon={<AlertTriangle size={16} />} label="Flagged Ratings" value="4" />
        <KpiCard icon={<Shield size={16} />} tone="success" label="Resolved Today" value="9" />
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
    </PageContainer>
  );
}
