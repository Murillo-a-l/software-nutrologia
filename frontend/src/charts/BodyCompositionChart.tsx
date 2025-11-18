import { BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export interface BodyCompositionDatum {
  label: string;
  atual?: number | null;
  ideal?: number | null;
}

interface BodyCompositionChartProps {
  data: BodyCompositionDatum[];
}

export function BodyCompositionChart({ data }: BodyCompositionChartProps) {
  const filtered = data.filter((item) => item.atual ?? item.ideal);

  if (filtered.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center text-sm text-[#7a838b]">
        Dados insuficientes para gerar comparação.
      </div>
    );
  }

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={filtered} barGap={12}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e0db" />
          <XAxis dataKey="label" tick={{ fill: '#7a838b', fontSize: 12 }} axisLine={{ stroke: '#e2e0db' }} tickLine={false} />
          <YAxis tick={{ fill: '#7a838b', fontSize: 12 }} axisLine={{ stroke: '#e2e0db' }} tickLine={false} />
          <Tooltip cursor={{ fill: 'rgba(53, 208, 160, 0.12)' }} />
          <Legend />
          <Bar dataKey="atual" name="Atual" fill="#0c2332" radius={[8, 8, 0, 0]} barSize={24} />
          <Bar dataKey="ideal" name="Ideal" fill="#35d0a0" radius={[8, 8, 0, 0]} barSize={24} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
