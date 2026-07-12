import { useEffect, useState } from 'react';
import PageContainer from '../../components/layout/PageContainer.jsx';
import PageHeader from '../../components/layout/PageHeader.jsx';
import Card from '../../components/common/Card.jsx';
import Button from '../../components/common/Button.jsx';
import Badge from '../../components/ui/Badge.jsx';
import EmptyState from '../../components/feedback/EmptyState.jsx';
import LoadingState from '../../components/feedback/Loading.jsx';
import ErrorState from '../../components/feedback/ErrorState.jsx';
import { useToast } from '../../components/feedback/Toast.jsx';
import { AlertTriangle } from 'lucide-react';
import { getAllFlags, resolveFlag } from '../../services/trustService.js';

export default function TrustFlags() {
  const toast = useToast();
  const [flags, setFlags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [resolvingId, setResolvingId] = useState(null);

  useEffect(() => {
    let active = true;
    getAllFlags()
      .then((data) => {
        if (!active) return;
        setFlags(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        if (!active) return;
        setError(err?.message || 'Unable to load trust flags');
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, []);

  const onResolve = async (flag) => {
    setResolvingId(flag.id);
    try {
      await resolveFlag(flag.id);
      setFlags((prev) => prev.filter((f) => f.id !== flag.id));
      toast.push({ tone: 'success', title: 'Flag resolved' });
    } catch (err) {
      toast.push({ tone: 'error', title: 'Failed to resolve flag', message: err?.message || '' });
    } finally {
      setResolvingId(null);
    }
  };

  return (
    <PageContainer>
      <PageHeader
        eyebrow="Mission 10"
        title="Trust Flags"
        description="Unresolved trust flags. Office resolves each with an action + reason."
        icon={AlertTriangle}
      />
      {loading ? (
        <LoadingState label="Loading trust flags..." />
      ) : error ? (
        <ErrorState title="Couldn't load trust flags" message={error} />
      ) : flags.length === 0 ? (
        <Card>
          <EmptyState title="No open flags" message="When peer-level trust anomalies are detected, they'll appear here for Office review." />
        </Card>
      ) : (
        <div className="space-y-3">
          {flags.map((flag) => (
            <Card key={flag.id} className="flex items-center justify-between gap-4 p-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-fg">{flag.targetName || flag.targetId}</span>
                  {flag.targetRoll && <Badge tone="neutral">{flag.targetRoll}</Badge>}
                </div>
                <p className="mt-1 text-xs text-muted">{flag.reason}</p>
                <p className="mt-1 text-[11px] text-subtle">{new Date(flag.createdAt).toLocaleString()}</p>
              </div>
              <Button
                size="sm"
                variant="secondary"
                onClick={() => onResolve(flag)}
                disabled={resolvingId === flag.id}
              >
                {resolvingId === flag.id ? 'Resolving…' : 'Resolve'}
              </Button>
            </Card>
          ))}
        </div>
      )}
    </PageContainer>
  );
}
