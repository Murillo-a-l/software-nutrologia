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

// Extended form state with physical exam
interface AnamnesisFormData extends CreateClinicalIntakeData {
  // Physical Exam
  bloodPressure?: string;
  heartRate?: string;
  temperature?: string;
  respiratoryRate?: string;
  oxygenSaturation?: string;
  generalCondition?: string;
  headNeck?: string;
  cardiovascular?: string;
  respiratory?: string;
  abdomen?: string;
  psychism?: string;
  spine?: string;
  upperLimbs?: string;
  lowerLimbs?: string;
  // Diagnostic hypothesis and plan
  diagnosticHypothesis?: string;
  plan?: string;
}

const initialFormState: AnamnesisFormData = {
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
  // Physical exam defaults
  bloodPressure: '',
  heartRate: '',
  temperature: '',
  respiratoryRate: '',
  oxygenSaturation: '',
  generalCondition: 'BEG, corado, hidratado, acianótico, anictérico, eupneico, afebril',
  headNeck: 'Sem dor a palpação muscular, sem linfonodos palpáveis',
  cardiovascular: 'BCR NF 2T SS, pulsos periféricos presentes bilateralmente e simétricos',
  respiratory: 'MV presente bilateralmente, simétrico. Sem RA.',
  abdomen: 'RHA+, flácido, plano, percussão sem anormalidades, indolor a palpação superficial e profunda nos quatro quadrantes.',
  psychism: 'Lúcido, orientado no tempo e espaço, pensamentos lineares.',
  spine: 'Sem dor a palpação de musculatura paravertebral, sem contratura muscular.',
  upperLimbs: 'Força grau V bilateral, trofismo adequado para a idade, sensibilidade adequada',
  lowerLimbs: 'Força grau V bilateral, trofismo adequado para a idade, sensibilidade adequada, sem encurtamento muscular',
  diagnosticHypothesis: '',
  plan: '',
};

export function AnamnesisPage() {
  const [searchParams] = useSearchParams();
  const patientId = searchParams.get('patientId');

  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedPatientId, setSelectedPatientId] = useState<string>(patientId || '');
  const [formData, setFormData] = useState<AnamnesisFormData>(initialFormState);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Dynamic list items for family history
  const [familyHistoryItems, setFamilyHistoryItems] = useState<string[]>([]);
  const [newFamilyItem, setNewFamilyItem] = useState('');

  // Dynamic list items for comorbidities
  const [comorbidityItems, setComorbidityItems] = useState<string[]>([]);
  const [newComorbidityItem, setNewComorbidityItem] = useState('');

  useEffect(() => {
    loadPatients();
  }, []);

  useEffect(() => {
    if (selectedPatientId) {
      loadExistingIntake(selectedPatientId);
    } else {
      setFormData(initialFormState);
      setFamilyHistoryItems([]);
      setComorbidityItems([]);
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
        // Parse family history notes as list
        const familyNotes = intake.familyHistoryNotes || '';
        const familyItems = familyNotes ? familyNotes.split('\n').filter(Boolean) : [];
        setFamilyHistoryItems(familyItems);

        // Parse other comorbidities as list
        const comorbNotes = intake.otherComorbidities || '';
        const comorbItems = comorbNotes ? comorbNotes.split('\n').filter(Boolean) : [];
        setComorbidityItems(comorbItems);

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
          // Reset physical exam to defaults if not saved
          ...initialFormState,
        });
      } else {
        setFormData(initialFormState);
        setFamilyHistoryItems([]);
        setComorbidityItems([]);
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

      // Combine family history items into notes
      const familyNotes = familyHistoryItems.join('\n');
      const comorbNotes = comorbidityItems.join('\n');

      await apiClient.saveClinicalIntake(selectedPatientId, {
        ...formData,
        familyHistoryNotes: familyNotes,
        otherComorbidities: comorbNotes,
        // Store physical exam and HD/Plan in notes for now
        notes: JSON.stringify({
          physicalExam: {
            bloodPressure: formData.bloodPressure,
            heartRate: formData.heartRate,
            temperature: formData.temperature,
            respiratoryRate: formData.respiratoryRate,
            oxygenSaturation: formData.oxygenSaturation,
            generalCondition: formData.generalCondition,
            headNeck: formData.headNeck,
            cardiovascular: formData.cardiovascular,
            respiratory: formData.respiratory,
            abdomen: formData.abdomen,
            psychism: formData.psychism,
            spine: formData.spine,
            upperLimbs: formData.upperLimbs,
            lowerLimbs: formData.lowerLimbs,
          },
          diagnosticHypothesis: formData.diagnosticHypothesis,
          plan: formData.plan,
          additionalNotes: formData.notes,
        }),
      });

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

  const addFamilyHistoryItem = () => {
    if (newFamilyItem.trim()) {
      setFamilyHistoryItems([...familyHistoryItems, newFamilyItem.trim()]);
      setNewFamilyItem('');
    }
  };

  const removeFamilyHistoryItem = (index: number) => {
    setFamilyHistoryItems(familyHistoryItems.filter((_, i) => i !== index));
  };

  const addComorbidityItem = () => {
    if (newComorbidityItem.trim()) {
      setComorbidityItems([...comorbidityItems, newComorbidityItem.trim()]);
      setNewComorbidityItem('');
    }
  };

  const removeComorbidityItem = (index: number) => {
    setComorbidityItems(comorbidityItems.filter((_, i) => i !== index));
  };

  const selectedPatient = patients.find((p) => p.id === selectedPatientId);

  return (
    <Layout>
      <div className="rounded-3xl border border-[#e2e0db] bg-white/90 p-6 shadow-sm">
        <p className="text-[11px] uppercase tracking-[0.4em] text-[#7a838b]">Clínico</p>
        <h1 className="mt-2 text-3xl font-semibold text-[#0c2332]">Anamnese completa</h1>
        <p className="mt-2 text-sm text-[#4f5a63]">
          Roteiro médico completo: QP, HDA, antecedentes, exame físico, HD e plano.
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
          {/* QP - Queixa Principal */}
          <div className="rounded-2xl border border-[#e2e0db] bg-white/90 p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-[#0c2332]">QP - Queixa Principal</h2>
            <textarea
              value={formData.mainComplaint}
              onChange={(e) => setFormData({ ...formData, mainComplaint: e.target.value })}
              rows={2}
              className="mt-3 w-full rounded-xl border border-[#e2e0db] bg-white px-4 py-3 text-sm text-[#0c2332] focus:border-[#35d0a0] focus:outline-none"
              placeholder="Descreva a queixa principal do paciente..."
            />
          </div>

          {/* MUC - Medicamentos em Uso Contínuo */}
          <div className="rounded-2xl border border-[#e2e0db] bg-white/90 p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-[#0c2332]">MUC - Medicamentos em Uso Contínuo</h2>
            <textarea
              value={formData.currentMedications}
              onChange={(e) => setFormData({ ...formData, currentMedications: e.target.value })}
              rows={3}
              className="mt-3 w-full rounded-xl border border-[#e2e0db] bg-white px-4 py-3 text-sm text-[#0c2332] focus:border-[#35d0a0] focus:outline-none"
              placeholder="Liste os medicamentos em uso contínuo..."
            />
          </div>

          {/* Antecedentes Pessoais - Comorbidades */}
          <div className="rounded-2xl border border-[#e2e0db] bg-white/90 p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-[#0c2332]">Antecedentes Pessoais - Comorbidades</h2>
            <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-3">
              <CheckboxField
                label="HAS"
                checked={formData.hasHypertension || false}
                onChange={(checked) => setFormData({ ...formData, hasHypertension: checked })}
              />
              <CheckboxField
                label="DM2"
                checked={formData.hasDiabetes || false}
                onChange={(checked) => setFormData({ ...formData, hasDiabetes: checked })}
              />
              <CheckboxField
                label="Pré-DM"
                checked={formData.hasPrediabetes || false}
                onChange={(checked) => setFormData({ ...formData, hasPrediabetes: checked })}
              />
              <CheckboxField
                label="Dislipidemia"
                checked={formData.hasDyslipidemia || false}
                onChange={(checked) => setFormData({ ...formData, hasDyslipidemia: checked })}
              />
              <CheckboxField
                label="Esteatose"
                checked={formData.hasSteatosis || false}
                onChange={(checked) => setFormData({ ...formData, hasSteatosis: checked })}
              />
              <CheckboxField
                label="Tireoide"
                checked={formData.hasThyroidDisorder || false}
                onChange={(checked) => setFormData({ ...formData, hasThyroidDisorder: checked })}
              />
            </div>

            {/* Dynamic comorbidity list */}
            <div className="mt-4">
              <label className="block text-sm font-medium text-[#5c6772]">Outras comorbidades (adicione livremente)</label>
              <div className="mt-2 flex gap-2">
                <input
                  type="text"
                  value={newComorbidityItem}
                  onChange={(e) => setNewComorbidityItem(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addComorbidityItem())}
                  className="flex-1 rounded-xl border border-[#e2e0db] bg-white px-4 py-2 text-sm text-[#0c2332] focus:border-[#35d0a0] focus:outline-none"
                  placeholder="Ex: Asma, DPOC, Artrite reumatoide..."
                />
                <button
                  type="button"
                  onClick={addComorbidityItem}
                  className="rounded-xl bg-[#35d0a0] px-4 py-2 text-sm font-semibold text-[#0c2332] hover:bg-[#2eb48a]"
                >
                  +
                </button>
              </div>
              {comorbidityItems.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {comorbidityItems.map((item, index) => (
                    <span key={index} className="flex items-center gap-1 rounded-full bg-[#f5f3f0] px-3 py-1 text-sm text-[#5c6772]">
                      {item}
                      <button
                        type="button"
                        onClick={() => removeComorbidityItem(index)}
                        className="ml-1 text-[#7a838b] hover:text-red-500"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Antecedentes Familiares */}
          <div className="rounded-2xl border border-[#e2e0db] bg-white/90 p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-[#0c2332]">Antecedentes Familiares</h2>
            <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-3">
              <CheckboxField
                label="DCV precoce"
                checked={formData.familyHistoryCV || false}
                onChange={(checked) => setFormData({ ...formData, familyHistoryCV: checked })}
              />
              <CheckboxField
                label="DM"
                checked={formData.familyHistoryDM || false}
                onChange={(checked) => setFormData({ ...formData, familyHistoryDM: checked })}
              />
              <CheckboxField
                label="Obesidade"
                checked={formData.familyHistoryObesity || false}
                onChange={(checked) => setFormData({ ...formData, familyHistoryObesity: checked })}
              />
            </div>

            {/* Dynamic family history list */}
            <div className="mt-4">
              <label className="block text-sm font-medium text-[#5c6772]">Histórico detalhado (adicione livremente)</label>
              <div className="mt-2 flex gap-2">
                <input
                  type="text"
                  value={newFamilyItem}
                  onChange={(e) => setNewFamilyItem(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFamilyHistoryItem())}
                  className="flex-1 rounded-xl border border-[#e2e0db] bg-white px-4 py-2 text-sm text-[#0c2332] focus:border-[#35d0a0] focus:outline-none"
                  placeholder="Ex: Mãe - CA mama, Pai - IAM aos 52 anos..."
                />
                <button
                  type="button"
                  onClick={addFamilyHistoryItem}
                  className="rounded-xl bg-[#35d0a0] px-4 py-2 text-sm font-semibold text-[#0c2332] hover:bg-[#2eb48a]"
                >
                  +
                </button>
              </div>
              {familyHistoryItems.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {familyHistoryItems.map((item, index) => (
                    <span key={index} className="flex items-center gap-1 rounded-full bg-[#f5f3f0] px-3 py-1 text-sm text-[#5c6772]">
                      {item}
                      <button
                        type="button"
                        onClick={() => removeFamilyHistoryItem(index)}
                        className="ml-1 text-[#7a838b] hover:text-red-500"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Hábitos de Vida */}
          <div className="rounded-2xl border border-[#e2e0db] bg-white/90 p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-[#0c2332]">Hábitos de Vida</h2>
            <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
              <div>
                <label className="block text-sm font-medium text-[#5c6772]">Sono (h/noite)</label>
                <input
                  type="number"
                  step="0.5"
                  value={formData.sleepHoursAvg || ''}
                  onChange={(e) => setFormData({ ...formData, sleepHoursAvg: e.target.value ? parseFloat(e.target.value) : undefined })}
                  className="mt-2 w-full rounded-xl border border-[#e2e0db] bg-white px-4 py-2 text-sm text-[#0c2332] focus:border-[#35d0a0] focus:outline-none"
                  placeholder="7"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#5c6772]">Qualidade sono</label>
                <select
                  value={formData.sleepQuality}
                  onChange={(e) => setFormData({ ...formData, sleepQuality: e.target.value })}
                  className="mt-2 w-full rounded-xl border border-[#e2e0db] bg-white px-4 py-2 text-sm text-[#0c2332] focus:border-[#35d0a0] focus:outline-none"
                >
                  <option value="">-</option>
                  {SLEEP_QUALITY_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#5c6772]">Etilismo</label>
                <select
                  value={formData.alcoholFrequency}
                  onChange={(e) => setFormData({ ...formData, alcoholFrequency: e.target.value })}
                  className="mt-2 w-full rounded-xl border border-[#e2e0db] bg-white px-4 py-2 text-sm text-[#0c2332] focus:border-[#35d0a0] focus:outline-none"
                >
                  <option value="">-</option>
                  {ALCOHOL_FREQUENCY_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#5c6772]">Atividade física</label>
                <select
                  value={formData.physicalActivityLevel}
                  onChange={(e) => setFormData({ ...formData, physicalActivityLevel: e.target.value })}
                  className="mt-2 w-full rounded-xl border border-[#e2e0db] bg-white px-4 py-2 text-sm text-[#0c2332] focus:border-[#35d0a0] focus:outline-none"
                >
                  <option value="">-</option>
                  {ACTIVITY_LEVEL_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#5c6772]">Tipo de AF</label>
                <input
                  type="text"
                  value={formData.physicalActivityType}
                  onChange={(e) => setFormData({ ...formData, physicalActivityType: e.target.value })}
                  className="mt-2 w-full rounded-xl border border-[#e2e0db] bg-white px-4 py-2 text-sm text-[#0c2332] focus:border-[#35d0a0] focus:outline-none"
                  placeholder="Musculação, corrida..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#5c6772]">Água (L/dia)</label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.waterIntakeLiters || ''}
                  onChange={(e) => setFormData({ ...formData, waterIntakeLiters: e.target.value ? parseFloat(e.target.value) : undefined })}
                  className="mt-2 w-full rounded-xl border border-[#e2e0db] bg-white px-4 py-2 text-sm text-[#0c2332] focus:border-[#35d0a0] focus:outline-none"
                  placeholder="2.0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#5c6772]">Ultraprocessados</label>
                <select
                  value={formData.ultraProcessedFreq}
                  onChange={(e) => setFormData({ ...formData, ultraProcessedFreq: e.target.value })}
                  className="mt-2 w-full rounded-xl border border-[#e2e0db] bg-white px-4 py-2 text-sm text-[#0c2332] focus:border-[#35d0a0] focus:outline-none"
                >
                  <option value="">-</option>
                  {ULTRA_PROCESSED_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="mt-4 flex items-center gap-6">
              <CheckboxField
                label="Tabagista"
                checked={formData.isSmoker || false}
                onChange={(checked) => setFormData({ ...formData, isSmoker: checked })}
              />
              {formData.isSmoker && (
                <input
                  type="text"
                  value={formData.smokingDetails}
                  onChange={(e) => setFormData({ ...formData, smokingDetails: e.target.value })}
                  className="flex-1 rounded-xl border border-[#e2e0db] bg-white px-4 py-2 text-sm text-[#0c2332] focus:border-[#35d0a0] focus:outline-none"
                  placeholder="Detalhes: quantidade, tempo..."
                />
              )}
            </div>
          </div>

          {/* Exame Físico */}
          <div className="rounded-2xl border border-[#e2e0db] bg-white/90 p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-[#0c2332]">Exame Físico</h2>

            {/* Sinais Vitais */}
            <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-5">
              <div>
                <label className="block text-xs font-medium text-[#7a838b]">PA (mmHg)</label>
                <input
                  type="text"
                  value={formData.bloodPressure}
                  onChange={(e) => setFormData({ ...formData, bloodPressure: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-[#e2e0db] bg-white px-3 py-2 text-sm text-[#0c2332] focus:border-[#35d0a0] focus:outline-none"
                  placeholder="120/80"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#7a838b]">FC (bpm)</label>
                <input
                  type="text"
                  value={formData.heartRate}
                  onChange={(e) => setFormData({ ...formData, heartRate: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-[#e2e0db] bg-white px-3 py-2 text-sm text-[#0c2332] focus:border-[#35d0a0] focus:outline-none"
                  placeholder="72"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#7a838b]">T (°C)</label>
                <input
                  type="text"
                  value={formData.temperature}
                  onChange={(e) => setFormData({ ...formData, temperature: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-[#e2e0db] bg-white px-3 py-2 text-sm text-[#0c2332] focus:border-[#35d0a0] focus:outline-none"
                  placeholder="36.5"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#7a838b]">FR (irpm)</label>
                <input
                  type="text"
                  value={formData.respiratoryRate}
                  onChange={(e) => setFormData({ ...formData, respiratoryRate: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-[#e2e0db] bg-white px-3 py-2 text-sm text-[#0c2332] focus:border-[#35d0a0] focus:outline-none"
                  placeholder="16"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#7a838b]">SpO2 (%)</label>
                <input
                  type="text"
                  value={formData.oxygenSaturation}
                  onChange={(e) => setFormData({ ...formData, oxygenSaturation: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-[#e2e0db] bg-white px-3 py-2 text-sm text-[#0c2332] focus:border-[#35d0a0] focus:outline-none"
                  placeholder="98"
                />
              </div>
            </div>

            {/* Exame segmentar */}
            <div className="mt-4 space-y-3">
              <div>
                <label className="block text-xs font-medium text-[#7a838b]">Estado Geral</label>
                <textarea
                  value={formData.generalCondition}
                  onChange={(e) => setFormData({ ...formData, generalCondition: e.target.value })}
                  rows={1}
                  className="mt-1 w-full rounded-lg border border-[#e2e0db] bg-white px-3 py-2 text-sm text-[#0c2332] focus:border-[#35d0a0] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#7a838b]">CP (Cabeça/Pescoço)</label>
                <textarea
                  value={formData.headNeck}
                  onChange={(e) => setFormData({ ...formData, headNeck: e.target.value })}
                  rows={1}
                  className="mt-1 w-full rounded-lg border border-[#e2e0db] bg-white px-3 py-2 text-sm text-[#0c2332] focus:border-[#35d0a0] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#7a838b]">ACV (Cardiovascular)</label>
                <textarea
                  value={formData.cardiovascular}
                  onChange={(e) => setFormData({ ...formData, cardiovascular: e.target.value })}
                  rows={1}
                  className="mt-1 w-full rounded-lg border border-[#e2e0db] bg-white px-3 py-2 text-sm text-[#0c2332] focus:border-[#35d0a0] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#7a838b]">AR (Respiratório)</label>
                <textarea
                  value={formData.respiratory}
                  onChange={(e) => setFormData({ ...formData, respiratory: e.target.value })}
                  rows={1}
                  className="mt-1 w-full rounded-lg border border-[#e2e0db] bg-white px-3 py-2 text-sm text-[#0c2332] focus:border-[#35d0a0] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#7a838b]">Abdome</label>
                <textarea
                  value={formData.abdomen}
                  onChange={(e) => setFormData({ ...formData, abdomen: e.target.value })}
                  rows={1}
                  className="mt-1 w-full rounded-lg border border-[#e2e0db] bg-white px-3 py-2 text-sm text-[#0c2332] focus:border-[#35d0a0] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#7a838b]">Psiquismo</label>
                <textarea
                  value={formData.psychism}
                  onChange={(e) => setFormData({ ...formData, psychism: e.target.value })}
                  rows={1}
                  className="mt-1 w-full rounded-lg border border-[#e2e0db] bg-white px-3 py-2 text-sm text-[#0c2332] focus:border-[#35d0a0] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#7a838b]">Coluna</label>
                <textarea
                  value={formData.spine}
                  onChange={(e) => setFormData({ ...formData, spine: e.target.value })}
                  rows={1}
                  className="mt-1 w-full rounded-lg border border-[#e2e0db] bg-white px-3 py-2 text-sm text-[#0c2332] focus:border-[#35d0a0] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#7a838b]">MMSS</label>
                <textarea
                  value={formData.upperLimbs}
                  onChange={(e) => setFormData({ ...formData, upperLimbs: e.target.value })}
                  rows={1}
                  className="mt-1 w-full rounded-lg border border-[#e2e0db] bg-white px-3 py-2 text-sm text-[#0c2332] focus:border-[#35d0a0] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#7a838b]">MMII</label>
                <textarea
                  value={formData.lowerLimbs}
                  onChange={(e) => setFormData({ ...formData, lowerLimbs: e.target.value })}
                  rows={1}
                  className="mt-1 w-full rounded-lg border border-[#e2e0db] bg-white px-3 py-2 text-sm text-[#0c2332] focus:border-[#35d0a0] focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Sintomas RED-S (para nutrologia) */}
          <div className="rounded-2xl border border-[#e2e0db] bg-white/90 p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-[#0c2332]">Sintomas relevantes (RED-S / Performance)</h2>
            <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
              <CheckboxField
                label="Fadiga"
                checked={formData.hasFatigue || false}
                onChange={(checked) => setFormData({ ...formData, hasFatigue: checked })}
              />
              <CheckboxField
                label="Queda performance"
                checked={formData.hasPerformanceDrop || false}
                onChange={(checked) => setFormData({ ...formData, hasPerformanceDrop: checked })}
              />
              <CheckboxField
                label="Amenorreia"
                checked={formData.hasAmenorrhea || false}
                onChange={(checked) => setFormData({ ...formData, hasAmenorrhea: checked })}
              />
              <CheckboxField
                label="Fraturas estresse"
                checked={formData.hasStressFractures || false}
                onChange={(checked) => setFormData({ ...formData, hasStressFractures: checked })}
              />
              <CheckboxField
                label="Infecções freq."
                checked={formData.hasFrequentInfections || false}
                onChange={(checked) => setFormData({ ...formData, hasFrequentInfections: checked })}
              />
              <CheckboxField
                label="TGI"
                checked={formData.hasDigestiveIssues || false}
                onChange={(checked) => setFormData({ ...formData, hasDigestiveIssues: checked })}
              />
              <CheckboxField
                label="Humor"
                checked={formData.hasMoodChanges || false}
                onChange={(checked) => setFormData({ ...formData, hasMoodChanges: checked })}
              />
            </div>
            <input
              type="text"
              value={formData.otherSymptoms}
              onChange={(e) => setFormData({ ...formData, otherSymptoms: e.target.value })}
              className="mt-3 w-full rounded-xl border border-[#e2e0db] bg-white px-4 py-2 text-sm text-[#0c2332] focus:border-[#35d0a0] focus:outline-none"
              placeholder="Outros sintomas..."
            />
          </div>

          {/* HD - Hipótese Diagnóstica */}
          <div className="rounded-2xl border border-[#e2e0db] bg-white/90 p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-[#0c2332]">HD - Hipótese Diagnóstica</h2>
            <textarea
              value={formData.diagnosticHypothesis}
              onChange={(e) => setFormData({ ...formData, diagnosticHypothesis: e.target.value })}
              rows={3}
              className="mt-3 w-full rounded-xl border border-[#e2e0db] bg-white px-4 py-3 text-sm text-[#0c2332] focus:border-[#35d0a0] focus:outline-none"
              placeholder="Liste as hipóteses diagnósticas..."
            />
          </div>

          {/* P - Plano */}
          <div className="rounded-2xl border border-[#e2e0db] bg-white/90 p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-[#0c2332]">P - Plano</h2>
            <textarea
              value={formData.plan}
              onChange={(e) => setFormData({ ...formData, plan: e.target.value })}
              rows={4}
              className="mt-3 w-full rounded-xl border border-[#e2e0db] bg-white px-4 py-3 text-sm text-[#0c2332] focus:border-[#35d0a0] focus:outline-none"
              placeholder="Descreva o plano terapêutico, exames solicitados, orientações..."
            />
          </div>

          {/* Objetivos (para nutrologia) */}
          <div className="rounded-2xl border border-[#e2e0db] bg-white/90 p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-[#0c2332]">Objetivos do Tratamento</h2>
            <div className="mt-3 flex flex-wrap gap-2">
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

          {/* Suplementos */}
          <div className="rounded-2xl border border-[#e2e0db] bg-white/90 p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-[#0c2332]">Suplementos em Uso</h2>
            <textarea
              value={formData.currentSupplements}
              onChange={(e) => setFormData({ ...formData, currentSupplements: e.target.value })}
              rows={2}
              className="mt-3 w-full rounded-xl border border-[#e2e0db] bg-white px-4 py-3 text-sm text-[#0c2332] focus:border-[#35d0a0] focus:outline-none"
              placeholder="Liste os suplementos em uso..."
            />
          </div>

          {/* Submit */}
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => {
                setFormData(initialFormState);
                setFamilyHistoryItems([]);
                setComorbidityItems([]);
              }}
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
