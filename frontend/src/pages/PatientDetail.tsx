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
          <p className="text-gray-600">Carregando dados do paciente...</p>
        </div>
      </Layout>
    );
  }

  if (error || !patient) {
    return (
      <Layout>
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
          {error || 'Paciente não encontrado'}
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Patient Info Card */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{patient.name}</h1>
              <div className="mt-2 flex flex-wrap gap-4 text-sm text-gray-600">
                <span>
                  <strong>Idade:</strong> {calculateAge(patient.birthDate)} anos
                </span>
                <span>
                  <strong>Sexo:</strong>{' '}
                  {patient.sex === 'M' ? 'Masculino' : patient.sex === 'F' ? 'Feminino' : 'Outro'}
                </span>
                <span>
                  <strong>Altura:</strong> {patient.heightM.toFixed(2)} m
                </span>
                <span>
                  <strong>Data de Nascimento:</strong> {patient.birthDate}
                </span>
              </div>
            </div>
            <Link
              to={`/patients/${patient.id}/assessments/new`}
              className="bg-secondary hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors shadow-md hover:shadow-lg"
            >
              + Nova Avaliação
            </Link>
          </div>
        </div>

        {/* Assessments List */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Avaliações</h2>

          {!patient.assessments || patient.assessments.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <p className="text-gray-600 mb-4">Nenhuma avaliação registrada ainda.</p>
              <Link
                to={`/patients/${patient.id}/assessments/new`}
                className="inline-block bg-secondary hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                Criar Primeira Avaliação
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Data
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Peso (kg)
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      % Gordura
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      IMC
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Body Comp Score
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {patient.assessments.map((assessment) => (
                    <tr key={assessment.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {assessment.dateTime}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {assessment.weightKg?.toFixed(1) || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {assessment.bfPercent?.toFixed(1) || '-'}%
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {assessment.metrics?.bmi?.toFixed(1) || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {assessment.metrics?.bodyCompScore || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <Link
                          to={`/assessments/${assessment.id}`}
                          className="text-secondary hover:text-blue-700"
                        >
                          Ver Detalhes
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
