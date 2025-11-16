import type { Patient, Assessment, CreatePatientData, CreateAssessmentData } from '../types';

const API_BASE_URL = 'http://localhost:3000';

class ApiClient {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;

    const config: RequestInit = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.error || `Erro na requisição: ${response.statusText}`
        );
      }

      return await response.json();
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Erro desconhecido ao fazer requisição');
    }
  }

  // ===== PATIENTS =====

  async getPatients(): Promise<Patient[]> {
    return this.request<Patient[]>('/patients');
  }

  async getPatientById(id: string): Promise<Patient> {
    return this.request<Patient>(`/patients/${id}`);
  }

  async createPatient(data: CreatePatientData): Promise<Patient> {
    return this.request<Patient>('/patients', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // ===== ASSESSMENTS =====

  async getAssessmentsByPatientId(patientId: string): Promise<Assessment[]> {
    return this.request<Assessment[]>(`/patients/${patientId}/assessments`);
  }

  async getAssessmentById(id: string): Promise<Assessment> {
    return this.request<Assessment>(`/assessments/${id}`);
  }

  async createAssessment(
    patientId: string,
    data: CreateAssessmentData
  ): Promise<Assessment> {
    return this.request<Assessment>(`/patients/${patientId}/assessments`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }
}

export const apiClient = new ApiClient();
