import express from 'express';
import cors from 'cors';
import { calculateMetrics } from '../calc/calculateMetrics.js';
import type { AssessmentInput, PatientBasic } from '../domain/types.js';
import * as patientService from '../services/patientService.js';
import * as assessmentService from '../services/assessmentService.js';
import { generateAssessmentReportPdf } from '../reports/assessmentReport.js';

const app = express();
const port = process.env.PORT || 3000;

// Middleware para CORS (permitir requisições do frontend)
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:3000'],
  credentials: true
}));

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
 * Converte Date para formato brasileiro DD/MM/YYYY
 */
function convertDateToBrazilian(date: Date): string {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

/**
 * Valida os campos obrigatórios do paciente
 */
function validatePatient(patient: any): { valid: boolean; error?: string } {
  if (!patient) {
    return { valid: false, error: "Campo 'patient' é obrigatório" };
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
// ROTAS - HEALTH CHECK
// ============================================================================

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// ============================================================================
// ROTAS - CÁLCULOS (SEM PERSISTÊNCIA)
// ============================================================================

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
      id: patientData.id || 'temp',
      name: patientData.name,
      birthDate: birthDate,
      sex: patientData.sex,
      heightM: patientData.heightM,
    };

    // Constrói objeto AssessmentInput
    const assessment: AssessmentInput = {
      patientId: patient.id,
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
      // Skinfold measurements
      tricepsMm: assessmentData.tricepsMm,
      subscapularMm: assessmentData.subscapularMm,
      suprailiacMm: assessmentData.suprailiacMm,
      abdominalMm: assessmentData.abdominalMm,
      thighMm: assessmentData.thighMm,
      chestMm: assessmentData.chestMm,
      midaxillaryMm: assessmentData.midaxillaryMm,
      skinfoldProtocol: assessmentData.skinfoldProtocol,
      skinfoldNotes: assessmentData.skinfoldNotes,
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
// ROTAS - PACIENTES
// ============================================================================

/**
 * POST /patients - Criar novo paciente
 */
app.post('/patients', async (req, res) => {
  console.log('[POST /patients] Criando novo paciente...');

  try {
    const { name, sex, birthDate, heightM } = req.body;

    // Validação
    if (!name || typeof name !== 'string') {
      return res.status(400).json({ error: "Campo 'name' é obrigatório" });
    }

    if (!sex || !['M', 'F', 'OUTRO'].includes(sex)) {
      return res.status(400).json({ error: "Campo 'sex' deve ser 'M', 'F' ou 'OUTRO'" });
    }

    if (!birthDate || typeof birthDate !== 'string') {
      return res.status(400).json({ error: "Campo 'birthDate' é obrigatório (formato DD/MM/YYYY)" });
    }

    if (typeof heightM !== 'number' || heightM <= 0) {
      return res.status(400).json({ error: "Campo 'heightM' é obrigatório e deve ser positivo" });
    }

    // Converte data
    const isoBirthDate = convertBrazilianDateToISO(birthDate);
    if (!isoBirthDate) {
      return res.status(400).json({
        error: "Formato de 'birthDate' inválido. Use DD/MM/YYYY (exemplo: 21/03/1995)"
      });
    }

    const patient = await patientService.createPatient({
      name,
      sex,
      birthDate: new Date(isoBirthDate),
      heightM,
    });

    console.log('[POST /patients] Paciente criado:', patient.id);

    return res.status(201).json({
      ...patient,
      birthDate: convertDateToBrazilian(patient.birthDate),
    });

  } catch (error) {
    console.error('[POST /patients] Erro:', error);
    return res.status(500).json({
      error: 'Erro ao criar paciente',
      details: error instanceof Error ? error.message : 'Erro desconhecido'
    });
  }
});

/**
 * GET /patients/:id - Buscar paciente por ID
 */
app.get('/patients/:id', async (req, res) => {
  console.log('[GET /patients/:id] Buscando paciente:', req.params.id);

  try {
    const patient = await patientService.getPatientById(req.params.id);

    if (!patient) {
      return res.status(404).json({ error: 'Paciente não encontrado' });
    }

    return res.json({
      ...patient,
      birthDate: convertDateToBrazilian(patient.birthDate),
      assessments: patient.assessments?.map(a => ({
        ...a,
        dateTime: convertDateToBrazilian(a.dateTime),
      })),
    });

  } catch (error) {
    console.error('[GET /patients/:id] Erro:', error);
    return res.status(500).json({
      error: 'Erro ao buscar paciente',
      details: error instanceof Error ? error.message : 'Erro desconhecido'
    });
  }
});

/**
 * GET /patients - Listar todos os pacientes
 */
app.get('/patients', async (req, res) => {
  console.log('[GET /patients] Listando pacientes...');

  try {
    const patients = await patientService.listPatients();

    return res.json(
      patients.map(p => ({
        ...p,
        birthDate: convertDateToBrazilian(p.birthDate),
        assessments: p.assessments?.map(a => ({
          ...a,
          dateTime: convertDateToBrazilian(a.dateTime),
        })),
      }))
    );

  } catch (error) {
    console.error('[GET /patients] Erro:', error);
    return res.status(500).json({
      error: 'Erro ao listar pacientes',
      details: error instanceof Error ? error.message : 'Erro desconhecido'
    });
  }
});

// ============================================================================
// ROTAS - AVALIAÇÕES
// ============================================================================

/**
 * POST /patients/:id/assessments - Criar nova avaliação para um paciente
 */
app.post('/patients/:id/assessments', async (req, res) => {
  console.log('[POST /patients/:id/assessments] Criando avaliação para paciente:', req.params.id);

  try {
    const patientId = req.params.id;
    const assessmentData = req.body;

    // Validação
    if (typeof assessmentData.weightKg !== 'number' || assessmentData.weightKg <= 0) {
      return res.status(400).json({
        error: "Campo 'weightKg' é obrigatório e deve ser positivo"
      });
    }

    // Converte dateTime se fornecido
    let dateTime: Date | undefined;
    if (assessmentData.dateTime) {
      const isoDate = convertBrazilianDateToISO(assessmentData.dateTime);
      if (!isoDate) {
        return res.status(400).json({
          error: "Formato de 'dateTime' inválido. Use DD/MM/YYYY"
        });
      }
      dateTime = new Date(isoDate);
    }

    const assessment = await assessmentService.createAssessment({
      patientId,
      dateTime,
      weightKg: assessmentData.weightKg,
      bfPercent: assessmentData.bfPercent,
      waistCm: assessmentData.waistCm,
      hipCm: assessmentData.hipCm,
      neckCm: assessmentData.neckCm,
      skeletalMuscleKg: assessmentData.skeletalMuscleKg,
      ffmKg: assessmentData.ffmKg,
      visceralFatIndex: assessmentData.visceralFatIndex,
      tbwL: assessmentData.tbwL,
      ecwL: assessmentData.ecwL,
      icwL: assessmentData.icwL,
      phaseAngleDeg: assessmentData.phaseAngleDeg,
      activityLevel: assessmentData.activityLevel,
      estimatedIntakeKcal: assessmentData.estimatedIntakeKcal,
      exerciseEnergyExpenditureKcal: assessmentData.exerciseEnergyExpenditureKcal,
      // Skinfold measurements
      tricepsMm: assessmentData.tricepsMm,
      subscapularMm: assessmentData.subscapularMm,
      suprailiacMm: assessmentData.suprailiacMm,
      abdominalMm: assessmentData.abdominalMm,
      thighMm: assessmentData.thighMm,
      chestMm: assessmentData.chestMm,
      midaxillaryMm: assessmentData.midaxillaryMm,
      skinfoldProtocol: assessmentData.skinfoldProtocol,
      skinfoldNotes: assessmentData.skinfoldNotes,
    });

    console.log('[POST /patients/:id/assessments] Avaliação criada:', assessment?.id);

    return res.status(201).json({
      ...assessment,
      dateTime: assessment ? convertDateToBrazilian(assessment.dateTime) : null,
      patient: assessment?.patient ? {
        ...assessment.patient,
        birthDate: convertDateToBrazilian(assessment.patient.birthDate),
      } : null,
    });

  } catch (error) {
    console.error('[POST /patients/:id/assessments] Erro:', error);
    return res.status(500).json({
      error: 'Erro ao criar avaliação',
      details: error instanceof Error ? error.message : 'Erro desconhecido'
    });
  }
});

/**
 * GET /patients/:id/assessments - Listar avaliações de um paciente
 */
app.get('/patients/:id/assessments', async (req, res) => {
  console.log('[GET /patients/:id/assessments] Listando avaliações do paciente:', req.params.id);

  try {
    const assessments = await assessmentService.getAssessmentsByPatientId(req.params.id);

    return res.json(
      assessments.map(a => ({
        ...a,
        dateTime: convertDateToBrazilian(a.dateTime),
      }))
    );

  } catch (error) {
    console.error('[GET /patients/:id/assessments] Erro:', error);
    return res.status(500).json({
      error: 'Erro ao listar avaliações',
      details: error instanceof Error ? error.message : 'Erro desconhecido'
    });
  }
});

/**
 * GET /assessments/:id - Buscar avaliação por ID
 */
app.get('/assessments/:id', async (req, res) => {
  console.log('[GET /assessments/:id] Buscando avaliação:', req.params.id);

  try {
    const assessment = await assessmentService.getAssessmentById(req.params.id);

    if (!assessment) {
      return res.status(404).json({ error: 'Avaliação não encontrada' });
    }

    return res.json({
      ...assessment,
      dateTime: convertDateToBrazilian(assessment.dateTime),
      patient: assessment.patient ? {
        ...assessment.patient,
        birthDate: convertDateToBrazilian(assessment.patient.birthDate),
      } : null,
    });

  } catch (error) {
    console.error('[GET /assessments/:id] Erro:', error);
    return res.status(500).json({
      error: 'Erro ao buscar avaliação',
      details: error instanceof Error ? error.message : 'Erro desconhecido'
    });
  }
});

/**
 * GET /assessments/:id/report - Gerar PDF da avaliação
 */
app.get('/assessments/:id/report', async (req, res) => {
  console.log('[GET /assessments/:id/report] Gerando PDF para avaliação:', req.params.id);

  try {
    const pdfBuffer = await generateAssessmentReportPdf(req.params.id);

    // Configurar headers para download do PDF
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="relatorio-avaliacao-${req.params.id}.pdf"`);
    res.setHeader('Content-Length', pdfBuffer.length);

    // Enviar PDF
    res.send(pdfBuffer);

    console.log('[GET /assessments/:id/report] PDF gerado com sucesso');
  } catch (error) {
    console.error('[GET /assessments/:id/report] Erro:', error);

    if (error instanceof Error && error.message.includes('não encontrad')) {
      return res.status(404).json({
        error: error.message
      });
    }

    if (error instanceof Error && error.message.includes('métricas')) {
      return res.status(400).json({
        error: error.message
      });
    }

    return res.status(500).json({
      error: 'Erro ao gerar relatório PDF',
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
    console.log(`\n📍 Endpoints disponíveis:`);
    console.log(`   💚 GET  /health`);
    console.log(`   📊 POST /calculate (cálculo sem persistência)`);
    console.log(`   👤 POST /patients`);
    console.log(`   👤 GET  /patients`);
    console.log(`   👤 GET  /patients/:id`);
    console.log(`   📋 POST /patients/:id/assessments`);
    console.log(`   📋 GET  /patients/:id/assessments`);
    console.log(`   📋 GET  /assessments/:id`);
    console.log(`   📄 GET  /assessments/:id/report (PDF)\n`);
  });
};
