export interface Patient {
  id: string;
  name: string;
  sex: 'M' | 'F' | 'OUTRO';
  birthDate: string; // DD/MM/YYYY
  heightM: number;
  createdAt?: string;
  updatedAt?: string;
  assessments?: Assessment[];
}

export interface Assessment {
  id: string;
  patientId: string;
  dateTime: string; // DD/MM/YYYY
  weightKg: number;
  bfPercent?: number;
  waistCm?: number;
  hipCm?: number;
  neckCm?: number;
  chestCm?: number;
  thighCm?: number;
  armCm?: number;
  calfCm?: number;
  skeletalMuscleKg?: number;
  ffmKg?: number;
  visceralFatIndex?: number;
  tbwL?: number;
  ecwL?: number;
  icwL?: number;
  phaseAngleDeg?: number;
  activityLevel?: 'SEDENTARIO' | 'LEVE' | 'MODERADO' | 'INTENSO' | 'ATLETA';
  estimatedIntakeKcal?: number;
  exerciseEnergyExpenditureKcal?: number;
  proteinMassKg?: number;
  mineralMassKg?: number;
  createdAt?: string;
  updatedAt?: string;
  metrics?: Metrics;
  patient?: Patient;
}

export interface Metrics {
  id: string;
  assessmentId: string;
  bmi?: number;
  bmiCategory?: string;
  waistHeightRatio?: number;
  waistHeightRisk?: string;
  waistHipRatio?: number;
  waistHipRisk?: string;
  fatMassKg?: number;
  leanMassKg?: number;
  smi?: number;
  bmrMifflin?: number;
  bmrCunningham?: number;
  tdee?: number;
  energyAvailability?: number;
  eaCategory?: string;
  ecwTbwRatio?: number;
  cardiometabolicScore?: number;
  cardiometabolicRiskLevel?: string;
  redsScore?: number;
  redsRiskLevel?: string;
  metabolicAgeYears?: number;
  ffmi?: number;
  fmi?: number;
  smmWeightRatio?: number;
  bcmKg?: number;
  bodyCompScore?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreatePatientData {
  name: string;
  sex: 'M' | 'F' | 'OUTRO';
  birthDate: string; // DD/MM/YYYY
  heightM: number;
}

export interface CreateAssessmentData {
  dateTime?: string; // DD/MM/YYYY
  weightKg: number;
  bfPercent?: number;
  waistCm?: number;
  hipCm?: number;
  neckCm?: number;
  chestCm?: number;
  thighCm?: number;
  armCm?: number;
  calfCm?: number;
  skeletalMuscleKg?: number;
  ffmKg?: number;
  visceralFatIndex?: number;
  tbwL?: number;
  ecwL?: number;
  icwL?: number;
  phaseAngleDeg?: number;
  activityLevel?: 'SEDENTARIO' | 'LEVE' | 'MODERADO' | 'INTENSO' | 'ATLETA';
  estimatedIntakeKcal?: number;
  exerciseEnergyExpenditureKcal?: number;
  proteinMassKg?: number;
  mineralMassKg?: number;
  tricepsMm?: number;
  subscapularMm?: number;
  suprailiacMm?: number;
  abdominalMm?: number;
  thighMm?: number;
  chestMm?: number;
  midaxillaryMm?: number;
  skinfoldProtocol?: string;
  skinfoldNotes?: string;
}

export interface ClinicalIntake {
  id: string;
  patientId: string;
  mainComplaint?: string;
  goals?: string[];

  // Comorbidities
  hasHypertension: boolean;
  hasDiabetes: boolean;
  hasPrediabetes: boolean;
  hasDyslipidemia: boolean;
  hasSteatosis: boolean;
  hasThyroidDisorder: boolean;
  otherComorbidities?: string;

  // Family history
  familyHistoryCV: boolean;
  familyHistoryDM: boolean;
  familyHistoryObesity: boolean;
  familyHistoryNotes?: string;

  // Lifestyle
  sleepHoursAvg?: number;
  sleepQuality?: string;
  isSmoker: boolean;
  smokingDetails?: string;
  alcoholFrequency?: string;
  physicalActivityLevel?: string;
  physicalActivityType?: string;
  ultraProcessedFreq?: string;
  waterIntakeLiters?: number;

  // Symptoms
  hasFatigue: boolean;
  hasPerformanceDrop: boolean;
  hasAmenorrhea: boolean;
  hasStressFractures: boolean;
  hasFrequentInfections: boolean;
  hasDigestiveIssues: boolean;
  hasMoodChanges: boolean;
  otherSymptoms?: string;

  // Medications
  currentMedications?: string;
  currentSupplements?: string;

  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateClinicalIntakeData {
  mainComplaint?: string;
  goals?: string[];
  hasHypertension?: boolean;
  hasDiabetes?: boolean;
  hasPrediabetes?: boolean;
  hasDyslipidemia?: boolean;
  hasSteatosis?: boolean;
  hasThyroidDisorder?: boolean;
  otherComorbidities?: string;
  familyHistoryCV?: boolean;
  familyHistoryDM?: boolean;
  familyHistoryObesity?: boolean;
  familyHistoryNotes?: string;
  sleepHoursAvg?: number;
  sleepQuality?: string;
  isSmoker?: boolean;
  smokingDetails?: string;
  alcoholFrequency?: string;
  physicalActivityLevel?: string;
  physicalActivityType?: string;
  ultraProcessedFreq?: string;
  waterIntakeLiters?: number;
  hasFatigue?: boolean;
  hasPerformanceDrop?: boolean;
  hasAmenorrhea?: boolean;
  hasStressFractures?: boolean;
  hasFrequentInfections?: boolean;
  hasDigestiveIssues?: boolean;
  hasMoodChanges?: boolean;
  otherSymptoms?: string;
  currentMedications?: string;
  currentSupplements?: string;
  notes?: string;
}

// Anamnesis configuration types
export interface CheckboxOption {
  id: string;
  label: string;
  fieldName: string;
  enabled: boolean;
}

export interface AnamnesisConfig {
  comorbidities: CheckboxOption[];
  familyHistory: CheckboxOption[];
  redsSymptoms: CheckboxOption[];
  treatmentGoals: CheckboxOption[];
}
