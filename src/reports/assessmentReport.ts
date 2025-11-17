import PDFDocument from 'pdfkit';
import prisma from '../services/prisma.js';
import { calculateAge, formatDateToBrazilian, getCurrentDateTime } from '../utils/date.js';

// ============================================================================
// TIPOS
// ============================================================================

interface ReportData {
  patient: {
    name: string;
    sex: string;
    birthDate: Date;
    age: number;
    heightM: number;
  };
  assessment: {
    dateTime: Date;
    weightKg: number;
    bfPercent?: number;
    waistCm?: number;
    hipCm?: number;
    activityLevel?: string;
  };
  metrics: {
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
    cardiometabolicScore?: number;
    cardiometabolicRiskLevel?: string;
    redsScore?: number;
    redsRiskLevel?: string;
    metabolicAgeYears?: number;
    bodyCompScore?: number;
  };
}

// ============================================================================
// FUNÇÕES AUXILIARES PARA TEXTO
// ============================================================================

function getInterpretationTexts(data: ReportData): string[] {
  const texts: string[] = [];

  // IMC
  if (data.metrics.bmi && data.metrics.bmiCategory) {
    texts.push(`• Seu IMC está na faixa "${data.metrics.bmiCategory}" (${data.metrics.bmi.toFixed(1)}).`);
  }

  // Risco Cardiometabólico
  if (data.metrics.cardiometabolicRiskLevel) {
    texts.push(`• Seu risco cardiometabólico global é ${data.metrics.cardiometabolicRiskLevel}.`);
  }

  // % Gordura
  if (data.assessment.bfPercent) {
    const sex = data.patient.sex;
    let classification = 'dentro da faixa esperada';

    if (sex === 'M' && data.assessment.bfPercent > 25) {
      classification = 'elevada para o sexo masculino';
    } else if (sex === 'F' && data.assessment.bfPercent > 32) {
      classification = 'elevada para o sexo feminino';
    }

    texts.push(`• Sua porcentagem de gordura corporal (${data.assessment.bfPercent.toFixed(1)}%) está ${classification}.`);
  }

  // Idade Metabólica
  if (data.metrics.metabolicAgeYears) {
    const diff = data.metrics.metabolicAgeYears - data.patient.age;
    if (diff > 5) {
      texts.push(`• Sua idade metabólica estimada (${data.metrics.metabolicAgeYears} anos) está acima da sua idade cronológica.`);
    } else if (diff < -5) {
      texts.push(`• Sua idade metabólica estimada (${data.metrics.metabolicAgeYears} anos) está abaixo da sua idade cronológica - excelente!`);
    } else {
      texts.push(`• Sua idade metabólica estimada é de ${data.metrics.metabolicAgeYears} anos.`);
    }
  }

  // Body Comp Score
  if (data.metrics.bodyCompScore !== undefined) {
    let classification = 'excelente';
    if (data.metrics.bodyCompScore < 70) classification = 'precisa melhorar';
    else if (data.metrics.bodyCompScore < 85) classification = 'bom';

    texts.push(`• Seu Body Composition Score é ${data.metrics.bodyCompScore}/100 - ${classification}.`);
  }

  // RED-S
  if (data.metrics.redsRiskLevel && data.metrics.redsRiskLevel !== 'baixo') {
    texts.push(`• Atenção: risco de deficiência energética relativa no esporte (RED-S) detectado - ${data.metrics.redsRiskLevel}.`);
  }

  return texts;
}

function getSexLabel(sex: string): string {
  switch (sex) {
    case 'M': return 'Masculino';
    case 'F': return 'Feminino';
    default: return 'Outro';
  }
}

function getActivityLabel(level?: string): string {
  if (!level) return 'Não informado';
  switch (level) {
    case 'SEDENTARIO': return 'Sedentário';
    case 'LEVE': return 'Leve';
    case 'MODERADO': return 'Moderado';
    case 'INTENSO': return 'Intenso';
    case 'ATLETA': return 'Atleta';
    default: return level;
  }
}

// ============================================================================
// GERAÇÃO DO PDF
// ============================================================================

function createPDF(data: ReportData): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({
      size: 'A4',
      margins: { top: 50, bottom: 50, left: 50, right: 50 },
    });

    const chunks: Buffer[] = [];

    doc.on('data', (chunk) => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    // Cores
    const primaryColor = '#0F172A';
    const secondaryColor = '#38BDF8';
    const textColor = '#1F2937';
    const lightGray = '#F3F4F6';

    // ========================================
    // CABEÇALHO
    // ========================================
    doc
      .fillColor(primaryColor)
      .fontSize(24)
      .font('Helvetica-Bold')
      .text('NutroLab', 50, 50);

    doc
      .fillColor(textColor)
      .fontSize(18)
      .font('Helvetica-Bold')
      .text('Relatório de Avaliação Corporal', 50, 85);

    doc
      .fillColor('#6B7280')
      .fontSize(10)
      .font('Helvetica')
      .text(`Gerado em: ${getCurrentDateTime()}`, 50, 110);

    // Linha separadora
    doc
      .strokeColor(secondaryColor)
      .lineWidth(2)
      .moveTo(50, 130)
      .lineTo(545, 130)
      .stroke();

    let yPosition = 150;

    // ========================================
    // DADOS DO PACIENTE
    // ========================================
    doc
      .fillColor(primaryColor)
      .fontSize(14)
      .font('Helvetica-Bold')
      .text('Dados do Paciente', 50, yPosition);

    yPosition += 25;

    const patientData = [
      ['Nome:', data.patient.name],
      ['Sexo:', getSexLabel(data.patient.sex)],
      ['Data de Nascimento:', formatDateToBrazilian(data.patient.birthDate)],
      ['Idade:', `${data.patient.age} anos`],
      ['Altura:', `${data.patient.heightM.toFixed(2)} m`],
      ['Data da Avaliação:', formatDateToBrazilian(data.assessment.dateTime)],
    ];

    doc.fillColor(textColor).fontSize(11).font('Helvetica');

    patientData.forEach(([label, value]) => {
      doc.font('Helvetica-Bold').text(label, 50, yPosition, { width: 150, continued: true });
      doc.font('Helvetica').text(value, { width: 350 });
      yPosition += 20;
    });

    yPosition += 10;

    // ========================================
    // DADOS ANTROPOMÉTRICOS
    // ========================================
    doc
      .fillColor(primaryColor)
      .fontSize(14)
      .font('Helvetica-Bold')
      .text('Dados Antropométricos', 50, yPosition);

    yPosition += 25;

    const anthropometricData: [string, string][] = [
      ['Peso:', `${data.assessment.weightKg.toFixed(1)} kg`],
    ];

    if (data.assessment.bfPercent) {
      anthropometricData.push(['% Gordura:', `${data.assessment.bfPercent.toFixed(1)}%`]);
    }
    if (data.metrics.fatMassKg) {
      anthropometricData.push(['Massa Gorda:', `${data.metrics.fatMassKg.toFixed(1)} kg`]);
    }
    if (data.metrics.leanMassKg) {
      anthropometricData.push(['Massa Magra:', `${data.metrics.leanMassKg.toFixed(1)} kg`]);
    }
    if (data.metrics.bmi && data.metrics.bmiCategory) {
      anthropometricData.push(['IMC:', `${data.metrics.bmi.toFixed(1)} (${data.metrics.bmiCategory})`]);
    }
    if (data.metrics.waistHeightRatio && data.metrics.waistHeightRisk) {
      anthropometricData.push([
        'Rel. Cintura/Altura:',
        `${data.metrics.waistHeightRatio.toFixed(2)} - Risco ${data.metrics.waistHeightRisk}`,
      ]);
    }
    if (data.metrics.waistHipRatio && data.metrics.waistHipRisk) {
      anthropometricData.push([
        'Rel. Cintura/Quadril:',
        `${data.metrics.waistHipRatio.toFixed(2)} - Risco ${data.metrics.waistHipRisk}`,
      ]);
    }

    doc.fillColor(textColor).fontSize(11).font('Helvetica');

    anthropometricData.forEach(([label, value]) => {
      doc.font('Helvetica-Bold').text(label, 50, yPosition, { width: 180, continued: true });
      doc.font('Helvetica').text(value, { width: 350 });
      yPosition += 20;
    });

    yPosition += 10;

    // ========================================
    // METABOLISMO
    // ========================================
    doc
      .fillColor(primaryColor)
      .fontSize(14)
      .font('Helvetica-Bold')
      .text('Metabolismo', 50, yPosition);

    yPosition += 25;

    const metabolismData: [string, string][] = [];

    if (data.metrics.bmrMifflin) {
      metabolismData.push(['TMB (Mifflin-St Jeor):', `${data.metrics.bmrMifflin.toFixed(0)} kcal/dia`]);
    }
    if (data.metrics.bmrCunningham) {
      metabolismData.push(['TMB (Cunningham):', `${data.metrics.bmrCunningham.toFixed(0)} kcal/dia`]);
    }
    if (data.metrics.tdee) {
      metabolismData.push(['Gasto Energético Total (TDEE):', `${data.metrics.tdee.toFixed(0)} kcal/dia`]);
    }
    if (data.assessment.activityLevel) {
      metabolismData.push(['Nível de Atividade:', getActivityLabel(data.assessment.activityLevel)]);
    }
    if (data.metrics.energyAvailability && data.metrics.eaCategory) {
      metabolismData.push([
        'Energia Disponível:',
        `${data.metrics.energyAvailability.toFixed(1)} kcal/kg - ${data.metrics.eaCategory}`,
      ]);
    }
    if (data.metrics.metabolicAgeYears) {
      metabolismData.push(['Idade Metabólica:', `${data.metrics.metabolicAgeYears} anos`]);
    }

    doc.fillColor(textColor).fontSize(11).font('Helvetica');

    metabolismData.forEach(([label, value]) => {
      doc.font('Helvetica-Bold').text(label, 50, yPosition, { width: 220, continued: true });
      doc.font('Helvetica').text(value, { width: 300 });
      yPosition += 20;
    });

    yPosition += 10;

    // Verificar se precisa de nova página
    if (yPosition > 650) {
      doc.addPage();
      yPosition = 50;
    }

    // ========================================
    // RISCOS E SCORES
    // ========================================
    doc
      .fillColor(primaryColor)
      .fontSize(14)
      .font('Helvetica-Bold')
      .text('Riscos e Scores', 50, yPosition);

    yPosition += 25;

    const risksData: [string, string][] = [];

    if (data.metrics.cardiometabolicScore !== undefined && data.metrics.cardiometabolicRiskLevel) {
      risksData.push([
        'Risco Cardiometabólico:',
        `${data.metrics.cardiometabolicRiskLevel.toUpperCase()} (Score: ${data.metrics.cardiometabolicScore})`,
      ]);
    }
    if (data.metrics.redsScore !== undefined && data.metrics.redsRiskLevel) {
      risksData.push([
        'Risco RED-S:',
        `${data.metrics.redsRiskLevel.toUpperCase()} (Score: ${data.metrics.redsScore})`,
      ]);
    }
    if (data.metrics.bodyCompScore !== undefined) {
      risksData.push(['Body Composition Score:', `${data.metrics.bodyCompScore}/100`]);
    }

    doc.fillColor(textColor).fontSize(11).font('Helvetica');

    risksData.forEach(([label, value]) => {
      doc.font('Helvetica-Bold').text(label, 50, yPosition, { width: 200, continued: true });
      doc.font('Helvetica').text(value, { width: 350 });
      yPosition += 20;
    });

    yPosition += 20;

    // ========================================
    // INTERPRETAÇÃO
    // ========================================
    if (yPosition > 600) {
      doc.addPage();
      yPosition = 50;
    }

    doc
      .fillColor(primaryColor)
      .fontSize(14)
      .font('Helvetica-Bold')
      .text('Interpretação e Observações', 50, yPosition);

    yPosition += 25;

    const interpretations = getInterpretationTexts(data);

    doc.fillColor(textColor).fontSize(10).font('Helvetica');

    interpretations.forEach((text) => {
      doc.text(text, 50, yPosition, { width: 495, align: 'left' });
      yPosition += doc.heightOfString(text, { width: 495 }) + 8;
    });

    // ========================================
    // RODAPÉ
    // ========================================
    const pageHeight = doc.page.height;
    doc
      .fontSize(8)
      .fillColor('#9CA3AF')
      .text(
        'Este relatório é um resultado de avaliação automatizada e não substitui consulta médica profissional.',
        50,
        pageHeight - 80,
        { width: 495, align: 'center' }
      );

    doc
      .fontSize(8)
      .fillColor('#9CA3AF')
      .text('NutroLab - Sistema de Avaliação Nutricional', 50, pageHeight - 60, {
        width: 495,
        align: 'center',
      });

    doc.end();
  });
}

// ============================================================================
// FUNÇÃO PRINCIPAL
// ============================================================================

export async function generateAssessmentReportPdf(assessmentId: string): Promise<Buffer> {
  // Buscar avaliação com métricas e paciente
  const assessment = await prisma.assessment.findUnique({
    where: { id: assessmentId },
    include: {
      metrics: true,
      patient: true,
    },
  });

  if (!assessment) {
    throw new Error('Avaliação não encontrada');
  }

  if (!assessment.metrics) {
    throw new Error('Avaliação não possui métricas calculadas');
  }

  if (!assessment.patient) {
    throw new Error('Paciente não encontrado');
  }

  // Preparar dados para o relatório
  const age = calculateAge(assessment.patient.birthDate, assessment.dateTime);

  const reportData: ReportData = {
    patient: {
      name: assessment.patient.name,
      sex: assessment.patient.sex,
      birthDate: assessment.patient.birthDate,
      age,
      heightM: assessment.patient.heightM,
    },
    assessment: {
      dateTime: assessment.dateTime,
      weightKg: assessment.weightKg ?? 0,
      bfPercent: assessment.bfPercent ?? undefined,
      waistCm: assessment.waistCm ?? undefined,
      hipCm: assessment.hipCm ?? undefined,
      activityLevel: assessment.activityLevel ?? undefined,
    },
    metrics: {
      bmi: assessment.metrics.bmi ?? undefined,
      bmiCategory: assessment.metrics.bmiCategory ?? undefined,
      waistHeightRatio: assessment.metrics.waistHeightRatio ?? undefined,
      waistHeightRisk: assessment.metrics.waistHeightRisk ?? undefined,
      waistHipRatio: assessment.metrics.waistHipRatio ?? undefined,
      waistHipRisk: assessment.metrics.waistHipRisk ?? undefined,
      fatMassKg: assessment.metrics.fatMassKg ?? undefined,
      leanMassKg: assessment.metrics.leanMassKg ?? undefined,
      smi: assessment.metrics.smi ?? undefined,
      bmrMifflin: assessment.metrics.bmrMifflin ?? undefined,
      bmrCunningham: assessment.metrics.bmrCunningham ?? undefined,
      tdee: assessment.metrics.tdee ?? undefined,
      energyAvailability: assessment.metrics.energyAvailability ?? undefined,
      eaCategory: assessment.metrics.eaCategory ?? undefined,
      cardiometabolicScore: assessment.metrics.cardiometabolicScore ?? undefined,
      cardiometabolicRiskLevel: assessment.metrics.cardiometabolicRiskLevel ?? undefined,
      redsScore: assessment.metrics.redsScore ?? undefined,
      redsRiskLevel: assessment.metrics.redsRiskLevel ?? undefined,
      metabolicAgeYears: assessment.metrics.metabolicAgeYears ?? undefined,
      bodyCompScore: assessment.metrics.bodyCompScore ?? undefined,
    },
  };

  // Gerar e retornar PDF
  return createPDF(reportData);
}
