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
        <div className="max-w-5xl mx-auto space-y-6">
          <div className="bg-success/10 border border-success/30 text-success px-6 py-4 rounded-2xl">
            <h2 className="text-xl font-semibold">Avaliação salva com sucesso</h2>
            <p className="text-sm mt-1">Os indicadores foram calculados automaticamente e já estão disponíveis no histórico do paciente.</p>
          </div>

          <div className="bg-card border border-border rounded-2xl shadow-sm p-6 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-wide text-muted">Paciente</p>
                <h2 className="text-2xl font-semibold text-primary">{patient.name}</h2>
              </div>
              <div className="text-right">
                <p className="text-xs uppercase tracking-wide text-muted">Data da avaliação</p>
                <p className="text-lg font-semibold text-gray-900">{savedAssessment.dateTime}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {metrics.bmi && (
                <div className="p-4 rounded-2xl border border-border bg-background">
                  <p className="text-xs uppercase tracking-wide text-muted">IMC</p>
                  <p className="text-2xl font-semibold text-gray-900">{metrics.bmi.toFixed(1)}</p>
                  <p className="text-sm text-muted">{metrics.bmiCategory}</p>
                </div>
              )}
              {savedAssessment.bfPercent && (
                <div className="p-4 rounded-2xl border border-border bg-background">
                  <p className="text-xs uppercase tracking-wide text-muted">% Gordura</p>
                  <p className="text-2xl font-semibold text-gray-900">{savedAssessment.bfPercent.toFixed(1)}%</p>
                  {metrics.fatMassKg && (
                    <p className="text-sm text-muted">{metrics.fatMassKg.toFixed(1)} kg</p>
                  )}
                </div>
              )}
              {metrics.bodyCompScore !== undefined && (
                <div className="p-4 rounded-2xl border border-border bg-background">
                  <p className="text-xs uppercase tracking-wide text-muted">Body Comp Score</p>
                  <p className="text-2xl font-semibold text-gray-900">{metrics.bodyCompScore}/100</p>
                  <p className="text-sm text-muted">Índice de composição corporal</p>
                </div>
              )}
              {metrics.tdee && (
                <div className="p-4 rounded-2xl border border-border bg-background">
                  <p className="text-xs uppercase tracking-wide text-muted">TDEE</p>
                  <p className="text-2xl font-semibold text-gray-900">{metrics.tdee.toFixed(0)} kcal</p>
                  <p className="text-sm text-muted">Gasto energético diário</p>
                </div>
              )}
              {metrics.metabolicAgeYears && (
                <div className="p-4 rounded-2xl border border-border bg-background">
                  <p className="text-xs uppercase tracking-wide text-muted">Idade metabólica</p>
                  <p className="text-2xl font-semibold text-gray-900">{metrics.metabolicAgeYears} anos</p>
                </div>
              )}
              {metrics.cardiometabolicRiskLevel && (
                <div className="p-4 rounded-2xl border border-border bg-background">
                  <p className="text-xs uppercase tracking-wide text-muted">Risco cardiometabólico</p>
                  <p className="text-2xl font-semibold text-gray-900 capitalize">{metrics.cardiometabolicRiskLevel}</p>
                  <p className="text-sm text-muted">Score {metrics.cardiometabolicScore}</p>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => navigate(`/patients/${patientId}`)}
              className="flex-1 min-w-[200px] bg-accent text-white rounded-xl px-4 py-3 font-semibold shadow-sm hover:bg-sky-500 transition"
            >
              Voltar para o paciente
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
              className="px-6 py-3 border border-border rounded-xl font-semibold text-primary bg-white hover:bg-gray-50"
            >
              Registrar nova avaliação
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  // Form de avaliação
  return (
    <Layout>
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted">Avaliação clínica</p>
          <h1 className="text-3xl font-semibold text-primary mt-2">Nova avaliação</h1>
          <p className="text-sm text-muted mt-1">Paciente: {patient.name}</p>
        </div>

        {/* Form */}
        <div className="bg-card border border-border rounded-2xl shadow-sm p-6">
          {error && (
            <div className="mb-6 bg-danger/10 border border-danger/30 text-danger px-4 py-3 rounded-xl">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Dados da avaliação */}
            <section className="space-y-4">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-muted">Sessão 01</p>
                <h2 className="text-xl font-semibold text-gray-900">Dados da avaliação</h2>
                <p className="text-sm text-muted">Defina data e medidas principais coletadas em consultório.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-primary">Data da avaliação</label>
                  <input
                    type="text"
                    value={formData.dateTime}
                    onChange={(e) => setFormData({ ...formData, dateTime: e.target.value })}
                    className="w-full rounded-xl border border-border px-4 py-2 focus:ring-2 focus:ring-accent focus:border-transparent outline-none bg-white"
                    placeholder="DD/MM/AAAA"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-primary">
                    Peso (kg) <span className="text-danger">*</span>
                  </label>
                  <input
                    type="number"
                    value={formData.weightKg}
                    onChange={(e) => setFormData({ ...formData, weightKg: e.target.value })}
                    className="w-full rounded-xl border border-border px-4 py-2 focus:ring-2 focus:ring-accent focus:border-transparent outline-none bg-white"
                    placeholder="75.5"
                    step="0.1"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-primary">% Gordura corporal</label>
                  <input
                    type="number"
                    value={formData.bfPercent}
                    onChange={(e) => setFormData({ ...formData, bfPercent: e.target.value })}
                    className="w-full rounded-xl border border-border px-4 py-2 focus:ring-2 focus:ring-accent focus:border-transparent outline-none bg-white"
                    placeholder="25.5"
                    step="0.1"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-primary">Nível de atividade física</label>
                  <select
                    value={formData.activityLevel}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        activityLevel: e.target.value as any,
                      })
                    }
                    className="w-full rounded-xl border border-border px-4 py-2 focus:ring-2 focus:ring-accent focus:border-transparent outline-none bg-white"
                  >
                    <option value="SEDENTARIO">Sedentário</option>
                    <option value="LEVE">Leve</option>
                    <option value="MODERADO">Moderado</option>
                    <option value="INTENSO">Intenso</option>
                    <option value="ATLETA">Atleta</option>
                  </select>
                </div>
              </div>
            </section>

            {/* Antropometria */}
            <section className="space-y-4">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-muted">Sessão 02</p>
                <h2 className="text-xl font-semibold text-gray-900">Antropometria</h2>
                <p className="text-sm text-muted">Circunferências e medidas lineares para cálculo de RCQ/RCA.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-primary">Circunferência da cintura (cm)</label>
                  <input
                    type="number"
                    value={formData.waistCm}
                    onChange={(e) => setFormData({ ...formData, waistCm: e.target.value })}
                    className="w-full rounded-xl border border-border px-4 py-2 focus:ring-2 focus:ring-accent focus:border-transparent outline-none bg-white"
                    placeholder="80"
                    step="0.1"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-primary">Circunferência do quadril (cm)</label>
                  <input
                    type="number"
                    value={formData.hipCm}
                    onChange={(e) => setFormData({ ...formData, hipCm: e.target.value })}
                    className="w-full rounded-xl border border-border px-4 py-2 focus:ring-2 focus:ring-accent focus:border-transparent outline-none bg-white"
                    placeholder="95"
                    step="0.1"
                  />
                </div>
              </div>
            </section>

            {/* Bioimpedância */}
            <section className="space-y-4">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-muted">Sessão 03</p>
                <h2 className="text-xl font-semibold text-gray-900">Bioimpedância (opcional)</h2>
                <p className="text-sm text-muted">Preencha quando houver dados do equipamento para enriquecer os cálculos.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-primary">Massa livre de gordura (kg)</label>
                  <input
                    type="number"
                    value={formData.ffmKg}
                    onChange={(e) => setFormData({ ...formData, ffmKg: e.target.value })}
                    className="w-full rounded-xl border border-border px-4 py-2 focus:ring-2 focus:ring-accent focus:border-transparent outline-none bg-white"
                    placeholder="55"
                    step="0.1"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-primary">Músculo esquelético (kg)</label>
                  <input
                    type="number"
                    value={formData.skeletalMuscleKg}
                    onChange={(e) => setFormData({ ...formData, skeletalMuscleKg: e.target.value })}
                    className="w-full rounded-xl border border-border px-4 py-2 focus:ring-2 focus:ring-accent focus:border-transparent outline-none bg-white"
                    placeholder="30"
                    step="0.1"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-primary">Índice de gordura visceral</label>
                  <input
                    type="number"
                    value={formData.visceralFatIndex}
                    onChange={(e) => setFormData({ ...formData, visceralFatIndex: e.target.value })}
                    className="w-full rounded-xl border border-border px-4 py-2 focus:ring-2 focus:ring-accent focus:border-transparent outline-none bg-white"
                    placeholder="8"
                    step="0.1"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-primary">Água corporal total (L)</label>
                  <input
                    type="number"
                    value={formData.tbwL}
                    onChange={(e) => setFormData({ ...formData, tbwL: e.target.value })}
                    className="w-full rounded-xl border border-border px-4 py-2 focus:ring-2 focus:ring-accent focus:border-transparent outline-none bg-white"
                    placeholder="40"
                    step="0.1"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-primary">Água extracelular (L)</label>
                  <input
                    type="number"
                    value={formData.ecwL}
                    onChange={(e) => setFormData({ ...formData, ecwL: e.target.value })}
                    className="w-full rounded-xl border border-border px-4 py-2 focus:ring-2 focus:ring-accent focus:border-transparent outline-none bg-white"
                    placeholder="15"
                    step="0.1"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-primary">Água intracelular (L)</label>
                  <input
                    type="number"
                    value={formData.icwL}
                    onChange={(e) => setFormData({ ...formData, icwL: e.target.value })}
                    className="w-full rounded-xl border border-border px-4 py-2 focus:ring-2 focus:ring-accent focus:border-transparent outline-none bg-white"
                    placeholder="25"
                    step="0.1"
                  />
                </div>
              </div>
            </section>

            {/* Placeholder for future sections */}
            <section className="space-y-2">
              <p className="text-xs uppercase tracking-[0.3em] text-muted">Sessão 04</p>
              <div className="rounded-2xl border border-dashed border-border p-4 text-sm text-muted">
                Dobras cutâneas (em breve)
              </div>
            </section>

            {/* Actions */}
            <div className="flex flex-wrap gap-3 pt-2">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 min-w-[200px] bg-accent text-white rounded-xl px-4 py-3 font-semibold shadow-sm hover:bg-sky-500 transition disabled:opacity-70"
              >
                {loading ? 'Salvando avaliação...' : 'Salvar avaliação'}
              </button>
              <button
                type="button"
                onClick={() => navigate(`/patients/${patientId}`)}
                className="px-6 py-3 border border-border rounded-xl font-semibold text-primary bg-white hover:bg-gray-50"
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
