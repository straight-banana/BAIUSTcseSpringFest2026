import ErrorState from '../components/feedback/ErrorState.jsx';
import PageContainer from '../components/layout/PageContainer.jsx';

export default function ErrorPage() {
  return (
    <PageContainer>
      <ErrorState title="Something went wrong" message="Please try again in a moment." />
    </PageContainer>
  );
}
