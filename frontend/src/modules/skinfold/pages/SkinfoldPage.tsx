import { useEffect, useMemo, useState } from 'react';
import { Layout } from '../../../components/Layout';
import { MetricCard } from '../../../components/ui/MetricCard';
import { TrendAreaChart } from '../../../charts/TrendAreaChart';
import { apiClient } from '../../../api/client';
import type { Patient, Assessment } from '../../../types';

const sites = [
  { name: 'Tríceps', tip: 'Dobra vertical no meio do braço posterior.' },
  { name: 'Subescapular', tip: 'Dobra oblíqua abaixo da escápula.' },
  { name: 'Supra-ilíaca', tip: 'Dobra diagonal acima da crista ilíaca.' },
  { name: 'Abdominal', tip: 'Dobra vertical lateral ao umbigo.' },
  { name: 'Coxa', tip: 'Dobra vertical na parte anterior da coxa.' },
  { name: 'Peitoral', tip: 'Dobra diagonal entre axila e mamilo.' },
  { name: 'Axilar média', tip: 'Dobra vertical na linha média axilar.' },
];

export function SkinfoldPage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const response = await apiClient.getPatients();
        setPatients(response);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao carregar dobras cutâneas');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const assessments = useMemo(() => patients.flatMap((patient) => patient.assessments ?? []), [patients]);
  const bfAverage = useMemo(() => average(assessments, (assessment) => assessment.bfPercent), [assessments]);
  const bfMin = useMemo(() => extremum(assessments, Math.min), [assessments]);
  const bfMax = useMemo(() => extremum(assessments, Math.max), [assessments]);
  const bfTrend = useMemo(
    () => assessments.map((assessment) => ({ label: assessment.dateTime, value: assessment.bfPercent ?? null })),
    [assessments]
  );

  return (
    <Layout>
      <div className="rounded-3xl border border-[#e2e0db] bg-white/90 p-6 shadow-sm">
        <p className="text-[11px] uppercase tracking-[0.4em] text-[#7a838b]">Módulo</p>
        <h1 className="mt-2 text-3xl font-semibold text-[#0c2332]">Dobras cutâneas</h1>
        <p className="mt-2 text-sm text-[#4f5a63]">
          Protocolos JP7 e JP3 com preview anatômico e acompanhamento do percentual de gordura.
        </p>
      </div>

      {error && <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          title="% Gordura médio"
          value={loading ? '...' : bfAverage ? `${bfAverage.toFixed(1)}%` : '—'}
          subtitle="Somatório das dobras"
          badge={{ label: 'Adipômetro', tone: 'info' }}
        />
        <MetricCard
          title="Menor registro"
          value={loading ? '...' : bfMin ? `${bfMin.toFixed(1)}%` : '—'}
          subtitle="Meta histórica"
          badge={{ label: 'Melhor', tone: 'success' }}
        />
        <MetricCard
          title="Maior registro"
          value={loading ? '...' : bfMax ? `${bfMax.toFixed(1)}%` : '—'}
          subtitle="Ponto crítico"
          badge={{ label: 'Alerta', tone: 'warning' }}
        />
        <MetricCard
          title="Protocolos ativos"
          value={sites.length.toString()}
          subtitle="Pontes disponíveis"
          badge={{ label: 'JP7/JP3', tone: 'danger' }}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="rounded-3xl border border-[#e2e0db] bg-white/90 p-6 shadow-sm lg:col-span-2">
          <p className="text-sm font-semibold text-[#0c2332] mb-3">Locais de dobras</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {sites.map((site) => (
              <div key={site.name} className="rounded-2xl border border-[#f0ede8] bg-white/80 p-4">
                <p className="text-sm font-semibold text-[#0c2332]">{site.name}</p>
                <p className="text-xs text-[#7a838b] mt-1">{site.tip}</p>
                import {Layout} from '../../../components/Layout';

                export function SkinfoldPage() {
  const sites = [
                {name: 'Tríceps', tip: 'Dobra vertical no meio do braço posterior.' },
                {name: 'Subescapular', tip: 'Dobra oblíqua abaixo da escápula.' },
                {name: 'Supra-ilíaca', tip: 'Dobra diagonal acima da crista ilíaca.' },
                {name: 'Abdominal', tip: 'Dobra vertical lateral ao umbigo.' },
                {name: 'Coxa', tip: 'Dobra vertical na parte anterior da coxa.' },
                {name: 'Peitoral', tip: 'Dobra diagonal entre axila e mamilo.' },
                {name: 'Axilar média', tip: 'Dobra vertical na linha média axilar.' },
                ];

                return (
                <Layout>
                  <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Módulo</p>
                    <h1 className="text-3xl font-semibold text-slate-900">Dobras cutâneas</h1>
                    <p className="text-sm text-slate-500 mt-2">
                      Configure protocolos JP7 ou JP3, visualize o corpo alvo e insira valores com feedback imediato do % de gordura.
                    </p>
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm lg:col-span-2">
                      <p className="text-sm font-semibold text-slate-600 mb-3">Locais de dobras</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {sites.map((site) => (
                          <div key={site.name} className="border border-slate-200 rounded-2xl p-4">
                            <p className="text-sm font-semibold text-slate-900">{site.name}</p>
                            <p className="text-xs text-slate-500 mt-1">{site.tip}</p>
                          </div>
                        ))}
                      </div>
                    </div>
<<<<<<< HEAD
  <div className="rounded-3xl border border-[#e2e0db] bg-white/90 p-6 shadow-sm">
    <p className="text-sm font-semibold text-[#0c2332] mb-4">Guia visual</p>
    <div className="aspect-[3/5] rounded-2xl bg-gradient-to-b from-[#a9e9ff]/40 to-[#35d0a0]/10 flex items-center justify-center">
      <svg viewBox="0 0 120 200" className="h-full w-full max-h-80 text-[#0c2332]">
        <path d="M60 10c-12 0-22 10-22 22v30c0 16-10 28-10 46 0 34 14 70 32 70s32-36 32-70c0-18-10-30-10-46V32c0-12-10-22-22-22z" fill="#e6f6ff" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="60" cy="40" r="4" fill="#fb923c" />
        <circle cx="40" cy="80" r="4" fill="#35d0a0" />
        <circle cx="80" cy="80" r="4" fill="#35d0a0" />
        <circle cx="60" cy="110" r="4" fill="#0c2332" />
=======
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
          <p className="text-sm font-semibold text-slate-600 mb-4">Guia visual</p>
          <div className="aspect-[3/5] bg-gradient-to-b from-slate-100 to-slate-200 rounded-2xl flex items-center justify-center">
            <svg viewBox="0 0 120 200" className="h-full w-full max-h-80">
              <path d="M60 10c-12 0-22 10-22 22v30c0 16-10 28-10 46 0 34 14 70 32 70s32-36 32-70c0-18-10-30-10-46V32c0-12-10-22-22-22z" fill="#CBD5F5" />
              <circle cx="60" cy="40" r="4" fill="#F97316" />
              <circle cx="40" cy="80" r="4" fill="#38BDF8" />
              <circle cx="80" cy="80" r="4" fill="#38BDF8" />
              <circle cx="60" cy="110" r="4" fill="#22C55E" />
>>>>>>> 81426ffc81f07d7ec03d3ac1dcf64bb81f065e2c
            </svg>
          </div>
        </div>
    </div>
<<<<<<< HEAD

  <div className="rounded-3xl border border-[#e2e0db] bg-white/90 p-6 shadow-sm">
    <h3 className="text-lg font-semibold text-[#0c2332]">Tendência do % gordura</h3>
    <TrendAreaChart data={bfTrend} color="#fb923c" title="% gordura" />
  </div>
    </Layout >
  );
}

function average(assessments: Assessment[], getter: (assessment: Assessment) => number | undefined | null) {
  const values = assessments
    .map(getter)
    .filter((value): value is number => typeof value === 'number' && !Number.isNaN(value));
  if (!values.length) return null;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function extremum(assessments: Assessment[], comparator: (...values: number[]) => number) {
  const values = assessments
    .map((assessment) => assessment.bfPercent)
    .filter((value): value is number => typeof value === 'number' && !Number.isNaN(value));
  if (!values.length) return null;
  return comparator(...values);
}
=======
    </Layout>
  );
}
>>>>>>> 81426ffc81f07d7ec03d3ac1dcf64bb81f065e2c
