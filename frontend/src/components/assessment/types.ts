export type ActivityLevel = 'SEDENTARIO' | 'LEVE' | 'MODERADO' | 'INTENSO' | 'ATLETA';

export interface AssessmentWizardFormData {
  dateTime: string;
  weightKg: string;
  bfPercent: string;
  activityLevel: ActivityLevel;
  waistCm: string;
  hipCm: string;
  neckCm: string;
  heightM: string;
  ffmKg: string;
  skeletalMuscleKg: string;
  visceralFatIndex: string;
  tbwL: string;
  ecwL: string;
  icwL: string;
  phaseAngleDeg: string;
  tricepsMm: string;
  subscapularMm: string;
  suprailiacMm: string;
  abdominalMm: string;
  thighMm: string;
  chestMm: string;
  midaxillaryMm: string;
  skinfoldProtocol: string;
  skinfoldNotes: string;
}

export interface AssessmentStepProps {
  formData: AssessmentWizardFormData;
  onChange: (values: Partial<AssessmentWizardFormData>) => void;
}
