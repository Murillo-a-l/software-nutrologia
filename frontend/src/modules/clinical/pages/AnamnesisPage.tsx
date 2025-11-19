import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Layout } from '../../../components/Layout';
import { apiClient } from '../../../api/client';
import type { Patient, CreateClinicalIntakeData } from '../../../types';

const GOALS_OPTIONS = [
  { value: 'emagrecimento', label: 'Emagrecimento' },
  { value: 'hipertrofia', label: 'Hipertrofia' },
  { value: 'performance', label: 'Performance esportiva' },
  { value: 'longevidade', label: 'Longevidade' },
  { value: 'saude_geral', label: 'Saúde geral' },
];

const SLEEP_QUALITY_OPTIONS = [
  { value: 'ruim', label: 'Ruim' },
  { value: 'regular', label: 'Regular' },
  { value: 'boa', label: 'Boa' },
  { value: 'excelente', label: 'Excelente' },
];

const ALCOHOL_FREQUENCY_OPTIONS = [
  { value: 'nunca', label: 'Nunca' },
  { value: 'raramente', label: 'Raramente' },
  { value: 'social', label: 'Social' },
  { value: 'frequente', label: 'Frequente' },
  { value: 'diario', label: 'Diário' },
];

const ACTIVITY_LEVEL_OPTIONS = [
  { value: 'sedentario', label: 'Sedentário' },
  { value: 'leve', label: 'Leve' },
  { value: 'moderado', label: 'Moderado' },
  { value: 'intenso', label: 'Intenso' },
  { value: 'atleta', label: 'Atleta' },
];

const ULTRA_PROCESSED_OPTIONS = [
  { value: 'nunca', label: 'Nunca' },
  { value: 'raramente', label: 'Raramente' },
  { value: 'semanal', label: 'Semanalmente' },
  { value: 'diario', label: 'Diariamente' },
];

const initialFormState: CreateClinicalIntakeData = {
  mainComplaint: '',
  goals: [],
  hasHypertension: false,
  hasDiabetes: false,
  hasPrediabetes: false,
  hasDyslipidemia: false,
  hasSteatosis: false,
  hasThyroidDisorder: false,
  otherComorbidities: '',
  familyHistoryCV: false,
  familyHistoryDM: false,
  familyHistoryObesity: false,
  familyHistoryNotes: '',
  sleepHoursAvg: undefined,
  sleepQuality: '',
  isSmoker: false,
  smokingDetails: '',
  alcoholFrequency: '',
  physicalActivityLevel: '',
  physicalActivityType: '',
  ultraProcessedFreq: '',
  waterIntakeLiters: undefined,
  hasFatigue: false,
  hasPerformanceDrop: false,
  hasAmenorrhea: false,
  hasStressFractures: false,
  hasFrequentInfections: false,
  hasDigestiveIssues: false,
  hasMoodChanges: false,
  otherSymptoms: '',
  currentMedications: '',
  currentSupplements: '',
  notes: '',
};

export function AnamnesisPage() {
  const [searchParams] = useSearchParams();
  const patientId = searchParams.get('patientId');

  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedPatientId, setSelectedPatientId] = useState<string>(patientId || '');
  const [formData, setFormData] = useState<CreateClinicalIntakeData>(initialFormState);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    loadPatients();
  }, []);

  useEffect(() => {
    if (selectedPatientId) {
      loadExistingIntake(selectedPatientId);
    } else {
      setFormData(initialFormState);
    }
  }, [selectedPatientId]);

  const loadPatients = async () => {
    try {
      const data = await apiClient.getPatients();
      setPatients(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar pacientes');
    }
  };

  const loadExistingIntake = async (patientId: string) => {
    try {
      setLoading(true);
      const intake = await apiClient.getClinicalIntake(patientId);
      if (intake) {
        setFormData({
          mainComplaint: intake.mainComplaint || '',
          goals: intake.goals || [],
          hasHypertension: intake.hasHypertension,
          hasDiabetes: intake.hasDiabetes,
          hasPrediabetes: intake.hasPrediabetes,
          hasDyslipidemia: intake.hasDyslipidemia,
          hasSteatosis: intake.hasSteatosis,
          hasThyroidDisorder: intake.hasThyroidDisorder,
          otherComorbidities: intake.otherComorbidities || '',
          familyHistoryCV: intake.familyHistoryCV,
          familyHistoryDM: intake.familyHistoryDM,
          familyHistoryObesity: intake.familyHistoryObesity,
          familyHistoryNotes: intake.familyHistoryNotes || '',
          sleepHoursAvg: intake.sleepHoursAvg,
          sleepQuality: intake.sleepQuality || '',
          isSmoker: intake.isSmoker,
          smokingDetails: intake.smokingDetails || '',
          alcoholFrequency: intake.alcoholFrequency || '',
          physicalActivityLevel: intake.physicalActivityLevel || '',
          physicalActivityType: intake.physicalActivityType || '',
          ultraProcessedFreq: intake.ultraProcessedFreq || '',
          waterIntakeLiters: intake.waterIntakeLiters,
          hasFatigue: intake.hasFatigue,
          hasPerformanceDrop: intake.hasPerformanceDrop,
          hasAmenorrhea: intake.hasAmenorrhea,
          hasStressFractures: intake.hasStressFractures,
          hasFrequentInfections: intake.hasFrequentInfections,
          hasDigestiveIssues: intake.hasDigestiveIssues,
          hasMoodChanges: intake.hasMoodChanges,
          otherSymptoms: intake.otherSymptoms || '',
          currentMedications: intake.currentMedications || '',
          currentSupplements: intake.currentSupplements || '',
          notes: intake.notes || '',
        });
      } else {
        setFormData(initialFormState);
      }
    } catch (err) {
      // Ignore 404 errors
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatientId) {
      setError('Selecione um paciente');
      return;
    }

    try {
      setSaving(true);
      setError(null);
      setSuccess(false);

      await apiClient.saveClinicalIntake(selectedPatientId, formData);

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar anamnese');
    } finally {
      setSaving(false);
    }
  };

  const handleGoalToggle = (goalValue: string) => {
    const currentGoals = formData.goals || [];
    if (currentGoals.includes(goalValue)) {
      setFormData({ ...formData, goals: currentGoals.filter((g) => g !== goalValue) });
    } else {
      setFormData({ ...formData, goals: [...currentGoals, goalValue] });
    }
  };

  const selectedPatient = patients.find((p) => p.id === selectedPatientId);

  return (
    <Layout>
      <div className="rounded-3xl border border-[#e2e0db] bg-white/90 p-6 shadow-sm">
        <p className="text-[11px] uppercase tracking-[0.4em] text-[#7a838b]">Clínico</p>
        <h1 className="mt-2 text-3xl font-semibold text-[#0c2332]">Anamnese inteligente</h1>
        <p className="mt-2 text-sm text-[#4f5a63]">
          Colete antecedentes clínicos, estilo de vida e sintomas para cálculo de riscos.
        </p>
      </div>

      {/* Patient selector */}
      <div className="rounded-2xl border border-[#e2e0db] bg-white/90 p-5 shadow-sm">
        <label className="block text-sm font-semibold text-[#0c2332]">Selecionar Paciente</label>
        <select
          value={selectedPatientId}
          onChange={(e) => setSelectedPatientId(e.target.value)}
          className="mt-2 w-full rounded-xl border border-[#e2e0db] bg-white px-4 py-3 text-sm text-[#0c2332] focus:border-[#35d0a0] focus:outline-none"
        >
          <option value="">Escolha um paciente...</option>
          {patients.map((patient) => (
            <option key={patient.id} value={patient.id}>
              {patient.name}
            </option>
          ))}
        </select>
        {selectedPatient && (
          <p className="mt-2 text-xs text-[#7a838b]">
            Sexo: {selectedPatient.sex === 'M' ? 'Masculino' : selectedPatient.sex === 'F' ? 'Feminino' : 'Outro'} •
            Altura: {selectedPatient.heightM?.toFixed(2)}m
          </p>
        )}
      </div>

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
      )}

      {success && (
        <div className="rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          Anamnese salva com sucesso!
        </div>
      )}

      {loading ? (
        <div className="rounded-2xl border border-[#e2e0db] bg-white/90 px-6 py-12 text-center shadow-sm">
          <p className="text-sm text-[#7a838b]">Carregando dados...</p>
        </div>
      ) : selectedPatientId ? (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Main Complaint & Goals */}
          <div className="rounded-2xl border border-[#e2e0db] bg-white/90 p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-[#0c2332]">Queixa principal e objetivos</h2>
            <div className="mt-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#5c6772]">Queixa principal / Motivo da consulta</label>
                <textarea
                  value={formData.mainComplaint}
                  onChange={(e) => setFormData({ ...formData, mainComplaint: e.target.value })}
                  rows={3}
                  className="mt-2 w-full rounded-xl border border-[#e2e0db] bg-white px-4 py-3 text-sm text-[#0c2332] focus:border-[#35d0a0] focus:outline-none"
                  placeholder="Descreva o motivo principal da consulta..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#5c6772]">Objetivos</label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {GOALS_OPTIONS.map((goal) => (
                    <button
                      key={goal.value}
                      type="button"
                      onClick={() => handleGoalToggle(goal.value)}
                      className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                        formData.goals?.includes(goal.value)
                          ? 'bg-[#35d0a0] text-[#0c2332]'
                          : 'bg-[#f5f3f0] text-[#5c6772] hover:bg-[#e2e0db]'
                      }`}
                    >
                      {goal.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Comorbidities */}
          <div className="rounded-2xl border border-[#e2e0db] bg-white/90 p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-[#0c2332]">Comorbidades</h2>
            <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-3">
              <CheckboxField
                label="Hipertensão (HAS)"
                checked={formData.hasHypertension || false}
                onChange={(checked) => setFormData({ ...formData, hasHypertension: checked })}
              />
              <CheckboxField
                label="Diabetes tipo 2"
                checked={formData.hasDiabetes || false}
                onChange={(checked) => setFormData({ ...formData, hasDiabetes: checked })}
              />
              <CheckboxField
                label="Pré-diabetes"
                checked={formData.hasPrediabetes || false}
                onChange={(checked) => setFormData({ ...formData, hasPrediabetes: checked })}
              />
              <CheckboxField
                label="Dislipidemia"
                checked={formData.hasDyslipidemia || false}
                onChange={(checked) => setFormData({ ...formData, hasDyslipidemia: checked })}
              />
              <CheckboxField
                label="Esteatose hepática"
                checked={formData.hasSteatosis || false}
                onChange={(checked) => setFormData({ ...formData, hasSteatosis: checked })}
              />
              <CheckboxField
                label="Distúrbio tireoidiano"
                checked={formData.hasThyroidDisorder || false}
                onChange={(checked) => setFormData({ ...formData, hasThyroidDisorder: checked })}
              />
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-[#5c6772]">Outras comorbidades</label>
              <input
                type="text"
                value={formData.otherComorbidities}
                onChange={(e) => setFormData({ ...formData, otherComorbidities: e.target.value })}
                className="mt-2 w-full rounded-xl border border-[#e2e0db] bg-white px-4 py-3 text-sm text-[#0c2332] focus:border-[#35d0a0] focus:outline-none"
                placeholder="Liste outras condições relevantes..."
              />
            </div>
          </div>

          {/* Family History */}
          <div className="rounded-2xl border border-[#e2e0db] bg-white/90 p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-[#0c2332]">Histórico familiar</h2>
            <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-3">
              <CheckboxField
                label="Doença CV precoce (IAM/AVC)"
                checked={formData.familyHistoryCV || false}
                onChange={(checked) => setFormData({ ...formData, familyHistoryCV: checked })}
              />
              <CheckboxField
                label="Diabetes"
                checked={formData.familyHistoryDM || false}
                onChange={(checked) => setFormData({ ...formData, familyHistoryDM: checked })}
              />
              <CheckboxField
                label="Obesidade"
                checked={formData.familyHistoryObesity || false}
                onChange={(checked) => setFormData({ ...formData, familyHistoryObesity: checked })}
              />
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-[#5c6772]">Observações sobre histórico familiar</label>
              <input
                type="text"
                value={formData.familyHistoryNotes}
                onChange={(e) => setFormData({ ...formData, familyHistoryNotes: e.target.value })}
                className="mt-2 w-full rounded-xl border border-[#e2e0db] bg-white px-4 py-3 text-sm text-[#0c2332] focus:border-[#35d0a0] focus:outline-none"
                placeholder="Detalhes adicionais..."
              />
            </div>
          </div>

          {/* Lifestyle */}
          <div className="rounded-2xl border border-[#e2e0db] bg-white/90 p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-[#0c2332]">Estilo de vida</h2>
            <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-[#5c6772]">Horas de sono (média)</label>
                <input
                  type="number"
                  step="0.5"
                  min="0"
                  max="24"
                  value={formData.sleepHoursAvg || ''}
                  onChange={(e) => setFormData({ ...formData, sleepHoursAvg: e.target.value ? parseFloat(e.target.value) : undefined })}
                  className="mt-2 w-full rounded-xl border border-[#e2e0db] bg-white px-4 py-3 text-sm text-[#0c2332] focus:border-[#35d0a0] focus:outline-none"
                  placeholder="7.5"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#5c6772]">Qualidade do sono</label>
                <select
                  value={formData.sleepQuality}
                  onChange={(e) => setFormData({ ...formData, sleepQuality: e.target.value })}
                  className="mt-2 w-full rounded-xl border border-[#e2e0db] bg-white px-4 py-3 text-sm text-[#0c2332] focus:border-[#35d0a0] focus:outline-none"
                >
                  <option value="">Selecione...</option>
                  {SLEEP_QUALITY_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#5c6772]">Consumo de álcool</label>
                <select
                  value={formData.alcoholFrequency}
                  onChange={(e) => setFormData({ ...formData, alcoholFrequency: e.target.value })}
                  className="mt-2 w-full rounded-xl border border-[#e2e0db] bg-white px-4 py-3 text-sm text-[#0c2332] focus:border-[#35d0a0] focus:outline-none"
                >
                  <option value="">Selecione...</option>
                  {ALCOHOL_FREQUENCY_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#5c6772]">Nível de atividade física</label>
                <select
                  value={formData.physicalActivityLevel}
                  onChange={(e) => setFormData({ ...formData, physicalActivityLevel: e.target.value })}
                  className="mt-2 w-full rounded-xl border border-[#e2e0db] bg-white px-4 py-3 text-sm text-[#0c2332] focus:border-[#35d0a0] focus:outline-none"
                >
                  <option value="">Selecione...</option>
                  {ACTIVITY_LEVEL_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#5c6772]">Tipo de atividade física</label>
                <input
                  type="text"
                  value={formData.physicalActivityType}
                  onChange={(e) => setFormData({ ...formData, physicalActivityType: e.target.value })}
                  className="mt-2 w-full rounded-xl border border-[#e2e0db] bg-white px-4 py-3 text-sm text-[#0c2332] focus:border-[#35d0a0] focus:outline-none"
                  placeholder="Ex: Musculação, corrida..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#5c6772]">Ultra-processados</label>
                <select
                  value={formData.ultraProcessedFreq}
                  onChange={(e) => setFormData({ ...formData, ultraProcessedFreq: e.target.value })}
                  className="mt-2 w-full rounded-xl border border-[#e2e0db] bg-white px-4 py-3 text-sm text-[#0c2332] focus:border-[#35d0a0] focus:outline-none"
                >
                  <option value="">Selecione...</option>
                  {ULTRA_PROCESSED_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#5c6772]">Ingestão de água (L/dia)</label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="10"
                  value={formData.waterIntakeLiters || ''}
                  onChange={(e) => setFormData({ ...formData, waterIntakeLiters: e.target.value ? parseFloat(e.target.value) : undefined })}
                  className="mt-2 w-full rounded-xl border border-[#e2e0db] bg-white px-4 py-3 text-sm text-[#0c2332] focus:border-[#35d0a0] focus:outline-none"
                  placeholder="2.0"
                />
              </div>
              <div className="flex items-center gap-3">
                <CheckboxField
                  label="Tabagista"
                  checked={formData.isSmoker || false}
                  onChange={(checked) => setFormData({ ...formData, isSmoker: checked })}
                />
              </div>
            </div>
            {formData.isSmoker && (
              <div className="mt-4">
                <label className="block text-sm font-medium text-[#5c6772]">Detalhes do tabagismo</label>
                <input
                  type="text"
                  value={formData.smokingDetails}
                  onChange={(e) => setFormData({ ...formData, smokingDetails: e.target.value })}
                  className="mt-2 w-full rounded-xl border border-[#e2e0db] bg-white px-4 py-3 text-sm text-[#0c2332] focus:border-[#35d0a0] focus:outline-none"
                  placeholder="Quantidade, há quanto tempo..."
                />
              </div>
            )}
          </div>

          {/* Symptoms */}
          <div className="rounded-2xl border border-[#e2e0db] bg-white/90 p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-[#0c2332]">Sintomas relevantes</h2>
            <p className="mt-1 text-xs text-[#7a838b]">Para avaliação de riscos como RED-S</p>
            <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-3">
              <CheckboxField
                label="Fadiga crônica"
                checked={formData.hasFatigue || false}
                onChange={(checked) => setFormData({ ...formData, hasFatigue: checked })}
              />
              <CheckboxField
                label="Queda de performance"
                checked={formData.hasPerformanceDrop || false}
                onChange={(checked) => setFormData({ ...formData, hasPerformanceDrop: checked })}
              />
              <CheckboxField
                label="Amenorreia"
                checked={formData.hasAmenorrhea || false}
                onChange={(checked) => setFormData({ ...formData, hasAmenorrhea: checked })}
              />
              <CheckboxField
                label="Fraturas por estresse"
                checked={formData.hasStressFractures || false}
                onChange={(checked) => setFormData({ ...formData, hasStressFractures: checked })}
              />
              <CheckboxField
                label="Infecções frequentes"
                checked={formData.hasFrequentInfections || false}
                onChange={(checked) => setFormData({ ...formData, hasFrequentInfections: checked })}
              />
              <CheckboxField
                label="Problemas digestivos"
                checked={formData.hasDigestiveIssues || false}
                onChange={(checked) => setFormData({ ...formData, hasDigestiveIssues: checked })}
              />
              <CheckboxField
                label="Alterações de humor"
                checked={formData.hasMoodChanges || false}
                onChange={(checked) => setFormData({ ...formData, hasMoodChanges: checked })}
              />
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-[#5c6772]">Outros sintomas</label>
              <input
                type="text"
                value={formData.otherSymptoms}
                onChange={(e) => setFormData({ ...formData, otherSymptoms: e.target.value })}
                className="mt-2 w-full rounded-xl border border-[#e2e0db] bg-white px-4 py-3 text-sm text-[#0c2332] focus:border-[#35d0a0] focus:outline-none"
                placeholder="Descreva outros sintomas relevantes..."
              />
            </div>
          </div>

          {/* Medications */}
          <div className="rounded-2xl border border-[#e2e0db] bg-white/90 p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-[#0c2332]">Medicamentos e suplementos</h2>
            <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-[#5c6772]">Medicamentos em uso</label>
                <textarea
                  value={formData.currentMedications}
                  onChange={(e) => setFormData({ ...formData, currentMedications: e.target.value })}
                  rows={3}
                  className="mt-2 w-full rounded-xl border border-[#e2e0db] bg-white px-4 py-3 text-sm text-[#0c2332] focus:border-[#35d0a0] focus:outline-none"
                  placeholder="Liste os medicamentos..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#5c6772]">Suplementos em uso</label>
                <textarea
                  value={formData.currentSupplements}
                  onChange={(e) => setFormData({ ...formData, currentSupplements: e.target.value })}
                  rows={3}
                  className="mt-2 w-full rounded-xl border border-[#e2e0db] bg-white px-4 py-3 text-sm text-[#0c2332] focus:border-[#35d0a0] focus:outline-none"
                  placeholder="Liste os suplementos..."
                />
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="rounded-2xl border border-[#e2e0db] bg-white/90 p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-[#0c2332]">Observações gerais</h2>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={4}
              className="mt-4 w-full rounded-xl border border-[#e2e0db] bg-white px-4 py-3 text-sm text-[#0c2332] focus:border-[#35d0a0] focus:outline-none"
              placeholder="Anotações adicionais sobre o paciente..."
            />
          </div>

          {/* Submit */}
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setFormData(initialFormState)}
              className="rounded-2xl border border-[#e2e0db] bg-white px-6 py-3 text-sm font-semibold text-[#5c6772] hover:bg-[#f5f3f0]"
            >
              Limpar
            </button>
            <button
              type="submit"
              disabled={saving}
              className="rounded-2xl bg-[#35d0a0] px-6 py-3 text-sm font-semibold text-[#0c2332] shadow-sm hover:bg-[#2eb48a] disabled:opacity-60"
            >
              {saving ? 'Salvando...' : 'Salvar anamnese'}
            </button>
          </div>
        </form>
      ) : (
        <div className="rounded-2xl border border-[#e2e0db] bg-white/90 px-6 py-12 text-center shadow-sm">
          <p className="text-sm text-[#7a838b]">Selecione um paciente para iniciar a anamnese.</p>
        </div>
      )}
    </Layout>
  );
}

interface CheckboxFieldProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

function CheckboxField({ label, checked, onChange }: CheckboxFieldProps) {
  return (
    <label className="flex cursor-pointer items-center gap-2">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4 rounded border-[#e2e0db] text-[#35d0a0] focus:ring-[#35d0a0]"
      />
      <span className="text-sm text-[#5c6772]">{label}</span>
    </label>
  );
}
