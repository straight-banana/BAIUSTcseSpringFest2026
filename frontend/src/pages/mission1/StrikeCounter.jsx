import PageContainer from '../../components/layout/PageContainer.jsx';
import PageHeader from '../../components/layout/PageHeader.jsx';
import Mission1SubNav from '../../components/mission1/Mission1SubNav.jsx';
import Card from '../../components/common/Card.jsx';
import { StatCard } from '../../components/common/Cards.jsx';
import SectionHeader from '../../components/ui/SectionHeader.jsx';
import ProgressRing from '../../components/mission1/ProgressRing.jsx';
import WarningLevelBadge from '../../components/mission1/WarningLevelBadge.jsx';
import { ProgressBar } from '../../components/ui/Progress.jsx';
import {
  Gauge, ClipboardCheck, Flame, ShieldCheck, Info,
} from 'lucide-react';
import { strikeSummary, WARNING_LEVELS } from '../../mocks/data/complaints.js';

export default function StrikeCounter() {
  const s = strikeSummary;
  const level = s.warningLevel;

  return (
    <PageContainer>
      <PageHeader
        title="Strike Counter"
        subtitle="Cumulative accountability meter. Only validated complaints add strike weight."
        icon={<Gauge size={18} />}
      />
      <Mission1SubNav />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
        <StatCard icon={<ClipboardCheck size={16} />} label="Total Valid Complaints" value={s.validComplaints} hint="Resolved & validated" />
        <StatCard icon={<Flame size={16} />}          label="Total Strikes"           value={s.totalStrikes}     hint={`out of ${s.strikeCap}`} />
        <StatCard icon={<ShieldCheck size={16} />}    label="Current Warning Level"   value={<WarningLevelBadge level={level} />} hint="Auto-computed" />
        <StatCard icon={<Gauge size={16} />}          label="Meter"                    value={`${s.strikePercent}%`} trend={s.strikePercent > 50 ? 8.4 : -2.1} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <Card className="p-6 flex flex-col items-center justify-center xl:col-span-1">
          <SectionHeader title="Impeachment Meter" description="Live strike progression" />
          <div className="mt-2">
            <ProgressRing
              value={s.strikePercent}
              tone={level.tone}
              label={level.label}
              sublabel={`${s.totalStrikes} / ${s.strikeCap} strike pts`}
            />
          </div>
          <p className="mt-4 text-xs text-muted text-center max-w-xs">
            When the meter reaches <span className="text-fg font-medium">100%</span>, an impeachment
            vote opens automatically and Rashid Sir is notified.
          </p>
        </Card>

        <Card className="p-5 xl:col-span-2">
          <SectionHeader title="Warning Level Legend" description="How the meter escalates" />
          <ul className="space-y-3 mt-1">
            {WARNING_LEVELS.map((w) => {
              const active = w.key === level.key;
              return (
                <li
                  key={w.key}
                  className={`rounded-lg border p-3 transition-colors ${
                    active ? 'border-brand bg-brand-soft/40' : 'border-border bg-surface'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <WarningLevelBadge level={w} />
                      {active && <span className="text-[10px] uppercase tracking-wider text-brand font-mono">Current</span>}
                    </div>
                    <span className="text-[11px] font-mono text-muted">{w.min}–{w.max}%</span>
                  </div>
                  <ProgressBar
                    value={w.max}
                    tone={w.tone === 'brand' ? 'brand' : w.tone === 'success' ? 'success' : w.tone === 'warning' ? 'warning' : 'danger'}
                  />
                </li>
              );
            })}
          </ul>
        </Card>
      </div>

      <Card className="p-5 mt-4">
        <div className="flex gap-3">
          <Info size={16} className="text-brand mt-0.5 shrink-0" />
          <div className="text-sm text-muted leading-relaxed">
            <p className="font-medium text-fg mb-1">How strikes work</p>
            <ul className="space-y-1 text-xs">
              <li>• A complaint only earns strike points once a <span className="text-fg font-medium">teacher validates</span> it.</li>
              <li>• Weight ranges from <span className="text-fg font-medium">1</span> (minor) to <span className="text-fg font-medium">3</span> (severe).</li>
              <li>• Points accumulate against the accused captain — never against a student who reported.</li>
              <li>• Rater identities are never revealed on this dashboard.</li>
            </ul>
          </div>
        </div>
      </Card>
    </PageContainer>
  );
}
