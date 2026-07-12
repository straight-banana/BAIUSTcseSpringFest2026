import Card from '../common/Card.jsx';
import { ProgressBar } from '../ui/Progress.jsx';
import DifficultyBadge from './DifficultyBadge.jsx';
import PriorityBadge from './PriorityBadge.jsx';
import { Clock, Target, Sparkles } from 'lucide-react';

export default function TopicCard({ topic, onClick }) {
  return (
    <Card
      as={onClick ? 'button' : 'div'}
      onClick={onClick}
      className="p-4 text-left w-full hover:border-brand/40 transition-colors flex flex-col gap-3"
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-sm font-semibold text-fg leading-snug min-w-0">{topic.name}</h3>
        <PriorityBadge value={topic.priority} />
      </div>

      <div className="flex flex-wrap items-center gap-2 text-xs text-muted">
        <DifficultyBadge value={topic.difficulty} />
        <span className="inline-flex items-center gap-1"><Clock size={12} /> {topic.hours}h</span>
        <span className="inline-flex items-center gap-1"><Target size={12} /> {topic.examProbability}% exam</span>
        <span className="inline-flex items-center gap-1"><Sparkles size={12} /> {topic.importance}% imp.</span>
      </div>

      <div>
        <div className="flex items-center justify-between text-xs text-muted mb-1">
          <span>Progress</span>
          <span className="font-mono text-fg">{topic.progress}%</span>
        </div>
        <ProgressBar value={topic.progress} tone={topic.progress > 66 ? 'success' : topic.progress > 33 ? 'brand' : 'warning'} />
      </div>
    </Card>
  );
}
