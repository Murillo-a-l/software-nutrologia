import { prisma } from './prisma';

export interface CreateClinicalIntakeData {
  mainComplaint?: string;
  goals?: string[];

  // Comorbidities
  hasHypertension?: boolean;
  hasDiabetes?: boolean;
  hasPrediabetes?: boolean;
  hasDyslipidemia?: boolean;
  hasSteatosis?: boolean;
  hasThyroidDisorder?: boolean;
  otherComorbidities?: string;

  // Family history
  familyHistoryCV?: boolean;
  familyHistoryDM?: boolean;
  familyHistoryObesity?: boolean;
  familyHistoryNotes?: string;

  // Lifestyle
  sleepHoursAvg?: number;
  sleepQuality?: string;
  isSmoker?: boolean;
  smokingDetails?: string;
  alcoholFrequency?: string;
  physicalActivityLevel?: string;
  physicalActivityType?: string;
  ultraProcessedFreq?: string;
  waterIntakeLiters?: number;

  // Symptoms
  hasFatigue?: boolean;
  hasPerformanceDrop?: boolean;
  hasAmenorrhea?: boolean;
  hasStressFractures?: boolean;
  hasFrequentInfections?: boolean;
  hasDigestiveIssues?: boolean;
  hasMoodChanges?: boolean;
  otherSymptoms?: string;

  // Medications
  currentMedications?: string;
  currentSupplements?: string;

  notes?: string;
}

export async function createOrUpdateClinicalIntake(
  patientId: string,
  data: CreateClinicalIntakeData
) {
  const existing = await prisma.clinicalIntake.findUnique({
    where: { patientId },
  });

  const intakeData = {
    mainComplaint: data.mainComplaint,
    goals: data.goals ? JSON.stringify(data.goals) : null,
    hasHypertension: data.hasHypertension ?? false,
    hasDiabetes: data.hasDiabetes ?? false,
    hasPrediabetes: data.hasPrediabetes ?? false,
    hasDyslipidemia: data.hasDyslipidemia ?? false,
    hasSteatosis: data.hasSteatosis ?? false,
    hasThyroidDisorder: data.hasThyroidDisorder ?? false,
    otherComorbidities: data.otherComorbidities,
    familyHistoryCV: data.familyHistoryCV ?? false,
    familyHistoryDM: data.familyHistoryDM ?? false,
    familyHistoryObesity: data.familyHistoryObesity ?? false,
    familyHistoryNotes: data.familyHistoryNotes,
    sleepHoursAvg: data.sleepHoursAvg,
    sleepQuality: data.sleepQuality,
    isSmoker: data.isSmoker ?? false,
    smokingDetails: data.smokingDetails,
    alcoholFrequency: data.alcoholFrequency,
    physicalActivityLevel: data.physicalActivityLevel,
    physicalActivityType: data.physicalActivityType,
    ultraProcessedFreq: data.ultraProcessedFreq,
    waterIntakeLiters: data.waterIntakeLiters,
    hasFatigue: data.hasFatigue ?? false,
    hasPerformanceDrop: data.hasPerformanceDrop ?? false,
    hasAmenorrhea: data.hasAmenorrhea ?? false,
    hasStressFractures: data.hasStressFractures ?? false,
    hasFrequentInfections: data.hasFrequentInfections ?? false,
    hasDigestiveIssues: data.hasDigestiveIssues ?? false,
    hasMoodChanges: data.hasMoodChanges ?? false,
    otherSymptoms: data.otherSymptoms,
    currentMedications: data.currentMedications,
    currentSupplements: data.currentSupplements,
    notes: data.notes,
  };

  if (existing) {
    return prisma.clinicalIntake.update({
      where: { patientId },
      data: intakeData,
    });
  }

  return prisma.clinicalIntake.create({
    data: {
      patientId,
      ...intakeData,
    },
  });
}

export async function getClinicalIntakeByPatientId(patientId: string) {
  const intake = await prisma.clinicalIntake.findUnique({
    where: { patientId },
  });

  if (!intake) return null;

  return {
    ...intake,
    goals: intake.goals ? JSON.parse(intake.goals) : [],
  };
}

export async function deleteClinicalIntake(patientId: string) {
  return prisma.clinicalIntake.delete({
    where: { patientId },
  });
}

// Helper to get clinical data for risk calculations
export function getClinicalRiskFactors(intake: {
  hasHypertension: boolean;
  hasDiabetes: boolean;
  hasPrediabetes: boolean;
  hasDyslipidemia: boolean;
  hasSteatosis: boolean;
  familyHistoryCV: boolean;
  isSmoker: boolean;
  hasFatigue: boolean;
  hasPerformanceDrop: boolean;
  hasAmenorrhea: boolean;
  hasStressFractures: boolean;
  hasFrequentInfections: boolean;
}) {
  return {
    dm2: intake.hasDiabetes || intake.hasPrediabetes,
    has: intake.hasHypertension,
    dislipidemia: intake.hasDyslipidemia,
    esteatose: intake.hasSteatosis,
    tabagismo: intake.isSmoker,
    historicoFamiliarCV: intake.familyHistoryCV,
    // RED-S symptoms
    fadiga: intake.hasFatigue,
    quedaPerformance: intake.hasPerformanceDrop,
    amenorreia: intake.hasAmenorrhea,
    fraturasEstresse: intake.hasStressFractures,
    infeccoesFrequentes: intake.hasFrequentInfections,
  };
}
