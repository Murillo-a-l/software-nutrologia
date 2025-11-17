import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Layout } from '../components/Layout';
import { apiClient } from '../api/client';
import type { Assessment, Metrics } from '../types';
import { calculateAge } from '../utils/date';

type ExtendedMetrics = Metrics & {
  bfPercentSkinfold?: number;
  bfPercentMethod?: string;
  bodyDensity?: number;
  fatMassIdealKg?: number;
  leanMassIdealKg?: number;
  weightIdealKg?: number;
};

const MAX_BMI = 40;
const MAX_BODY_FAT_PERCENT = 50;
const MAX_LEAN_MASS = 90;

export function AssessmentDetail() {
  const { id } = useParams<{ id: string }>();
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [downloadingPdf, setDownloadingPdf] = useState(false);

  useEffect(() => {
    if (id) {
      loadAssessment(id);
    }
  }, [id]);

  const loadAssessment = async (assessmentId: string) => {
    try {
      setLoading(true);
      const data = await apiClient.getAssessmentById(assessmentId);
      setAssessment(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar avaliação');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPdf = async () => {
    if (!id) return;

    try {
      setDownloadingPdf(true);
      await apiClient.downloadAssessmentReport(id);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Erro ao baixar relatório');
    } finally {
      setDownloadingPdf(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="text-center py-12">
          <p className="text-sm text-muted">Carregando avaliação...</p>
        </div>
      </Layout>
    );
  }

  if (error || !assessment) {
    return (
      <Layout>
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {error || 'Avaliação não encontrada'}
        </div>
      </Layout>
    );
  }

  const patient = assessment.patient;
  const metrics = (assessment.metrics as ExtendedMetrics | undefined) ?? undefined;
  const age = patient ? calculateAge(patient.birthDate) : null;
  const bmiValue = metrics?.bmi ?? null;
  const bodyFatPercent = metrics?.bfPercent ?? assessment.bfPercent ?? null;

  const idealBodyFatPercent = patient?.sex === 'M' ? 15 : patient?.sex === 'F' ? 23 : 20;
  const derivedIdealWeight =
    metrics?.weightIdealKg ??
    (metrics?.leanMassKg && idealBodyFatPercent
      ? metrics.leanMassKg / (1 - idealBodyFatPercent / 100)
      : undefined);
  const fatMassIdeal =
    metrics?.fatMassIdealKg ??
    (derivedIdealWeight ? (derivedIdealWeight * idealBodyFatPercent) / 100 : undefined);
  const leanMassIdeal =
    metrics?.leanMassIdealKg ??
    (derivedIdealWeight && fatMassIdeal !== undefined
      ? derivedIdealWeight - fatMassIdeal
      : metrics?.leanMassKg ?? undefined);

  const chartData = [
    {
      label: 'Peso',
      atual: assessment.weightKg ?? null,
      ideal: derivedIdealWeight ?? null,
    },
    {
      label: 'Massa Gorda',
      atual: metrics?.fatMassKg ?? null,
      ideal: fatMassIdeal ?? null,
    },
    {
      label: 'Massa Magra',
      atual: metrics?.leanMassKg ?? null,
      ideal: leanMassIdeal ?? null,
    },
  ].filter((item) => item.atual !== null || item.ideal !== null);

  const summaryMetrics: MetricRowConfig[] = [
    {
      key: 'bmi',
      label: 'Índice de Massa Corporal',
      value: bmiValue,
      unit: '',
      helper: metrics?.bmiCategory ?? undefined,
      max: MAX_BMI,
      color: 'bg-cyan-700',
      digits: 1,
    },
    {
      key: 'bodyFat',
      label: 'Percentual de gordura',
      value: bodyFatPercent,
      unit: '%',
      helper: 'Atual',
      max: MAX_BODY_FAT_PERCENT,
      color: 'bg-amber-400',
      digits: 1,
    },
  ];

  if (metrics?.bfPercentSkinfold) {
    summaryMetrics.push({
      key: 'skinfold',
      label: '% Gordura (Dobras)',
      value: metrics.bfPercentSkinfold,
      unit: '%',
      helper: metrics.bfPercentMethod ?? 'Dobras cutâneas',
      max: MAX_BODY_FAT_PERCENT,
      color: 'bg-sky-500',
      digits: 1,
    });
  }

  const detailedMetrics: MetricRowConfig[] = [
    {
      key: 'imc',
      label: 'IMC',
      value: bmiValue,
      unit: '',
      helper: metrics?.bmiCategory,
      max: MAX_BMI,
      color: 'bg-cyan-700',
      showBar: true,
      digits: 1,
    },
    {
      key: 'bfPercent',
      label: 'Percentual de gordura',
      value: bodyFatPercent,
      unit: '%',
      helper: 'Distribuição atual',
      max: MAX_BODY_FAT_PERCENT,
      color: 'bg-amber-400',
      showBar: true,
      digits: 1,
    },
    {
      key: 'fatMassKg',
      label: 'Massa gorda',
      value: metrics?.fatMassKg ?? null,
      unit: ' kg',
      digits: 1,
    },
    {
      key: 'leanMassKg',
      label: 'Massa magra',
      value: metrics?.leanMassKg ?? null,
      unit: ' kg',
      max: MAX_LEAN_MASS,
      color: 'bg-emerald-500',
      showBar: true,
      digits: 1,
    },
    {
      key: 'bodyCompScore',
      label: 'Body Comp Score',
      value: metrics?.bodyCompScore ?? null,
      digits: 0,
    },
    {
      key: 'metabolicAge',
      label: 'Idade metabólica',
      value: metrics?.metabolicAgeYears ?? null,
      unit: ' anos',
      digits: 0,
    },
  ];

  const personalRows = [
    { label: 'Nome', value: patient?.name ?? '—' },
    { label: 'Idade', value: age !== null ? `${age} anos` : '—' },
    { label: 'Sexo', value: patient ? getSexLabel(patient.sex) : '—' },
    {
      label: 'Altura',
      value:
        patient && typeof patient.heightM === 'number'
          ? `${patient.heightM.toFixed(2)} m`
          : '—',
    },
    {
      label: 'Peso atual',
      value:
        typeof assessment.weightKg === 'number'
          ? `${assessment.weightKg.toFixed(1)} kg`
          : '—',
    },
  ];

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-3xl font-semibold text-primary">Avaliação Física</p>
            <p className="text-sm text-muted mt-2">
              {patient ? patient.name : 'Paciente não informado'} {assessment.dateTime ? `• ${assessment.dateTime}` : ''}
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleDownloadPdf}
              disabled={downloadingPdf}
              className="bg-accent text-white rounded-2xl px-5 py-2.5 font-semibold shadow-sm hover:bg-sky-500 transition flex items-center gap-2 disabled:opacity-60"
            >
              {downloadingPdf ? (
                <>
                  <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 3v3" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M12 18v3" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M3 12h3" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M18 12h3" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Gerando...
                </>
              ) : (
                <>
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v14m0 0l-4-4m4 4l4-4M6 9V5h12v4" />
                  </svg>
                  Baixar PDF do laudo
                </>
              )}
            </button>
            {patient && (
              <Link
                to={`/patients/${patient.id}`}
                className="bg-white text-primary border border-border rounded-2xl px-5 py-2.5 font-semibold hover:bg-gray-50"
              >
                Ver paciente
              </Link>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="space-y-6">
            <div className="bg-card border border-border rounded-2xl shadow-sm p-5">
              <div className="pb-3 border-b border-border">
                <p className="text-primary text-lg font-semibold">Dados Pessoais</p>
                <p className="text-sm text-muted">Informações gerais do paciente</p>
              </div>
              <div className="mt-4 space-y-3">
                {personalRows.map((row) => (
                  <InfoRow key={row.label} label={row.label} value={row.value} />
                ))}
                <div className="pt-3 border-t border-border">
                  <p className="text-sm text-muted">IMC</p>
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-xl font-semibold text-gray-900">{formatMetricValue(bmiValue)}</p>
                    <span className="text-xs font-semibold px-3 py-1 rounded-full bg-cyan-50 text-cyan-700">
                      {metrics?.bmiCategory ?? '—'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-card border border-border rounded-2xl shadow-sm p-5">
              <div className="pb-3 border-b border-border">
                <p className="text-primary text-lg font-semibold">Resultados</p>
                <p className="text-sm text-muted">Principais indicadores</p>
              </div>
              <div className="mt-4 space-y-5">
                {summaryMetrics.map((metric) => (
                  <MetricProgressRow
                    key={metric.key}
                    label={metric.label}
                    value={metric.value}
                    unit={metric.unit}
                    helper={metric.helper}
                    max={metric.max}
                    colorClass={metric.color}
                    emphasize
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-card border border-border rounded-2xl shadow-sm p-5">
              <div className="pb-3 border-b border-border">
                <p className="text-primary text-lg font-semibold">Resultados detalhados</p>
                <p className="text-sm text-muted">Composição corporal completa</p>
              </div>
              <div className="divide-y divide-border">
                {detailedMetrics.map((metric) => (
                  <div key={metric.key} className="py-4">
                    <MetricProgressRow
                      label={metric.label}
                      value={metric.value}
                      unit={metric.unit}
                      helper={metric.helper}
                      max={metric.max}
                      colorClass={metric.color}
                      showBar={metric.showBar}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div>
            <div className="bg-card border border-border rounded-2xl shadow-sm p-5 h-full">
              <div className="pb-3 border-b border-border">
                <p className="text-primary text-lg font-semibold">Análise Corporal</p>
                <p className="text-sm text-muted">Atual x Ideal x Massa magra</p>
              </div>
              <div className="mt-6 h-72">
                {chartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                      <XAxis dataKey="label" tickLine={false} axisLine={{ stroke: '#E5E7EB' }} tick={{ fill: '#6B7280', fontSize: 12 }} />
                      <YAxis tickLine={false} axisLine={{ stroke: '#E5E7EB' }} tick={{ fill: '#6B7280', fontSize: 12 }} />
                      <Tooltip cursor={{ fill: 'rgba(56, 189, 248, 0.08)' }} />
                      <Legend />
                      <Bar dataKey="atual" name="Atual" fill="#0F172A" radius={[6, 6, 0, 0]} barSize={28} />
                      <Bar dataKey="ideal" name="Ideal" fill="#10B981" radius={[6, 6, 0, 0]} barSize={28} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center">
                    <p className="text-sm text-muted text-center">
                      Dados insuficientes para montar o gráfico neste momento.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

interface InfoRowProps {
  label: string;
  value: string;
}

function InfoRow({ label, value }: InfoRowProps) {
  return (
    <div className="flex items-center justify-between">
      <p className="text-sm text-muted">{label}</p>
      <p className="text-base font-semibold text-gray-900">{value}</p>
    </div>
  );
}

interface MetricRowConfig {
  key: string;
  label: string;
  value?: number | null;
  unit?: string;
  helper?: string;
  max?: number;
  color?: string;
  showBar?: boolean;
  digits?: number;
}

interface MetricProgressRowProps extends MetricRowConfig {
  colorClass?: string;
  emphasize?: boolean;
}

function MetricProgressRow({
  label,
  value,
  unit,
  helper,
  max,
  colorClass,
  showBar = true,
  emphasize,
  digits,
}: MetricProgressRowProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm text-muted">{label}</p>
          {helper && <p className="text-xs text-muted mt-0.5">{helper}</p>}
        </div>
        <p className={`text-gray-900 font-semibold ${emphasize ? 'text-xl' : 'text-lg'}`}>
          {formatMetricValue(value, unit, digits)}
        </p>
      </div>
      {showBar && max && colorClass && <ProgressBar value={value} max={max} colorClass={colorClass} />}
    </div>
  );
}

interface ProgressBarProps {
  value?: number | null;
  max: number;
  colorClass: string;
}

function ProgressBar({ value, max, colorClass }: ProgressBarProps) {
  const width = getBarWidth(value, max);
  return (
    <div className="w-full h-2.5 rounded-full bg-gray-200 overflow-hidden">
      <div className={`h-full ${colorClass} transition-all duration-300`} style={{ width }} />
    </div>
  );
}

function formatMetricValue(value?: number | null, unit = '', digits = 1) {
  if (value === null || value === undefined || Number.isNaN(value)) {
    return '—';
  }

  const formatted = digits === 0 ? value.toFixed(0) : value.toFixed(digits);
  return `${formatted}${unit}`.trim();
}

function getBarWidth(value: number | null | undefined, max: number) {
  if (value === null || value === undefined || max <= 0) {
    return '0%';
  }

  return `${Math.min((value / max) * 100, 100)}%`;
}

function getSexLabel(sex: 'M' | 'F' | 'OUTRO') {
  if (sex === 'M') return 'Masculino';
  if (sex === 'F') return 'Feminino';
  return 'Outro';
}
