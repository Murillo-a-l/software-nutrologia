export interface PatientBasic {
  id: string;
  name: string;
  birthDate: Date;
  sex: "M" | "F" | "OUTRO";
  heightM: number;
}

export interface AssessmentInput {
  patientId: string;
  dateTime: Date;
  weightKg: number;
  waistCm?: number;
  hipCm?: number;
  neckCm?: number;
  bfPercent?: number;
  ffmKg?: number;
  skeletalMuscleMassKg?: number;
  tbwL?: number;
  ecwL?: number;
  icwL?: number;
  visceralFatIndex?: number;
  phaseAngleDeg?: number;
  activityLevel?: "SEDENTARIO" | "LEVE" | "MODERADO" | "INTENSO" | "ATLETA";
  estimatedIntakeKcal?: number;
  exerciseEnergyExpenditureKcal?: number;
  // Skinfold measurements (mm)
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

export interface CalculatedMetrics {
  bmi?: number | string;
  bmiCategory?: number | string;
  waistHeightRatio?: number | string;
  waistHeightRisk?: number | string;
  waistHipRatio?: number | string;
  waistHipRisk?: number | string;
  fatMassKg?: number | string;
  leanMassKg?: number | string;
  smi?: number | string;
  bmrMifflin?: number | string;
  bmrCunningham?: number | string;
  tdee?: number | string;
  energyAvailability?: number | string;
  eaCategory?: number | string;
  ecwTbwRatio?: number | string;
  cardiometabolicScore?: number | string;
  cardiometabolicRiskLevel?: number | string;
  redsScore?: number | string;
  redsRiskLevel?: number | string;
  metabolicAgeYears?: number | string;
  proteinMassKg?: number | string;
  mineralMassKg?: number | string;
  bcmKg?: number | string;
  ffmi?: number | string;
  fmi?: number | string;
  smmWeightRatio?: number | string;
  bodyCompScore?: number | string;
  // Skinfold-derived metrics
  bodyDensity?: number | string;
  bfPercentSkinfold?: number | string;
  bfPercentMethod?: string;
}
