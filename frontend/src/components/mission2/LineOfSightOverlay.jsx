import { useMemo } from 'react';

/**
 * LineOfSightOverlay — SVG overlay drawing sight-lines from teacher podium
 * to seated students. Visualization-only, no calculations.
 */
export default function LineOfSightOverlay({ rows, cols, highlightedId, seats }) {
  const width = 720;
  const height = 360;
  const podium = { x: width / 2, y: 24 };

  const points = useMemo(() => {
    const gap = 16;
    const cellW = (width - gap * (cols + 1)) / cols;
    const cellH = (height - gap * (rows + 2)) / rows;
    return seats
      .filter((s) => s.student)
      .map((s) => ({
        id: s.student.id,
        name: s.student.name,
        x: gap + s.col * (cellW + gap) + cellW / 2,
        y: 60 + s.row * (cellH + gap) + cellH / 2,
      }));
  }, [seats, rows, cols]);

  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto" role="img" aria-label="Line of sight visualization">
        <defs>
          <linearGradient id="losLine" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-brand, #FF8F00)" stopOpacity="0.9" />
            <stop offset="100%" stopColor="var(--color-brand, #FF8F00)" stopOpacity="0.15" />
          </linearGradient>
        </defs>

        {/* sight lines */}
        {points.map((p) => {
          const isTarget = highlightedId === p.id;
          return (
            <line
              key={p.id}
              x1={podium.x}
              y1={podium.y}
              x2={p.x}
              y2={p.y}
              stroke={isTarget ? 'var(--color-danger, #C62828)' : 'url(#losLine)'}
              strokeWidth={isTarget ? 2.5 : 1}
              strokeDasharray={isTarget ? '0' : '4 4'}
              opacity={isTarget ? 1 : 0.5}
            />
          );
        })}

        {/* podium */}
        <g>
          <rect x={podium.x - 44} y={podium.y - 14} width={88} height={28} rx={14} fill="var(--color-brand, #FF8F00)" />
          <text x={podium.x} y={podium.y + 5} textAnchor="middle" fill="white" fontSize="11" fontWeight="600">Podium</text>
        </g>

        {/* student dots */}
        {points.map((p) => {
          const isTarget = highlightedId === p.id;
          return (
            <g key={`dot-${p.id}`}>
              <circle
                cx={p.x}
                cy={p.y}
                r={isTarget ? 10 : 6}
                fill={isTarget ? 'var(--color-danger, #C62828)' : 'var(--color-accent, #FBC02D)'}
                stroke="white"
                strokeWidth={2}
              />
              {isTarget && (
                <text x={p.x} y={p.y - 14} textAnchor="middle" fontSize="10" fill="var(--color-danger, #C62828)" fontWeight="700">
                  {p.name.split(' ')[0]}
                </text>
              )}
            </g>
          );
        })}
      </svg>

      <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-muted">
        <span className="inline-flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-brand" /> Teacher</span>
        <span className="inline-flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-warning" /> Student</span>
        <span className="inline-flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-danger" /> Highlighted</span>
        <span className="inline-flex items-center gap-1.5"><span className="h-0.5 w-6 bg-brand" /> Sight line</span>
      </div>
    </div>
  );
}
