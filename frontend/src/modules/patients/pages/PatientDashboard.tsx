import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Layout } from '../../../components/Layout';
import { MetricCard } from '../../../components/ui/MetricCard';
import { BodyCompositionChart } from '../../../charts/BodyCompositionChart';
import { TrendAreaChart } from '../../../charts/TrendAreaChart';
import { DonutCompositionChart } from '../../../charts/DonutCompositionChart';
import { RadarComparisonChart } from '../../../charts/RadarComparisonChart';
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
    return [...assessments].sort((a, b) => parseDate(b.dateTime).getTime() - parseDate(a.dateTime).getTime())[0];
  }, [assessments]);
  const sortedAssessments = useMemo(() => {
    return [...assessments].sort((a, b) => parseDate(a.dateTime).getTime() - parseDate(b.dateTime).getTime());
  }, [assessments]);

  const weightTrend = sortedAssessments.map((assessment) => ({ label: assessment.dateTime, value: assessment.weightKg ?? null }));
  const fatTrend = sortedAssessments.map((assessment) => ({ label: assessment.dateTime, value: assessment.bfPercent ?? null }));
  const leanTrend = sortedAssessments.map((assessment) => ({ label: assessment.dateTime, value: assessment.metrics?.leanMassKg ?? assessment.ffmKg ?? null }));
  const waistTrend = sortedAssessments.map((assessment) => ({ label: assessment.dateTime, value: assessment.waistCm ?? null }));

  const height = patient?.heightM ?? null;
  const weight = latestAssessment?.weightKg ?? null;
  const bmi = useMemo(() => {
    if (latestAssessment?.metrics?.bmi) return latestAssessment.metrics.bmi;
    if (!weight || !height) return null;
    return weight / (height * height);
  }, [latestAssessment, weight, height]);

  const idealWeight = height ? 22 * height * height : null;
  const idealBfPercent = patient?.sex === 'M' ? 15 : patient?.sex === 'F' ? 23 : 20;
  const fatMass =
    latestAssessment?.metrics?.fatMassKg ??
    (weight && latestAssessment?.bfPercent ? (weight * latestAssessment.bfPercent) / 100 : null);
  const leanMass = latestAssessment?.metrics?.leanMassKg ?? latestAssessment?.ffmKg ?? null;
  const idealFat = idealWeight ? (idealWeight * idealBfPercent) / 100 : null;
  const idealLean = idealWeight && idealFat !== null ? idealWeight - idealFat : null;

  const bodyCompData = useMemo(() => {
    return [
      { label: 'Peso', atual: weight ?? null, ideal: idealWeight ?? null },
      { label: 'Massa gorda', atual: fatMass ?? null, ideal: idealFat ?? null },
      { label: 'Massa magra', atual: leanMass ?? null, ideal: idealLean ?? null },
    ];
  }, [weight, fatMass, leanMass, idealWeight, idealFat, idealLean]);

  const bmiCategory = getBmiCategory(bmi);
  const tdee = latestAssessment?.metrics?.tdee;
  const waist = latestAssessment?.waistCm;
  const hip = latestAssessment?.hipCm;
  const rca = waist && height ? waist / (height * 100) : null;
  const rcq = waist && hip ? waist / hip : null;
  const bfPercent = latestAssessment?.bfPercent ?? null;

  const radarData = useMemo(
    () => [
      { label: 'IMC', atual: bmi, ideal: 22 },
      { label: '% Gordura', atual: bfPercent, ideal: idealBfPercent },
      { label: 'Massa magra', atual: leanMass, ideal: idealLean },
      { label: 'TDEE', atual: tdee, ideal: tdee ? tdee * 0.95 : null },
    ],
    [bmi, bfPercent, idealBfPercent, leanMass, idealLean, tdee]
  );

  const donutData = useMemo(
    () => [
      { label: 'Massa gorda', value: fatMass, color: '#fb923c' },
      { label: 'Massa magra', value: leanMass, color: '#35d0a0' },
    ],
    [fatMass, leanMass]
  );

  const bioHistory = useMemo(() => sortedAssessments.slice(-5).reverse(), [sortedAssessments]);
  const skinfoldHistory = useMemo(() => sortedAssessments.slice(-5).reverse(), [sortedAssessments]);

  const prescriptions = useMemo(() => {
    const recommendations: string[] = [];
    if (bmi && bmi > 25) recommendations.push('Implementar déficit calórico controlado (-15%) com reforço proteico.');
    if (latestAssessment?.metrics?.cardiometabolicRiskLevel?.includes('ALTO')) {
      recommendations.push('Solicitar painel cardiometabólico completo e revisar antihipertensivos.');
    }
    if (latestAssessment?.metrics?.redsRiskLevel?.includes('ALTO')) {
      recommendations.push('Avaliar disponibilidade energética e suplementação para RED-S.');
    }
    if (!recommendations.length) {
      recommendations.push('Manter plano atual e revisar em 30 dias com nova bioimpedância.');
    }
    return recommendations;
  }, [bmi, latestAssessment]);

  const macroPlan = useMemo(() => {
    if (!tdee || !weight) return null;
    const targetCalories = Math.round(tdee * 0.85);
    const protein = Math.round(weight * 1.8);
    const fats = Math.round((targetCalories * 0.25) / 9);
    const carbs = Math.max(Math.round((targetCalories - protein * 4 - fats * 9) / 4), 0);
    return { calories: targetCalories, protein, fats, carbs };
  }, [tdee, weight]);

  return (
    <Layout>
      {error && <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

      <div className="rounded-3xl border border-[#e2e0db] bg-white/90 p-6 shadow-sm">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-[11px] uppercase tracking-[0.4em] text-[#7a838b]">Paciente</p>
            <h1 className="mt-2 text-3xl font-semibold text-[#0c2332]">{patient?.name ?? 'Carregando...'}</h1>
            <p className="mt-2 text-sm text-[#4f5a63]">
              {patient
                ? `${calculateAge(patient.birthDate)} anos · ${patient.sex === 'M' ? 'Masculino' : 'Feminino'} · ${patient.heightM?.toFixed(2) ?? '--'} m`
                : '—'}
            </p>
            <p className="text-xs text-[#7a838b]">Última avaliação: {latestAssessment?.dateTime ?? '—'}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link to="/patients" className="rounded-2xl border border-[#e2e0db] px-5 py-2.5 text-sm font-semibold text-[#4f5a63]">
              Voltar
            </Link>
            {patient && (
              <Link
                to={`/patients/${patient.id}/assessments/new`}
                className="rounded-2xl bg-[#35d0a0] px-5 py-2.5 text-sm font-semibold text-white shadow-sm"
              >
                Registrar avaliação
              </Link>
            )}
            {patient && (
              <Link
                to={`/patients/${patient.id}`}
                className="rounded-2xl border border-[#e2e0db] px-5 py-2.5 text-sm font-semibold text-[#4f5a63]"
              >
                Abrir prontuário
              </Link>
            )}
          </div>
        </div>
      </div>

      {latestAssessment && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">
          <MetricCard
            title="IMC"
            value={bmi ? bmi.toFixed(1) : '—'}
            subtitle={`Categoria: ${bmiCategory}`}
            badge={{ label: bmiCategory, tone: bmi && bmi > 25 ? 'warning' : 'info' }}
            progress={{ current: bmi ?? 0, max: 40, color: 'bg-[#a9e9ff]' }}
          />
          <MetricCard
            title="% Gordura"
            value={latestAssessment.bfPercent ? `${latestAssessment.bfPercent.toFixed(1)}%` : '—'}
            subtitle="Distribuição atual"
            badge={{ label: 'Monitorado', tone: 'warning' }}
            progress={{ current: latestAssessment.bfPercent ?? 0, max: 50, color: 'bg-[#fb923c]' }}
          />
          <MetricCard
            title="Massa magra"
            value={leanMass ? `${leanMass.toFixed(1)} kg` : '—'}
            subtitle="Bioimpedância"
            badge={{ label: 'Meta', tone: 'success' }}
            progress={{ current: leanMass ?? 0, max: 80, color: 'bg-[#35d0a0]' }}
          />
          <MetricCard
            title="TDEE"
            value={tdee ? `${Math.round(tdee)} kcal` : '—'}
            subtitle="Equação automatizada"
            badge={{ label: 'Energia', tone: 'info' }}
          />
        </div>
      )}

      {latestAssessment && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            title="RCA"
            value={rca ? rca.toFixed(2) : '—'}
            subtitle="Risco cintura/altura"
            badge={{ label: rca && rca > 0.53 ? 'Alto' : 'Seguro', tone: rca && rca > 0.53 ? 'warning' : 'success' }}
          />
          <MetricCard
            title="RCQ"
            value={rcq ? rcq.toFixed(2) : '—'}
            subtitle="Distribuição abdominal"
            badge={{ label: rcq && rcq > 0.85 ? 'Atenção' : 'Adequado', tone: rcq && rcq > 0.85 ? 'warning' : 'info' }}
          />
          <MetricCard
            title="Idade metabólica"
            value={latestAssessment.metrics?.metabolicAgeYears ? `${latestAssessment.metrics.metabolicAgeYears} anos` : '—'}
            subtitle="Comparativo corporal"
            badge={{ label: 'Metabolismo', tone: 'info' }}
          />
          <MetricCard
            title="Score cardiometabólico"
            value={latestAssessment.metrics?.cardiometabolicScore?.toFixed(0) ?? '—'}
            subtitle={latestAssessment.metrics?.cardiometabolicRiskLevel ?? 'Sem risco'}
            badge={{ label: 'Clínico', tone: 'warning' }}
          />
          <MetricCard
            title="Score RED-S"
            value={latestAssessment.metrics?.redsScore?.toFixed(0) ?? '—'}
            subtitle={latestAssessment.metrics?.redsRiskLevel ?? 'Sem alerta'}
            badge={{ label: 'Performance', tone: 'danger' }}
          />
        </div>
      )}

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
        <div className="rounded-3xl border border-[#e2e0db] bg-white/90 p-6 shadow-sm xl:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-[#0c2332]">Evolução corporal</h2>
            <span className="text-xs text-[#7a838b]">Linhas temporais</span>
          </div>
          <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div>
              <p className="text-sm font-semibold text-[#4f5a63]">Peso (kg)</p>
              <TrendAreaChart data={weightTrend} color="#a9e9ff" title="Peso" />
            </div>
            <div>
              <p className="text-sm font-semibold text-[#4f5a63]">% Gordura</p>
              <TrendAreaChart data={fatTrend} color="#fb923c" title="% Gordura" />
            </div>
            <div>
              <p className="text-sm font-semibold text-[#4f5a63]">Massa magra</p>
              <TrendAreaChart data={leanTrend} color="#35d0a0" title="Massa magra" />
            </div>
            <div>
              <p className="text-sm font-semibold text-[#4f5a63]">Cintura (cm)</p>
              <TrendAreaChart data={waistTrend} color="#0c2332" title="Cintura" />
            </div>
          </div>
        </div>
        <div className="space-y-5">
          <div className="rounded-3xl border border-[#e2e0db] bg-white/90 p-6 shadow-sm">
            <p className="text-[11px] uppercase tracking-[0.4em] text-[#7a838b]">Comparativo</p>
            <h2 className="mt-2 text-xl font-semibold text-[#0c2332]">Atual x Ideal</h2>
            <BodyCompositionChart data={bodyCompData} />
          </div>
          <div className="rounded-3xl border border-[#e2e0db] bg-white/90 p-6 shadow-sm">
            <p className="text-sm font-semibold text-[#0c2332]">Distribuição corporal</p>
            <DonutCompositionChart data={donutData} />
          </div>
          <div className="rounded-3xl border border-[#e2e0db] bg-white/90 p-6 shadow-sm">
            <p className="text-sm font-semibold text-[#0c2332]">Radar biométrico</p>
            <RadarComparisonChart data={radarData} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <div className="rounded-3xl border border-[#e2e0db] bg-white/90 p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-[#0c2332]">Dados clínicos</h3>
          <dl className="mt-4 space-y-3 text-sm text-[#4f5a63]">
            {[
              { label: 'Categoria IMC', value: bmiCategory },
              { label: 'Risco cintura/altura', value: rca ? (rca > 0.53 ? 'Alto' : 'Adequado') : '—' },
              { label: 'Risco cintura/quadril', value: rcq ? (rcq > 0.85 ? 'Elevado' : 'Controlado') : '—' },
              { label: 'Cardiometabólico', value: latestAssessment?.metrics?.cardiometabolicRiskLevel ?? '—' },
              { label: 'RED-S', value: latestAssessment?.metrics?.redsRiskLevel ?? '—' },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between">
                <dt>{item.label}</dt>
                <dd className="font-semibold text-[#0c2332]">{item.value}</dd>
              </div>
            ))}
          </dl>
        </div>
        <div className="rounded-3xl border border-[#e2e0db] bg-white/90 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-[#0c2332]">Bioimpedância histórica</h3>
            {patient && (
              <Link to={`/patients/${patient.id}/assessments/new`} className="text-sm font-semibold text-[#35d0a0]">
                Nova avaliação
              </Link>
            )}
          </div>
          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left text-[11px] uppercase tracking-[0.3em] text-[#7a838b]">
                  <th className="pb-3 pr-4">Data</th>
                  <th className="pb-3 pr-4">FFM</th>
                  <th className="pb-3 pr-4">TBW</th>
                  <th className="pb-3 pr-4">Ângulo de fase</th>
                </tr>
              </thead>
              <tbody>
                {bioHistory.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-6 text-center text-[#7a838b]">
                      Sem registros de bioimpedância.
                    </td>
                  </tr>
                ) : (
                  bioHistory.map((assessment) => (
                    <tr key={assessment.id} className="border-t border-[#f0ede8]">
                      <td className="py-3 pr-4 text-[#0c2332]">{assessment.dateTime}</td>
                      <td className="py-3 pr-4 text-[#0c2332]">{assessment.ffmKg ? `${assessment.ffmKg.toFixed(1)} kg` : '—'}</td>
                      <td className="py-3 pr-4 text-[#0c2332]">{assessment.tbwL ? `${assessment.tbwL.toFixed(1)} L` : '—'}</td>
                      <td className="py-3 pr-4 text-[#0c2332]">{assessment.phaseAngleDeg ? `${assessment.phaseAngleDeg.toFixed(1)} °` : '—'}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <div className="rounded-3xl border border-[#e2e0db] bg-white/90 p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-[#0c2332]">Dobras & adipometria</h3>
          <ul className="mt-4 space-y-3 text-sm text-[#4f5a63]">
            {skinfoldHistory.length === 0 && <li>Nenhum protocolo JP7/JP3 registrado ainda.</li>}
            {skinfoldHistory.map((assessment) => (
              <li key={assessment.id} className="flex items-center justify-between border-b border-[#f0ede8] pb-2 last:border-none last:pb-0">
                <div>
                  <p className="font-semibold text-[#0c2332]">{assessment.dateTime}</p>
                  <p className="text-xs text-[#7a838b]">{assessment.metrics?.bmiCategory ?? 'Dobras em acompanhamento'}</p>
                </div>
                <span className="text-sm font-semibold text-[#fb923c]">{assessment.bfPercent ? `${assessment.bfPercent.toFixed(1)}%` : '—'}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-3xl border border-[#e2e0db] bg-white/90 p-6 shadow-sm space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-[#0c2332]">Prescrições recentes</h3>
            <ul className="mt-4 space-y-2 text-sm text-[#4f5a63]">
              {prescriptions.map((item, index) => (
                <li key={index} className="rounded-2xl border border-[#f0ede8] bg-white/70 px-4 py-2">{item}</li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-[#0c2332]">Plano alimentar sugerido</h3>
            {macroPlan ? (
              <dl className="mt-4 grid grid-cols-2 gap-3 text-sm text-[#4f5a63]">
                <div>
                  <dt>Calorias alvo</dt>
                  <dd className="font-semibold text-[#0c2332]">{macroPlan.calories} kcal</dd>
                </div>
                <div>
                  <dt>Proteína</dt>
                  <dd className="font-semibold text-[#0c2332]">{macroPlan.protein} g</dd>
                </div>
                <div>
                  <dt>Carboidratos</dt>
                  <dd className="font-semibold text-[#0c2332]">{macroPlan.carbs} g</dd>
                </div>
                <div>
                  <dt>Gorduras</dt>
                  <dd className="font-semibold text-[#0c2332]">{macroPlan.fats} g</dd>
                </div>
              </dl>
            ) : (
              <p className="mt-2 text-sm text-[#7a838b]">Informe TDEE e peso para gerar o plano energético.</p>
            )}
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-[#e2e0db] bg-white/90 p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-[#0c2332]">Histórico de avaliações</h3>
          {patient && (
            <Link to={`/patients/${patient.id}/assessments/new`} className="text-sm font-semibold text-[#35d0a0]">
              Nova avaliação
            </Link>
          )}
        </div>
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-[11px] uppercase tracking-[0.3em] text-[#7a838b]">
                <th className="pb-3 pr-4">Data</th>
                <th className="pb-3 pr-4">Peso</th>
                <th className="pb-3 pr-4">% Gordura</th>
                <th className="pb-3 pr-4">Massa magra</th>
                <th className="pb-3 pr-4">TDEE</th>
                <th className="pb-3 pr-4">Ações</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-6 text-center text-[#7a838b]">
                    Carregando histórico...
                  </td>
                </tr>
              ) : assessments.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-6 text-center text-[#7a838b]">
                    Nenhuma avaliação registrada.
                  </td>
                </tr>
              ) : (
                assessments.map((assessment) => (
                  <tr key={assessment.id} className="border-t border-[#f0ede8]">
                    <td className="py-3 pr-4 text-[#0c2332]">{assessment.dateTime}</td>
                    <td className="py-3 pr-4 text-[#0c2332]">{assessment.weightKg ? `${assessment.weightKg.toFixed(1)} kg` : '—'}</td>
                    <td className="py-3 pr-4 text-[#0c2332]">{assessment.bfPercent ? `${assessment.bfPercent.toFixed(1)}%` : '—'}</td>
                    <td className="py-3 pr-4 text-[#0c2332]">
                      {assessment.metrics?.leanMassKg ?? assessment.ffmKg
                        ? `${(assessment.metrics?.leanMassKg ?? assessment.ffmKg)?.toFixed(1)} kg`
                        : '—'}
                    </td>
                    <td className="py-3 pr-4 text-[#0c2332]">{assessment.metrics?.tdee ? `${Math.round(assessment.metrics.tdee)} kcal` : '—'}</td>
                    <td className="py-3 pr-4">
                      <Link to={`/assessments/${assessment.id}`} className="text-xs font-semibold text-[#35d0a0]">
                        Abrir
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}

function parseDate(value?: string) {
  const safe = value ?? '01/01/1970';
  const [day, month, year] = safe.split('/').map(Number);
  return new Date(year || 0, (month || 1) - 1, day || 1);
}

function getBmiCategory(bmi: number | null) {
  if (!bmi) return '—';
  if (bmi < 18.5) return 'Magreza';
  if (bmi < 25) return 'Adequado';
  if (bmi < 30) return 'Sobrepeso';
  if (bmi < 35) return 'Obesidade I';
  if (bmi < 40) return 'Obesidade II';
  return 'Obesidade III';
}
