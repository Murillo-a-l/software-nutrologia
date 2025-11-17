import prisma from './prisma.js';
import { calculateMetrics } from '../calc/calculateMetrics.js';
import type { AssessmentInput, PatientBasic } from '../domain/types.js';

// ============================================================================
// INTERFACES
// ============================================================================

export interface CreateAssessmentInput {
  patientId: string;
  dateTime?: Date;
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
  activityLevel?: string;
  estimatedIntakeKcal?: number;
  exerciseEnergyExpenditureKcal?: number;
}

// ============================================================================
// ASSESSMENT SERVICE
// ============================================================================

/**
 * Cria uma nova avaliação e calcula as métricas automaticamente
 */
export async function createAssessment(data: CreateAssessmentInput) {
  // Busca o paciente
  const patient = await prisma.patient.findUnique({
    where: { id: data.patientId },
  });

  if (!patient) {
    throw new Error(`Paciente com ID ${data.patientId} não encontrado`);
  }

  // Cria a avaliação
  const assessment = await prisma.assessment.create({
    data: {
      patientId: data.patientId,
      dateTime: data.dateTime || new Date(),
      weightKg: data.weightKg,
      bfPercent: data.bfPercent,
      waistCm: data.waistCm,
      hipCm: data.hipCm,
      neckCm: data.neckCm,
      skeletalMuscleKg: data.skeletalMuscleKg,
      ffmKg: data.ffmKg,
      visceralFatIndex: data.visceralFatIndex,
      tbwL: data.tbwL,
      ecwL: data.ecwL,
      icwL: data.icwL,
      phaseAngleDeg: data.phaseAngleDeg,
      activityLevel: data.activityLevel,
      estimatedIntakeKcal: data.estimatedIntakeKcal,
      exerciseEnergyExpenditureKcal: data.exerciseEnergyExpenditureKcal,
    },
  });

  // Prepara dados para cálculo
  const patientBasic: PatientBasic = {
    id: patient.id,
    name: patient.name,
    birthDate: patient.birthDate,
    sex: patient.sex as "M" | "F" | "OUTRO",
    heightM: patient.heightM,
  };

  const assessmentInput: AssessmentInput = {
    patientId: assessment.patientId,
    dateTime: assessment.dateTime,
    weightKg: assessment.weightKg!,
    waistCm: assessment.waistCm ?? undefined,
    hipCm: assessment.hipCm ?? undefined,
    neckCm: assessment.neckCm ?? undefined,
    bfPercent: assessment.bfPercent ?? undefined,
    ffmKg: assessment.ffmKg ?? undefined,
    skeletalMuscleMassKg: assessment.skeletalMuscleKg ?? undefined,
    tbwL: assessment.tbwL ?? undefined,
    ecwL: assessment.ecwL ?? undefined,
    icwL: assessment.icwL ?? undefined,
    visceralFatIndex: assessment.visceralFatIndex ?? undefined,
    phaseAngleDeg: assessment.phaseAngleDeg ?? undefined,
    activityLevel: assessment.activityLevel as any,
    estimatedIntakeKcal: assessment.estimatedIntakeKcal ?? undefined,
    exerciseEnergyExpenditureKcal: assessment.exerciseEnergyExpenditureKcal ?? undefined,
  };

  // Calcula métricas
  const calculatedMetrics = calculateMetrics(assessmentInput, patientBasic);

  // Salva métricas no banco
  const metrics = await prisma.metrics.create({
    data: {
      assessmentId: assessment.id,
      bmi: calculatedMetrics.bmi ? Number(calculatedMetrics.bmi) : null,
      bmiCategory: calculatedMetrics.bmiCategory as string | null,
      waistHeightRatio: calculatedMetrics.waistHeightRatio ? Number(calculatedMetrics.waistHeightRatio) : null,
      waistHeightRisk: calculatedMetrics.waistHeightRisk as string | null,
      waistHipRatio: calculatedMetrics.waistHipRatio ? Number(calculatedMetrics.waistHipRatio) : null,
      waistHipRisk: calculatedMetrics.waistHipRisk as string | null,
      fatMassKg: calculatedMetrics.fatMassKg ? Number(calculatedMetrics.fatMassKg) : null,
      leanMassKg: calculatedMetrics.leanMassKg ? Number(calculatedMetrics.leanMassKg) : null,
      smi: calculatedMetrics.smi ? Number(calculatedMetrics.smi) : null,
      bmrMifflin: calculatedMetrics.bmrMifflin ? Number(calculatedMetrics.bmrMifflin) : null,
      bmrCunningham: calculatedMetrics.bmrCunningham ? Number(calculatedMetrics.bmrCunningham) : null,
      tdee: calculatedMetrics.tdee ? Number(calculatedMetrics.tdee) : null,
      energyAvailability: calculatedMetrics.energyAvailability ? Number(calculatedMetrics.energyAvailability) : null,
      eaCategory: calculatedMetrics.eaCategory as string | null,
      ecwTbwRatio: calculatedMetrics.ecwTbwRatio ? Number(calculatedMetrics.ecwTbwRatio) : null,
      cardiometabolicScore: calculatedMetrics.cardiometabolicScore ? Number(calculatedMetrics.cardiometabolicScore) : null,
      cardiometabolicRiskLevel: calculatedMetrics.cardiometabolicRiskLevel as string | null,
      redsScore: calculatedMetrics.redsScore ? Number(calculatedMetrics.redsScore) : null,
      redsRiskLevel: calculatedMetrics.redsRiskLevel as string | null,
      metabolicAgeYears: calculatedMetrics.metabolicAgeYears ? Number(calculatedMetrics.metabolicAgeYears) : null,
      ffmi: calculatedMetrics.ffmi ? Number(calculatedMetrics.ffmi) : null,
      fmi: calculatedMetrics.fmi ? Number(calculatedMetrics.fmi) : null,
      smmWeightRatio: calculatedMetrics.smmWeightRatio ? Number(calculatedMetrics.smmWeightRatio) : null,
      bcmKg: calculatedMetrics.bcmKg ? Number(calculatedMetrics.bcmKg) : null,
      bodyCompScore: calculatedMetrics.bodyCompScore ? Number(calculatedMetrics.bodyCompScore) : null,
    },
  });

  // Atualiza proteinMassKg e mineralMassKg no assessment (calculados)
  if (calculatedMetrics.proteinMassKg || calculatedMetrics.mineralMassKg) {
    await prisma.assessment.update({
      where: { id: assessment.id },
      data: {
        proteinMassKg: calculatedMetrics.proteinMassKg ? Number(calculatedMetrics.proteinMassKg) : null,
        mineralMassKg: calculatedMetrics.mineralMassKg ? Number(calculatedMetrics.mineralMassKg) : null,
      },
    });
  }

  // Retorna avaliação com métricas
  return await prisma.assessment.findUnique({
    where: { id: assessment.id },
    include: {
      metrics: true,
      patient: true,
    },
  });
}

/**
 * Busca uma avaliação por ID com suas métricas
 */
export async function getAssessmentById(id: string) {
  const assessment = await prisma.assessment.findUnique({
    where: { id },
    include: {
      metrics: true,
      patient: true,
    },
  });

  return assessment;
}

/**
 * Lista todas as avaliações de um paciente
 */
export async function getAssessmentsByPatientId(patientId: string) {
  const assessments = await prisma.assessment.findMany({
    where: { patientId },
    orderBy: { dateTime: 'desc' },
    include: {
      metrics: true,
    },
  });

  return assessments;
}

/**
 * Deleta uma avaliação (e suas métricas em cascata)
 */
export async function deleteAssessment(id: string): Promise<void> {
  // Deleta métricas primeiro (se existirem)
  await prisma.metrics.deleteMany({
    where: { assessmentId: id },
  });

  // Deleta avaliação
  await prisma.assessment.delete({
    where: { id },
  });
}
