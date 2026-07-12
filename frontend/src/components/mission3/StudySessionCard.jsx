import Card from '../common/Card.jsx';
import DifficultyBadge from './DifficultyBadge.jsx';
import PriorityBadge from './PriorityBadge.jsx';
import { Check, Clock, PlayCircle } from 'lucide-react';
import { cx } from '../../utils/index.js';

export default function StudySessionCard({ session, onToggle }) {
  return (
    <Card className={cx('p-4 flex items-center gap-3', session.completed && 'opacity-70')}>
      <button
        onClick={() => onToggle?.(session.id)}
        aria-label={session.completed ? 'Mark as incomplete' : 'Mark as complete'}
        className={cx(
          'h-9 w-9 shrink-0 rounded-lg flex items-center justify-center border transition-colors',
          session.completed
            ? 'bg-success text-white border-transparent'
            : 'bg-elevated text-muted border-border hover:text-fg'
        )}
      >
        {session.completed ? <Check size={16} /> : <PlayCircle size={16} />}
      </button>
      <div className="min-w-0 flex-1">
        <p className={cx('text-sm font-medium text-fg truncate', session.completed && 'line-through')}>
          {session.topic}
        </p>
        <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted">
          <DifficultyBadge value={session.difficulty} />
          <PriorityBadge value={session.priority} />
          <span className="inline-flex items-center gap-1"><Clock size={12} /> {session.hours}h</span>
        </div>
      </div>
    </Card>
  );
}
