import PageContainer from '../components/layout/PageContainer.jsx';
import PageHeader from '../components/layout/PageHeader.jsx';
import Card from '../components/common/Card.jsx';
import Button from '../components/common/Button.jsx';
import Badge from '../components/ui/Badge.jsx';
import WarningMeter from '../components/common/WarningMeter.jsx';
import { StatCard } from '../components/common/Cards.jsx';
import ChartPlaceholder from '../components/ui/ChartPlaceholder.jsx';
import {
  ShieldAlert, Siren, Grid3X3, Coins, SearchCheck, Users, ArrowUpRight,
  FileText, Download, Plus,
} from 'lucide-react';
import { stats, activity, tasks, notifications, chartSeries } from '../mocks/data/dashboard.js';
import { formatNumber } from '../utils/index.js';
import { Link } from 'react-router-dom';

const ICONS = {
  students: Users, complaints: ShieldAlert, sos: Siren,
  seats: Grid3X3, ledger: Coins, facts: SearchCheck,
};

const CATEGORY_ICON = {
  Anonymous: ShieldAlert,
  'Sir Rashid': FileText,
  'Captain Rana': Siren,
  System: Grid3X3,
};

export default function Dashboard() {
  // Kuddus's live warning count — the product's central number.
  const kuddusWarnings = 2;

  return (
    <PageContainer>
      <PageHeader
        eyebrow="File 00 · Bulletin · 12 Jul 2026"
        title="Kuddus Mia — under standing complaint"
        subtitle="Rashid Sir's live register for Class 9C. Complaints, strikes, ledgers and rescue flares are entered here in the order they were reported."
        actions={
          <>
            <Button variant="outline" size="sm" leftIcon={<Download size={14} />}>Export register</Button>
            <Button size="sm" leftIcon={<Plus size={14} />}>File a complaint</Button>
          </>
        }
      />

      {/* SIGNATURE MOMENT — 3-slot warning meter as the dominant element */}
      <section className="mb-6 border border-ink/15 bg-elevated rounded-sm overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_320px]">
          {/* Left — the meter */}
          <div className="p-6 sm:p-8 relative">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="eyebrow">Standing case · Kuddus Mia · Roll 005</p>
                <h2 className="mt-2 font-display text-2xl sm:text-3xl text-ink leading-tight">
                  {kuddusWarnings} of 3 slots filled.<br className="hidden sm:block" />
                  <span className="text-ink/50">One more strike and impeachment opens.</span>
                </h2>
              </div>
              <Badge tone={kuddusWarnings >= 2 ? 'live' : 'neutral'}>
                {kuddusWarnings >= 2 ? 'Escalated' : 'Under watch'}
              </Badge>
            </div>

            <WarningMeter
              count={kuddusWarnings}
              size="lg"
              label="Impeachment slots"
              subject="Case #2417"
            />

            <div className="mt-6 flex flex-wrap gap-2">
              <Button size="sm" variant="secondary">Open case file</Button>
              <Button size="sm" variant="outline">Add warning</Button>
              <Button size="sm" variant="ghost">View strike history</Button>
            </div>
          </div>

          {/* Right — recent strikes ledger */}
          <div className="border-t lg:border-t-0 lg:border-l rule-ink bg-paper p-6">
            <div className="flex items-center justify-between mb-4">
              <p className="eyebrow">Strikes ledger</p>
              <Link to="/mission-1/history" className="font-mono text-[10px] tracking-widest uppercase text-ink hover:text-ochre">
                See all →
              </Link>
            </div>
            <ol className="space-y-4">
              {[
                { n: 1, when: '04 Jul', where: 'Tiffin theft — Rifat', by: 'Anonymous' },
                { n: 2, when: '08 Jul', where: 'Bribe — 2 Tk washroom', by: 'Anonymous' },
              ].map((s) => (
                <li key={s.n} className="grid grid-cols-[24px_1fr_auto] gap-3 items-start">
                  <span className="font-display text-lg leading-none text-ochre">{s.n}</span>
                  <div className="min-w-0">
                    <p className="text-sm text-ink truncate">{s.where}</p>
                    <p className="font-mono text-[10px] tracking-wider uppercase text-ink/50 mt-0.5">Filed by {s.by}</p>
                  </div>
                  <span className="font-mono text-[10px] tracking-wider uppercase text-ink/50">{s.when}</span>
                </li>
              ))}
              <li className="grid grid-cols-[24px_1fr_auto] gap-3 items-start opacity-50">
                <span className="font-display text-lg leading-none text-ink/30">3</span>
                <p className="text-sm text-ink/60">— slot open —</p>
                <span className="font-mono text-[10px] tracking-wider uppercase text-ink/40">pending</span>
              </li>
            </ol>
          </div>
        </div>
      </section>

      {/* Register indicators — mono eyebrow strip, sized by weight */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3 mb-6">
        {stats.map((s) => {
          const Icon = ICONS[s.key];
          return (
            <StatCard
              key={s.key}
              icon={Icon ? <Icon size={14} /> : null}
              label={s.label}
              value={formatNumber(s.value)}
              trend={s.trend}
              hint={s.hint}
            />
          );
        })}
      </div>

      {/* Ledger + side rail — break the grid */}
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_360px] gap-4">
        {/* Central ledger — the register itself, as a table not cards */}
        <Card eyebrow="Live register · last 14 days" ref="LOG //" tone="ochre" className="overflow-hidden">
          <div className="px-5 pt-5 pb-3 flex items-center justify-between">
            <h3 className="font-display text-lg text-ink">Entries in Rashid Sir's book</h3>
            <Button variant="ghost" size="sm">View log</Button>
          </div>

          <div className="px-5">
            <div className="grid grid-cols-[80px_minmax(0,1fr)_100px] items-center gap-4 py-2 border-b border-ink/15">
              <p className="eyebrow">Time</p>
              <p className="eyebrow">Entry</p>
              <p className="eyebrow text-right">Filed by</p>
            </div>
            <ul>
              {activity.map((a) => {
                const Icon = CATEGORY_ICON[a.who] || FileText;
                return (
                  <li
                    key={a.id}
                    className="grid grid-cols-[80px_minmax(0,1fr)_100px] items-center gap-4 py-3 border-b border-ink/10 last:border-0"
                  >
                    <p className="font-mono text-[11px] tracking-wide text-ink/60">{a.when}</p>
                    <div className="min-w-0 flex items-start gap-2.5">
                      <Icon size={14} className="mt-0.5 shrink-0 text-ink/50" />
                      <p className="text-sm text-ink truncate">{a.what}</p>
                    </div>
                    <p className="text-xs text-ink/70 text-right truncate">{a.who}</p>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="border-t border-ink/10 bg-paper/70 px-5 py-3 flex items-center justify-between">
            <p className="font-mono text-[10px] tracking-widest uppercase text-ink/60">
              Anonymised · zero-knowledge separation enforced
            </p>
            <ArrowUpRight size={13} className="text-ink/50" />
          </div>
        </Card>

        {/* Side rail — one dense chart, then a small task strip */}
        <div className="space-y-4">
          <Card eyebrow="Chart · complaints vs SOS · 14d" ref="CHT-01">
            <div className="px-4 pt-3 pb-4">
              <ChartPlaceholder
                data={chartSeries}
                keys={[
                  { dataKey: 'complaints', color: 'rgb(var(--rule))' },
                  { dataKey: 'sos', color: 'rgb(var(--danger))' },
                ]}
                height={180}
              />
              <div className="mt-3 flex items-center gap-4">
                <span className="inline-flex items-center gap-2 text-[11px] text-muted">
                  <span className="h-2 w-2 bg-ink" /> Complaints
                </span>
                <span className="inline-flex items-center gap-2 text-[11px] text-muted">
                  <span className="h-2 w-2 bg-danger" /> SOS flares
                </span>
              </div>
            </div>
          </Card>

          <Card eyebrow="Due this week" ref="TASK">
            <ul className="divide-y divide-ink/10">
              {tasks.map((t) => (
                <li key={t.id} className="flex items-start justify-between gap-3 px-4 py-3">
                  <div className="min-w-0">
                    <p className="text-sm text-ink truncate">{t.label}</p>
                    <p className="eyebrow mt-0.5">Sir Rashid</p>
                  </div>
                  <span className="font-mono text-[10px] tracking-widest uppercase text-ink/60 border border-ink/25 px-1.5 py-0.5">
                    {t.due}
                  </span>
                </li>
              ))}
            </ul>
          </Card>

          <Card eyebrow="Live signals" ref="ALT" tone="stamp">
            <ul className="divide-y divide-ink/10">
              {notifications.map((n) => (
                <li key={n.id} className="px-4 py-3 flex items-start gap-3">
                  <span
                    aria-hidden
                    className={n.tone === 'danger' ? 'mt-1.5 h-1.5 w-1.5 rounded-full bg-danger stamp-live shrink-0' : 'mt-1.5 h-1.5 w-1.5 rounded-full bg-ink/40 shrink-0'}
                  />
                  <div className="min-w-0">
                    <p className="text-sm text-ink truncate">{n.title}</p>
                    <p className="text-xs text-muted">{n.body}</p>
                  </div>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
}
