import { Layout } from '../../../components/Layout';

export function BioimpedancePage() {
  return (
    <Layout>
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
        <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Módulo</p>
        <h1 className="text-3xl font-semibold text-slate-900">Bioimpedância</h1>
        <p className="text-sm text-slate-500 mt-2">
          Configure protocolos de BIA, registre massa magra, água corporal total e ângulo de fase com gráficos dedicados.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {["Massa livre de gordura", "Água corporal", "Ângulo de fase", "Índice de gordura visceral"].map((label) => (
          <div key={label} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <p className="text-sm font-semibold text-slate-900">{label}</p>
            <p className="text-xs text-slate-500 mt-1">Dados prontos para gráficos premium.</p>
          </div>
        ))}
      </div>
    </Layout>
  );
}

import { useEffect, useMemo, useState } from 'react';
import { Layout } from '../../../components/Layout';
import { MetricCard } from '../../../components/ui/MetricCard';
import { TrendAreaChart } from '../../../charts/TrendAreaChart';
import { apiClient } from '../../../api/client';
import type { Patient, Assessment } from '../../../types';

export function BioimpedancePage() {
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
        setError(err instanceof Error ? err.message : 'Erro ao buscar dados de bioimpedância');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const assessments = useMemo(() => patients.flatMap((patient) => patient.assessments ?? []), [patients]);
  const sortedAssessments = useMemo(
    () => [...assessments].sort((a, b) => parseAssessmentDate(a) - parseAssessmentDate(b)),
    [assessments]
  );

  const ffmAverage = useMemo(() => averageMetric(assessments, (assessment) => assessment.ffmKg ?? assessment.metrics?.leanMassKg), [assessments]);
  const tbwAverage = useMemo(() => averageMetric(assessments, (assessment) => assessment.tbwL), [assessments]);
  const phaseAverage = useMemo(() => averageMetric(assessments, (assessment) => assessment.phaseAngleDeg), [assessments]);

  const hydrationAlerts = useMemo(() => {
    return assessments.filter((assessment) => {
      if (!assessment.ecwL || !assessment.tbwL) return false;
      return assessment.ecwL / assessment.tbwL > 0.4;
    }).length;
  }, [assessments]);

  const ffmTrend = sortedAssessments.map((assessment) => ({
    label: assessment.dateTime,
    value: assessment.ffmKg ?? assessment.metrics?.leanMassKg ?? null,
  }));
  const tbwTrend = sortedAssessments.map((assessment) => ({ label: assessment.dateTime, value: assessment.tbwL ?? null }));
  const phaseTrend = sortedAssessments.map((assessment) => ({ label: assessment.dateTime, value: assessment.phaseAngleDeg ?? null }));

  const tableRows = sortedAssessments.slice(-6).reverse();

  return (
    <Layout>
      <div className="rounded-3xl border border-[#e2e0db] bg-white/90 p-6 shadow-sm">
        <p className="text-[11px] uppercase tracking-[0.4em] text-[#7a838b]">Módulo</p>
        <h1 className="mt-2 text-3xl font-semibold text-[#0c2332]">Bioimpedância clínica</h1>
        <p className="mt-2 text-sm text-[#4f5a63]">
          Monitoramento avançado de massa magra, água corporal e equilíbrio celular em tempo real.
        </p>
      </div>

      {error && <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          title="FFM média"
          value={loading ? '...' : ffmAverage ? `${ffmAverage.toFixed(1)} kg` : '—'}
          subtitle="Massa livre de gordura"
          badge={{ label: 'Bioimpedância', tone: 'success' }}
        />
        <MetricCard
          title="Água corporal total"
          value={loading ? '...' : tbwAverage ? `${tbwAverage.toFixed(1)} L` : '—'}
          subtitle="Hidratação sistêmica"
          badge={{ label: 'H2O', tone: 'info' }}
        />
        <MetricCard
          title="Ângulo de fase"
          value={loading ? '...' : phaseAverage ? `${phaseAverage.toFixed(1)}°` : '—'}
          subtitle="Integridade celular"
          badge={{ label: 'Células', tone: 'warning' }}
        />
        <MetricCard
          title="Alertas ECW/TBW"
          value={`${hydrationAlerts}`}
          subtitle="Risco de retenção"
          badge={{ label: hydrationAlerts > 0 ? 'Revisar' : 'Estável', tone: hydrationAlerts > 0 ? 'danger' : 'success' }}
        />
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <div className="rounded-3xl border border-[#e2e0db] bg-white/90 p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-[#0c2332]">FFM</h2>
          <TrendAreaChart data={ffmTrend} color="#35d0a0" title="FFM" />
        </div>
        <div className="rounded-3xl border border-[#e2e0db] bg-white/90 p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-[#0c2332]">Água corporal total</h2>
          <TrendAreaChart data={tbwTrend} color="#a9e9ff" title="Água corporal" />
        </div>
        <div className="rounded-3xl border border-[#e2e0db] bg-white/90 p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-[#0c2332]">Ângulo de fase</h2>
          <TrendAreaChart data={phaseTrend} color="#fb923c" title="Ângulo de fase" />
        </div>
      </div>

      <div className="rounded-3xl border border-[#e2e0db] bg-white/90 p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-[#0c2332]">Registros recentes</h3>
          <span className="text-xs text-[#7a838b]">{tableRows.length} avaliações</span>
        </div>
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-[11px] uppercase tracking-[0.3em] text-[#7a838b]">
                <th className="pb-3 pr-4">Data</th>
                <th className="pb-3 pr-4">FFM</th>
                <th className="pb-3 pr-4">TBW</th>
                <th className="pb-3 pr-4">ECW/TBW</th>
                <th className="pb-3 pr-4">Ângulo</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-6 text-center text-[#7a838b]">
                    Carregando registros...
                  </td>
                </tr>
              ) : tableRows.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-6 text-center text-[#7a838b]">
                    Nenhuma avaliação registrada.
                  </td>
                </tr>
              ) : (
                tableRows.map((assessment) => {
                  const ratio = assessment.ecwL && assessment.tbwL ? assessment.ecwL / assessment.tbwL : null;
                  return (
                    <tr key={assessment.id} className="border-t border-[#f0ede8]">
                      <td className="py-3 pr-4 text-[#0c2332]">{assessment.dateTime}</td>
                      <td className="py-3 pr-4 text-[#0c2332]">{assessment.ffmKg ? `${assessment.ffmKg.toFixed(1)} kg` : '—'}</td>
                      <td className="py-3 pr-4 text-[#0c2332]">{assessment.tbwL ? `${assessment.tbwL.toFixed(1)} L` : '—'}</td>
                      <td className="py-3 pr-4 text-[#0c2332]">{ratio ? ratio.toFixed(2) : '—'}</td>
                      <td className="py-3 pr-4 text-[#0c2332]">{assessment.phaseAngleDeg ? `${assessment.phaseAngleDeg.toFixed(1)} °` : '—'}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}

function averageMetric(assessments: Assessment[], getter: (assessment: Assessment) => number | null | undefined) {
  const values = assessments
    .map(getter)
    .filter((value): value is number => typeof value === 'number' && !Number.isNaN(value));
  if (!values.length) return null;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function parseAssessmentDate(assessment: Assessment) {
  const [day, month, year] = (assessment.dateTime ?? '01/01/1970').split('/').map(Number);
  return new Date(year || 0, (month || 1) - 1, day || 1).getTime();
}
