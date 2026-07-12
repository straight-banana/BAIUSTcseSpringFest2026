import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, GitCompare, Vote, GraduationCap, Star, Trophy, Target, ShieldCheck } from 'lucide-react';
import PageContainer from '../../components/layout/PageContainer.jsx';
import PageHeader from '../../components/layout/PageHeader.jsx';
import Card from '../../components/common/Card.jsx';
import Button from '../../components/common/Button.jsx';
import Badge from '../../components/ui/Badge.jsx';
import Avatar from '../../components/ui/Avatar.jsx';
import SectionHeader from '../../components/ui/SectionHeader.jsx';
import Mission9SubNav from '../../components/mission9/Mission9SubNav.jsx';
import VoteBar from '../../components/mission9/VoteBar.jsx';
import { getCandidateById } from '../../mocks/data/mission9.js';

export default function CandidateProfile() {
  const { id } = useParams();
  const c = getCandidateById(id);

  return (
    <PageContainer>
      <PageHeader
        title={c.name}
        subtitle={`Class ${c.className} · Section ${c.section} · Roll ${c.roll}`}
        icon={<Avatar name={c.name} size={40} />}
        actions={
          <div className="flex flex-wrap gap-2">
            <Link to="/mission-9/candidates"><Button variant="outline" leftIcon={<ArrowLeft size={14} />}>Back</Button></Link>
            <Link to={`/mission-9/compare?a=${c.id}`}><Button variant="secondary" leftIcon={<GitCompare size={14} />}>Compare</Button></Link>
            <Link to={`/mission-9/ballot?candidate=${c.id}`}><Button leftIcon={<Vote size={14} />}>Select Candidate</Button></Link>
          </div>
        }
      />
      <Mission9SubNav />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-5">
            <SectionHeader title="Biography" />
            <p className="text-sm text-muted leading-relaxed">{c.biography}</p>
          </Card>

          <Card className="p-5">
            <SectionHeader title="Manifesto" />
            <p className="text-sm text-fg leading-relaxed italic border-l-2 border-brand pl-3">"{c.manifesto}"</p>
            <h4 className="mt-5 text-xs uppercase text-subtle mb-2">Goals if elected</h4>
            <ul className="grid sm:grid-cols-2 gap-2">
              {c.goals.map((g, i) => (
                <li key={i} className="flex gap-2 text-sm text-muted">
                  <Target size={14} className="text-brand shrink-0 mt-0.5" />{g}
                </li>
              ))}
            </ul>
          </Card>

          <Card className="p-5">
            <SectionHeader title="Leadership Experience & Achievements" />
            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <h4 className="text-xs uppercase text-subtle mb-2">Experience</h4>
                <ul className="space-y-1.5">
                  {c.experience.map((e, i) => (
                    <li key={i} className="flex gap-2 text-sm text-muted">
                      <ShieldCheck size={14} className="text-brand shrink-0 mt-0.5" />{e}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="text-xs uppercase text-subtle mb-2">Achievements</h4>
                <ul className="space-y-1.5">
                  {c.achievements.map((a, i) => (
                    <li key={i} className="flex gap-2 text-sm text-muted">
                      <Trophy size={14} className="text-warning shrink-0 mt-0.5" />{a}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Card>

          <Card className="p-5">
            <SectionHeader title="Peer rating summary" description={`Based on ${c.peerRatingCount} anonymous ratings`} />
            <div className="flex items-baseline gap-3 mb-4">
              <p className="text-3xl font-semibold text-fg tabular-nums">{c.scores.peer.toFixed(2)}</p>
              <span className="text-sm text-muted">/ 5.00</span>
              <Star size={16} className="text-warning" />
            </div>
            <div className="space-y-3">
              <VoteBar label="Leadership"     value={c.scores.leadership}     suffix="/100" />
              <VoteBar label="Communication"  value={c.scores.communication}  suffix="/100" />
              <VoteBar label="Responsibility" value={c.scores.responsibility} suffix="/100" />
              <VoteBar label="Participation"  value={c.scores.participation}  suffix="/100" />
              <VoteBar label="Academic"       value={c.scores.academic}       suffix="/100" />
            </div>
          </Card>
        </div>

        <aside className="space-y-4">
          <Card className="p-5">
            <h4 className="text-xs uppercase text-subtle mb-3">Recommendation</h4>
            <div className="flex items-center gap-3 mb-3">
              <div className="h-14 w-14 rounded-full bg-brand-soft text-brand flex items-center justify-center text-lg font-semibold tabular-nums">
                {c.overallScore}
              </div>
              <div>
                <p className="text-sm font-medium text-fg">Overall Score</p>
                <p className="text-xs text-muted">Composite weighted</p>
              </div>
            </div>
            <Badge tone={c.recommendation === 'strong' ? 'success' : c.recommendation === 'endorsed' ? 'brand' : 'warning'}>
              {c.recommendation === 'strong' ? 'Strong pick' : c.recommendation === 'endorsed' ? 'Endorsed' : 'Under review'}
            </Badge>
          </Card>

          <Card className="p-5">
            <h4 className="text-xs uppercase text-subtle mb-3">Academic overview</h4>
            <div className="space-y-2 text-sm">
              <Row icon={<GraduationCap size={14} />} label="CGPA"       value={c.cgpa.toFixed(2)} />
              <Row label="Attendance"   value={`${c.attendancePct}%`} />
              <Row label="Peer ratings" value={c.peerRatingCount} />
              <Row label="Year"         value={`${c.year}rd`} />
            </div>
          </Card>

          <Card className="p-5">
            <h4 className="text-xs uppercase text-subtle mb-3">Strengths</h4>
            <div className="flex flex-wrap gap-1.5">
              {c.strengths.map((s, i) => <Badge key={i} tone="brand">{s}</Badge>)}
            </div>
          </Card>
        </aside>
      </div>
    </PageContainer>
  );
}

function Row({ icon, label, value }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-muted inline-flex items-center gap-1.5">{icon}{label}</span>
      <span className="text-fg font-medium tabular-nums">{value}</span>
    </div>
  );
}
