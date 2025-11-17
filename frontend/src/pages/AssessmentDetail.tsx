import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { apiClient } from '../api/client';
import type { Assessment } from '../types';
import { calculateAge } from '../utils/date';

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

  const metrics = assessment.metrics;

  return (
    <Layout>
      <div className="space-y-8">
        <div className="bg-card border border-border rounded-2xl shadow-sm p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted">Avaliação</p>
              <h1 className="text-3xl font-semibold text-primary mt-2">Detalhes da avaliação</h1>
              {assessment.patient && (
                <p className="text-sm text-muted mt-3">
                  {assessment.dateTime} • {assessment.patient.name} ({calculateAge(assessment.patient.birthDate)} anos)
                </p>
              )}
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={handleDownloadPdf}
                disabled={downloadingPdf}
                className="bg-accent text-white rounded-xl px-4 py-2 font-semibold shadow-sm hover:bg-sky-500 transition flex items-center gap-2"
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
              {assessment.patient && (
                <Link
                  to={`/patients/${assessment.patient.id}`}
                  className="bg-white text-primary border border-border rounded-xl px-4 py-2 font-semibold hover:bg-gray-50"
                >
                  Ver paciente
                </Link>
              )}
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-2xl shadow-sm p-6 space-y-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-muted">Resumo clínico</p>
            <h2 className="text-xl font-semibold text-gray-900">Indicadores principais</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="rounded-2xl border border-border p-4">
              <p className="text-xs uppercase tracking-wide text-muted">IMC</p>
              <p className="text-2xl font-semibold text-gray-900">{metrics?.bmi ? metrics.bmi.toFixed(1) : '—'}</p>
              <p className="text-sm text-muted">{metrics?.bmiCategory ?? 'Aguardando dados'}</p>
            </div>
            <div className="rounded-2xl border border-border p-4">
              <p className="text-xs uppercase tracking-wide text-muted">Body Comp Score</p>
              <p className="text-2xl font-semibold text-gray-900">{metrics?.bodyCompScore ?? '—'}</p>
              <p className="text-sm text-muted">Qualidade de composição corporal</p>
            </div>
            <div className="rounded-2xl border border-border p-4">
              <p className="text-xs uppercase tracking-wide text-muted">Idade metabólica</p>
              <p className="text-2xl font-semibold text-gray-900">{metrics?.metabolicAgeYears ?? '—'} anos</p>
              {assessment.patient && (
                <p className="text-sm text-muted">Idade real: {calculateAge(assessment.patient.birthDate)} anos</p>
              )}
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-2xl shadow-sm p-6 space-y-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-muted">Antropometria</p>
            <h2 className="text-xl font-semibold text-gray-900">Medidas e composição</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            <CardItem label="Peso" value={assessment.weightKg ? `${assessment.weightKg.toFixed(1)} kg` : '—'} />
            <CardItem label="Altura" value={assessment.patient ? `${assessment.patient.heightM.toFixed(2)} m` : '—'} />
            <CardItem label="% Gordura" value={assessment.bfPercent ? `${assessment.bfPercent.toFixed(1)}%` : '—'} />
            {metrics?.waistHipRatio && (
              <CardItem label="RCQ" value={metrics.waistHipRatio.toFixed(2)} helper={metrics.waistHipRisk ? `Risco ${metrics.waistHipRisk}` : undefined} />
            )}
            {metrics?.waistHeightRatio && (
              <CardItem label="RCA" value={metrics.waistHeightRatio.toFixed(2)} helper={metrics.waistHeightRisk ? `Risco ${metrics.waistHeightRisk}` : undefined} />
            )}
            {metrics?.fatMassKg && <CardItem label="Massa gorda" value={`${metrics.fatMassKg.toFixed(1)} kg`} />}
            {metrics?.leanMassKg && <CardItem label="Massa magra" value={`${metrics.leanMassKg.toFixed(1)} kg`} />}
            {metrics?.smi && <CardItem label="SMI" value={metrics.smi.toFixed(1)} />}
          </div>
        </div>

        <div className="bg-card border border-border rounded-2xl shadow-sm p-6 space-y-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-muted">Metabolismo</p>
            <h2 className="text-xl font-semibold text-gray-900">Taxas e gasto energético</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {metrics?.bmrMifflin && <CardItem label="BMR Mifflin" value={`${metrics.bmrMifflin.toFixed(0)} kcal`} helper="Basal estimado" />}
            {metrics?.bmrCunningham && <CardItem label="BMR Cunningham" value={`${metrics.bmrCunningham.toFixed(0)} kcal`} helper="Baseado em massa magra" />}
            {metrics?.tdee && <CardItem label="TDEE" value={`${metrics.tdee.toFixed(0)} kcal`} helper="Gasto energético total" />}
          </div>
        </div>

        <div className="bg-card border border-border rounded-2xl shadow-sm p-6 space-y-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-muted">Riscos</p>
            <h2 className="text-xl font-semibold text-gray-900">Alertas e scores</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {metrics?.cardiometabolicRiskLevel && (
              <CardItem
                label="Score cardiometabólico"
                value={metrics.cardiometabolicScore ?? '—'}
                helper={`Risco ${metrics.cardiometabolicRiskLevel}`}
              />
            )}
            {metrics?.redsRiskLevel && (
              <CardItem label="Score RED-S" value={metrics.redsScore ?? '—'} helper={`Risco ${metrics.redsRiskLevel}`} />
            )}
            {metrics?.metabolicAgeYears && (
              <CardItem label="Idade metabólica" value={`${metrics.metabolicAgeYears} anos`} />
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}

interface CardItemProps {
  label: string;
  value: string | number;
  helper?: string;
}

function CardItem({ label, value, helper }: CardItemProps) {
  return (
    <div className="rounded-2xl border border-border p-4">
      <p className="text-xs uppercase tracking-wide text-muted">{label}</p>
      <p className="text-2xl font-semibold text-gray-900">{value}</p>
      {helper && <p className="text-sm text-muted">{helper}</p>}
    </div>
  );
}
