import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { apiClient } from '../api/client';
import type { Patient } from '../types';
import { calculateAge } from '../utils/date';

export function PatientDetail() {
  const { id } = useParams<{ id: string }>();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      loadPatient(id);
    }
  }, [id]);

  const loadPatient = async (patientId: string) => {
    try {
      setLoading(true);
      const data = await apiClient.getPatientById(patientId);
      setPatient(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar paciente');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="text-center py-12">
          <p className="text-sm text-muted">Carregando dados do paciente...</p>
        </div>
      </Layout>
    );
  }

  if (error || !patient) {
    return (
      <Layout>
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {error || 'Paciente não encontrado'}
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header com Info do Paciente */}
        <div className="bg-card border border-border rounded-xl shadow-sm p-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">{patient.name}</h1>
              <div className="mt-3 flex flex-wrap gap-x-6 gap-y-1 text-sm text-muted">
                <span>{calculateAge(patient.birthDate)} anos</span>
                <span>•</span>
                <span>{patient.sex === 'M' ? 'Masculino' : patient.sex === 'F' ? 'Feminino' : 'Outro'}</span>
                <span>•</span>
                <span>{patient.heightM.toFixed(2)} m</span>
                <span>•</span>
                <span>Nascimento: {patient.birthDate}</span>
              </div>
            </div>
            <Link
              to={`/patients/${patient.id}/assessments/new`}
              className="bg-accent hover:bg-sky-500 text-white px-4 py-2 rounded-lg font-semibold shadow-sm transition-colors"
            >
              + Nova Avaliação
            </Link>
          </div>
        </div>

        {/* Card de Avaliações */}
        <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-border">
            <h2 className="text-lg font-semibold text-gray-900">Avaliações</h2>
            <p className="text-sm text-muted mt-1">Histórico de avaliações do paciente</p>
          </div>

          {!patient.assessments || patient.assessments.length === 0 ? (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
              <p className="text-sm text-muted mt-3 mb-4">Nenhuma avaliação registrada ainda</p>
              <Link
                to={`/patients/${patient.id}/assessments/new`}
                className="inline-block bg-accent hover:bg-sky-500 text-white px-4 py-2 rounded-lg font-semibold shadow-sm transition-colors"
              >
                Criar Primeira Avaliação
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b border-border bg-gray-50">
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">
                      Data
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">
                      Peso (kg)
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">
                      % Gordura
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">
                      IMC
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">
                      Body Comp Score
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border bg-white">
                  {patient.assessments.map((assessment) => (
                    <tr key={assessment.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {assessment.dateTime}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-muted">
                        {assessment.weightKg?.toFixed(1) || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-muted">
                        {assessment.bfPercent?.toFixed(1) || '-'}%
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-muted">
                        {assessment.metrics?.bmi?.toFixed(1) || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-muted">
                        {assessment.metrics?.bodyCompScore || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <Link
                          to={`/assessments/${assessment.id}`}
                          className="bg-white border border-border text-gray-800 px-3 py-1.5 rounded-md hover:bg-gray-50 transition-colors inline-block"
                        >
                          Ver
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
