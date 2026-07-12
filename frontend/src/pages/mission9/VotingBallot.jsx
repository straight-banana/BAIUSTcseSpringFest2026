import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Vote, ShieldCheck, ArrowLeft, X, Users, Info } from 'lucide-react';
import PageContainer from '../../components/layout/PageContainer.jsx';
import PageHeader from '../../components/layout/PageHeader.jsx';
import Card from '../../components/common/Card.jsx';
import Button from '../../components/common/Button.jsx';
import Modal from '../../components/common/Modal.jsx';
import Avatar from '../../components/ui/Avatar.jsx';
import Badge from '../../components/ui/Badge.jsx';
import SectionHeader from '../../components/ui/SectionHeader.jsx';
import EmptyState from '../../components/feedback/EmptyState.jsx';
import LoadingState from '../../components/feedback/Loading.jsx';
import ErrorState from '../../components/feedback/ErrorState.jsx';
import Mission9SubNav from '../../components/mission9/Mission9SubNav.jsx';
import CandidateVoteCard from '../../components/mission9/CandidateVoteCard.jsx';
import CountdownTimer from '../../components/mission9/CountdownTimer.jsx';
import { getActive, hasVoted, castVote } from '../../services/electionsService.js';

export default function VotingBallot() {
  const [params, setParams] = useSearchParams();
  const navigate = useNavigate();
  const initial = params.get('candidate') || '';
  const [election, setElection] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedId, setSelectedId] = useState(initial);
  const [confirmed, setConfirmed] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showPicker, setShowPicker] = useState(!initial);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let active = true;
    getActive()
      .then((e) => {
        if (!active) return null;
        setElection(e);
        return e ? hasVoted(e.id) : null;
      })
      .then((v) => {
        if (!active) return;
        if (v?.hasVoted) setError('You have already voted in this election.');
      })
      .catch((err) => {
        if (!active) return;
        if (err?.status === 404) setError('There is no active election right now.');
        else setError(err?.message || 'Unable to load election');
      })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  const candidates = election?.candidates || [];
  const candidate = useMemo(() => candidates.find((c) => c.id === selectedId) || null, [candidates, selectedId]);

  const pick = (id) => {
    setSelectedId(id);
    setShowPicker(false);
    setParams({ candidate: id }, { replace: true });
  };

  const submit = async () => {
    setSubmitting(true);
    try {
      await castVote(election.id, [{ candidateId: selectedId, rank: 1 }]);
      setShowModal(false);
      navigate('/mission-9/confirmation', { state: { candidate, electionTitle: election.title } });
    } catch (err) {
      setShowModal(false);
      setError(err?.message || 'Failed to submit vote');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <PageContainer>
        <PageHeader title="Voting Ballot" icon={<Vote size={18} />} />
        <Mission9SubNav />
        <LoadingState label="Loading ballot..." />
      </PageContainer>
    );
  }

  if (error || !election) {
    return (
      <PageContainer>
        <PageHeader title="Voting Ballot" icon={<Vote size={18} />} />
        <Mission9SubNav />
        <ErrorState title="Can't open ballot" message={error || 'No active election'} />
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <PageHeader
        title="Voting Ballot"
        subtitle={election.title}
        icon={<Vote size={18} />}
        actions={
          <Link to="/mission-9/candidates"><Button variant="outline" leftIcon={<ArrowLeft size={14} />}>Cancel</Button></Link>
        }
      />
      <Mission9SubNav />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {!candidate || showPicker ? (
            <Card className="p-5">
              <SectionHeader title="Choose your candidate" description="Tap a candidate to place them on the ballot" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {candidates.map((c) => (
                  <CandidateVoteCard
                    key={c.id}
                    candidate={c}
                    variant="list"
                    showActions={false}
                    selected={selectedId === c.id}
                    onSelect={pick}
                  />
                ))}
              </div>
              {selectedId && (
                <div className="mt-4 flex justify-end">
                  <Button onClick={() => setShowPicker(false)}>Review ballot</Button>
                </div>
              )}
            </Card>
          ) : (
            <Card className="p-5">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <p className="text-xs uppercase text-subtle">Selected candidate</p>
                  <h3 className="text-sm font-semibold text-fg mt-0.5">Your ballot</h3>
                </div>
                <button
                  onClick={() => setShowPicker(true)}
                  className="text-xs text-brand hover:underline inline-flex items-center gap-1"
                >
                  <Users size={12} /> Change selection
                </button>
              </div>

              <div className="rounded-xl border border-brand/40 bg-brand/5 p-4 flex items-center gap-4">
                <Avatar name={candidate.name} size={56} />
                <div className="min-w-0 flex-1">
                  <p className="text-base font-semibold text-fg truncate">{candidate.name}</p>
                  <p className="text-xs text-muted truncate">{candidate.roll} · Sec {candidate.section}</p>
                  {candidate.bio && <p className="mt-2 text-xs text-muted italic line-clamp-2">"{candidate.bio}"</p>}
                </div>
                <button
                  onClick={() => { setSelectedId(''); setConfirmed(false); setShowPicker(true); setParams({}, { replace: true }); }}
                  className="h-8 w-8 rounded-full bg-elevated text-muted hover:bg-danger/10 hover:text-danger inline-flex items-center justify-center shrink-0"
                  aria-label="Deselect candidate"
                >
                  <X size={14} />
                </button>
              </div>

              <label className="mt-6 flex items-start gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={confirmed}
                  onChange={(e) => setConfirmed(e.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-border text-brand focus:ring-brand/40"
                  aria-describedby="confirm-help"
                />
                <span className="text-sm text-fg">
                  I confirm this is my final selection. I understand my vote cannot be changed once submitted.
                  <span id="confirm-help" className="block text-xs text-muted mt-0.5">
                    Your ballot is anonymous — it is not linked to your student ID.
                  </span>
                </span>
              </label>

              <div className="mt-6 flex flex-wrap gap-2 justify-end">
                <Button variant="outline" onClick={() => setShowPicker(true)}>Change selection</Button>
                <Link to="/mission-9"><Button variant="ghost">Cancel</Button></Link>
                <Button
                  disabled={!confirmed}
                  onClick={() => setShowModal(true)}
                  leftIcon={<Vote size={14} />}
                >
                  Submit Vote
                </Button>
              </div>
            </Card>
          )}
        </div>

        <aside className="space-y-4">
          {election.endsAt && <CountdownTimer target={election.endsAt} />}
          <Card className="p-4">
            <h4 className="text-xs uppercase text-subtle mb-2 inline-flex items-center gap-1.5"><ShieldCheck size={12} />Ballot rules</h4>
            <ul className="text-xs text-muted space-y-1.5 list-disc pl-4">
              <li>One student, one vote.</li>
              <li>Voting is anonymous — your identity is not linked to your ballot.</li>
              <li>Once submitted, your vote cannot be changed.</li>
            </ul>
          </Card>
          <Card className="p-4 bg-warning/10 border-warning/30">
            <div className="flex gap-2">
              <Info size={14} className="text-warning shrink-0 mt-0.5" />
              <div className="text-xs text-fg">
                <p className="font-medium">One student, one vote.</p>
                <p className="text-muted mt-1">Once you press <span className="font-semibold text-fg">Submit</span>, your ballot is final.</p>
              </div>
            </div>
          </Card>
        </aside>
      </div>

      <Modal
        open={showModal}
        onClose={() => setShowModal(false)}
        title="Confirm your vote"
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowModal(false)} disabled={submitting}>Cancel</Button>
            <Button onClick={submit} leftIcon={<Vote size={14} />} disabled={submitting}>{submitting ? 'Submitting…' : 'Submit Vote'}</Button>
          </div>
        }
      >
        {candidate ? (
          <>
            <p className="text-sm text-muted mb-3">You are casting your vote for:</p>
            <div className="rounded-lg bg-surface border border-border p-3 flex items-center gap-3">
              <Avatar name={candidate.name} size={40} />
              <div className="min-w-0">
                <p className="text-sm font-semibold text-fg truncate">{candidate.name}</p>
                <p className="text-xs text-muted truncate">{candidate.roll}</p>
              </div>
              <Badge tone="brand" className="ml-auto">Selected</Badge>
            </div>
            <p className="text-xs text-muted mt-4">This action cannot be undone.</p>
          </>
        ) : (
          <EmptyState title="No candidate selected" />
        )}
      </Modal>
    </PageContainer>
  );
}
