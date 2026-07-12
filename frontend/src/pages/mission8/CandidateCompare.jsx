import { useEffect, useMemo, useState } from 'react';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { GitCompare, X, Plus } from 'lucide-react';
import PageContainer from '../../components/layout/PageContainer.jsx';
import PageHeader from '../../components/layout/PageHeader.jsx';
import Mission8SubNav from '../../components/mission8/Mission8SubNav.jsx';
import Card from '../../components/common/Card.jsx';
import Select from '../../components/forms/Select.jsx';
import Button from '../../components/common/Button.jsx';
import Avatar from '../../components/ui/Avatar.jsx';
import Badge from '../../components/ui/Badge.jsx';
import SectionHeader from '../../components/ui/SectionHeader.jsx';
import EmptyState from '../../components/feedback/EmptyState.jsx';
import LoadingState from '../../components/feedback/Loading.jsx';
import ErrorState from '../../components/feedback/ErrorState.jsx';
import { getCurrentRound, getRankedCandidates, weightsToList } from '../../services/candidatesService.js';

import { cx } from '../../utils/index.js';

const COLORS = ['rgb(var(--brand))', 'rgb(var(--success))', 'rgb(var(--warning))', 'rgb(var(--danger))'];
const MAX = 4;

export default function CandidateCompare() {
  const [candidates, setCandidates] = useState([]);
  const [weights, setWeights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [ids, setIds] = useState([]);
  const [pick, setPick] = useState('');

  useEffect(() => {
    let active = true;
    getCurrentRound()
      .then((round) => {
        if (!active || !round) return [];
        setWeights(weightsToList(round.weights));
        return getRankedCandidates(round.id);
      })
      .then((data) => {
        if (!active) return;
        setCandidates(data || []);
        setIds((data || []).slice(0, 2).map((c) => c.id));
      })
      .catch((err) => { if (active) setError(err?.message || 'Unable to load candidates'); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  const selected = ids.map((id) => candidates.find((c) => c.id === id)).filter(Boolean);

  const radar = useMemo(() => weights.map((w) => {
    const row = { subject: w.label };
    selected.forEach((s) => { row[s.name] = s.scores?.[w.key] ?? 0; });
    return row;
  }), [selected, weights]);

  const bestByKey = useMemo(() => {
    const map = {};
    weights.forEach((w) => {
      const best = selected.reduce((b, s) => (!b || (s.scores?.[w.key] ?? 0) > (b.scores?.[w.key] ?? 0) ? s : b), null);
      map[w.key] = best?.id;
    });
    return map;
  }, [selected, weights]);

  const remove = (id) => setIds((xs) => xs.filter((x) => x !== id));
  const add = () => {
    if (pick && !ids.includes(pick) && ids.length < MAX) {
      setIds((xs) => [...xs, pick]);
      setPick('');
    }
  };

  if (loading) {
    return (
      <PageContainer>
        <PageHeader title="Compare Candidates" subtitle="Line up 2–4 candidates across every leadership factor." icon={<GitCompare size={18} />} />
        <Mission8SubNav />
        <LoadingState label="Loading candidates..." />
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer>
        <PageHeader title="Compare Candidates" subtitle="Line up 2–4 candidates across every leadership factor." icon={<GitCompare size={18} />} />
        <Mission8SubNav />
        <ErrorState title="Couldn't load candidates" message={error} />
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <PageHeader title="Compare Candidates" subtitle="Line up 2–4 candidates across every leadership factor." icon={<GitCompare size={18} />} />
      <Mission8SubNav />

      <Card className="p-4 mb-6 flex flex-wrap items-end gap-3">
        <div className="flex-1 min-w-[220px]">
          <Select label="Add candidate" value={pick} onChange={(e) => setPick(e.target.value)}>
            <option value="">— Select —</option>
            {candidates.filter((c) => !ids.includes(c.id)).map((c) => (
              <option key={c.id} value={c.id}>{c.name} ({c.roll})</option>
            ))}
          </Select>
        </div>
        <Button leftIcon={<Plus size={14} />} onClick={add} disabled={!pick || ids.length >= MAX}>Add</Button>
        <p className="text-xs text-muted">Up to {MAX} candidates</p>
      </Card>

      {selected.length < 2 ? (
        <EmptyState title="Pick at least 2 candidates" message="Add another candidate to unlock the comparison view." />
      ) : (
        <>
          <div className={cx('grid gap-4 mb-6', selected.length === 2 ? 'sm:grid-cols-2' : selected.length === 3 ? 'sm:grid-cols-3' : 'sm:grid-cols-2 lg:grid-cols-4')}>
            {selected.map((s, i) => (
              <Card key={s.id} className="p-4 relative">
                <button
                  onClick={() => remove(s.id)}
                  className="absolute top-2 right-2 h-6 w-6 rounded-full bg-elevated text-muted hover:bg-danger/10 hover:text-danger inline-flex items-center justify-center"
                  aria-label={`Remove ${s.name}`}
                >
                  <X size={12} />
                </button>
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full" style={{ background: COLORS[i] }} />
                  <Avatar name={s.name} size={40} />
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-fg truncate">{s.name}</p>
                    <p className="text-xs text-muted truncate">{s.roll}</p>
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-semibold text-fg tabular-nums">{s.scores?.overall ?? 0}</p>
                    <p className="text-[11px] text-muted">Overall</p>
                  </div>
                  {s.badge && <Badge tone="brand">{s.badge}</Badge>}
                </div>
              </Card>
            ))}
          </div>

          <Card className="p-4 mb-6">
            <SectionHeader title="Radar comparison" description="Overlaid score profiles" />
            <div style={{ width: '100%', height: 320 }}>
              <ResponsiveContainer>
                <RadarChart data={radar}>
                  <PolarGrid stroke="rgb(var(--border))" />
                  <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fill: 'rgb(var(--muted))' }} />
                  <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 10 }} />
                  {selected.map((s, i) => (
                    <Radar key={s.id} name={s.name} dataKey={s.name} stroke={COLORS[i]} fill={COLORS[i]} fillOpacity={0.2} />
                  ))}
                  <Tooltip contentStyle={{ background: 'rgb(var(--elevated))', border: '1px solid rgb(var(--border))', borderRadius: 8, fontSize: 12 }} />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card className="p-4 overflow-x-auto">
            <SectionHeader title="Category-by-category" description="Best score in each row is highlighted" />
            <table className="w-full text-sm min-w-[600px]">
              <thead>
                <tr className="text-left text-xs uppercase text-muted">
                  <th className="px-3 py-2 font-medium">Category</th>
                  {selected.map((s, i) => (
                    <th key={s.id} className="px-3 py-2 font-medium">
                      <span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-full" style={{ background: COLORS[i] }} /> {s.name.split(' ')[0]}</span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {weights.map((w) => (
                  <tr key={w.key} className="border-t border-border">
                    <td className="px-3 py-2.5 text-fg">{w.label}</td>
                    {selected.map((s) => {
                      const best = bestByKey[w.key] === s.id;
                      return (
                        <td key={s.id} className={cx('px-3 py-2.5 tabular-nums', best ? 'text-success font-semibold' : 'text-fg')}>
                          {s.scores?.[w.key] ?? 0}{best && <Badge tone="success" className="ml-1.5">Top</Badge>}
                        </td>
                      );
                    })}
                  </tr>
                ))}
                <tr className="border-t border-border bg-elevated/40">
                  <td className="px-3 py-2.5 font-semibold text-fg">Overall</td>
                  {selected.map((s) => {
                    const top = Math.max(...selected.map((x) => x.scores?.overall ?? 0));
                    const best = (s.scores?.overall ?? 0) === top;
                    return (
                      <td key={s.id} className={cx('px-3 py-2.5 tabular-nums font-semibold', best ? 'text-brand' : 'text-fg')}>
                        {s.scores?.overall ?? 0}
                      </td>
                    );
                  })}
                </tr>
              </tbody>
            </table>
          </Card>
        </>
      )}
    </PageContainer>
  );
}
