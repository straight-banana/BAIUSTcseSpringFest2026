import { useParams, Link } from 'react-router-dom';
import { Share2, Download, MessageSquare, Award, TrendingUp, Star } from 'lucide-react';
import PageContainer from '../../components/layout/PageContainer.jsx';
import PageHeader from '../../components/layout/PageHeader.jsx';
import Mission7SubNav from '../../components/mission7/Mission7SubNav.jsx';
import Card from '../../components/common/Card.jsx';
import Button from '../../components/common/Button.jsx';
import Badge from '../../components/ui/Badge.jsx';
import Avatar from '../../components/ui/Avatar.jsx';
import SectionHeader from '../../components/ui/SectionHeader.jsx';
import StarRating from '../../components/mission7/StarRating.jsx';
import CommentCard from '../../components/mission7/CommentCard.jsx';
import ChartPlaceholder from '../../components/ui/ChartPlaceholder.jsx';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, CartesianGrid, Tooltip } from 'recharts';
import { RATING_CATEGORIES, RATING_DISTRIBUTION, MONTHLY_TRENDS, getStudentById, getCommentsFor } from '../../mocks/data/mission7.js';

export default function StudentProfile() {
  const { id } = useParams();
  const student = getStudentById(id);
  const comments = getCommentsFor(student.id).slice(0, 4);

  return (
    <PageContainer>
      <PageHeader title="Student Profile" subtitle="Rating overview and anonymous feedback." icon={<Star size={18} />} />
      <Mission7SubNav />

      <Card className="p-5 mb-6">
        <div className="flex flex-wrap items-center gap-4">
          <Avatar name={student.name} size={64} />
          <div className="min-w-0 flex-1">
            <h2 className="text-lg font-semibold text-fg">{student.name}</h2>
            <p className="text-xs text-muted">{student.roll} · {student.department} · Sec {student.section} · Year {student.year}</p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {student.leadershipBadge && <Badge tone="brand"><Award size={11} className="mr-1" />{student.leadershipBadge}</Badge>}
              {student.achievements.map((a) => (<Badge key={a} tone="neutral">{a}</Badge>))}
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" leftIcon={<Share2 size={13} />}>Share</Button>
            <Button variant="outline" size="sm" leftIcon={<Download size={13} />}>Export</Button>
            <Link to={`/mission-7/rate?student=${student.id}`}>
              <Button size="sm" leftIcon={<Star size={13} />}>Rate</Button>
            </Link>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <Card className="p-4">
          <p className="text-[11px] uppercase text-subtle">Overall</p>
          <div className="mt-1 flex items-center gap-2">
            <span className="text-2xl font-semibold text-fg tabular-nums">{student.overall.toFixed(2)}</span>
            <StarRating value={Math.round(student.overall)} readOnly size={14} />
          </div>
          <p className="mt-1 text-[11px] text-muted">Based on {student.totalRatings} ratings</p>
        </Card>
        <Card className="p-4">
          <p className="text-[11px] uppercase text-subtle">Leadership</p>
          <p className="mt-1 text-2xl font-semibold text-fg tabular-nums">{student.ratings.leadership}</p>
        </Card>
        <Card className="p-4">
          <p className="text-[11px] uppercase text-subtle">Teamwork</p>
          <p className="mt-1 text-2xl font-semibold text-fg tabular-nums">{student.ratings.teamwork}</p>
        </Card>
        <Card className="p-4">
          <p className="text-[11px] uppercase text-subtle">Communication</p>
          <p className="mt-1 text-2xl font-semibold text-fg tabular-nums">{student.ratings.communication}</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div>
            <SectionHeader title="Category breakdown" />
            <Card className="p-4 space-y-3">
              {RATING_CATEGORIES.map((c) => {
                const v = student.ratings[c.key];
                return (
                  <div key={c.key}>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-fg">{c.label}</span>
                      <span className="tabular-nums text-muted">{v.toFixed(1)}</span>
                    </div>
                    <div className="h-2 rounded-full bg-elevated overflow-hidden">
                      <div className="h-full bg-brand" style={{ width: `${(v / 5) * 100}%` }} />
                    </div>
                  </div>
                );
              })}
            </Card>
          </div>

          <div>
            <SectionHeader title="Rating distribution" />
            <Card className="p-4">
              <div style={{ width: '100%', height: 220 }}>
                <ResponsiveContainer>
                  <BarChart data={RATING_DISTRIBUTION}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgb(var(--border))" vertical={false} />
                    <XAxis dataKey="name" stroke="rgb(var(--muted))" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                    <YAxis stroke="rgb(var(--muted))" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                    <Tooltip contentStyle={{ background: 'rgb(var(--elevated))', border: '1px solid rgb(var(--border))', borderRadius: 8, fontSize: 12 }} />
                    <Bar dataKey="value" fill="rgb(var(--brand))" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>

          <div>
            <SectionHeader title="Performance timeline" description="Monthly average rating" />
            <Card className="p-4">
              <ChartPlaceholder
                data={MONTHLY_TRENDS}
                keys={[{ dataKey: 'avg', color: 'rgb(var(--brand))' }]}
                height={200}
              />
            </Card>
          </div>

          <div>
            <SectionHeader
              title="Recent anonymous feedback"
              action={<Link to="/mission-7/comments" className="text-xs text-brand hover:underline inline-flex items-center gap-1"><MessageSquare size={12} /> View all</Link>}
            />
            <div className="space-y-3">
              {comments.map((c) => <CommentCard key={c.id} comment={c} />)}
            </div>
          </div>
        </div>

        <aside className="space-y-4">
          <Card className="p-4">
            <h4 className="text-xs font-semibold uppercase text-subtle mb-3">Strengths summary</h4>
            <ul className="text-sm text-fg space-y-1.5">
              <li className="flex gap-2"><TrendingUp size={14} className="text-success shrink-0 mt-0.5" /> Strong in {RATING_CATEGORIES.slice().sort((a,b) => student.ratings[b.key]-student.ratings[a.key])[0].label}</li>
              <li className="flex gap-2"><TrendingUp size={14} className="text-success shrink-0 mt-0.5" /> Consistently reliable teammate</li>
              <li className="flex gap-2"><TrendingUp size={14} className="text-success shrink-0 mt-0.5" /> Clear written communication</li>
            </ul>
          </Card>
          <Card className="p-4">
            <h4 className="text-xs font-semibold uppercase text-subtle mb-3">Areas for improvement</h4>
            <ul className="text-sm text-muted space-y-1.5 list-disc pl-4">
              <li>More initiative in group discussions</li>
              <li>Deeper engagement in viva sessions</li>
              <li>Punctuality on tight deadlines</li>
            </ul>
          </Card>
          <Card className="p-4">
            <h4 className="text-xs font-semibold uppercase text-subtle mb-3">Statistics</h4>
            <div className="grid grid-cols-2 gap-3 text-center">
              <div><p className="text-lg font-semibold text-fg">{student.totalRatings}</p><p className="text-[11px] text-muted">Ratings</p></div>
              <div><p className="text-lg font-semibold text-fg">{comments.length}</p><p className="text-[11px] text-muted">Comments</p></div>
              <div><p className="text-lg font-semibold text-fg">{student.achievements.length}</p><p className="text-[11px] text-muted">Badges</p></div>
              <div><p className="text-lg font-semibold text-fg">#{Math.max(1, Math.round(6 - student.overall))}</p><p className="text-[11px] text-muted">Class rank</p></div>
            </div>
          </Card>
        </aside>
      </div>
    </PageContainer>
  );
}
