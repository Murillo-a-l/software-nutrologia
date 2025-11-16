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
}
