import { useEffect, useMemo, useState } from 'react';
import { Layout } from '../../../components/Layout';
import { MetricCard } from '../../../components/ui/MetricCard';
import { TrendAreaChart } from '../../../charts/TrendAreaChart';
import { apiClient } from '../../../api/client';
import type { Patient, Assessment } from '../../../types';

export function AnthropometryPage() {
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
        setError(err instanceof Error ? err.message : 'Erro ao carregar antropometria');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const assessments = useMemo(() => patients.flatMap((patient) => patient.assessments ?? []), [patients]);
  const sorted = useMemo(
    () => [...assessments].sort((a, b) => parseAssessmentDate(a.dateTime) - parseAssessmentDate(b.dateTime)),
    [assessments]
  );

  const waistAverage = useMemo(() => average(assessments, (assessment) => assessment.waistCm), [assessments]);
  const hipAverage = useMemo(() => average(assessments, (assessment) => assessment.hipCm), [assessments]);
  const neckAverage = useMemo(() => average(assessments, (assessment) => assessment.neckCm), [assessments]);

  const rcqAlerts = useMemo(() => {
    return assessments.filter((assessment) => {
      if (!assessment.waistCm || !assessment.hipCm) return false;
      return assessment.waistCm / assessment.hipCm > 0.85;
    }).length;
  }, [assessments]);

  const waistTrend = sorted.map((assessment) => ({ label: assessment.dateTime, value: assessment.waistCm ?? null }));
  const hipTrend = sorted.map((assessment) => ({ label: assessment.dateTime, value: assessment.hipCm ?? null }));

  return (
    <Layout>
      <div className="rounded-3xl border border-[#e2e0db] bg-white/90 p-6 shadow-sm">
        <p className="text-[11px] uppercase tracking-[0.4em] text-[#7a838b]">Módulo</p>
        <h1 className="mt-2 text-3xl font-semibold text-[#0c2332]">Antropometria avançada</h1>
        <p className="mt-2 text-sm text-[#4f5a63]">
          Circunferências, proporções e alertas cardiometabólicos com visualização premium.
        </p>
      </div>

      {error && <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          title="Cintura média"
          value={loading ? '...' : waistAverage ? `${waistAverage.toFixed(1)} cm` : '—'}
          subtitle="Risco central"
          badge={{ label: 'Cintura', tone: 'warning' }}
        />
        <MetricCard
          title="Quadril médio"
          value={loading ? '...' : hipAverage ? `${hipAverage.toFixed(1)} cm` : '—'}
          subtitle="Base estrutural"
          badge={{ label: 'Quadril', tone: 'info' }}
        />
        <MetricCard
          title="Pescoço médio"
          value={loading ? '...' : neckAverage ? `${neckAverage.toFixed(1)} cm` : '—'}
          subtitle="Apneia e risco"
          badge={{ label: 'Pescoço', tone: 'success' }}
        />
        <MetricCard
          title="Alertas RCQ"
          value={`${rcqAlerts}`}
          subtitle="Acima do ideal"
          badge={{ label: rcqAlerts > 0 ? 'Investigar' : 'Estável', tone: rcqAlerts > 0 ? 'danger' : 'info' }}
        />
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <div className="rounded-3xl border border-[#e2e0db] bg-white/90 p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-[#0c2332]">Evolução da cintura</h2>
          <TrendAreaChart data={waistTrend} color="#fb923c" title="Cintura" />
        </div>
        <div className="rounded-3xl border border-[#e2e0db] bg-white/90 p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-[#0c2332]">Evolução do quadril</h2>
          <TrendAreaChart data={hipTrend} color="#35d0a0" title="Quadril" />
        </div>
      </div>

      <div className="rounded-3xl border border-[#e2e0db] bg-white/90 p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-[#0c2332]">Últimas medições</h3>
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-[11px] uppercase tracking-[0.3em] text-[#7a838b]">
                <th className="pb-3 pr-4">Data</th>
                <th className="pb-3 pr-4">Cintura</th>
                <th className="pb-3 pr-4">Quadril</th>
                <th className="pb-3 pr-4">Pescoço</th>
                <th className="pb-3 pr-4">RCQ</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-6 text-center text-[#7a838b]">
                    Carregando medições...
                  </td>
                </tr>
              ) : sorted.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-6 text-center text-[#7a838b]">
                    Nenhum registro encontrado.
                  </td>
                </tr>
              ) : (
                sorted.slice(-8).reverse().map((assessment) => {
                  const rcq = assessment.waistCm && assessment.hipCm ? assessment.waistCm / assessment.hipCm : null;
                  return (
                    <tr key={assessment.id} className="border-t border-[#f0ede8]">
                      <td className="py-3 pr-4 text-[#0c2332]">{assessment.dateTime}</td>
                      <td className="py-3 pr-4 text-[#0c2332]">{assessment.waistCm ? `${assessment.waistCm.toFixed(1)} cm` : '—'}</td>
                      <td className="py-3 pr-4 text-[#0c2332]">{assessment.hipCm ? `${assessment.hipCm.toFixed(1)} cm` : '—'}</td>
                      <td className="py-3 pr-4 text-[#0c2332]">{assessment.neckCm ? `${assessment.neckCm.toFixed(1)} cm` : '—'}</td>
                      <td className="py-3 pr-4 text-[#0c2332]">{rcq ? rcq.toFixed(2) : '—'}</td>
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
