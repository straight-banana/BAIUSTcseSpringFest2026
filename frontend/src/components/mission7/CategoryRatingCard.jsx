import Card from '../common/Card.jsx';
import StarRating from './StarRating.jsx';

export default function CategoryRatingCard({ label, description, value, onChange, readOnly = false }) {
  return (
    <Card className="p-4 flex items-center justify-between gap-4">
      <div className="min-w-0">
        <p className="text-sm font-medium text-fg">{label}</p>
        {description && <p className="text-xs text-muted mt-0.5">{description}</p>}
      </div>
      <div className="shrink-0">
        <StarRating value={value} onChange={onChange} readOnly={readOnly} showValue />
      </div>
    </Card>
  );
}
