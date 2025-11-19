// Mock do Prisma Client com armazenamento em memória
// Esta é uma solução temporária enquanto o Prisma não pode ser gerado

// ============================================================================
// ARMAZENAMENTO EM MEMÓRIA
// ============================================================================

interface PatientData {
  id: string;
  name: string;
  sex: string;
  birthDate: Date;
  heightM: number;
  createdAt: Date;
  updatedAt: Date;
}

interface AssessmentData {
  id: string;
  patientId: string;
  dateTime: Date;
  weightKg: number | null;
  bfPercent: number | null;
  waistCm: number | null;
  hipCm: number | null;
  neckCm: number | null;
  skeletalMuscleKg: number | null;
  ffmKg: number | null;
  visceralFatIndex: number | null;
  tbwL: number | null;
  ecwL: number | null;
  icwL: number | null;
  phaseAngleDeg: number | null;
  activityLevel: string | null;
  estimatedIntakeKcal: number | null;
  exerciseEnergyExpenditureKcal: number | null;
  proteinMassKg: number | null;
  mineralMassKg: number | null;
  tricepsMm: number | null;
  subscapularMm: number | null;
  suprailiacMm: number | null;
  abdominalMm: number | null;
  thighMm: number | null;
  chestMm: number | null;
  midaxillaryMm: number | null;
  skinfoldProtocol: string | null;
  skinfoldNotes: string | null;
  createdAt: Date;
  updatedAt: Date;
}

interface MetricsData {
  id: string;
  assessmentId: string;
  bmi: number | null;
  bmiCategory: string | null;
  waistHeightRatio: number | null;
  waistHeightRisk: string | null;
  waistHipRatio: number | null;
  waistHipRisk: string | null;
  fatMassKg: number | null;
  leanMassKg: number | null;
  smi: number | null;
  bmrMifflin: number | null;
  bmrCunningham: number | null;
  tdee: number | null;
  energyAvailability: number | null;
  eaCategory: string | null;
  ecwTbwRatio: number | null;
  cardiometabolicScore: number | null;
  cardiometabolicRiskLevel: string | null;
  redsScore: number | null;
  redsRiskLevel: string | null;
  metabolicAgeYears: number | null;
  ffmi: number | null;
  fmi: number | null;
  smmWeightRatio: number | null;
  bcmKg: number | null;
  bodyCompScore: number | null;
  bodyDensity: number | null;
  bfPercentSkinfold: number | null;
  bfPercentMethod: string | null;
  createdAt: Date;
  updatedAt: Date;
}

const patients: Map<string, PatientData> = new Map();
const assessments: Map<string, AssessmentData> = new Map();
const metrics: Map<string, MetricsData> = new Map();

function generateId(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

// ============================================================================
// MOCK PRISMA CLIENT
// ============================================================================

const prisma = {
  patient: {
    create: async ({ data }: { data: Omit<PatientData, 'id' | 'createdAt' | 'updatedAt'> }) => {
      const patient: PatientData = {
        id: generateId(),
        ...data,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      patients.set(patient.id, patient);
      return patient;
    },

    findUnique: async ({ where, include }: { where: { id: string }; include?: any }) => {
      const patient = patients.get(where.id);
      if (!patient) return null;

      if (include?.assessments) {
        const patientAssessments = Array.from(assessments.values())
          .filter(a => a.patientId === patient.id)
          .sort((a, b) => b.dateTime.getTime() - a.dateTime.getTime());

        const assessmentsWithMetrics = patientAssessments.map(a => {
          const metricsData = Array.from(metrics.values()).find(m => m.assessmentId === a.id);
          return { ...a, metrics: metricsData || null };
        });

        return { ...patient, assessments: assessmentsWithMetrics };
      }

      return patient;
    },

    findMany: async ({ orderBy, include }: { orderBy?: any; include?: any } = {}) => {
      let result = Array.from(patients.values());

      if (orderBy?.createdAt === 'desc') {
        result.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
      }

      if (include?.assessments) {
        return result.map(patient => {
          let patientAssessments = Array.from(assessments.values())
            .filter(a => a.patientId === patient.id)
            .sort((a, b) => b.dateTime.getTime() - a.dateTime.getTime());

          if (include.assessments.take) {
            patientAssessments = patientAssessments.slice(0, include.assessments.take);
          }

          return { ...patient, assessments: patientAssessments };
        });
      }

      return result;
    },

    update: async ({ where, data }: { where: { id: string }; data: Partial<PatientData> }) => {
      const patient = patients.get(where.id);
      if (!patient) throw new Error(`Patient not found: ${where.id}`);

      const updated = { ...patient, ...data, updatedAt: new Date() };
      patients.set(where.id, updated);
      return updated;
    },

    delete: async ({ where }: { where: { id: string } }) => {
      const patient = patients.get(where.id);
      if (!patient) throw new Error(`Patient not found: ${where.id}`);
      patients.delete(where.id);
      return patient;
    },
  },

  assessment: {
    create: async ({ data }: { data: any }) => {
      const assessment: AssessmentData = {
        id: generateId(),
        patientId: data.patientId,
        dateTime: data.dateTime || new Date(),
        weightKg: data.weightKg ?? null,
        bfPercent: data.bfPercent ?? null,
        waistCm: data.waistCm ?? null,
        hipCm: data.hipCm ?? null,
        neckCm: data.neckCm ?? null,
        skeletalMuscleKg: data.skeletalMuscleKg ?? null,
        ffmKg: data.ffmKg ?? null,
        visceralFatIndex: data.visceralFatIndex ?? null,
        tbwL: data.tbwL ?? null,
        ecwL: data.ecwL ?? null,
        icwL: data.icwL ?? null,
        phaseAngleDeg: data.phaseAngleDeg ?? null,
        activityLevel: data.activityLevel ?? null,
        estimatedIntakeKcal: data.estimatedIntakeKcal ?? null,
        exerciseEnergyExpenditureKcal: data.exerciseEnergyExpenditureKcal ?? null,
        proteinMassKg: data.proteinMassKg ?? null,
        mineralMassKg: data.mineralMassKg ?? null,
        tricepsMm: data.tricepsMm ?? null,
        subscapularMm: data.subscapularMm ?? null,
        suprailiacMm: data.suprailiacMm ?? null,
        abdominalMm: data.abdominalMm ?? null,
        thighMm: data.thighMm ?? null,
        chestMm: data.chestMm ?? null,
        midaxillaryMm: data.midaxillaryMm ?? null,
        skinfoldProtocol: data.skinfoldProtocol ?? null,
        skinfoldNotes: data.skinfoldNotes ?? null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      assessments.set(assessment.id, assessment);
      return assessment;
    },

    findUnique: async ({ where, include }: { where: { id: string }; include?: any }) => {
      const assessment = assessments.get(where.id);
      if (!assessment) return null;

      let result: any = { ...assessment };

      if (include?.metrics) {
        const metricsData = Array.from(metrics.values()).find(m => m.assessmentId === assessment.id);
        result.metrics = metricsData || null;
      }

      if (include?.patient) {
        result.patient = patients.get(assessment.patientId) || null;
      }

      return result;
    },

    findMany: async ({ where, orderBy, include }: { where?: any; orderBy?: any; include?: any } = {}) => {
      let result = Array.from(assessments.values());

      if (where?.patientId) {
        result = result.filter(a => a.patientId === where.patientId);
      }

      if (orderBy?.dateTime === 'desc') {
        result.sort((a, b) => b.dateTime.getTime() - a.dateTime.getTime());
      }

      if (include?.metrics) {
        return result.map(a => {
          const metricsData = Array.from(metrics.values()).find(m => m.assessmentId === a.id);
          return { ...a, metrics: metricsData || null };
        });
      }

      return result;
    },

    update: async ({ where, data }: { where: { id: string }; data: any }) => {
      const assessment = assessments.get(where.id);
      if (!assessment) throw new Error(`Assessment not found: ${where.id}`);

      const updated = { ...assessment, ...data, updatedAt: new Date() };
      assessments.set(where.id, updated);
      return updated;
    },

    delete: async ({ where }: { where: { id: string } }) => {
      const assessment = assessments.get(where.id);
      if (!assessment) throw new Error(`Assessment not found: ${where.id}`);
      assessments.delete(where.id);
      return assessment;
    },
  },

  metrics: {
    create: async ({ data }: { data: any }) => {
      const metricsData: MetricsData = {
        id: generateId(),
        assessmentId: data.assessmentId,
        bmi: data.bmi ?? null,
        bmiCategory: data.bmiCategory ?? null,
        waistHeightRatio: data.waistHeightRatio ?? null,
        waistHeightRisk: data.waistHeightRisk ?? null,
        waistHipRatio: data.waistHipRatio ?? null,
        waistHipRisk: data.waistHipRisk ?? null,
        fatMassKg: data.fatMassKg ?? null,
        leanMassKg: data.leanMassKg ?? null,
        smi: data.smi ?? null,
        bmrMifflin: data.bmrMifflin ?? null,
        bmrCunningham: data.bmrCunningham ?? null,
        tdee: data.tdee ?? null,
        energyAvailability: data.energyAvailability ?? null,
        eaCategory: data.eaCategory ?? null,
        ecwTbwRatio: data.ecwTbwRatio ?? null,
        cardiometabolicScore: data.cardiometabolicScore ?? null,
        cardiometabolicRiskLevel: data.cardiometabolicRiskLevel ?? null,
        redsScore: data.redsScore ?? null,
        redsRiskLevel: data.redsRiskLevel ?? null,
        metabolicAgeYears: data.metabolicAgeYears ?? null,
        ffmi: data.ffmi ?? null,
        fmi: data.fmi ?? null,
        smmWeightRatio: data.smmWeightRatio ?? null,
        bcmKg: data.bcmKg ?? null,
        bodyCompScore: data.bodyCompScore ?? null,
        bodyDensity: data.bodyDensity ?? null,
        bfPercentSkinfold: data.bfPercentSkinfold ?? null,
        bfPercentMethod: data.bfPercentMethod ?? null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      metrics.set(metricsData.id, metricsData);
      return metricsData;
    },

    deleteMany: async ({ where }: { where: { assessmentId: string } }) => {
      const toDelete = Array.from(metrics.entries()).filter(([, m]) => m.assessmentId === where.assessmentId);
      toDelete.forEach(([id]) => metrics.delete(id));
      return { count: toDelete.length };
    },
  },
};

export default prisma;

// Mensagem informativa ao iniciar
console.log('⚠️  Usando armazenamento em memória (Prisma Client não disponível)');
console.log('   Os dados serão perdidos ao reiniciar o servidor.');
