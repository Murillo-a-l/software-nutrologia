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

  if (loading) {
    return (
      <Layout>
        <div className="text-center py-12">
          <p className="text-gray-600">Carregando avaliação...</p>
        </div>
      </Layout>
    );
  }

  if (error || !assessment) {
    return (
      <Layout>
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
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
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Detalhes da Avaliação</h1>
              {assessment.patient && (
                <p className="text-gray-600 mt-2">
                  Paciente: <strong>{assessment.patient.name}</strong> (
                  {calculateAge(assessment.patient.birthDate)} anos)
                </p>
              )}
              <p className="text-gray-600">Data: {assessment.dateTime}</p>
            </div>
            {assessment.patient && (
              <Link
                to={`/patients/${assessment.patient.id}`}
                className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                Ver Paciente
              </Link>
            )}
          </div>
        </div>

        {/* Dados da Avaliação */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Dados Coletados</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-600">Peso</p>
              <p className="text-lg font-semibold">{assessment.weightKg?.toFixed(1)} kg</p>
            </div>
            {assessment.bfPercent && (
              <div>
                <p className="text-sm text-gray-600">% Gordura</p>
                <p className="text-lg font-semibold">{assessment.bfPercent.toFixed(1)}%</p>
              </div>
            )}
            {assessment.waistCm && (
              <div>
                <p className="text-sm text-gray-600">Cintura</p>
                <p className="text-lg font-semibold">{assessment.waistCm.toFixed(1)} cm</p>
              </div>
            )}
            {assessment.hipCm && (
              <div>
                <p className="text-sm text-gray-600">Quadril</p>
                <p className="text-lg font-semibold">{assessment.hipCm.toFixed(1)} cm</p>
              </div>
            )}
            {assessment.activityLevel && (
              <div>
                <p className="text-sm text-gray-600">Nível de Atividade</p>
                <p className="text-lg font-semibold capitalize">
                  {assessment.activityLevel.toLowerCase()}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Métricas Calculadas */}
        {metrics && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Métricas Calculadas</h2>

            <div className="space-y-6">
              {/* Antropometria */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Antropometria</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {metrics.bmi && (
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-600">IMC</p>
                      <p className="text-2xl font-bold text-primary">{metrics.bmi.toFixed(1)}</p>
                      <p className="text-sm text-gray-700 mt-1">{metrics.bmiCategory}</p>
                    </div>
                  )}
                  {metrics.waistHeightRatio && (
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-600">Relação Cintura/Altura</p>
                      <p className="text-2xl font-bold text-primary">
                        {metrics.waistHeightRatio.toFixed(2)}
                      </p>
                      <p className="text-sm text-gray-700 mt-1 capitalize">
                        Risco: {metrics.waistHeightRisk}
                      </p>
                    </div>
                  )}
                  {metrics.waistHipRatio && (
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-600">Relação Cintura/Quadril</p>
                      <p className="text-2xl font-bold text-primary">
                        {metrics.waistHipRatio.toFixed(2)}
                      </p>
                      <p className="text-sm text-gray-700 mt-1 capitalize">
                        Risco: {metrics.waistHipRisk}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Composição Corporal */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Composição Corporal</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {metrics.fatMassKg && (
                    <div className="bg-yellow-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-600">Massa Gorda</p>
                      <p className="text-2xl font-bold text-primary">
                        {metrics.fatMassKg.toFixed(1)} kg
                      </p>
                    </div>
                  )}
                  {metrics.leanMassKg && (
                    <div className="bg-green-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-600">Massa Magra</p>
                      <p className="text-2xl font-bold text-primary">
                        {metrics.leanMassKg.toFixed(1)} kg
                      </p>
                    </div>
                  )}
                  {metrics.smi && (
                    <div className="bg-green-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-600">SMI</p>
                      <p className="text-2xl font-bold text-primary">{metrics.smi.toFixed(1)}</p>
                    </div>
                  )}
                  {metrics.bodyCompScore !== undefined && (
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-600">Body Comp Score</p>
                      <p className="text-2xl font-bold text-primary">{metrics.bodyCompScore}/100</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Metabolismo */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Metabolismo</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {metrics.bmrMifflin && (
                    <div className="bg-orange-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-600">BMR (Mifflin)</p>
                      <p className="text-2xl font-bold text-primary">
                        {metrics.bmrMifflin.toFixed(0)} kcal
                      </p>
                    </div>
                  )}
                  {metrics.bmrCunningham && (
                    <div className="bg-orange-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-600">BMR (Cunningham)</p>
                      <p className="text-2xl font-bold text-primary">
                        {metrics.bmrCunningham.toFixed(0)} kcal
                      </p>
                    </div>
                  )}
                  {metrics.tdee && (
                    <div className="bg-green-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-600">TDEE</p>
                      <p className="text-2xl font-bold text-primary">
                        {metrics.tdee.toFixed(0)} kcal
                      </p>
                      <p className="text-sm text-gray-700 mt-1">Gasto energético total</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Riscos */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Avaliação de Riscos</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {metrics.cardiometabolicRiskLevel && (
                    <div className="bg-red-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-600">Risco Cardiometabólico</p>
                      <p className="text-2xl font-bold text-primary capitalize">
                        {metrics.cardiometabolicRiskLevel}
                      </p>
                      <p className="text-sm text-gray-700 mt-1">
                        Score: {metrics.cardiometabolicScore}
                      </p>
                    </div>
                  )}
                  {metrics.redsRiskLevel && (
                    <div className="bg-red-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-600">Risco RED-S</p>
                      <p className="text-2xl font-bold text-primary capitalize">
                        {metrics.redsRiskLevel}
                      </p>
                      <p className="text-sm text-gray-700 mt-1">Score: {metrics.redsScore}</p>
                    </div>
                  )}
                  {metrics.metabolicAgeYears && (
                    <div className="bg-orange-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-600">Idade Metabólica</p>
                      <p className="text-2xl font-bold text-primary">
                        {metrics.metabolicAgeYears} anos
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
