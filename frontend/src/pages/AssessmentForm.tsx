import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { apiClient } from '../api/client';
import type { Patient, Assessment } from '../types';
import { getCurrentDateBrazilian } from '../utils/date';

export function AssessmentForm() {
  const { id: patientId } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingPatient, setLoadingPatient] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [savedAssessment, setSavedAssessment] = useState<Assessment | null>(null);

  const [formData, setFormData] = useState({
    dateTime: getCurrentDateBrazilian(),
    weightKg: '',
    bfPercent: '',
    waistCm: '',
    hipCm: '',
    activityLevel: 'MODERADO' as 'SEDENTARIO' | 'LEVE' | 'MODERADO' | 'INTENSO' | 'ATLETA',
    ffmKg: '',
    skeletalMuscleKg: '',
    visceralFatIndex: '',
    tbwL: '',
    ecwL: '',
    icwL: '',
  });

  useEffect(() => {
    if (patientId) {
      loadPatient(patientId);
    }
  }, [patientId]);

  const loadPatient = async (id: string) => {
    try {
      setLoadingPatient(true);
      const data = await apiClient.getPatientById(id);
      setPatient(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar paciente');
    } finally {
      setLoadingPatient(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!patientId) {
      setError('ID do paciente não encontrado');
      return;
    }

    const weightKg = parseFloat(formData.weightKg);
    if (isNaN(weightKg) || weightKg <= 0) {
      setError('Peso é obrigatório e deve ser maior que zero');
      return;
    }

    try {
      setLoading(true);
      const assessment = await apiClient.createAssessment(patientId, {
        dateTime: formData.dateTime,
        weightKg,
        bfPercent: formData.bfPercent ? parseFloat(formData.bfPercent) : undefined,
        waistCm: formData.waistCm ? parseFloat(formData.waistCm) : undefined,
        hipCm: formData.hipCm ? parseFloat(formData.hipCm) : undefined,
        activityLevel: formData.activityLevel,
        ffmKg: formData.ffmKg ? parseFloat(formData.ffmKg) : undefined,
        skeletalMuscleKg: formData.skeletalMuscleKg ? parseFloat(formData.skeletalMuscleKg) : undefined,
        visceralFatIndex: formData.visceralFatIndex ? parseFloat(formData.visceralFatIndex) : undefined,
        tbwL: formData.tbwL ? parseFloat(formData.tbwL) : undefined,
        ecwL: formData.ecwL ? parseFloat(formData.ecwL) : undefined,
        icwL: formData.icwL ? parseFloat(formData.icwL) : undefined,
      });

      setSavedAssessment(assessment);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar avaliação');
    } finally {
      setLoading(false);
    }
  };

  if (loadingPatient) {
    return (
      <Layout>
        <div className="text-center py-12">
          <p className="text-gray-600">Carregando dados do paciente...</p>
        </div>
      </Layout>
    );
  }

  if (!patient) {
    return (
      <Layout>
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
          Paciente não encontrado
        </div>
      </Layout>
    );
  }

  // Se a avaliação foi salva, mostrar resumo
  if (savedAssessment && savedAssessment.metrics) {
    const metrics = savedAssessment.metrics;

    return (
      <Layout>
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="bg-green-50 border border-green-200 text-green-800 px-6 py-4 rounded-lg">
            <h2 className="text-xl font-bold mb-2">✓ Avaliação criada com sucesso!</h2>
            <p>As métricas foram calculadas automaticamente.</p>
          </div>

          {/* Patient Info */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Paciente</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Nome</p>
                <p className="font-semibold">{patient.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Data da Avaliação</p>
                <p className="font-semibold">{savedAssessment.dateTime}</p>
              </div>
            </div>
          </div>

          {/* Metrics Summary */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Resumo das Métricas</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* IMC */}
              {metrics.bmi && (
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">IMC</p>
                  <p className="text-2xl font-bold text-primary">{metrics.bmi.toFixed(1)}</p>
                  <p className="text-sm text-gray-700 mt-1">{metrics.bmiCategory}</p>
                </div>
              )}

              {/* TDEE */}
              {metrics.tdee && (
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">TDEE</p>
                  <p className="text-2xl font-bold text-primary">{metrics.tdee.toFixed(0)} kcal</p>
                  <p className="text-sm text-gray-700 mt-1">Gasto energético total</p>
                </div>
              )}

              {/* % Gordura */}
              {savedAssessment.bfPercent && (
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">% Gordura</p>
                  <p className="text-2xl font-bold text-primary">{savedAssessment.bfPercent.toFixed(1)}%</p>
                  {metrics.fatMassKg && (
                    <p className="text-sm text-gray-700 mt-1">
                      {metrics.fatMassKg.toFixed(1)} kg de gordura
                    </p>
                  )}
                </div>
              )}

              {/* Body Comp Score */}
              {metrics.bodyCompScore !== undefined && (
                <div className="bg-purple-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Body Comp Score</p>
                  <p className="text-2xl font-bold text-primary">{metrics.bodyCompScore}/100</p>
                  <p className="text-sm text-gray-700 mt-1">Índice de composição</p>
                </div>
              )}

              {/* Idade Metabólica */}
              {metrics.metabolicAgeYears && (
                <div className="bg-orange-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Idade Metabólica</p>
                  <p className="text-2xl font-bold text-primary">{metrics.metabolicAgeYears} anos</p>
                  <p className="text-sm text-gray-700 mt-1">Idade metabólica estimada</p>
                </div>
              )}

              {/* Risco Cardiometabólico */}
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
            </div>
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => navigate(`/patients/${patientId}`)}
              className="flex-1 bg-secondary hover:bg-blue-600 text-white font-semibold py-3 rounded-lg transition-colors shadow-md hover:shadow-lg"
            >
              Voltar para o Paciente
            </button>
            <button
              onClick={() => {
                setSavedAssessment(null);
                setFormData({
                  ...formData,
                  dateTime: getCurrentDateBrazilian(),
                  weightKg: '',
                  bfPercent: '',
                  waistCm: '',
                  hipCm: '',
                });
              }}
              className="px-6 py-3 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Nova Avaliação
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  // Form de avaliação
  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Nova Avaliação</h1>
          <p className="text-gray-600 mt-1">Paciente: {patient.name}</p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow-md p-6">
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Data */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Data da Avaliação
              </label>
              <input
                type="text"
                value={formData.dateTime}
                onChange={(e) => setFormData({ ...formData, dateTime: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent outline-none transition"
                placeholder="DD/MM/AAAA"
              />
            </div>

            {/* Dados Básicos */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Peso (kg) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={formData.weightKg}
                  onChange={(e) => setFormData({ ...formData, weightKg: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent outline-none transition"
                  placeholder="75.5"
                  step="0.1"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  % Gordura Corporal
                </label>
                <input
                  type="number"
                  value={formData.bfPercent}
                  onChange={(e) => setFormData({ ...formData, bfPercent: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent outline-none transition"
                  placeholder="25.5"
                  step="0.1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Circunferência da Cintura (cm)
                </label>
                <input
                  type="number"
                  value={formData.waistCm}
                  onChange={(e) => setFormData({ ...formData, waistCm: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent outline-none transition"
                  placeholder="80"
                  step="0.1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Circunferência do Quadril (cm)
                </label>
                <input
                  type="number"
                  value={formData.hipCm}
                  onChange={(e) => setFormData({ ...formData, hipCm: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent outline-none transition"
                  placeholder="95"
                  step="0.1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nível de Atividade Física
                </label>
                <select
                  value={formData.activityLevel}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      activityLevel: e.target.value as any,
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent outline-none transition"
                >
                  <option value="SEDENTARIO">Sedentário</option>
                  <option value="LEVE">Leve</option>
                  <option value="MODERADO">Moderado</option>
                  <option value="INTENSO">Intenso</option>
                  <option value="ATLETA">Atleta</option>
                </select>
              </div>
            </div>

            {/* Bioimpedância (campos avançados) */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Dados de Bioimpedância (Opcional)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Massa Livre de Gordura (kg)
                  </label>
                  <input
                    type="number"
                    value={formData.ffmKg}
                    onChange={(e) => setFormData({ ...formData, ffmKg: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent outline-none transition"
                    placeholder="55"
                    step="0.1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Músculo Esquelético (kg)
                  </label>
                  <input
                    type="number"
                    value={formData.skeletalMuscleKg}
                    onChange={(e) =>
                      setFormData({ ...formData, skeletalMuscleKg: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent outline-none transition"
                    placeholder="30"
                    step="0.1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Índice de Gordura Visceral
                  </label>
                  <input
                    type="number"
                    value={formData.visceralFatIndex}
                    onChange={(e) =>
                      setFormData({ ...formData, visceralFatIndex: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent outline-none transition"
                    placeholder="8"
                    step="0.1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Água Corporal Total (L)
                  </label>
                  <input
                    type="number"
                    value={formData.tbwL}
                    onChange={(e) => setFormData({ ...formData, tbwL: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent outline-none transition"
                    placeholder="40"
                    step="0.1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Água Extracelular (L)
                  </label>
                  <input
                    type="number"
                    value={formData.ecwL}
                    onChange={(e) => setFormData({ ...formData, ecwL: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent outline-none transition"
                    placeholder="15"
                    step="0.1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Água Intracelular (L)
                  </label>
                  <input
                    type="number"
                    value={formData.icwL}
                    onChange={(e) => setFormData({ ...formData, icwL: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent outline-none transition"
                    placeholder="25"
                    step="0.1"
                  />
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-secondary hover:bg-blue-600 disabled:bg-gray-400 text-white font-semibold py-3 rounded-lg transition-colors shadow-md hover:shadow-lg"
              >
                {loading ? 'Salvando e Calculando...' : 'Salvar Avaliação'}
              </button>
              <button
                type="button"
                onClick={() => navigate(`/patients/${patientId}`)}
                className="px-6 py-3 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
}
