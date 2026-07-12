import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';

export default function ChartPlaceholder({ data = [], keys = [], height = 220, type = 'area' }) {
  const Chart = type === 'line' ? LineChart : AreaChart;
  const Series = type === 'line' ? Line : Area;
  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer>
        <Chart data={data} margin={{ top: 10, right: 12, left: -20, bottom: 0 }}>
          <defs>
            {keys.map((k) => (
              <linearGradient key={k.dataKey} id={`g-${k.dataKey}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={k.color} stopOpacity={0.35} />
                <stop offset="100%" stopColor={k.color} stopOpacity={0} />
              </linearGradient>
            ))}
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgb(var(--border))" vertical={false} />
          <XAxis dataKey="day" stroke="rgb(var(--muted))" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
          <YAxis stroke="rgb(var(--muted))" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
          <Tooltip
            contentStyle={{
              background: 'rgb(var(--elevated))',
              border: '1px solid rgb(var(--border))',
              borderRadius: 8,
              fontSize: 12,
              color: 'rgb(var(--fg))',
            }}
          />
          {keys.map((k) => (
            <Series
              key={k.dataKey}
              type="monotone"
              dataKey={k.dataKey}
              stroke={k.color}
              strokeWidth={2}
              fill={`url(#g-${k.dataKey})`}
              dot={false}
            />
          ))}
        </Chart>
      </ResponsiveContainer>
    </div>
  );
}
