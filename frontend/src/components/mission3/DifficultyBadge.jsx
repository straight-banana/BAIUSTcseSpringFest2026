import Badge from '../ui/Badge.jsx';
import { findDifficulty } from '../../mocks/data/mission3.js';

export default function DifficultyBadge({ value }) {
  const d = findDifficulty(value);
  return <Badge tone={d.tone}>{d.label}</Badge>;
}
