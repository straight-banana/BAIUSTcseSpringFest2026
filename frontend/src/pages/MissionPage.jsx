import PageContainer from '../components/layout/PageContainer.jsx';
import PageHeader from '../components/layout/PageHeader.jsx';
import EmptyState from '../components/feedback/EmptyState.jsx';
import Button from '../components/common/Button.jsx';

export default function MissionPage({ number, title, subtitle, icon }) {
  return (
    <PageContainer>
      <PageHeader
        title={title}
        subtitle={subtitle}
        icon={icon}
        actions={<Button variant="outline">Docs</Button>}
      />
      <EmptyState
        title={`Mission ${number} — coming soon`}
        message="This module is scaffolded. Feature implementation lands in the next phase."
        action={<Button>Start building</Button>}
      />
    </PageContainer>
  );
}
