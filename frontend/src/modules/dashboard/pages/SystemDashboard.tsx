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

import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Layout } from '../../../components/Layout';
import { MetricCard } from '../../../components/ui/MetricCard';
import { BodyCompositionChart } from '../../../charts/BodyCompositionChart';
import { TrendAreaChart } from '../../../charts/TrendAreaChart';
import { apiClient } from '../../../api/client';
import type { Patient } from '../../../types';
import { calculateAge, getCurrentDateBrazilian } from '../../../utils/date';
import { ArrowRight, Sparkles } from 'lucide-react';

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

  const todayLabel = getCurrentDateBrazilian();
  const todaysPatients = useMemo(() => {
    return assessments
      .filter((assessment) => assessment.dateTime === todayLabel)
      .map((assessment) => patients.find((patient) => patient.id === assessment.patientId))
      .filter(Boolean) as Patient[];
  }, [assessments, patients, todayLabel]);

  const latestAssessments = useMemo(() => {
    return [...assessments].sort((a, b) => parseDate(b.dateTime).getTime() - parseDate(a.dateTime).getTime()).slice(0, 8);
  }, [assessments]);

  const upcomingAssessments = useMemo(() => {
    const now = new Date();
    const scheduled = assessments
      .map((assessment) => ({
        assessment,
        patient: patients.find((patient) => patient.id === assessment.patientId),
      }))
      .filter((entry) => parseDate(entry.assessment.dateTime).getTime() >= now.getTime());

    if (scheduled.length === 0) {
      return latestAssessments.map((assessment) => ({
        assessment,
        patient: patients.find((patient) => patient.id === assessment.patientId),
      }));
    }

    return scheduled
      .sort((a, b) => parseDate(a.assessment.dateTime).getTime() - parseDate(b.assessment.dateTime).getTime())
      .slice(0, 4);
  }, [assessments, patients, latestAssessments]);

  const latestAssessment = latestAssessments[0];
  const latestPatient = latestAssessment ? patients.find((patient) => patient.id === latestAssessment.patientId) : undefined;

  const weightTrend = latestAssessments
    .map((assessment) => ({ label: assessment.dateTime, value: assessment.weightKg ?? null }))
    .reverse();

  const fatTrend = latestAssessments
    .map((assessment) => ({ label: assessment.dateTime, value: assessment.bfPercent ?? null }))
    .reverse();

  const leanTrend = latestAssessments
    .map((assessment) => ({ label: assessment.dateTime, value: assessment.metrics?.leanMassKg ?? assessment.ffmKg ?? null }))
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
      { label: 'Peso', atual: latestAssessment.weightKg ?? null, ideal: idealWeight ?? null },
      { label: 'Massa gorda', atual: fatMass ?? null, ideal: idealFat ?? null },
      { label: 'Massa magra', atual: leanMass ?? null, ideal: idealLean ?? null },
    ];
  }, [latestAssessment, latestPatient]);

  const avgBmi = useMemo(() => {
    if (assessments.length === 0) return null;
    const total = assessments.reduce((acc, curr) => acc + (curr.metrics?.bmi ?? 0), 0);
    return total / assessments.length;
  }, [assessments]);

  const avgBf = useMemo(() => {
    const values = assessments.map((item) => item.bfPercent).filter((value): value is number => typeof value === 'number');
    if (!values.length) return null;
    return values.reduce((acc, curr) => acc + curr, 0) / values.length;
  }, [assessments]);

  const avgMetabolicAge = useMemo(() => {
    const values = assessments
      .map((assessment) => assessment.metrics?.metabolicAgeYears)
      .filter((value): value is number => typeof value === 'number');
    if (!values.length) return null;
    return values.reduce((acc, curr) => acc + curr, 0) / values.length;
  }, [assessments]);

  const newThisMonth = useMemo(() => {
    const now = new Date();
    const month = now.getMonth();
    const year = now.getFullYear();
    return patients.filter((patient) => {
      if (!patient.createdAt) return false;
      const created = new Date(patient.createdAt);
      return created.getMonth() === month && created.getFullYear() === year;
    }).length;
  }, [patients]);

  return (
    <Layout>
      <div className="rounded-3xl bg-gradient-to-r from-[#0c2332] via-[#12354a] to-[#1f608b] p-8 text-white shadow-lg">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-[11px] uppercase tracking-[0.45em] text-white/60">Painel mestre</p>
            <h1 className="mt-2 text-4xl font-semibold tracking-tight">Bem-vindo ao AntropoMax</h1>
            <p className="mt-3 max-w-2xl text-sm text-white/75">
              Monitoramento clínico completo dos módulos de avaliação física, bioimpedância, nutrição e relatórios premium.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                to="/patients/new"
                className="inline-flex items-center gap-2 rounded-2xl bg-white/95 px-5 py-2.5 text-sm font-semibold text-[#0c2332] shadow-sm"
              >
                <Sparkles className="h-4 w-4" /> Novo paciente
              </Link>
              <Link to="/assessments/workspace" className="inline-flex items-center gap-2 rounded-2xl border border-white/40 px-5 py-2.5 text-sm font-semibold text-white">
                <ArrowRight className="h-4 w-4" /> Abrir wizard
              </Link>
            </div>
          </div>
          <div className="rounded-2xl border border-white/20 bg-white/10 p-4 text-sm">
            <p className="text-white/70">Pacientes agendados hoje</p>
            <p className="text-3xl font-semibold">{todaysPatients.length}</p>
            <p className="text-xs text-white/60">{todayLabel}</p>
          </div>
        </div>
      </div>

      {error && <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          title="Pacientes ativos"
          value={loading ? '...' : patients.length.toString()}
          subtitle="Total de prontuários em acompanhamento"
          badge={{ label: 'Clínica', tone: 'info' }}
          trend={{ value: `+${newThisMonth}`, label: 'no mês', status: 'up' }}
          progress={{ current: patients.length, max: 200, color: 'bg-[#35d0a0]' }}
        />
        <MetricCard
          title="Avaliações registradas"
          value={loading ? '...' : assessments.length.toString()}
          subtitle="Histórico consolidado"
          badge={{ label: 'Premium', tone: 'success' }}
          trend={{ value: '+12', label: 'últimos 30 dias', status: 'up' }}
          progress={{ current: assessments.length, max: 400, color: 'bg-[#a9e9ff]' }}
        />
        <MetricCard
          title="IMC médio"
          value={avgBmi ? avgBmi.toFixed(1) : '—'}
          subtitle="Baseado em todas as avaliações"
          badge={{ label: avgBmi && avgBmi > 25 ? 'Atenção' : 'Saudável', tone: avgBmi && avgBmi > 25 ? 'warning' : 'info' }}
        />
        <MetricCard
          title="% Gordura médio"
          value={avgBf ? `${avgBf.toFixed(1)}%` : '—'}
          subtitle="Tendência corporativa"
          badge={{ label: 'Monitorado', tone: 'warning' }}
        />
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
        <div className="rounded-3xl border border-[#e2e0db] bg-white/90 p-6 shadow-sm xl:col-span-2">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-[11px] uppercase tracking-[0.4em] text-[#7a838b]">Trendlines</p>
              <h2 className="text-2xl font-semibold text-[#0c2332]">Panorama corporal</h2>
            </div>
            <span className="rounded-full bg-[#35d0a0]/15 px-3 py-1 text-xs font-semibold text-[#0c7a5a]">Atualizado</span>
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
            <div className="lg:col-span-2">
              <p className="text-sm font-semibold text-[#4f5a63]">Massa magra</p>
              <TrendAreaChart data={leanTrend} color="#35d0a0" title="Massa magra" />
            </div>
          </div>
        </div>
        <div className="rounded-3xl border border-[#e2e0db] bg-white/90 p-6 shadow-sm">
          <p className="text-[11px] uppercase tracking-[0.4em] text-[#7a838b]">Comparativo</p>
          <h2 className="mt-2 text-xl font-semibold text-[#0c2332]">Atual x Ideal</h2>
          <BodyCompositionChart data={bodyCompData} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <div className="rounded-3xl border border-[#e2e0db] bg-white/90 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-[#0c2332]">Pacientes do dia</h2>
            <span className="text-xs font-semibold uppercase tracking-[0.3em] text-[#7a838b]">{todayLabel}</span>
          </div>
          <ul className="mt-4 space-y-3">
            {(todaysPatients.length ? todaysPatients : patients.slice(0, 3)).map((patient) => (
              <li key={patient.id} className="flex items-center justify-between rounded-2xl border border-[#f0ede8] bg-white/70 px-4 py-3">
                <div>
                  <p className="font-semibold text-[#0c2332]">{patient.name}</p>
                  <p className="text-xs text-[#7a838b]">{calculateAge(patient.birthDate)} anos · {patient.sex}</p>
                </div>
                <Link to={`/patients/${patient.id}`} className="text-xs font-semibold text-[#35d0a0]">
                  Ver prontuário
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-3xl border border-[#e2e0db] bg-white/90 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-[#0c2332]">Avaliações agendadas</h2>
            <span className="text-xs text-[#7a838b]">Próximos atendimentos</span>
          </div>
          <ul className="mt-4 space-y-3">
            {upcomingAssessments.slice(0, 4).map((entry) => (
              <li key={entry.assessment.id} className="rounded-2xl border border-[#f0ede8] bg-white/70 px-4 py-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-[#0c2332]">{entry.patient?.name ?? 'Paciente'}</p>
                    <p className="text-xs text-[#7a838b]">{entry.assessment.dateTime}</p>
                  </div>
                  <span className="text-xs font-semibold text-[#35d0a0]">{entry.assessment.weightKg ? `${entry.assessment.weightKg.toFixed(1)} kg` : '—'}</span>
                </div>
              </li>
            ))}
            {upcomingAssessments.length === 0 && (
              <li className="rounded-2xl border border-dashed border-[#f0ede8] bg-white/50 px-4 py-4 text-sm text-[#7a838b]">
                Nenhuma avaliação agendada. Utilize o wizard para programar novas medições.
              </li>
            )}
          </ul>
        </div>
        <div className="rounded-3xl border border-[#e2e0db] bg-white/90 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-[#0c2332]">Alertas clínicos</h2>
            {avgMetabolicAge && <span className="text-xs text-[#7a838b]">Idade metabólica média {avgMetabolicAge.toFixed(0)} anos</span>}
          </div>
          <ul className="mt-4 space-y-3 text-sm text-[#4f5a63]">
            <li className="rounded-2xl border border-[#f0ede8] bg-white/70 px-4 py-3">
              Pacientes com RED-S em alerta: {assessments.filter((item) => (item.metrics?.redsRiskLevel ?? '').includes('ALTO')).length}
            </li>
            <li className="rounded-2xl border border-[#f0ede8] bg-white/70 px-4 py-3">
              Revisar bioimpedância de {assessments.filter((item) => (item.metrics?.ecwTbwRatio ?? 0) > 0.4).length} pacientes.
            </li>
            <li className="rounded-2xl border border-[#f0ede8] bg-white/70 px-4 py-3">
              Gerar relatório premium para as últimas {Math.min(latestAssessments.length, 5)} avaliações.
            </li>
          </ul>
        </div>
      </div>

      <div className="rounded-3xl border border-[#e2e0db] bg-white/90 p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-[#0c2332]">Últimas avaliações</h2>
          <span className="text-xs text-[#7a838b]">{latestAssessments.length} registros</span>
        </div>
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-[11px] uppercase tracking-[0.35em] text-[#8b939b]">
                <th className="pb-3 pr-4">Paciente</th>
                <th className="pb-3 pr-4">Data</th>
                <th className="pb-3 pr-4">Peso</th>
                <th className="pb-3 pr-4">% Gordura</th>
                <th className="pb-3 pr-4">Ações</th>
              </tr>
            </thead>
            <tbody>
              {latestAssessments.map((assessment) => {
                const patient = patients.find((item) => item.id === assessment.patientId);
                return (
                  <tr key={assessment.id} className="border-t border-[#f0ede8]">
                    <td className="py-3 pr-4">
                      <p className="font-semibold text-[#0c2332]">{patient?.name ?? 'Paciente'}</p>
                      <p className="text-xs text-[#7a838b]">{patient ? `${calculateAge(patient.birthDate)} anos` : '—'}</p>
                    </td>
                    <td className="py-3 pr-4 text-[#0c2332]">{assessment.dateTime}</td>
                    <td className="py-3 pr-4 text-[#0c2332]">{assessment.weightKg ? `${assessment.weightKg.toFixed(1)} kg` : '—'}</td>
                    <td className="py-3 pr-4 text-[#0c2332]">{assessment.bfPercent ? `${assessment.bfPercent.toFixed(1)}%` : '—'}</td>
                    <td className="py-3 pr-4">
                      <Link to={`/assessments/${assessment.id}`} className="text-xs font-semibold text-[#35d0a0]">
                        Abrir laudo
                      </Link>
                    </td>
                  </tr>
                );
              })}
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
