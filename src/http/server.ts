import express from 'express';
import { calculateMetrics } from '../calc/calculateMetrics.js';
import type { AssessmentInput, PatientBasic } from '../domain/types.js';

const app = express();
const port = process.env.PORT || 3000;

// Middleware para parsear JSON
app.use(express.json());

// ============================================================================
// FUNÇÕES AUXILIARES
// ============================================================================

/**
 * Converte data do formato brasileiro (DD/MM/YYYY) para ISO (YYYY-MM-DD)
 */
function convertBrazilianDateToISO(dateStr: string): string | null {
  // dateStr = "DD/MM/YYYY"
  const parts = dateStr.split("/");
  if (parts.length !== 3) return null;

  const [day, month, year] = parts.map(Number);

  if (!day || !month || !year) return null;
  if (month < 1 || month > 12) return null;
  if (day < 1 || day > 31) return null;
  if (year < 1900 || year > 2100) return null;

  // Cria ISO: YYYY-MM-DD
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

/**
 * Valida os campos obrigatórios do paciente
 */
function validatePatient(patient: any): { valid: boolean; error?: string } {
  if (!patient) {
    return { valid: false, error: "Campo 'patient' é obrigatório" };
  }

  if (!patient.id || typeof patient.id !== 'string') {
    return { valid: false, error: "Campo 'patient.id' é obrigatório e deve ser string" };
  }

  if (!patient.name || typeof patient.name !== 'string') {
    return { valid: false, error: "Campo 'patient.name' é obrigatório e deve ser string" };
  }

  if (!patient.birthDate || typeof patient.birthDate !== 'string') {
    return { valid: false, error: "Campo 'patient.birthDate' é obrigatório e deve ser string no formato DD/MM/YYYY" };
  }

  if (!patient.sex || !['M', 'F', 'OUTRO'].includes(patient.sex)) {
    return { valid: false, error: "Campo 'patient.sex' deve ser 'M', 'F' ou 'OUTRO'" };
  }

  if (typeof patient.heightM !== 'number' || patient.heightM <= 0) {
    return { valid: false, error: "Campo 'patient.heightM' é obrigatório e deve ser um número positivo" };
  }

  return { valid: true };
}

/**
 * Valida os campos obrigatórios da avaliação
 */
function validateAssessment(assessment: any): { valid: boolean; error?: string } {
  if (!assessment) {
    return { valid: false, error: "Campo 'assessment' é obrigatório" };
  }

  if (typeof assessment.weightKg !== 'number' || assessment.weightKg <= 0) {
    return { valid: false, error: "Campo 'assessment.weightKg' é obrigatório e deve ser um número positivo" };
  }

  return { valid: true };
}

// ============================================================================
// ROTAS
// ============================================================================

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.post('/calculate', (req, res) => {
  console.log('[POST /calculate] Recebendo requisição...');

  try {
    const { patient: patientData, assessment: assessmentData } = req.body;

    // Validação do paciente
    const patientValidation = validatePatient(patientData);
    if (!patientValidation.valid) {
      console.log('[POST /calculate] Erro de validação:', patientValidation.error);
      return res.status(400).json({ error: patientValidation.error });
    }

    // Validação da avaliação
    const assessmentValidation = validateAssessment(assessmentData);
    if (!assessmentValidation.valid) {
      console.log('[POST /calculate] Erro de validação:', assessmentValidation.error);
      return res.status(400).json({ error: assessmentValidation.error });
    }

    // Converte birthDate de DD/MM/YYYY para Date
    const isoBirthDate = convertBrazilianDateToISO(patientData.birthDate);
    if (!isoBirthDate) {
      console.log('[POST /calculate] Formato de data de nascimento inválido:', patientData.birthDate);
      return res.status(400).json({
        error: "Formato de 'patient.birthDate' inválido. Use DD/MM/YYYY (exemplo: 21/03/1995)"
      });
    }
    const birthDate = new Date(isoBirthDate);

    // Converte dateTime se fornecido, senão usa data atual
    let assessmentDateTime = new Date();
    if (assessmentData.dateTime) {
      const isoDateTime = convertBrazilianDateToISO(assessmentData.dateTime);
      if (!isoDateTime) {
        console.log('[POST /calculate] Formato de data de avaliação inválido:', assessmentData.dateTime);
        return res.status(400).json({
          error: "Formato de 'assessment.dateTime' inválido. Use DD/MM/YYYY (exemplo: 16/11/2024)"
        });
      }
      assessmentDateTime = new Date(isoDateTime);
    }

    // Constrói objeto PatientBasic
    const patient: PatientBasic = {
      id: patientData.id,
      name: patientData.name,
      birthDate: birthDate,
      sex: patientData.sex,
      heightM: patientData.heightM,
    };

    // Constrói objeto AssessmentInput
    const assessment: AssessmentInput = {
      patientId: assessmentData.patientId || patientData.id,
      dateTime: assessmentDateTime,
      weightKg: assessmentData.weightKg,
      waistCm: assessmentData.waistCm,
      hipCm: assessmentData.hipCm,
      neckCm: assessmentData.neckCm,
      bfPercent: assessmentData.bfPercent,
      ffmKg: assessmentData.ffmKg,
      skeletalMuscleMassKg: assessmentData.skeletalMuscleMassKg,
      tbwL: assessmentData.tbwL,
      ecwL: assessmentData.ecwL,
      icwL: assessmentData.icwL,
      visceralFatIndex: assessmentData.visceralFatIndex,
      phaseAngleDeg: assessmentData.phaseAngleDeg,
      activityLevel: assessmentData.activityLevel,
      estimatedIntakeKcal: assessmentData.estimatedIntakeKcal,
      exerciseEnergyExpenditureKcal: assessmentData.exerciseEnergyExpenditureKcal,
    };

    // Calcula as métricas
    console.log('[POST /calculate] Calculando métricas para paciente:', patient.name);
    const metrics = calculateMetrics(assessment, patient);

    console.log('[POST /calculate] Métricas calculadas com sucesso');

    // Retorna resposta
    return res.status(200).json({
      patient: {
        id: patient.id,
        name: patient.name,
        birthDate: patientData.birthDate, // retorna no formato original (DD/MM/YYYY)
        sex: patient.sex,
        heightM: patient.heightM,
      },
      assessment: {
        ...assessmentData,
        dateTime: assessmentData.dateTime || new Date().toISOString(),
      },
      metrics,
    });

  } catch (error) {
    console.error('[POST /calculate] Erro interno:', error);
    return res.status(500).json({
      error: 'Erro interno do servidor ao processar cálculos',
      details: error instanceof Error ? error.message : 'Erro desconhecido'
    });
  }
});

// ============================================================================
// INICIALIZAÇÃO DO SERVIDOR
// ============================================================================

export const startServer = () => {
  app.listen(port, () => {
    console.log(`🚀 Server is running on http://localhost:${port}`);
    console.log(`📊 POST /calculate - Endpoint de cálculos disponível`);
    console.log(`💚 GET /health - Health check disponível`);
  });
};
