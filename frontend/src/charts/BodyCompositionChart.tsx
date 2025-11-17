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
      <div className="h-64 flex items-center justify-center text-sm text-slate-500">
        Dados insuficientes para gerar comparação.
      </div>
    );
  }

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={filtered} barGap={12}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
          <XAxis dataKey="label" tick={{ fill: '#64748B', fontSize: 12 }} axisLine={{ stroke: '#E2E8F0' }} tickLine={false} />
          <YAxis tick={{ fill: '#64748B', fontSize: 12 }} axisLine={{ stroke: '#E2E8F0' }} tickLine={false} />
          <Tooltip cursor={{ fill: 'rgba(56, 189, 248, 0.08)' }} />
          <Legend />
          <Bar dataKey="atual" name="Atual" fill="#0F172A" radius={[6, 6, 0, 0]} barSize={24} />
          <Bar dataKey="ideal" name="Ideal" fill="#10B981" radius={[6, 6, 0, 0]} barSize={24} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
