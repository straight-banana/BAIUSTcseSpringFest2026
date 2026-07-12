import { useParams, Link } from 'react-router-dom';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, Tooltip } from 'recharts';
import { Calculator, ArrowLeft } from 'lucide-react';
import PageContainer from '../../components/layout/PageContainer.jsx';
import PageHeader from '../../components/layout/PageHeader.jsx';
import Mission8SubNav from '../../components/mission8/Mission8SubNav.jsx';
import Card from '../../components/common/Card.jsx';
import Button from '../../components/common/Button.jsx';
import SectionHeader from '../../components/ui/SectionHeader.jsx';
import CircularScore from '../../components/mission8/CircularScore.jsx';
import ScoreBar from '../../components/mission8/ScoreBar.jsx';
import { getCandidateById, SCORE_WEIGHTS } from '../../mocks/data/mission8.js';

export default function ScoreBreakdown() {
  const { id } = useParams();
  const c = getCandidateById(id);
  const radar = SCORE_WEIGHTS.map((w) => ({ subject: w.label, score: c.scores[w.key] }));

  return (
    <PageContainer>
      <PageHeader
        title="Score Breakdown"
        subtitle={`${c.name} · ${c.roll}`}
        icon={<Calculator size={18} />}
        actions={
          <Link to={`/mission-8/candidates/${c.id}`}>
            <Button variant="outline" leftIcon={<ArrowLeft size={13} />}>Back to profile</Button>
          </Link>
        }
      />
      <Mission8SubNav />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="p-5 text-center">
          <SectionHeader title="Overall score" className="!mb-3" />
          <CircularScore value={c.scores.overall} size={160} stroke={12} label="Overall" />
          <p className="mt-3 text-xs text-muted">Weighted composite of 7 categories</p>
        </Card>

        <Card className="lg:col-span-2 p-4">
          <SectionHeader title="Category radar" description="Balance across leadership factors" />
          <div style={{ width: '100%', height: 260 }}>
            <ResponsiveContainer>
              <RadarChart data={radar}>
                <PolarGrid stroke="rgb(var(--border))" />
                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fill: 'rgb(var(--muted))' }} />
                <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 10 }} />
                <Radar dataKey="score" stroke="rgb(var(--brand))" fill="rgb(var(--brand))" fillOpacity={0.35} />
                <Tooltip contentStyle={{ background: 'rgb(var(--elevated))', border: '1px solid rgb(var(--border))', borderRadius: 8, fontSize: 12 }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <Card className="p-4 mt-6">
        <SectionHeader title="Weighted contributions" description="How each factor pushes the overall score" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
          {SCORE_WEIGHTS.map((w) => {
            const raw = c.scores[w.key];
            const contribution = +(raw * w.weight).toFixed(1);
            return (
              <div key={w.key}>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-fg font-medium">{w.label}</span>
                  <span className="text-muted">weight <span className="text-fg tabular-nums">{(w.weight * 100).toFixed(0)}%</span></span>
                </div>
                <ScoreBar label={`Raw score`} value={raw} />
                <p className="mt-1 text-[11px] text-muted">Contributes <span className="text-fg font-medium tabular-nums">{contribution}</span> points to overall</p>
              </div>
            );
          })}
        </div>
      </Card>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
        {SCORE_WEIGHTS.slice(0, 4).map((w) => (
          <Card key={w.key} className="p-4 text-center">
            <CircularScore value={c.scores[w.key]} size={80} stroke={7} label={w.label} />
          </Card>
        ))}
      </div>
    </PageContainer>
  );
}
