import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend, Tooltip } from 'recharts';

export interface RadarComparisonDatum {
  label: string;
  atual?: number | null;
  ideal?: number | null;
}

interface RadarComparisonChartProps {
  data: RadarComparisonDatum[];
}

export function RadarComparisonChart({ data }: RadarComparisonChartProps) {
  const filtered = data.filter((item) =>
    (item.atual !== null && item.atual !== undefined && !Number.isNaN(item.atual)) ||
    (item.ideal !== null && item.ideal !== undefined && !Number.isNaN(item.ideal))
  );

  if (!filtered.length) {
    return (
      <div className="flex h-64 items-center justify-center text-sm text-[#7a838b]">
        Insira dados corporais para visualizar o radar.
      </div>
    );
  }

  const maxValue = Math.max(
    40,
    ...filtered.map((item) => Math.max(item.atual ?? 0, item.ideal ?? 0))
  );

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={filtered} outerRadius="80%">
          <PolarGrid stroke="#e2e0db" />
          <PolarAngleAxis dataKey="label" stroke="#7a838b" tick={{ fill: '#7a838b', fontSize: 12 }} />
          <PolarRadiusAxis angle={45} domain={[0, maxValue]} tick={false} />
          <Tooltip />
          <Legend />
          <Radar name="Atual" dataKey="atual" stroke="#0c2332" fill="#0c2332" fillOpacity={0.25} />
          <Radar name="Ideal" dataKey="ideal" stroke="#35d0a0" fill="#35d0a0" fillOpacity={0.2} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
