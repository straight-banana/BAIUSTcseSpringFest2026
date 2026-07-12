import PageContainer from '../components/layout/PageContainer.jsx';
import PageHeader from '../components/layout/PageHeader.jsx';
import Card from '../components/common/Card.jsx';
import Badge from '../components/ui/Badge.jsx';
import { Bell } from 'lucide-react';
import { notifications } from '../mocks/data/dashboard.js';

const toneMap = { danger: 'danger', warning: 'warning', brand: 'brand' };

export default function Notifications() {
  return (
    <PageContainer>
      <PageHeader title="Notifications" subtitle="Recent alerts across the console." icon={<Bell size={18} />} />
      <Card>
        <ul className="divide-y divide-border">
          {notifications.map((n) => (
            <li key={n.id} className="px-5 py-4 flex items-start gap-3">
              <span className={`h-2 w-2 rounded-full mt-2 bg-${toneMap[n.tone]}`} />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-fg">{n.title}</p>
                  <Badge tone={n.tone}>{n.tone}</Badge>
                </div>
                <p className="text-xs text-muted mt-0.5">{n.body}</p>
              </div>
            </li>
          ))}
        </ul>
      </Card>
    </PageContainer>
  );
}
