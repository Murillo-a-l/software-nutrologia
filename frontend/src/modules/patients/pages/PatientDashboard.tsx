import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Layout } from '../../../components/Layout';
import { MetricCard } from '../../../components/ui/MetricCard';
import { BodyCompositionChart } from '../../../charts/BodyCompositionChart';
import { TrendAreaChart } from '../../../charts/TrendAreaChart';
import { apiClient } from '../../../api/client';
import type { Assessment, Patient } from '../../../types';
import { calculateAge } from '../../../utils/date';

export function PatientDashboard() {
  const { id } = useParams<{ id: string }>();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const load = async () => {
      try {
        setLoading(true);
        const [patientData, assessmentData] = await Promise.all([
          apiClient.getPatientById(id),
          apiClient.getAssessmentsByPatientId(id),
        ]);
        setPatient(patientData);
        setAssessments(assessmentData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao carregar paciente');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id]);

  const latestAssessment = useMemo(() => {
    if (assessments.length === 0) return undefined;
    return [...assessments].sort((a, b) => getDate(b.dateTime).getTime() - getDate(a.dateTime).getTime())[0];
  }, [assessments]);
  const sortedAssessments = useMemo(() => {
    return [...assessments].sort((a, b) => getDate(a.dateTime).getTime() - getDate(b.dateTime).getTime());
  }, [assessments]);

  const weightTrend = sortedAssessments.map((assessment) => ({
    label: assessment.dateTime,
    value: assessment.weightKg ?? null,
  }));

  const fatTrend = sortedAssessments.map((assessment) => ({
    label: assessment.dateTime,
    value: assessment.bfPercent ?? null,
  }));

  const leanTrend = sortedAssessments.map((assessment) => ({
    label: assessment.dateTime,
    value: assessment.metrics?.leanMassKg ?? assessment.ffmKg ?? null,
  }));

  const bmi = useMemo(() => {
    if (latestAssessment?.metrics?.bmi) return latestAssessment.metrics.bmi;
    if (!latestAssessment?.weightKg || !patient?.heightM) return null;
    return latestAssessment.weightKg / (patient.heightM * patient.heightM);
  }, [latestAssessment, patient?.heightM]);

  const bodyCompData = useMemo(() => {
    const height = patient?.heightM;
    const idealWeight = height ? 22 * height * height : undefined;
    const fatMass = latestAssessment?.metrics?.fatMassKg;
    const leanMass = latestAssessment?.metrics?.leanMassKg ?? latestAssessment?.ffmKg;
    const idealFat = idealWeight && latestAssessment?.bfPercent ? (idealWeight * latestAssessment.bfPercent) / 100 : undefined;
    const idealLean = idealWeight && idealFat !== undefined ? idealWeight - idealFat : undefined;

    return [
      { label: 'Peso', atual: latestAssessment?.weightKg ?? null, ideal: idealWeight ?? null },
      { label: 'Massa gorda', atual: fatMass ?? null, ideal: idealFat ?? null },
      { label: 'Massa magra', atual: leanMass ?? null, ideal: idealLean ?? null },
    ];
  }, [latestAssessment, patient?.heightM]);

  const bmiCategory = getBmiCategory(bmi);
  const leanMass = latestAssessment?.metrics?.leanMassKg ?? latestAssessment?.ffmKg ?? null;
  const fatMass = latestAssessment?.metrics?.fatMassKg ?? null;

  return (
    <Layout>
      {error && <div className="bg-red-50 border border-red-200 text-red-700 rounded-2xl p-4">{error}</div>}

      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col gap-6">
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-slate-400">Paciente</p>
            <h1 className="text-3xl font-semibold text-slate-900">{patient?.name ?? 'Carregando...'}</h1>
            <p className="text-sm text-slate-500 mt-2">
              {patient ? `${calculateAge(patient.birthDate)} anos · ${patient.sex === 'M' ? 'Masculino' : 'Feminino'} · ${
                patient.heightM?.toFixed(2) ?? '--'
              } m` : '...'}
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link to="/patients" className="border border-slate-200 px-4 py-2 rounded-2xl font-semibold text-slate-600">
              Voltar
            </Link>
            {patient && (
              <Link
                to={`/patients/${patient.id}/assessments/new`}
                className="bg-[#38BDF8] text-white px-5 py-2.5 rounded-2xl font-semibold shadow-sm"
              >
                Registrar avaliação
              </Link>
            )}
          </div>
        </div>

        {latestAssessment && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricCard
              title="IMC"
              value={bmi ? bmi.toFixed(1) : '—'}
              subtitle={`Categoria: ${bmiCategory}`}
              badge={{ label: bmiCategory, tone: bmi && bmi > 25 ? 'warning' : 'info' }}
              progress={{ current: bmi ?? 0, max: 40, color: 'bg-[#38BDF8]' }}
            />
            <MetricCard
              title="% Gordura"
              value={latestAssessment.bfPercent ? `${latestAssessment.bfPercent.toFixed(1)}%` : '—'}
              subtitle="Distribuição atual"
              badge={{ label: 'Monitorado', tone: 'warning' }}
              progress={{ current: latestAssessment.bfPercent ?? 0, max: 50, color: 'bg-[#FACC15]' }}
            />
            <MetricCard
              title="Massa gorda"
              value={fatMass ? `${fatMass.toFixed(1)} kg` : '—'}
              subtitle="Resultado da última avaliação"
              badge={{ label: 'Composição', tone: 'danger' }}
            />
            <MetricCard
              title="Massa magra"
              value={leanMass ? `${leanMass.toFixed(1)} kg` : '—'}
              subtitle="Bioimpedância"
              badge={{ label: 'Meta', tone: 'success' }}
              progress={{ current: leanMass ?? 0, max: 80, color: 'bg-[#22C55E]' }}
            />
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm xl:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Tendência</p>
              <h2 className="text-xl font-semibold text-slate-900">Histórico corporal</h2>
            </div>
            <span className="text-xs font-semibold text-emerald-500 bg-emerald-50 px-3 py-1 rounded-full">Atualizado</span>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <p className="text-sm font-semibold text-slate-600 mb-2">Peso (kg)</p>
              <TrendAreaChart data={weightTrend} color="#38BDF8" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-600 mb-2">% Gordura</p>
              <TrendAreaChart data={fatTrend} color="#FB923C" />
            </div>
            <div className="lg:col-span-2">
              <p className="text-sm font-semibold text-slate-600 mb-2">Massa magra</p>
              <TrendAreaChart data={leanTrend} color="#22C55E" />
            </div>
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Comparativo</p>
          <h2 className="text-xl font-semibold text-slate-900 mt-2">Atual x Ideal</h2>
          <BodyCompositionChart data={bodyCompData} />
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Histórico</p>
            <h2 className="text-xl font-semibold text-slate-900">Avaliações registradas</h2>
          </div>
          {patient && (
            <Link to={`/patients/${patient.id}/assessments/new`} className="text-sm font-semibold text-[#38BDF8]">
              Nova avaliação
            </Link>
          )}
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-[11px] uppercase tracking-[0.2em] text-slate-400 border-b border-slate-200">
                <th className="py-3 pr-4">Data</th>
                <th className="py-3 pr-4">Peso</th>
                <th className="py-3 pr-4">% Gordura</th>
                <th className="py-3 pr-4">IMC</th>
                <th className="py-3 pr-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {assessments.map((assessment) => (
                <tr key={assessment.id} className="hover:bg-slate-50">
                  <td className="py-3 pr-4 font-medium text-slate-900">{assessment.dateTime}</td>
                  <td className="py-3 pr-4 text-slate-600">{assessment.weightKg?.toFixed(1) ?? '—'} kg</td>
                  <td className="py-3 pr-4 text-slate-600">{assessment.bfPercent?.toFixed(1) ?? '—'}%</td>
                  <td className="py-3 pr-4 text-slate-600">{assessment.metrics?.bmi?.toFixed(1) ?? '—'}</td>
                  <td className="py-3 pr-4">
                    <Link to={`/assessments/${assessment.id}`} className="text-[#0F172A] font-semibold">
                      Ver detalhes
                    </Link>
                  </td>
                </tr>
              ))}
              {assessments.length === 0 && !loading && (
                <tr>
                  <td colSpan={5} className="py-6 text-center text-slate-500">
                    Nenhuma avaliação registrada ainda.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}

function getBmiCategory(bmi: number | null | undefined) {
  if (!bmi) return '—';
  if (bmi < 18.5) return 'Baixo peso';
  if (bmi < 25) return 'Eutrófico';
  if (bmi < 30) return 'Sobrepeso';
  return 'Obesidade';
}

function getDate(value: string) {
  const [day, month, year] = value.split('/').map(Number);
  return new Date(year || 0, (month || 1) - 1, day || 1);
}
