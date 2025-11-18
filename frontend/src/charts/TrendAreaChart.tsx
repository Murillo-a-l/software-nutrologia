import { AreaChart, Area, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';

export interface TrendPoint {
  label: string;
  value: number | null;
}

interface TrendAreaChartProps {
  data: TrendPoint[];
  color?: string;
  title?: string;
}

export function TrendAreaChart({ data, color = '#35d0a0', title }: TrendAreaChartProps) {
  const filtered = data.filter((point) => point.value !== null && !Number.isNaN(point.value));

  if (filtered.length === 0) {
    return (
      <div className="flex h-48 flex-col items-center justify-center text-sm text-[#7a838b]">
        <p>{title ?? 'Sem dados suficientes para este gráfico.'}</p>
      </div>
    );
  }

  return (
    <div className="h-48">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={filtered} margin={{ left: 0, top: 10, right: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.3} />
              <stop offset="95%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e0db" />
          <XAxis dataKey="label" tick={{ fill: '#7a838b', fontSize: 12 }} tickLine={false} axisLine={{ stroke: '#e2e0db' }} />
          <YAxis tick={{ fill: '#7a838b', fontSize: 12 }} tickLine={false} axisLine={{ stroke: '#e2e0db' }} width={32} />
          <Tooltip cursor={{ stroke: color, strokeWidth: 1 }} />
          <Area type="monotone" dataKey="value" stroke={color} fillOpacity={1} fill="url(#trendGradient)" strokeWidth={2} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

import { AreaChart, Area, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';

export interface TrendPoint {
  label: string;
  value: number | null;
}

interface TrendAreaChartProps {
  data: TrendPoint[];
  color?: string;
  title?: string;
}

export function TrendAreaChart({ data, color = '#38BDF8', title }: TrendAreaChartProps) {
  const filtered = data.filter((point) => point.value !== null && !Number.isNaN(point.value));

  if (filtered.length === 0) {
    return (
      <div className="h-48 flex flex-col items-center justify-center text-sm text-slate-500">
        <p>{title ?? 'Sem dados suficientes para este gráfico.'}</p>
      </div>
    );
  }

  return (
    <div className="h-48">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={filtered} margin={{ left: 0, top: 10, right: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.3} />
              <stop offset="95%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
          <XAxis dataKey="label" tick={{ fill: '#94A3B8', fontSize: 12 }} tickLine={false} axisLine={{ stroke: '#E2E8F0' }} />
          <YAxis tick={{ fill: '#94A3B8', fontSize: 12 }} tickLine={false} axisLine={{ stroke: '#E2E8F0' }} width={32} />
          <Tooltip cursor={{ stroke: color, strokeWidth: 1 }} />
          <Area type="monotone" dataKey="value" stroke={color} fillOpacity={1} fill="url(#trendGradient)" strokeWidth={2} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
