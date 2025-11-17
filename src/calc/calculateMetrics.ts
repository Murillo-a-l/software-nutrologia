import type { AssessmentInput, CalculatedMetrics, PatientBasic } from "../domain/types.js";

// ============================================================================
// FUNÇÕES AUXILIARES
// ============================================================================

/**
 * Calcula a idade em anos a partir da data de nascimento
 */
function calculateAge(birthDate: Date, assessmentDate: Date): number {
  const age = assessmentDate.getFullYear() - birthDate.getFullYear();
  const monthDiff = assessmentDate.getMonth() - birthDate.getMonth();
  const dayDiff = assessmentDate.getDate() - birthDate.getDate();

  if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
    return age - 1;
  }
  return age;
}

/**
 * 1) Calcula o BMI
 */
function calculateBMI(weightKg: number, heightM: number): number {
  return weightKg / (heightM * heightM);
}

/**
 * 1) Determina a categoria do BMI
 */
function categorizeBMI(bmi: number): string {
  if (bmi < 18.5) return "baixo peso";
  if (bmi < 25) return "normal";
  if (bmi < 30) return "sobrepeso";
  if (bmi < 35) return "obesidade 1";
  if (bmi < 40) return "obesidade 2";
  return "obesidade 3";
}

/**
 * 2) Calcula a relação Cintura/Altura
 */
function calculateWaistHeightRatio(waistCm: number, heightM: number): number {
  const heightCm = heightM * 100;
  return waistCm / heightCm;
}

/**
 * 2) Determina o risco da relação Cintura/Altura
 */
function categorizeWaistHeightRisk(ratio: number): string {
  if (ratio < 0.5) return "baixo";
  if (ratio <= 0.55) return "moderado";
  return "alto";
}

/**
 * 3) Calcula a relação Cintura/Quadril
 */
function calculateWaistHipRatio(waistCm: number, hipCm: number): number {
  return waistCm / hipCm;
}

/**
 * 3) Determina o risco da relação Cintura/Quadril
 */
function categorizeWaistHipRisk(ratio: number, sex: "M" | "F" | "OUTRO"): string {
  if (sex === "M") {
    if (ratio < 0.90) return "baixo";
    if (ratio < 1.0) return "moderado";
    return "alto";
  } else {
    // F ou OUTRO
    if (ratio < 0.85) return "baixo";
    if (ratio < 0.90) return "moderado";
    return "alto";
  }
}

/**
 * 4) Calcula a massa gorda
 */
function calculateFatMass(weightKg: number, bfPercent: number): number {
  return weightKg * (bfPercent / 100);
}

/**
 * 4) Calcula a massa magra
 */
function calculateLeanMass(weightKg: number, fatMassKg: number): number {
  return weightKg - fatMassKg;
}

/**
 * 5) Calcula o SMI (Skeletal Muscle Index)
 */
function calculateSMI(skeletalMuscleMassKg: number, heightM: number): number {
  return skeletalMuscleMassKg / (heightM * heightM);
}

/**
 * 6) Calcula BMR usando a fórmula Mifflin-St Jeor
 */
function calculateBMRMifflin(
  weightKg: number,
  heightM: number,
  age: number,
  sex: "M" | "F" | "OUTRO"
): number {
  const heightCm = heightM * 100;
  const base = 10 * weightKg + 6.25 * heightCm - 5 * age;

  if (sex === "M") {
    return base + 5;
  } else {
    // F ou OUTRO usa a fórmula feminina
    return base - 161;
  }
}

/**
 * 7) Calcula BMR usando a fórmula Cunningham
 */
function calculateBMRCunningham(ffmKg: number): number {
  return 500 + (22 * ffmKg);
}

/**
 * 8) Calcula o TDEE (Total Daily Energy Expenditure)
 */
function calculateTDEE(
  bmr: number,
  activityLevel?: "SEDENTARIO" | "LEVE" | "MODERADO" | "INTENSO" | "ATLETA"
): number {
  const factors: Record<string, number> = {
    SEDENTARIO: 1.2,
    LEVE: 1.375,
    MODERADO: 1.55,
    INTENSO: 1.725,
    ATLETA: 1.9,
  };

  const factor = activityLevel ? factors[activityLevel] : 1.2;
  return bmr * factor;
}

/**
 * 9) Calcula a Energia Disponível (EA)
 */
function calculateEnergyAvailability(
  estimatedIntakeKcal: number,
  exerciseEEKcal: number,
  ffmKg: number
): number {
  return (estimatedIntakeKcal - exerciseEEKcal) / ffmKg;
}

/**
 * 9) Categoriza a Energia Disponível
 */
function categorizeEA(ea: number): string {
  if (ea < 30) return "baixa";
  if (ea <= 45) return "atenção";
  return "adequada";
}

/**
 * 10) Calcula a relação ECW/TBW
 */
function calculateECWTBWRatio(ecwL: number, tbwL: number): number {
  return ecwL / tbwL;
}

/**
 * 11) Calcula o Score Cardiometabólico
 */
function calculateCardiometabolicScore(
  bmi: number | null,
  waistHeightRatio: number | null,
  bfPercent: number | null,
  visceralFatIndex: number | null,
  sex: "M" | "F" | "OUTRO"
): number {
  let score = 0;

  if (bmi !== null && bmi >= 30) score += 2;
  if (waistHeightRatio !== null && waistHeightRatio >= 0.5) score += 2;

  if (bfPercent !== null) {
    if ((sex === "M" && bfPercent >= 25) || (sex !== "M" && bfPercent >= 32)) {
      score += 2;
    }
  }

  if (visceralFatIndex !== null && visceralFatIndex >= 12) score += 3;

  return score;
}

/**
 * 11) Categoriza o risco cardiometabólico
 */
function categorizeCardiometabolicRisk(score: number): string {
  if (score <= 2) return "baixo";
  if (score <= 5) return "moderado";
  return "alto";
}

/**
 * 12) Calcula o Score RED-S
 */
function calculateREDSScore(ea: number | null): number {
  if (ea === null) return 0;

  let score = 0;
  if (ea < 30) score += 2;
  else if (ea >= 30 && ea < 45) score += 1;

  return score;
}

/**
 * 12) Categoriza o risco RED-S
 */
function categorizeREDSRisk(score: number): string {
  if (score === 0) return "baixo";
  if (score <= 2) return "suspeita";
  return "alto";
}

/**
 * 13) Calcula a idade metabólica
 */
function calculateMetabolicAge(
  chronologicalAge: number,
  cardiometabolicRiskLevel: string | null,
  bfPercent: number | null,
  waistHeightRatio: number | null,
  sex: "M" | "F" | "OUTRO"
): number {
  let metabolicAge = chronologicalAge;

  if (cardiometabolicRiskLevel === "moderado") metabolicAge += 5;
  if (cardiometabolicRiskLevel === "alto") metabolicAge += 10;

  if (bfPercent !== null) {
    if ((sex === "M" && bfPercent >= 28) || (sex !== "M" && bfPercent >= 38)) {
      metabolicAge += 3;
    }
  }

  if (waistHeightRatio !== null && waistHeightRatio > 0.60) metabolicAge += 2;

  return metabolicAge;
}

/**
 * 14) Calcula o FFMI (Fat-Free Mass Index)
 */
function calculateFFMI(ffmKg: number, heightM: number): number {
  return ffmKg / (heightM * heightM);
}

/**
 * 14) Calcula o FMI (Fat Mass Index)
 */
function calculateFMI(fatMassKg: number, heightM: number): number {
  return fatMassKg / (heightM * heightM);
}

/**
 * 14) Calcula a proporção SMM/Peso
 */
function calculateSMMWeightRatio(skeletalMuscleMassKg: number, weightKg: number): number {
  return skeletalMuscleMassKg / weightKg;
}

/**
 * 15) Calcula o Body Composition Score
 */
function calculateBodyCompScore(
  bmi: number | null,
  waistHeightRatio: number | null,
  visceralFatIndex: number | null,
  smi: number | null,
  ecwTbwRatio: number | null
): number {
  let score = 100;

  if (bmi !== null && bmi >= 30) score -= 8;
  if (waistHeightRatio !== null && waistHeightRatio >= 0.55) score -= 5;
  if (visceralFatIndex !== null && visceralFatIndex >= 12) score -= 8;
  if (smi !== null && smi < 6.0) score -= 4;
  if (ecwTbwRatio !== null && ecwTbwRatio >= 0.40) score -= 2;

  return Math.max(0, Math.min(100, score));
}

// ============================================================================
// SKINFOLD CALCULATIONS (Jackson & Pollock, Siri/Brozek)
// ============================================================================

interface SkinfoldData {
  tricepsMm?: number;
  subscapularMm?: number;
  suprailiacMm?: number;
  abdominalMm?: number;
  thighMm?: number;
  chestMm?: number;
  midaxillaryMm?: number;
}

interface SkinfoldResult {
  bodyDensity: number;
  bfPercentSkinfold: number;
  bfPercentMethod: string;
}

/**
 * Calcula densidade corporal usando Jackson & Pollock (7 dobras)
 * Fórmulas:
 * Homens: D = 1.112 - 0.00043499 * S7 + 0.00000055 * S7^2 - 0.00028826 * idade
 * Mulheres: D = 1.097 - 0.00046971 * S7 + 0.00000056 * S7^2 - 0.00012828 * idade
 */
function calculateBodyDensityJP7(
  skinfolds: SkinfoldData,
  age: number,
  sex: "M" | "F" | "OUTRO"
): SkinfoldResult | null {
  const { chestMm, midaxillaryMm, tricepsMm, subscapularMm, abdominalMm, suprailiacMm, thighMm } = skinfolds;

  // Verifica se todas as 7 dobras estão disponíveis
  if (
    chestMm === undefined ||
    midaxillaryMm === undefined ||
    tricepsMm === undefined ||
    subscapularMm === undefined ||
    abdominalMm === undefined ||
    suprailiacMm === undefined ||
    thighMm === undefined
  ) {
    return null;
  }

  const S7 = chestMm + midaxillaryMm + tricepsMm + subscapularMm + abdominalMm + suprailiacMm + thighMm;

  let bodyDensity: number;
  if (sex === "M") {
    bodyDensity = 1.112 - 0.00043499 * S7 + 0.00000055 * S7 * S7 - 0.00028826 * age;
  } else {
    // F ou OUTRO usa fórmula feminina
    bodyDensity = 1.097 - 0.00046971 * S7 + 0.00000056 * S7 * S7 - 0.00012828 * age;
  }

  // Calcular % gordura usando Siri
  const bfPercentSkinfold = (495 / bodyDensity) - 450;

  return {
    bodyDensity,
    bfPercentSkinfold,
    bfPercentMethod: "Skinfold (Jackson-Pollock 7 + Siri)"
  };
}

/**
 * Calcula densidade corporal usando Jackson & Pollock (3 dobras)
 * Fórmulas:
 * Homens (peito, abdome, coxa): D = 1.10938 - 0.0008267 * S3 + 0.0000016 * S3^2 - 0.0002574 * idade
 * Mulheres (tríceps, supra-ilíaca, coxa): D = 1.0994921 - 0.0009929 * S3 + 0.0000023 * S3^2 - 0.0001392 * idade
 */
function calculateBodyDensityJP3(
  skinfolds: SkinfoldData,
  age: number,
  sex: "M" | "F" | "OUTRO"
): SkinfoldResult | null {
  let S3: number | null = null;

  if (sex === "M") {
    // Homens: peito, abdome, coxa
    const { chestMm, abdominalMm, thighMm } = skinfolds;
    if (chestMm !== undefined && abdominalMm !== undefined && thighMm !== undefined) {
      S3 = chestMm + abdominalMm + thighMm;
    }
  } else {
    // Mulheres: tríceps, supra-ilíaca, coxa
    const { tricepsMm, suprailiacMm, thighMm } = skinfolds;
    if (tricepsMm !== undefined && suprailiacMm !== undefined && thighMm !== undefined) {
      S3 = tricepsMm + suprailiacMm + thighMm;
    }
  }

  if (S3 === null) {
    return null;
  }

  let bodyDensity: number;
  if (sex === "M") {
    bodyDensity = 1.10938 - 0.0008267 * S3 + 0.0000016 * S3 * S3 - 0.0002574 * age;
  } else {
    bodyDensity = 1.0994921 - 0.0009929 * S3 + 0.0000023 * S3 * S3 - 0.0001392 * age;
  }

  // Calcular % gordura usando Siri
  const bfPercentSkinfold = (495 / bodyDensity) - 450;

  return {
    bodyDensity,
    bfPercentSkinfold,
    bfPercentMethod: "Skinfold (Jackson-Pollock 3 + Siri)"
  };
}

/**
 * Calcula métricas de dobras cutâneas (tenta 7 dobras primeiro, depois 3)
 */
function calculateSkinfoldMetrics(
  skinfolds: SkinfoldData,
  age: number,
  sex: "M" | "F" | "OUTRO"
): SkinfoldResult | null {
  // Tenta primeiro com 7 dobras
  const jp7Result = calculateBodyDensityJP7(skinfolds, age, sex);
  if (jp7Result !== null) {
    return jp7Result;
  }

  // Se não houver 7 dobras, tenta com 3 dobras
  const jp3Result = calculateBodyDensityJP3(skinfolds, age, sex);
  return jp3Result;
}

// ============================================================================
// FUNÇÃO PRINCIPAL
// ============================================================================

export function calculateMetrics(
  input: AssessmentInput,
  patient: PatientBasic
): CalculatedMetrics {
  const result: CalculatedMetrics = {};

  // Calcula idade do paciente
  const age = calculateAge(patient.birthDate, input.dateTime);

  // 1) BMI
  let bmi: number | null = null;
  if (input.weightKg && patient.heightM) {
    bmi = calculateBMI(input.weightKg, patient.heightM);
    result.bmi = bmi;
    result.bmiCategory = categorizeBMI(bmi);
  }

  // 2) Cintura/Altura (RCA)
  let waistHeightRatio: number | null = null;
  if (input.waistCm && patient.heightM) {
    waistHeightRatio = calculateWaistHeightRatio(input.waistCm, patient.heightM);
    result.waistHeightRatio = waistHeightRatio;
    result.waistHeightRisk = categorizeWaistHeightRisk(waistHeightRatio);
  }

  // 3) Cintura/Quadril (RCQ)
  if (input.waistCm && input.hipCm) {
    const waistHipRatio = calculateWaistHipRatio(input.waistCm, input.hipCm);
    result.waistHipRatio = waistHipRatio;
    result.waistHipRisk = categorizeWaistHipRisk(waistHipRatio, patient.sex);
  }

  // 4) Massa gorda e massa magra
  let fatMassKg: number | null = null;
  let leanMassKg: number | null = null;
  if (input.weightKg && input.bfPercent !== undefined) {
    fatMassKg = calculateFatMass(input.weightKg, input.bfPercent);
    leanMassKg = calculateLeanMass(input.weightKg, fatMassKg);
    result.fatMassKg = fatMassKg;
    result.leanMassKg = leanMassKg;
  }

  // 5) SMI
  let smi: number | null = null;
  if (input.skeletalMuscleMassKg && patient.heightM) {
    smi = calculateSMI(input.skeletalMuscleMassKg, patient.heightM);
    result.smi = smi;
  }

  // 6) BMR – Mifflin
  let bmrMifflin: number | null = null;
  if (input.weightKg && patient.heightM) {
    bmrMifflin = calculateBMRMifflin(input.weightKg, patient.heightM, age, patient.sex);
    result.bmrMifflin = bmrMifflin;
  }

  // 7) BMR – Cunningham
  let bmrCunningham: number | null = null;
  if (input.ffmKg) {
    bmrCunningham = calculateBMRCunningham(input.ffmKg);
    result.bmrCunningham = bmrCunningham;
  }

  // 8) TDEE
  // Seleciona BMR: preferir Cunningham se ffmKg existir
  const selectedBMR = input.ffmKg && bmrCunningham !== null ? bmrCunningham : bmrMifflin;
  if (selectedBMR !== null) {
    result.tdee = calculateTDEE(selectedBMR, input.activityLevel);
  }

  // 9) Energia Disponível (EA)
  let ea: number | null = null;
  if (
    input.estimatedIntakeKcal !== undefined &&
    input.exerciseEnergyExpenditureKcal !== undefined &&
    input.ffmKg
  ) {
    ea = calculateEnergyAvailability(
      input.estimatedIntakeKcal,
      input.exerciseEnergyExpenditureKcal,
      input.ffmKg
    );
    result.energyAvailability = ea;
    result.eaCategory = categorizeEA(ea);
  }

  // 10) ECW/TBW
  let ecwTbwRatio: number | null = null;
  if (input.ecwL && input.tbwL) {
    ecwTbwRatio = calculateECWTBWRatio(input.ecwL, input.tbwL);
    result.ecwTbwRatio = ecwTbwRatio;
  }

  // 11) Score cardiometabólico
  const cardiometabolicScore = calculateCardiometabolicScore(
    bmi,
    waistHeightRatio,
    input.bfPercent ?? null,
    input.visceralFatIndex ?? null,
    patient.sex
  );
  result.cardiometabolicScore = cardiometabolicScore;
  result.cardiometabolicRiskLevel = categorizeCardiometabolicRisk(cardiometabolicScore);

  // 12) Score RED-S
  const redsScore = calculateREDSScore(ea);
  result.redsScore = redsScore;
  result.redsRiskLevel = categorizeREDSRisk(redsScore);

  // 13) Idade metabólica
  result.metabolicAgeYears = calculateMetabolicAge(
    age,
    result.cardiometabolicRiskLevel as string | null,
    input.bfPercent ?? null,
    waistHeightRatio,
    patient.sex
  );

  // 14) Índices avançados
  if (input.ffmKg && patient.heightM) {
    result.ffmi = calculateFFMI(input.ffmKg, patient.heightM);
  }

  if (fatMassKg !== null && patient.heightM) {
    result.fmi = calculateFMI(fatMassKg, patient.heightM);
  }

  if (input.skeletalMuscleMassKg && input.weightKg) {
    result.smmWeightRatio = calculateSMMWeightRatio(input.skeletalMuscleMassKg, input.weightKg);
  }

  // BCM (Body Cell Mass)
  if (input.icwL && input.ffmKg) {
    // Estimativa simples de proteína: ~20% da FFM
    const proteinMassKg = input.ffmKg * 0.20;
    result.proteinMassKg = proteinMassKg;
    result.bcmKg = input.icwL + proteinMassKg;
  }

  // Massa mineral: estimativa ~5% da FFM
  if (input.ffmKg) {
    result.mineralMassKg = input.ffmKg * 0.05;
  }

  // 15) Body Comp Score
  result.bodyCompScore = calculateBodyCompScore(
    bmi,
    waistHeightRatio,
    input.visceralFatIndex ?? null,
    smi,
    ecwTbwRatio
  );

  // 16) Skinfold measurements (Jackson & Pollock + Siri)
  const skinfoldData: SkinfoldData = {
    tricepsMm: input.tricepsMm,
    subscapularMm: input.subscapularMm,
    suprailiacMm: input.suprailiacMm,
    abdominalMm: input.abdominalMm,
    thighMm: input.thighMm,
    chestMm: input.chestMm,
    midaxillaryMm: input.midaxillaryMm,
  };

  const skinfoldResult = calculateSkinfoldMetrics(skinfoldData, age, patient.sex);
  if (skinfoldResult !== null) {
    result.bodyDensity = skinfoldResult.bodyDensity;
    result.bfPercentSkinfold = skinfoldResult.bfPercentSkinfold;
    result.bfPercentMethod = skinfoldResult.bfPercentMethod;
  }

  return result;
}
