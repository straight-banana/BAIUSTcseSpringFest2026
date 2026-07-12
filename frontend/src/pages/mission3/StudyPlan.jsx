import { useState } from 'react';
import PageContainer from '../../components/layout/PageContainer.jsx';
import PageHeader from '../../components/layout/PageHeader.jsx';
import Mission3SubNav from '../../components/mission3/Mission3SubNav.jsx';
import Card from '../../components/common/Card.jsx';
import SectionHeader from '../../components/ui/SectionHeader.jsx';
import { StatCard } from '../../components/common/Cards.jsx';
import StudySessionCard from '../../components/mission3/StudySessionCard.jsx';
import { ProgressBar, CircularProgress } from '../../components/ui/Progress.jsx';
import { CalendarDays, Clock, Flame, Target } from 'lucide-react';
import { STUDY_PLAN } from '../../mocks/data/mission3.js';

export default function StudyPlan() {
  const [plan, setPlan] = useState(STUDY_PLAN);

  const toggle = (id) => {
    setPlan((p) => ({
      ...p,
      weeks: p.weeks.map((w) => ({
        ...w,
        days: w.days.map((d) => ({
          ...d,
          sessions: d.sessions.map((s) => (s.id === id ? { ...s, completed: !s.completed } : s)),
        })),
      })),
    }));
  };

  const allSessions = plan.weeks.flatMap((w) => w.days.flatMap((d) => d.sessions));
  const completed = allSessions.filter((s) => s.completed).length;
  const total = allSessions.length;
  const pct = total ? Math.round((completed / total) * 100) : 0;

  return (
    <PageContainer>
      <PageHeader
        title="Study Plan"
        subtitle="Automatically distributed across days by difficulty, priority and available hours."
        icon={<CalendarDays size={18} />}
      />
      <Mission3SubNav />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        <StatCard icon={<Clock size={16} />} label="Total planned" value={`${plan.totalHours}h`} hint="Across 3 weeks" />
        <StatCard icon={<Target size={16} />} label="Completed" value={`${plan.completedHours}h`} hint={`${pct}% of plan`} trend={4.2} />
        <StatCard icon={<Flame size={16} />} label="Streak" value={`${plan.streakDays} days`} hint="Keep it going" trend={12} />
        <StatCard icon={<CalendarDays size={16} />} label="Sessions" value={`${completed}/${total}`} hint="Marked complete" />
      </div>

      <Card className="p-5 mb-4">
        <SectionHeader
          title="Plan completion"
          description="Toggle sessions below to update progress."
          action={<span className="text-xs font-mono text-muted">{pct}%</span>}
        />
        <div className="flex items-center gap-4">
          <div className="text-brand"><CircularProgress value={pct} size={56} stroke={5} /></div>
          <div className="flex-1">
            <ProgressBar value={pct} tone={pct > 66 ? 'success' : pct > 33 ? 'brand' : 'warning'} />
            <p className="mt-2 text-xs text-muted">{completed} of {total} sessions complete</p>
          </div>
        </div>
      </Card>

      <div className="space-y-6">
        {plan.weeks.map((week) => (
          <section key={week.label}>
            <div className="flex items-center gap-2 mb-3">
              <h2 className="text-sm font-semibold text-fg">{week.label}</h2>
              <span className="h-px flex-1 bg-border" />
              <span className="text-xs text-muted">
                {week.days.reduce((sum, d) => sum + d.sessions.reduce((s, x) => s + x.hours, 0), 0)}h total
              </span>
            </div>
            <div className="space-y-4">
              {week.days.map((day) => (
                <div key={day.day} className="grid grid-cols-1 md:grid-cols-[160px_1fr] gap-3">
                  <div className="text-sm text-muted md:pt-2">
                    <p className="font-medium text-fg">{day.day}</p>
                    <p className="text-xs mt-0.5">{day.sessions.reduce((s, x) => s + x.hours, 0)}h scheduled</p>
                  </div>
                  <div className="space-y-2">
                    {day.sessions.map((s) => (
                      <StudySessionCard key={s.id} session={s} onToggle={toggle} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </PageContainer>
  );
}
