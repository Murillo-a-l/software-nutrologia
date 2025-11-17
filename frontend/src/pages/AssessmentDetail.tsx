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
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-card border border-border rounded-xl shadow-sm p-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">Detalhes da Avaliação</h1>
              {assessment.patient && (
                <p className="text-sm text-muted mt-2">
                  <strong className="text-gray-900">{assessment.patient.name}</strong> • {calculateAge(assessment.patient.birthDate)} anos • {assessment.dateTime}
                </p>
              )}
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleDownloadPdf}
                disabled={downloadingPdf}
                className="bg-accent hover:bg-sky-500 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg font-semibold shadow-sm transition-colors flex items-center gap-2"
              >
                {downloadingPdf ? (
                  <>
                    <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Gerando...
                  </>
                ) : (
                  <>
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                    Baixar PDF
                  </>
                )}
              </button>
              {assessment.patient && (
                <Link
                  to={`/patients/${assessment.patient.id}`}
                  className="bg-white border border-border text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-50 font-medium transition-colors"
                >
                  Ver Paciente
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Resumo - Dados Coletados */}
        <div className="bg-card border border-border rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Resumo</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-xs uppercase tracking-wide text-muted">Peso</p>
              <p className="text-xl font-semibold text-gray-900 mt-1">{assessment.weightKg?.toFixed(1)} kg</p>
            </div>
            {assessment.bfPercent && (
              <div>
                <p className="text-xs uppercase tracking-wide text-muted">% Gordura</p>
                <p className="text-xl font-semibold text-gray-900 mt-1">{assessment.bfPercent.toFixed(1)}%</p>
              </div>
            )}
            {assessment.waistCm && (
              <div>
                <p className="text-xs uppercase tracking-wide text-muted">Cintura</p>
                <p className="text-xl font-semibold text-gray-900 mt-1">{assessment.waistCm.toFixed(0)} cm</p>
              </div>
            )}
            {assessment.activityLevel && (
              <div>
                <p className="text-xs uppercase tracking-wide text-muted">Atividade</p>
                <p className="text-xl font-semibold text-gray-900 mt-1 capitalize">{assessment.activityLevel.toLowerCase()}</p>
              </div>
            )}
          </div>
        </div>

        {/* Métricas Calculadas */}
        {metrics && (
          <>
            {/* Antropometria */}
            <div className="bg-card border border-border rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Antropometria</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {metrics.bmi && (
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 p-4 rounded-lg border border-blue-200">
                    <p className="text-xs uppercase tracking-wide text-blue-700 font-medium">IMC</p>
                    <p className="text-2xl font-semibold text-gray-900 mt-1">{metrics.bmi.toFixed(1)}</p>
                    <p className="text-sm text-blue-700 mt-1">{metrics.bmiCategory}</p>
                  </div>
                )}
                {metrics.waistHeightRatio && (
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 p-4 rounded-lg border border-blue-200">
                    <p className="text-xs uppercase tracking-wide text-blue-700 font-medium">Cintura/Altura</p>
                    <p className="text-2xl font-semibold text-gray-900 mt-1">{metrics.waistHeightRatio.toFixed(2)}</p>
                    <p className="text-sm text-blue-700 mt-1 capitalize">Risco: {metrics.waistHeightRisk}</p>
                  </div>
                )}
                {metrics.waistHipRatio && (
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 p-4 rounded-lg border border-blue-200">
                    <p className="text-xs uppercase tracking-wide text-blue-700 font-medium">Cintura/Quadril</p>
                    <p className="text-2xl font-semibold text-gray-900 mt-1">{metrics.waistHipRatio.toFixed(2)}</p>
                    <p className="text-sm text-blue-700 mt-1 capitalize">Risco: {metrics.waistHipRisk}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Composição Corporal */}
            <div className="bg-card border border-border rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Composição Corporal</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {metrics.fatMassKg && (
                  <div className="bg-gradient-to-br from-amber-50 to-amber-100/50 p-4 rounded-lg border border-amber-200">
                    <p className="text-xs uppercase tracking-wide text-amber-700 font-medium">Massa Gorda</p>
                    <p className="text-2xl font-semibold text-gray-900 mt-1">{metrics.fatMassKg.toFixed(1)} kg</p>
                  </div>
                )}
                {metrics.leanMassKg && (
                  <div className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 p-4 rounded-lg border border-emerald-200">
                    <p className="text-xs uppercase tracking-wide text-emerald-700 font-medium">Massa Magra</p>
                    <p className="text-2xl font-semibold text-gray-900 mt-1">{metrics.leanMassKg.toFixed(1)} kg</p>
                  </div>
                )}
                {metrics.smi && (
                  <div className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 p-4 rounded-lg border border-emerald-200">
                    <p className="text-xs uppercase tracking-wide text-emerald-700 font-medium">SMI</p>
                    <p className="text-2xl font-semibold text-gray-900 mt-1">{metrics.smi.toFixed(1)}</p>
                  </div>
                )}
                {metrics.bodyCompScore !== undefined && (
                  <div className="bg-gradient-to-br from-violet-50 to-violet-100/50 p-4 rounded-lg border border-violet-200">
                    <p className="text-xs uppercase tracking-wide text-violet-700 font-medium">Body Comp Score</p>
                    <p className="text-2xl font-semibold text-gray-900 mt-1">{metrics.bodyCompScore}/100</p>
                  </div>
                )}
              </div>
            </div>

            {/* Metabolismo */}
            <div className="bg-card border border-border rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Metabolismo</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {metrics.bmrMifflin && (
                  <div className="bg-gradient-to-br from-orange-50 to-orange-100/50 p-4 rounded-lg border border-orange-200">
                    <p className="text-xs uppercase tracking-wide text-orange-700 font-medium">BMR (Mifflin)</p>
                    <p className="text-2xl font-semibold text-gray-900 mt-1">{metrics.bmrMifflin.toFixed(0)} kcal</p>
                    <p className="text-xs text-orange-700 mt-1">Taxa metabólica basal</p>
                  </div>
                )}
                {metrics.bmrCunningham && (
                  <div className="bg-gradient-to-br from-orange-50 to-orange-100/50 p-4 rounded-lg border border-orange-200">
                    <p className="text-xs uppercase tracking-wide text-orange-700 font-medium">BMR (Cunningham)</p>
                    <p className="text-2xl font-semibold text-gray-900 mt-1">{metrics.bmrCunningham.toFixed(0)} kcal</p>
                    <p className="text-xs text-orange-700 mt-1">Baseado em massa magra</p>
                  </div>
                )}
                {metrics.tdee && (
                  <div className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 p-4 rounded-lg border border-emerald-200">
                    <p className="text-xs uppercase tracking-wide text-emerald-700 font-medium">TDEE</p>
                    <p className="text-2xl font-semibold text-gray-900 mt-1">{metrics.tdee.toFixed(0)} kcal</p>
                    <p className="text-xs text-emerald-700 mt-1">Gasto energético total</p>
                  </div>
                )}
              </div>
            </div>

            {/* Riscos e Avaliações */}
            <div className="bg-card border border-border rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Riscos e Avaliações</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {metrics.cardiometabolicRiskLevel && (
                  <div className="bg-gradient-to-br from-rose-50 to-rose-100/50 p-4 rounded-lg border border-rose-200">
                    <p className="text-xs uppercase tracking-wide text-rose-700 font-medium">Risco Cardiometabólico</p>
                    <p className="text-2xl font-semibold text-gray-900 mt-1 capitalize">{metrics.cardiometabolicRiskLevel}</p>
                    <p className="text-xs text-rose-700 mt-1">Score: {metrics.cardiometabolicScore}</p>
                  </div>
                )}
                {metrics.redsRiskLevel && (
                  <div className="bg-gradient-to-br from-rose-50 to-rose-100/50 p-4 rounded-lg border border-rose-200">
                    <p className="text-xs uppercase tracking-wide text-rose-700 font-medium">Risco RED-S</p>
                    <p className="text-2xl font-semibold text-gray-900 mt-1 capitalize">{metrics.redsRiskLevel}</p>
                    <p className="text-xs text-rose-700 mt-1">Score: {metrics.redsScore}</p>
                  </div>
                )}
                {metrics.metabolicAgeYears && (
                  <div className="bg-gradient-to-br from-amber-50 to-amber-100/50 p-4 rounded-lg border border-amber-200">
                    <p className="text-xs uppercase tracking-wide text-amber-700 font-medium">Idade Metabólica</p>
                    <p className="text-2xl font-semibold text-gray-900 mt-1">{metrics.metabolicAgeYears} anos</p>
                    {assessment.patient && (
                      <p className="text-xs text-amber-700 mt-1">
                        Idade real: {calculateAge(assessment.patient.birthDate)} anos
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
}
