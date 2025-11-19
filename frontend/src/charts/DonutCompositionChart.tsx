import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export interface DonutDatum {
  label: string;
  value?: number | null;
  color?: string;
}

interface DonutCompositionChartProps {
  data: DonutDatum[];
}

const defaultColors = ['#0c2332', '#35d0a0', '#a9e9ff', '#fb923c'];

export function DonutCompositionChart({ data }: DonutCompositionChartProps) {
  const filtered = data.filter((item) => typeof item.value === 'number' && !Number.isNaN(item.value));
  const total = filtered.reduce((sum, item) => sum + (item.value ?? 0), 0);

  if (!filtered.length || total <= 0) {
    return (
      <div className="flex h-56 items-center justify-center text-sm text-[#7a838b]">
        Dados insuficientes para gerar distribuição corporal.
      </div>
    );
  }

  return (
    <div className="h-56">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Tooltip cursor={{ fill: 'rgba(53, 208, 160, 0.12)' }} />
          <Legend />
          <Pie
            data={filtered}
            dataKey="value"
            nameKey="label"
            innerRadius={50}
            outerRadius={70}
            paddingAngle={3}
          >
            {filtered.map((entry, index) => (
              <Cell key={entry.label} fill={entry.color ?? defaultColors[index % defaultColors.length]} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
