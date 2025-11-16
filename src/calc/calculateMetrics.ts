import { AssessmentInput, CalculatedMetrics, PatientBasic } from "../domain/types";

export function calculateMetrics(
  input: AssessmentInput,
  patient: PatientBasic
): CalculatedMetrics {
  return {
    bmi: undefined,
    bmiCategory: undefined,
    waistHeightRatio: undefined,
    waistHeightRisk: undefined,
    waistHipRatio: undefined,
    waistHipRisk: undefined,
    fatMassKg: undefined,
    leanMassKg: undefined,
    smi: undefined,
    bmrMifflin: undefined,
    bmrCunningham: undefined,
    tdee: undefined,
    energyAvailability: undefined,
    eaCategory: undefined,
    ecwTbwRatio: undefined,
    cardiometabolicScore: undefined,
    cardiometabolicRiskLevel: undefined,
    redsScore: undefined,
    redsRiskLevel: undefined,
    metabolicAgeYears: undefined,
    proteinMassKg: undefined,
    mineralMassKg: undefined,
    bcmKg: undefined,
    ffmi: undefined,
    fmi: undefined,
    smmWeightRatio: undefined,
    bodyCompScore: undefined,
  };
}
