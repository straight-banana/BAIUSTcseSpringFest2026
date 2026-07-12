import { useMemo, useState } from 'react';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { GitCompare, X, Plus } from 'lucide-react';
import PageContainer from '../../components/layout/PageContainer.jsx';
import PageHeader from '../../components/layout/PageHeader.jsx';
import Card from '../../components/common/Card.jsx';
import Button from '../../components/common/Button.jsx';
import Select from '../../components/forms/Select.jsx';
import Avatar from '../../components/ui/Avatar.jsx';
import Badge from '../../components/ui/Badge.jsx';
import SectionHeader from '../../components/ui/SectionHeader.jsx';
import EmptyState from '../../components/feedback/EmptyState.jsx';
import Mission9SubNav from '../../components/mission9/Mission9SubNav.jsx';
import VoteBar from '../../components/mission9/VoteBar.jsx';
import { CANDIDATES } from '../../mocks/data/mission9.js';
import { cx } from '../../utils/index.js';

const COLORS = ['rgb(var(--brand))', 'rgb(var(--success))', 'rgb(var(--warning))', 'rgb(var(--danger))'];
const AXES = [
  { key: 'leadership',     label: 'Leadership' },
  { key: 'communication',  label: 'Communication' },
  { key: 'responsibility', label: 'Responsibility' },
  { key: 'participation',  label: 'Participation' },
  { key: 'academic',       label: 'Academic' },
];
const MAX = 4;

export default function CandidateCompare() {
  const [ids, setIds] = useState(['cand-1', 'cand-2']);
  const [pick, setPick] = useState('');

  const selected = ids.map((id) => CANDIDATES.find((c) => c.id === id)).filter(Boolean);

  const radar = useMemo(() => AXES.map((a) => {
    const row = { subject: a.label };
    selected.forEach((s) => { row[s.name] = s.scores[a.key]; });
    return row;
  }), [selected]);

  const bestByKey = useMemo(() => {
    const map = {};
    AXES.forEach((a) => {
      const best = selected.reduce((b, s) => (!b || s.scores[a.key] > b.scores[a.key] ? s : b), null);
      map[a.key] = best?.id;
    });
    return map;
  }, [selected]);

  const remove = (id) => setIds((xs) => xs.filter((x) => x !== id));
  const add = () => {
    if (pick && !ids.includes(pick) && ids.length < MAX) {
      setIds((xs) => [...xs, pick]); setPick('');
    }
  };

  return (
    <PageContainer>
      <PageHeader title="Compare Candidates" subtitle="Line up 2–4 candidates across every category." icon={<GitCompare size={18} />} />
      <Mission9SubNav />

      <Card className="p-4 mb-6 flex flex-wrap items-end gap-3">
        <div className="flex-1 min-w-[220px]">
          <Select label="Add candidate" value={pick} onChange={(e) => setPick(e.target.value)}>
            <option value="">— Select —</option>
            {CANDIDATES.filter((c) => !ids.includes(c.id)).map((c) => (
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
          <div className={cx('grid gap-4 mb-6',
            selected.length === 2 ? 'sm:grid-cols-2' :
            selected.length === 3 ? 'sm:grid-cols-3' :
            'sm:grid-cols-2 lg:grid-cols-4')}>
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
                    <p className="text-xs text-muted truncate">{s.roll} · {s.department}</p>
                  </div>
                </div>
                <p className="mt-3 text-xs text-muted line-clamp-3 min-h-[3rem]">{s.manifesto}</p>
                <div className="mt-3 flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-semibold text-fg tabular-nums">{s.overallScore}</p>
                    <p className="text-[11px] text-muted">Overall</p>
                  </div>
                  <Badge tone={s.recommendation === 'strong' ? 'success' : s.recommendation === 'endorsed' ? 'brand' : 'warning'}>
                    {s.recommendation === 'strong' ? 'Strong' : s.recommendation === 'endorsed' ? 'Endorsed' : 'Review'}
                  </Badge>
                </div>
              </Card>
            ))}
          </div>

          <Card className="p-4 mb-6">
            <SectionHeader title="Progress bars" description="Highest score in each row is highlighted" />
            <div className="space-y-5">
              {AXES.map((a) => (
                <div key={a.key} className="grid gap-3" style={{ gridTemplateColumns: `120px repeat(${selected.length}, minmax(0, 1fr))` }}>
                  <p className="text-xs text-muted self-center">{a.label}</p>
                  {selected.map((s) => (
                    <VoteBar
                      key={s.id}
                      label={s.name.split(' ')[0]}
                      value={s.scores[a.key]}
                      suffix="/100"
                      highlight={bestByKey[a.key] === s.id}
                    />
                  ))}
                </div>
              ))}
            </div>
          </Card>

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
            <SectionHeader title="Manifesto highlights" description="Side-by-side promises" />
            <table className="w-full text-sm min-w-[600px]">
              <thead>
                <tr className="text-left text-xs uppercase text-muted">
                  <th className="px-3 py-2 font-medium w-24">Candidate</th>
                  <th className="px-3 py-2 font-medium">Manifesto</th>
                </tr>
              </thead>
              <tbody>
                {selected.map((s, i) => (
                  <tr key={s.id} className="border-t border-border align-top">
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full shrink-0" style={{ background: COLORS[i] }} />
                        <span className="text-fg font-medium truncate">{s.name.split(' ')[0]}</span>
                      </div>
                    </td>
                    <td className="px-3 py-3 text-muted italic">"{s.manifesto}"</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </>
      )}
    </PageContainer>
  );
}
