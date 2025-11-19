interface MetricCardProps {
  title: string;
  value: string;
  subtitle?: string;
  trend?: {
    value: string;
    label: string;
    status?: 'up' | 'down' | 'stable';
  };
  badge?: {
    label: string;
    tone: 'success' | 'warning' | 'danger' | 'info';
  };
  progress?: {
    current: number;
    max: number;
    color?: string;
  };
}

const toneClasses: Record<NonNullable<MetricCardProps['badge']>['tone'], string> = {
  success: 'bg-[#35d0a0]/20 text-[#0c7a5a]',
  warning: 'bg-[#facc15]/20 text-[#92400e]',
  danger: 'bg-[#f87171]/20 text-[#b91c1c]',
  info: 'bg-[#a9e9ff]/30 text-[#0c2332]',
};

export function MetricCard({ title, value, subtitle, trend, badge, progress }: MetricCardProps) {
  const progressPercent = progress ? Math.min((progress.current / progress.max) * 100, 100) : null;
  const progressColor = progress?.color ?? 'bg-[#35d0a0]';

  return (
    <div className="relative overflow-hidden rounded-3xl border border-[#e2e0db] bg-white/85 p-5 shadow-sm">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#35d0a0]/5 via-transparent to-[#a9e9ff]/10" />
      <div className="relative flex flex-col gap-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[11px] uppercase tracking-[0.35em] text-[#7a838b]">{title}</p>
            <p className="mt-1 text-3xl font-semibold text-[#0c2332]">{value}</p>
          </div>
          {badge && <span className={`rounded-full px-3 py-1 text-xs font-semibold ${toneClasses[badge.tone]}`}>{badge.label}</span>}
        </div>
        {subtitle && <p className="text-sm text-[#4f5a63]">{subtitle}</p>}
        {progress && (
          <div>
            <div className="h-2.5 w-full overflow-hidden rounded-full bg-[#f0ede8]">
              <div className={`h-full rounded-full ${progressColor}`} style={{ width: `${progressPercent ?? 0}%` }} />
            </div>
            <p className="mt-1 text-xs text-[#7a838b]">
              {progress.current.toFixed(1)} / {progress.max}
            </p>
          </div>
        )}
        {trend && (
          <div className="flex items-center gap-2 text-xs font-medium text-[#4f5a63]">
            <TrendIcon status={trend.status} />
            <span>{trend.value}</span>
            <span className="text-[#7a838b]">{trend.label}</span>
          </div>
        )}
      </div>
    </div>
  );
}

function TrendIcon({ status = 'stable' }: { status?: 'up' | 'down' | 'stable' }) {
  if (status === 'up') {
    return (
      <svg className="h-3.5 w-3.5 text-[#35d0a0]" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={2}>
        <path d="M3 12l4-4 4 4 6-6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  if (status === 'down') {
    return (
      <svg className="h-3.5 w-3.5 text-[#f87171]" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={2}>
        <path d="M3 8l4 4 4-4 6 6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  return (
    <svg className="h-3.5 w-3.5 text-[#7a838b]" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={2}>
      <path d="M4 10h12" strokeLinecap="round" />
    </svg>
  );
}
