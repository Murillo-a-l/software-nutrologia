import { useEffect, useMemo, useState } from 'react';
import { Layout } from '../../../components/Layout';
import { MetricCard } from '../../../components/ui/MetricCard';
import { TrendAreaChart } from '../../../charts/TrendAreaChart';
import { apiClient } from '../../../api/client';
import type { Patient, Assessment } from '../../../types';

export function MetabolismPage() {
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
        setError(err instanceof Error ? err.message : 'Erro ao carregar metabolismo');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const assessments = useMemo(() => patients.flatMap((patient) => patient.assessments ?? []), [patients]);
  const sortedAssessments = useMemo(
    () => [...assessments].sort((a, b) => parseAssessmentDate(a.dateTime) - parseAssessmentDate(b.dateTime)),
    [assessments]
  );

  const bmrMifflinAvg = useMemo(() => average(assessments, (assessment) => assessment.metrics?.bmrMifflin), [assessments]);
  const bmrCunninghamAvg = useMemo(() => average(assessments, (assessment) => assessment.metrics?.bmrCunningham), [assessments]);
  const tdeeAvg = useMemo(() => average(assessments, (assessment) => assessment.metrics?.tdee), [assessments]);
  const metabolicAgeAvg = useMemo(() => average(assessments, (assessment) => assessment.metrics?.metabolicAgeYears), [assessments]);

  const bmrTrend = sortedAssessments.map((assessment) => ({ label: assessment.dateTime, value: assessment.metrics?.bmrMifflin ?? null }));
  const tdeeTrend = sortedAssessments.map((assessment) => ({ label: assessment.dateTime, value: assessment.metrics?.tdee ?? null }));

  return (
    <Layout>
      <div className="rounded-3xl border border-[#e2e0db] bg-white/90 p-6 shadow-sm">
        <p className="text-[11px] uppercase tracking-[0.4em] text-[#7a838b]">Módulo</p>
        <h1 className="mt-2 text-3xl font-semibold text-[#0c2332]">Metabolismo energético</h1>
        <p className="mt-2 text-sm text-[#4f5a63]">
          BMR, TDEE, idade metabólica e disponibilidade energética com cálculos automatizados.
        </p>
      </div>

      {error && <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          title="BMR Mifflin"
          value={loading ? '...' : bmrMifflinAvg ? `${Math.round(bmrMifflinAvg)} kcal` : '—'}
          subtitle="Repouso"
          badge={{ label: 'Mifflin', tone: 'info' }}
        />
        <MetricCard
          title="BMR Cunningham"
          value={loading ? '...' : bmrCunninghamAvg ? `${Math.round(bmrCunninghamAvg)} kcal` : '—'}
          subtitle="Baseado em FFM"
          badge={{ label: 'Cunningham', tone: 'success' }}
        />
        <MetricCard
          title="TDEE"
          value={loading ? '...' : tdeeAvg ? `${Math.round(tdeeAvg)} kcal` : '—'}
          subtitle="Gasto diário"
          badge={{ label: 'Energia', tone: 'warning' }}
        />
        <MetricCard
          title="Idade metabólica média"
          value={loading ? '...' : metabolicAgeAvg ? `${metabolicAgeAvg.toFixed(0)} anos` : '—'}
          subtitle="Comparativo corporal"
          badge={{ label: 'Idade', tone: 'danger' }}
        />
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <div className="rounded-3xl border border-[#e2e0db] bg-white/90 p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-[#0c2332]">Linha BMR</h2>
          <TrendAreaChart data={bmrTrend} color="#35d0a0" title="BMR" />
        </div>
        <div className="rounded-3xl border border-[#e2e0db] bg-white/90 p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-[#0c2332]">Linha TDEE</h2>
          <TrendAreaChart data={tdeeTrend} color="#a9e9ff" title="TDEE" />
        </div>
      </div>

      <div className="rounded-3xl border border-[#e2e0db] bg-white/90 p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-[#0c2332]">Resumo energético</h3>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 text-sm text-[#4f5a63]">
          <div className="rounded-2xl border border-[#f0ede8] bg-white/70 p-4">
            <p className="text-xs uppercase tracking-[0.3em] text-[#7a838b]">Disponibilidade</p>
            <p className="mt-1 text-2xl font-semibold text-[#0c2332]">
              {tdeeAvg && bmrMifflinAvg ? `${Math.round((tdeeAvg - bmrMifflinAvg) / 7)} kcal/kg` : '—'}
            </p>
            <p className="text-xs text-[#7a838b]">Semana</p>
          </div>
          <div className="rounded-2xl border border-[#f0ede8] bg-white/70 p-4">
            <p className="text-xs uppercase tracking-[0.3em] text-[#7a838b]">Superávit seguro</p>
            <p className="mt-1 text-2xl font-semibold text-[#0c2332]">
              {tdeeAvg ? `${Math.round(tdeeAvg * 1.1)} kcal` : '—'}
            </p>
            <p className="text-xs text-[#7a838b]">Hipertrofia</p>
          </div>
          <div className="rounded-2xl border border-[#f0ede8] bg-white/70 p-4">
            <p className="text-xs uppercase tracking-[0.3em] text-[#7a838b]">Déficit clínico</p>
            <p className="mt-1 text-2xl font-semibold text-[#0c2332]">
              {tdeeAvg ? `${Math.round(tdeeAvg * 0.8)} kcal` : '—'}
            </p>
            <p className="text-xs text-[#7a838b]">Cutting</p>
          </div>
          <div className="rounded-2xl border border-[#f0ede8] bg-white/70 p-4">
            <p className="text-xs uppercase tracking-[0.3em] text-[#7a838b]">Idade metabólica</p>
            <p className="mt-1 text-2xl font-semibold text-[#0c2332]">{metabolicAgeAvg ? metabolicAgeAvg.toFixed(0) : '—'}</p>
            <p className="text-xs text-[#7a838b]">Comparativo</p>
          </div>
        </div>
      </div>
    </Layout>
  );
}

function average(assessments: Assessment[], getter: (assessment: Assessment) => number | undefined | null) {
  const values = assessments
    .map(getter)
    .filter((value): value is number => typeof value === 'number' && !Number.isNaN(value));
  if (!values.length) return null;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function parseAssessmentDate(value: string) {
  const [day, month, year] = (value ?? '01/01/1970').split('/').map(Number);
  return new Date(year || 0, (month || 1) - 1, day || 1).getTime();
}
