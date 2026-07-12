import { Trophy } from 'lucide-react';
import Card from '../common/Card.jsx';
import Avatar from '../ui/Avatar.jsx';
import Badge from '../ui/Badge.jsx';

export default function WinnerCard({ candidate: c, totalVotes }) {
  return (
    <Card className="p-6 relative overflow-hidden bg-gradient-to-br from-brand/10 via-surface to-warning/10 border-brand/40">
      <div className="absolute top-3 right-3">
        <Badge tone="brand"><Trophy size={11} className="mr-1" />Winner</Badge>
      </div>
      <div className="flex items-center gap-4">
        <div className="relative">
          <Avatar name={c.name} size={72} />
          <div className="absolute -bottom-1 -right-1 h-7 w-7 rounded-full bg-warning text-white flex items-center justify-center border-2 border-surface">
            <Trophy size={14} />
          </div>
        </div>
        <div className="min-w-0">
          <p className="text-xs uppercase text-subtle">Elected Captain</p>
          <h3 className="text-lg sm:text-xl font-semibold text-fg truncate">{c.name}</h3>
          <p className="text-xs text-muted truncate">{c.roll} · {c.department} · Sec {c.section}</p>
        </div>
      </div>
      <div className="mt-5 grid grid-cols-3 gap-3">
        <Stat label="Votes" value={c.votes} />
        <Stat label="Share" value={`${c.votePct}%`} />
        <Stat label="Of total" value={totalVotes} />
      </div>
    </Card>
  );
}

function Stat({ label, value }) {
  return (
    <div className="rounded-lg bg-surface/80 border border-border p-3 text-center">
      <p className="text-lg font-semibold text-fg tabular-nums">{value}</p>
      <p className="text-[10px] uppercase text-subtle mt-0.5">{label}</p>
    </div>
  );
}
