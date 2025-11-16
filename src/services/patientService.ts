import prisma from './prisma.js';

// ============================================================================
// INTERFACES
// ============================================================================

export interface CreatePatientInput {
  name: string;
  sex: string;
  birthDate: Date;
  heightM: number;
}

export interface PatientWithAssessments {
  id: string;
  name: string;
  sex: string;
  birthDate: Date;
  heightM: number;
  createdAt: Date;
  updatedAt: Date;
  assessments?: any[];
}

// ============================================================================
// PATIENT SERVICE
// ============================================================================

/**
 * Cria um novo paciente no banco de dados
 */
export async function createPatient(data: CreatePatientInput): Promise<PatientWithAssessments> {
  const patient = await prisma.patient.create({
    data: {
      name: data.name,
      sex: data.sex,
      birthDate: data.birthDate,
      heightM: data.heightM,
    },
  });

  return patient;
}

/**
 * Busca um paciente por ID
 */
export async function getPatientById(id: string): Promise<PatientWithAssessments | null> {
  const patient = await prisma.patient.findUnique({
    where: { id },
    include: {
      assessments: {
        orderBy: { dateTime: 'desc' },
        include: {
          metrics: true,
        },
      },
    },
  });

  return patient;
}

/**
 * Lista todos os pacientes
 */
export async function listPatients(): Promise<PatientWithAssessments[]> {
  const patients = await prisma.patient.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      assessments: {
        orderBy: { dateTime: 'desc' },
        take: 1, // Apenas a última avaliação
      },
    },
  });

  return patients;
}

/**
 * Atualiza dados de um paciente
 */
export async function updatePatient(
  id: string,
  data: Partial<CreatePatientInput>
): Promise<PatientWithAssessments> {
  const patient = await prisma.patient.update({
    where: { id },
    data: {
      ...(data.name && { name: data.name }),
      ...(data.sex && { sex: data.sex }),
      ...(data.birthDate && { birthDate: data.birthDate }),
      ...(data.heightM && { heightM: data.heightM }),
    },
  });

  return patient;
}

/**
 * Deleta um paciente
 */
export async function deletePatient(id: string): Promise<void> {
  await prisma.patient.delete({
    where: { id },
  });
}
