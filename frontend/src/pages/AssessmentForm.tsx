import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { apiClient } from '../api/client';
import type { Patient } from '../types';
import { getCurrentDateBrazilian } from '../utils/date';
import { AssessmentWizardSteps } from '../components/assessment/AssessmentWizardSteps';
import { AssessmentStepBasics } from '../components/assessment/AssessmentStepBasics';
import { AssessmentStepAnthropometry } from '../components/assessment/AssessmentStepAnthropometry';
import { AssessmentStepBioimpedance } from '../components/assessment/AssessmentStepBioimpedance';
import { AssessmentStepSkinfolds } from '../components/assessment/AssessmentStepSkinfolds';
import { AssessmentStepRisks } from '../components/assessment/AssessmentStepRisks';
import { AssessmentStepReview } from '../components/assessment/AssessmentStepReview';
import { AssessmentPreviewPanel } from '../components/assessment/AssessmentPreviewPanel';
import type { AssessmentWizardFormData } from '../components/assessment/types';

const wizardSteps = [
  { title: 'Dados básicos', subtitle: 'Peso, altura e contexto' },
  { title: 'Antropometria', subtitle: 'Perímetros clínicos' },
  { title: 'Bioimpedância', subtitle: 'Módulo BIA', optional: true },
  { title: 'Dobras cutâneas', subtitle: 'Protocolos JP3 / JP7', optional: true },
  { title: 'Riscos e métricas', subtitle: 'Cálculos automáticos' },
  { title: 'Revisão', subtitle: 'Resumo e envio' },
];

const optionalSkipLabels: Record<number, string> = {
  2: 'Pular Bioimpedância',
  3: 'Pular Dobras',
};

const initialFormState: AssessmentWizardFormData = {
  dateTime: getCurrentDateBrazilian(),
  weightKg: '',
  bfPercent: '',
  activityLevel: 'MODERADO',
  waistCm: '',
  hipCm: '',
  neckCm: '',
  heightM: '',
  chestCm: '',
  thighCm: '',
  armCm: '',
  calfCm: '',
  ffmKg: '',
  skeletalMuscleKg: '',
  visceralFatIndex: '',
  tbwL: '',
  ecwL: '',
  icwL: '',
  phaseAngleDeg: '',
  proteinMassKg: '',
  mineralMassKg: '',
  tricepsMm: '',
  subscapularMm: '',
  suprailiacMm: '',
  abdominalMm: '',
  thighMm: '',
  chestMm: '',
  midaxillaryMm: '',
  skinfoldProtocol: '',
  skinfoldNotes: '',
};

export function AssessmentForm() {
  const { id: patientId } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [patient, setPatient] = useState<Patient | null>(null);
  const [loadingPatient, setLoadingPatient] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<AssessmentWizardFormData>(initialFormState);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (patientId) {
      loadPatient(patientId);
    }
  }, [patientId]);

  useEffect(() => {
    if (patient?.heightM && !formData.heightM) {
      setFormData((prev) => ({ ...prev, heightM: prev.heightM || patient.heightM.toFixed(2) }));
    }
  }, [patient, formData.heightM]);

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

  const updateFormData = (values: Partial<AssessmentWizardFormData>) => {
    setFormData((prev) => ({ ...prev, ...values }));
  };

  const goToNextStep = () => {
    setCurrentStep((prev) => Math.min(prev + 1, wizardSteps.length - 1));
  };

  const goToPreviousStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const handleSkipStep = () => {
    goToNextStep();
  };

  const isStepValid = useMemo(() => {
    const weight = toNumber(formData.weightKg);
    const height = toNumber(formData.heightM) ?? patient?.heightM;

    if (currentStep === 0) {
      return Boolean(formData.dateTime && weight && weight > 0 && height && height > 0);
    }

    if (currentStep === 1) {
      return Boolean(height && height > 0);
    }

    return true;
  }, [currentStep, formData, patient]);

  const handleSubmit = async (event?: React.FormEvent) => {
    event?.preventDefault();
    setError(null);

    if (!patientId) {
      setError('ID do paciente não encontrado');
      return;
    }

    const weight = toNumber(formData.weightKg);
    if (!weight || weight <= 0) {
      setError('Peso é obrigatório para salvar a avaliação.');
      setCurrentStep(0);
      return;
    }

    try {
      setSubmitting(true);
      await apiClient.createAssessment(patientId, {
        dateTime: formData.dateTime,
        weightKg: weight,
        bfPercent: toNumber(formData.bfPercent),
        waistCm: toNumber(formData.waistCm),
        hipCm: toNumber(formData.hipCm),
        neckCm: toNumber(formData.neckCm),
        chestCm: toNumber(formData.chestCm),
        thighCm: toNumber(formData.thighCm),
        armCm: toNumber(formData.armCm),
        calfCm: toNumber(formData.calfCm),
        activityLevel: formData.activityLevel,
        ffmKg: toNumber(formData.ffmKg),
        skeletalMuscleKg: toNumber(formData.skeletalMuscleKg),
        visceralFatIndex: toNumber(formData.visceralFatIndex),
        tbwL: toNumber(formData.tbwL),
        ecwL: toNumber(formData.ecwL),
        icwL: toNumber(formData.icwL),
        phaseAngleDeg: toNumber(formData.phaseAngleDeg),
        proteinMassKg: toNumber(formData.proteinMassKg),
        mineralMassKg: toNumber(formData.mineralMassKg),
        tricepsMm: toNumber(formData.tricepsMm),
        subscapularMm: toNumber(formData.subscapularMm),
        suprailiacMm: toNumber(formData.suprailiacMm),
        abdominalMm: toNumber(formData.abdominalMm),
        thighMm: toNumber(formData.thighMm),
        chestMm: toNumber(formData.chestMm),
        midaxillaryMm: toNumber(formData.midaxillaryMm),
        skinfoldProtocol: formData.skinfoldProtocol || undefined,
        skinfoldNotes: formData.skinfoldNotes || undefined,
      });

      navigate(`/patients/${patientId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar avaliação');
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingPatient) {
    return (
      <Layout>
        <div className="text-center py-12">
          <p className="text-sm text-muted">Carregando dados do paciente...</p>
        </div>
      </Layout>
    );
  }

  if (!patient) {
    return (
      <Layout>
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">Paciente não encontrado</div>
      </Layout>
    );
  }

  const showSkipButton = optionalSkipLabels[currentStep];

  return (
    <Layout>
      <div className="bg-background min-h-screen">
        <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted">Avaliação clínica</p>
            <h1 className="text-3xl font-semibold text-primary mt-2">Nova avaliação</h1>
            <p className="text-sm text-muted mt-1">Paciente: {patient.name}</p>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            <div className="xl:col-span-2 space-y-6">
              <div className="bg-white border border-border rounded-2xl shadow-sm p-6 space-y-6">
                <AssessmentWizardSteps steps={wizardSteps} currentStep={currentStep} />

                {error && (
                  <div className="bg-danger/10 border border-danger/30 text-danger px-4 py-3 rounded-xl text-sm">{error}</div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  {currentStep === 0 && <AssessmentStepBasics formData={formData} onChange={updateFormData} />}
                  {currentStep === 1 && <AssessmentStepAnthropometry formData={formData} onChange={updateFormData} />}
                  {currentStep === 2 && <AssessmentStepBioimpedance formData={formData} onChange={updateFormData} />}
                  {currentStep === 3 && <AssessmentStepSkinfolds formData={formData} onChange={updateFormData} />}
                  {currentStep === 4 && (
                    <AssessmentStepRisks formData={formData} onChange={updateFormData} patient={patient} />
                  )}
                  {currentStep === 5 && (
                    <AssessmentStepReview formData={formData} onChange={updateFormData} patient={patient} />
                  )}

                  <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-border">
                    <div className="flex flex-wrap gap-3">
                      <button
                        type="button"
                        onClick={goToPreviousStep}
                        disabled={currentStep === 0}
                        className="px-5 py-2.5 rounded-2xl border border-border text-sm font-medium text-primary disabled:opacity-50"
                      >
                        Voltar
                      </button>
                      <button
                        type="button"
                        onClick={() => navigate(`/patients/${patientId}`)}
                        className="px-5 py-2.5 rounded-2xl border border-border text-sm font-medium text-gray-600"
                      >
                        Cancelar
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-3">
                      {showSkipButton && (
                        <button
                          type="button"
                          onClick={handleSkipStep}
                          className="px-5 py-2.5 rounded-2xl border border-dashed border-border text-sm font-medium text-muted"
                        >
                          {showSkipButton}
                        </button>
                      )}

                      {currentStep === wizardSteps.length - 1 ? (
                        <button
                          type="submit"
                          disabled={submitting}
                          className="px-6 py-3 rounded-2xl bg-accent text-white font-semibold shadow-sm hover:bg-sky-500 transition disabled:opacity-70"
                        >
                          {submitting ? 'Salvando avaliação...' : 'Salvar avaliação'}
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={goToNextStep}
                          disabled={!isStepValid}
                          className="px-6 py-3 rounded-2xl bg-primary text-white font-semibold shadow-sm disabled:opacity-60"
                        >
                          Próximo
                        </button>
                      )}
                    </div>
                  </div>
                </form>
              </div>
            </div>

            <AssessmentPreviewPanel patient={patient} formData={formData} />
          </div>
        </div>
      </div>
    </Layout>
  );
}

function toNumber(value: string) {
  if (!value) {
    return undefined;
  }

  const parsed = parseFloat(value);
  if (Number.isNaN(parsed)) {
    return undefined;
  }

  return parsed;
}
