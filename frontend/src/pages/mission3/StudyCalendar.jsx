import { useState } from 'react';
import PageContainer from '../../components/layout/PageContainer.jsx';
import PageHeader from '../../components/layout/PageHeader.jsx';
import Mission3SubNav from '../../components/mission3/Mission3SubNav.jsx';
import Card from '../../components/common/Card.jsx';
import SectionHeader from '../../components/ui/SectionHeader.jsx';
import { StatCard } from '../../components/common/Cards.jsx';
import CalendarGrid from '../../components/mission3/CalendarGrid.jsx';
import EmptyState from '../../components/feedback/EmptyState.jsx';
import { ProgressBar } from '../../components/ui/Progress.jsx';
import Badge from '../../components/ui/Badge.jsx';
import Button from '../../components/common/Button.jsx';
import { Calendar, ChevronLeft, ChevronRight, Flame, CheckCircle2, Clock, CalendarClock } from 'lucide-react';
import { CALENDAR_TASKS } from '../../mocks/data/mission3.js';

const todayKey = new Date().toISOString().slice(0, 10);

export default function StudyCalendar() {
  const [monthOffset, setMonthOffset] = useState(0);
  const [selected, setSelected] = useState(todayKey);

  const dayTasks = CALENDAR_TASKS[selected] || [];
  const upcoming = Object.entries(CALENDAR_TASKS)
    .filter(([k]) => k > todayKey)
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(0, 4);
  const completed = Object.values(CALENDAR_TASKS).flat().filter((t) => t.done).length;
  const totalHoursWeek = Object.entries(CALENDAR_TASKS)
    .filter(([k]) => Math.abs((new Date(k) - new Date(todayKey)) / (1000 * 60 * 60 * 24)) <= 7)
    .flatMap(([, v]) => v)
    .reduce((s, t) => s + t.hours, 0);

  return (
    <PageContainer>
      <PageHeader
        title="Study Calendar"
        subtitle="Monthly overview with today's tasks, streak and upcoming sessions."
        icon={<Calendar size={18} />}
      />
      <Mission3SubNav />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        <StatCard icon={<Flame size={16} />} label="Streak" value="5 days" hint="Longest: 9 days" trend={20} />
        <StatCard icon={<CheckCircle2 size={16} />} label="Sessions done" value={completed} hint="This month" trend={8} />
        <StatCard icon={<Clock size={16} />} label="Hours (7d)" value={`${totalHoursWeek.toFixed(1)}h`} hint="Rolling week" />
        <StatCard icon={<CalendarClock size={16} />} label="Upcoming" value={upcoming.length} hint="Next 4 sessions" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2 p-5">
          <div className="flex items-center justify-between mb-4">
            <SectionHeader title="Monthly overview" className="mb-0" />
            <div className="flex items-center gap-1">
              <Button size="icon" variant="ghost" onClick={() => setMonthOffset((m) => m - 1)} aria-label="Previous month">
                <ChevronLeft size={16} />
              </Button>
              <Button size="sm" variant="ghost" onClick={() => setMonthOffset(0)}>Today</Button>
              <Button size="icon" variant="ghost" onClick={() => setMonthOffset((m) => m + 1)} aria-label="Next month">
                <ChevronRight size={16} />
              </Button>
            </div>
          </div>
          <CalendarGrid
            tasksByDate={CALENDAR_TASKS}
            monthOffset={monthOffset}
            selected={selected}
            onSelect={setSelected}
          />

          <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-muted">
            <span className="inline-flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-brand" /> Scheduled
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-success" /> Completed
            </span>
          </div>
        </Card>

        <div className="space-y-4">
          <Card className="p-5">
            <SectionHeader
              title={selected === todayKey ? "Today's tasks" : 'Selected day'}
              message={new Date(selected).toDateString()}
            />
            {dayTasks.length === 0 ? (
              <EmptyState title="Nothing scheduled" message="Pick another day or add a session from your plan." />
            ) : (
              <ul className="space-y-2">
                {dayTasks.map((t, i) => (
                  <li key={i} className="flex items-center gap-3 rounded-lg border border-border p-3">
                    <div className={
                      'h-8 w-8 rounded-lg flex items-center justify-center shrink-0 ' +
                      (t.done ? 'bg-success text-white' : 'bg-brand-soft text-brand')
                    }>
                      {t.done ? <CheckCircle2 size={16} /> : <Clock size={16} />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-fg truncate">{t.title}</p>
                      <p className="text-xs text-muted">{t.hours}h</p>
                    </div>
                    {t.done && <Badge tone="success">Done</Badge>}
                  </li>
                ))}
              </ul>
            )}
          </Card>

          <Card className="p-5">
            <SectionHeader title="Weekly progress" />
            <div className="flex items-center justify-between text-xs text-muted mb-1">
              <span>{completed} sessions</span>
              <span className="font-mono text-fg">{Math.min(100, Math.round((completed / 12) * 100))}%</span>
            </div>
            <ProgressBar value={Math.min(100, (completed / 12) * 100)} />
          </Card>

          <Card className="p-5">
            <SectionHeader title="Upcoming" message="Next few study sessions" />
            {upcoming.length === 0 ? (
              <EmptyState title="Nothing upcoming" message="You're all caught up for now." />
            ) : (
              <ul className="space-y-2">
                {upcoming.map(([date, tasks]) => (
                  <li key={date} className="flex items-center gap-3 text-sm">
                    <span className="w-24 text-xs text-muted font-mono">
                      {new Date(date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    </span>
                    <span className="flex-1 text-fg truncate">{tasks[0].title}</span>
                    <Badge tone="brand">{tasks.length}</Badge>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </div>
      </div>
    </PageContainer>
  );
}
