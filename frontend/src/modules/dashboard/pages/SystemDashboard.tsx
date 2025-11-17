import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Layout } from '../../../components/Layout';
import { MetricCard } from '../../../components/ui/MetricCard';
import { BodyCompositionChart } from '../../../charts/BodyCompositionChart';
import { TrendAreaChart } from '../../../charts/TrendAreaChart';
import { apiClient } from '../../../api/client';
import type { Patient } from '../../../types';
import { calculateAge } from '../../../utils/date';

export function SystemDashboard() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const data = await apiClient.getPatients();
        setPatients(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao carregar pacientes');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const assessments = useMemo(() => patients.flatMap((patient) => patient.assessments ?? []), [patients]);

  const latestAssessments = useMemo(() => {
    return [...assessments].sort((a, b) => getDate(b.dateTime).getTime() - getDate(a.dateTime).getTime()).slice(0, 8);
  }, [assessments]);

  const latestAssessment = latestAssessments[0];
  const latestPatient = latestAssessment ? patients.find((patient) => patient.id === latestAssessment.patientId) : undefined;

  const weightTrend = latestAssessments
    .map((assessment) => ({ label: assessment.dateTime, value: assessment.weightKg ?? null }))
    .reverse();

  const fatTrend = latestAssessments
    .map((assessment) => ({ label: assessment.dateTime, value: assessment.bfPercent ?? null }))
    .reverse();

  const bodyCompData = useMemo(() => {
    if (!latestAssessment) return [];

    const height = latestPatient?.heightM;
    const idealWeight = height ? 22 * height * height : undefined;
    const fatMass = latestAssessment.metrics?.fatMassKg;
    const leanMass = latestAssessment.metrics?.leanMassKg ?? latestAssessment.ffmKg;
    const idealFat = idealWeight && latestAssessment.bfPercent ? (idealWeight * latestAssessment.bfPercent) / 100 : undefined;
    const idealLean = idealWeight && idealFat !== undefined ? idealWeight - idealFat : undefined;

    return [
      {
        label: 'Peso',
        atual: latestAssessment.weightKg ?? null,
        ideal: idealWeight ?? null,
      },
      {
        label: 'Massa gorda',
        atual: fatMass ?? null,
        ideal: idealFat ?? null,
      },
      {
        label: 'Massa magra',
        atual: leanMass ?? null,
        ideal: idealLean ?? null,
      },
    ];
  }, [latestAssessment, latestPatient]);

  const avgBmi = useMemo(() => {
    if (assessments.length === 0) return null;
    const total = assessments.reduce((acc, curr) => acc + (curr.metrics?.bmi ?? 0), 0);
    return total / assessments.length;
  }, [assessments]);

  return (
    <Layout>
      <div className="bg-gradient-to-r from-[#0F172A] to-[#1D2A44] text-white rounded-3xl p-8 shadow-lg">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-white/60">Centro clínico</p>
            <h1 className="text-4xl font-semibold mt-3">Bem-vindo ao painel NutroLab</h1>
            <p className="text-sm text-white/70 mt-3 max-w-2xl">
              Controle total sobre pacientes, avaliações físicas e módulos avançados de composição corporal, tudo em uma única
              experiência profissional.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/patients/new"
              className="bg-white text-[#0F172A] px-5 py-3 rounded-2xl font-semibold shadow-md hover:bg-slate-100"
            >
              + Novo paciente
            </Link>
            <Link
              to="/patients"
              className="border border-white/60 px-5 py-3 rounded-2xl font-semibold text-white/90 hover:bg-white/10"
            >
              Ver pacientes
            </Link>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 border border-red-200 rounded-2xl p-4">{error}</div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
        <MetricCard
          title="Pacientes ativos"
          value={loading ? '...' : patients.length.toString()}
          subtitle="Número total de pacientes cadastrados"
          badge={{ label: 'Estável', tone: 'info' }}
          trend={{ value: '+4', label: 'nos últimos 30 dias', status: 'up' }}
          progress={{ current: patients.length, max: 150, color: 'bg-[#4ADE80]' }}
        />
        <MetricCard
          title="Avaliações registradas"
          value={loading ? '...' : assessments.length.toString()}
          subtitle="Somatório de todas as avaliações físicas"
          badge={{ label: 'On track', tone: 'success' }}
          trend={{ value: '+12', label: 'este mês', status: 'up' }}
          progress={{ current: assessments.length, max: 300, color: 'bg-[#38BDF8]' }}
        />
        <MetricCard
          title="IMC médio"
          value={avgBmi ? avgBmi.toFixed(1) : '—'}
          subtitle="Baseado nos últimos registros"
          badge={{ label: avgBmi && avgBmi > 25 ? 'Atenção' : 'Saudável', tone: avgBmi && avgBmi > 25 ? 'warning' : 'info' }}
        />
        <MetricCard
          title="Último paciente"
          value={latestPatient ? latestPatient.name : '—'}
          subtitle={
            latestPatient
              ? `${calculateAge(latestPatient.birthDate)} anos · ${latestPatient.sex === 'M' ? 'Masculino' : 'Feminino'}`
              : 'Nenhuma avaliação recente'
          }
          badge={{ label: 'Em acompanhamento', tone: 'info' }}
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Tendência</p>
              <h2 className="text-xl font-semibold text-slate-900">Evolução de peso</h2>
            </div>
            <span className="text-xs font-semibold text-emerald-500 bg-emerald-50 px-3 py-1 rounded-full">Tempo real</span>
          </div>
          <TrendAreaChart data={weightTrend} color="#38BDF8" />
        </div>
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Gordura corporal</p>
              <h2 className="text-xl font-semibold text-slate-900">Percentual de gordura</h2>
            </div>
            <span className="text-xs font-semibold text-amber-500 bg-amber-50 px-3 py-1 rounded-full">Monitorado</span>
          </div>
          <TrendAreaChart data={fatTrend} color="#F97316" />
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm xl:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Comparativo</p>
              <h2 className="text-xl font-semibold text-slate-900">Atual x Ideal</h2>
            </div>
            {latestPatient && (
              <div className="text-sm text-slate-500">
                Referência: <span className="font-semibold text-slate-900">{latestPatient.name}</span>
              </div>
            )}
          </div>
          <BodyCompositionChart data={bodyCompData} />
        </div>
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Fluxo rápido</p>
          <h2 className="text-xl font-semibold text-slate-900 mt-2">Próximas ações</h2>
          <ul className="mt-4 space-y-4 text-sm text-slate-600">
            <li className="flex items-start gap-3">
              <span className="h-2.5 w-2.5 rounded-full bg-[#38BDF8] mt-1.5" />
              Revisar avaliações de bioimpedância pendentes
            </li>
            <li className="flex items-start gap-3">
              <span className="h-2.5 w-2.5 rounded-full bg-[#4ADE80] mt-1.5" />
              Preparar relatório premium para os três últimos pacientes
            </li>
            <li className="flex items-start gap-3">
              <span className="h-2.5 w-2.5 rounded-full bg-[#F97316] mt-1.5" />
              Atualizar plano alimentar de atletas em cutting
            </li>
          </ul>
        </div>
      </div>
    </Layout>
  );
}

function getDate(value: string) {
  const [day, month, year] = value.split('/').map(Number);
  return new Date(year || 0, (month || 1) - 1, day || 1);
}
