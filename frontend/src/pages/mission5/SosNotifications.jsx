import { useState } from 'react';
import { Bell, Check, CheckCheck } from 'lucide-react';
import PageContainer from '../../components/layout/PageContainer.jsx';
import PageHeader from '../../components/layout/PageHeader.jsx';
import Card from '../../components/common/Card.jsx';
import Button from '../../components/common/Button.jsx';
import Badge from '../../components/ui/Badge.jsx';
import SectionHeader from '../../components/ui/SectionHeader.jsx';
import Mission5SubNav from '../../components/mission5/Mission5SubNav.jsx';
import { NOTIFICATIONS } from '../../mocks/data/mission5.js';

const iconFor = { new: '🚨', accepted: '✅', resolved: '🎉', closed: '📁' };

export default function SosNotifications() {
  const [items, setItems] = useState(NOTIFICATIONS);
  const unread = items.filter((n) => !n.read).length;

  const markAll = () => setItems((xs) => xs.map((n) => ({ ...n, read: true })));
  const toggle = (id) => setItems((xs) => xs.map((n) => n.id === id ? { ...n, read: !n.read } : n));

  return (
    <PageContainer>
      <PageHeader
        title="Notifications"
        subtitle="Live updates on SOS activity."
        icon={<Bell size={18} />}
        actions={<Button variant="outline" size="sm" onClick={markAll} leftIcon={<CheckCheck size={14} />}>Mark all read</Button>}
      />
      <Mission5SubNav />

      <Card className="p-5">
        <SectionHeader
          title="Recent Activity"
          description={`${unread} unread of ${items.length}`}
          action={<Badge tone="brand">{unread} new</Badge>}
        />
        <ul className="space-y-2">
          {items.map((n) => (
            <li key={n.id} className={`rounded-lg border p-3 flex gap-3 transition-colors ${n.read ? 'border-border bg-surface' : 'border-brand/40 bg-brand-soft/40'}`}>
              <div className="h-10 w-10 rounded-lg bg-elevated flex items-center justify-center text-lg shrink-0">
                {iconFor[n.kind] || '🔔'}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-sm font-semibold text-fg">{n.title}</p>
                  <Badge tone={n.tone}>{n.kind}</Badge>
                  {!n.read && <Badge tone="brand">Unread</Badge>}
                </div>
                <p className="text-xs text-muted mt-0.5">{n.body}</p>
                <p className="text-[11px] text-subtle mt-1">{n.when}</p>
              </div>
              <button
                onClick={() => toggle(n.id)}
                className="text-muted hover:text-fg p-1 rounded-md hover:bg-elevated shrink-0"
                aria-label={n.read ? 'Mark unread' : 'Mark read'}
              >
                <Check size={14} />
              </button>
            </li>
          ))}
        </ul>
      </Card>
    </PageContainer>
  );
}
