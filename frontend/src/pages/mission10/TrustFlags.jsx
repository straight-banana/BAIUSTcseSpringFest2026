import PageContainer from '../../components/layout/PageContainer.jsx';
import PageHeader from '../../components/layout/PageHeader.jsx';
import Card from '../../components/common/Card.jsx';
import EmptyState from '../../components/feedback/EmptyState.jsx';
import { AlertTriangle } from 'lucide-react';

export default function TrustFlags() {
  return (
    <PageContainer>
      <PageHeader
        eyebrow="Mission 10"
        title="Trust Flags"
        description="Unresolved trust flags. Office resolves each with an action + reason."
        icon={AlertTriangle}
      />
      <Card>
        <EmptyState title="No open flags" description="When peer-level trust anomalies are detected, they'll appear here for Office review." />
      </Card>
    </PageContainer>
  );
}
