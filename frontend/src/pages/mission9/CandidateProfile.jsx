import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, GitCompare, Vote, Trophy } from 'lucide-react';
import PageContainer from '../../components/layout/PageContainer.jsx';
import PageHeader from '../../components/layout/PageHeader.jsx';
import Card from '../../components/common/Card.jsx';
import Button from '../../components/common/Button.jsx';
import Avatar from '../../components/ui/Avatar.jsx';
import SectionHeader from '../../components/ui/SectionHeader.jsx';
import Mission9SubNav from '../../components/mission9/Mission9SubNav.jsx';
import LoadingState from '../../components/feedback/Loading.jsx';
import ErrorState from '../../components/feedback/ErrorState.jsx';
import { getActive } from '../../services/electionsService.js';

export default function CandidateProfile() {
  const { id } = useParams();
  const [c, setC] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    getActive()
      .then((e) => {
        if (!active) return;
        const found = (e?.candidates || []).find((cand) => cand.id === id);
        setC(found || null);
      })
      .catch((err) => { if (active) setError(err?.message || 'Unable to load candidate'); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [id]);

  if (loading) {
    return (
      <PageContainer>
        <PageHeader title="Candidate Profile" icon={<Vote size={18} />} />
        <Mission9SubNav />
        <LoadingState label="Loading candidate..." />
      </PageContainer>
    );
  }

  if (error || !c) {
    return (
      <PageContainer>
        <PageHeader title="Candidate Profile" icon={<Vote size={18} />} />
        <Mission9SubNav />
        <ErrorState title="Couldn't load candidate" message={error || 'Candidate not found'} />
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <PageHeader
        title={c.name}
        subtitle={`Class ${c.className || '—'} · Section ${c.section || '—'} · Roll ${c.roll}`}
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
            <SectionHeader title="Bio" />
            {c.bio ? (
              <p className="text-sm text-muted leading-relaxed">{c.bio}</p>
            ) : (
              <p className="text-sm text-muted">No bio provided yet.</p>
            )}
          </Card>

          <Card className="p-5">
            <SectionHeader title="Achievements" />
            {(c.achievements || []).length === 0 ? (
              <p className="text-sm text-muted">No achievements listed yet.</p>
            ) : (
              <ul className="space-y-1.5">
                {c.achievements.map((a, i) => (
                  <li key={i} className="flex gap-2 text-sm text-muted">
                    <Trophy size={14} className="text-warning shrink-0 mt-0.5" />{a}
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </div>

        <aside className="space-y-4">
          <Card className="p-5">
            <h4 className="text-xs uppercase text-subtle mb-3">Status</h4>
            <p className="text-sm text-fg">{c.isCaptain ? 'Current class captain' : 'Not currently a captain'}</p>
          </Card>
        </aside>
      </div>
    </PageContainer>
  );
}
