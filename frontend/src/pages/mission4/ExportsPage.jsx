import { FileText, FileSpreadsheet, Printer, Download, CalendarDays, CalendarRange, BellRing } from 'lucide-react';
import PageContainer from '../../components/layout/PageContainer.jsx';
import PageHeader from '../../components/layout/PageHeader.jsx';
import Card from '../../components/common/Card.jsx';
import Button from '../../components/common/Button.jsx';
import SectionHeader from '../../components/ui/SectionHeader.jsx';
import Badge from '../../components/ui/Badge.jsx';
import Mission4SubNav from '../../components/mission4/Mission4SubNav.jsx';
import { NOTIFICATIONS } from '../../mocks/data/mission4.js';

const options = [
  { icon: <FileText size={18} />,         title: 'Export PDF',            desc: 'Formatted ledger with charts' },
  { icon: <FileSpreadsheet size={18} />,  title: 'Export CSV',            desc: 'Raw transaction data' },
  { icon: <Printer size={18} />,          title: 'Print Ledger',          desc: 'Printer-friendly layout' },
  { icon: <Download size={18} />,         title: 'Download Analytics',    desc: 'PNG chart export bundle' },
  { icon: <CalendarDays size={18} />,     title: 'Monthly Report',        desc: 'February 2026 summary' },
  { icon: <CalendarRange size={18} />,    title: 'Annual Report',         desc: 'Full academic year 2025-26' },
];

export default function ExportsPage() {
  return (
    <PageContainer>
      <PageHeader
        title="Export Center"
        subtitle="Generate reports and download financial data (UI only)."
        icon={<Download size={18} />}
      />
      <Mission4SubNav />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <Card className="p-5">
            <SectionHeader title="Export Options" description="Choose a format or scheduled report" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {options.map((o) => (
                <div key={o.title} className="rounded-lg border border-border bg-surface p-4 hover:border-brand transition-colors flex flex-col gap-3">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-brand-soft text-brand flex items-center justify-center">{o.icon}</div>
                    <div>
                      <h4 className="text-sm font-semibold text-fg">{o.title}</h4>
                      <p className="text-xs text-muted">{o.desc}</p>
                    </div>
                  </div>
                  <Button size="sm" variant="outline" className="w-full">Generate</Button>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <Card className="p-5">
          <SectionHeader title="Notifications" description="Recent finance activity" action={<Badge tone="brand">{NOTIFICATIONS.length}</Badge>} />
          <ul className="space-y-2">
            {NOTIFICATIONS.map((n) => (
              <li key={n.id} className="rounded-lg border border-border bg-surface p-3 flex gap-3">
                <div className="h-8 w-8 rounded-md bg-brand-soft text-brand flex items-center justify-center shrink-0">
                  <BellRing size={14} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-fg truncate">{n.title}</p>
                    <Badge tone={n.tone}>{n.kind}</Badge>
                  </div>
                  <p className="text-xs text-muted truncate">{n.body}</p>
                  <p className="text-[11px] text-subtle mt-0.5">{n.when}</p>
                </div>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </PageContainer>
  );
}
