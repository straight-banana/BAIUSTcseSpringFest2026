import Card from '../common/Card.jsx';
import SectionHeader from '../ui/SectionHeader.jsx';

export default function ChartContainer({ title, description, action, height = 260, children }) {
  return (
    <Card className="p-5">
      <SectionHeader title={title} description={description} action={action} />
      <div style={{ height }}>{children}</div>
    </Card>
  );
}
