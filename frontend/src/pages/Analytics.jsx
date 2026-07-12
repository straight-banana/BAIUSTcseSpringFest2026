import PageContainer from '../components/layout/PageContainer.jsx';
import PageHeader from '../components/layout/PageHeader.jsx';
import Card from '../components/common/Card.jsx';
import ChartPlaceholder from '../components/ui/ChartPlaceholder.jsx';
import SectionHeader from '../components/ui/SectionHeader.jsx';
import { BarChart3 } from 'lucide-react';
import { chartSeries } from '../mocks/data/dashboard.js';

export default function Analytics() {
  return (
    <PageContainer>
      <PageHeader
        title="Analytics"
        subtitle="Unified view of complaint trends, SOS activity, and trust signals."
        icon={<BarChart3 size={18} />}
      />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="p-5">
          <SectionHeader title="Complaint Trend" description="Rolling 14-day" />
          <ChartPlaceholder data={chartSeries} keys={[{ dataKey: 'complaints', color: 'rgb(var(--brand))' }]} />
        </Card>
        <Card className="p-5">
          <SectionHeader title="SOS Activity" description="Rolling 14-day" />
          <ChartPlaceholder data={chartSeries} keys={[{ dataKey: 'sos', color: 'rgb(var(--danger))' }]} />
        </Card>
      </div>
    </PageContainer>
  );
}
