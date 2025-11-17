import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { apiClient } from '../api/client';
import type { Patient } from '../types';
import { calculateAge } from '../utils/date';

export function PatientList() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadPatients();
  }, []);

  const loadPatients = async () => {
    try {
      setLoading(true);
      const data = await apiClient.getPatients();
      setPatients(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar pacientes');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">Pacientes</h1>
            <p className="text-sm text-muted mt-1">Lista completa de pacientes cadastrados</p>
          </div>
          <Link
            to="/patients/new"
            className="bg-accent hover:bg-sky-500 text-white px-4 py-2 rounded-lg font-semibold shadow-sm transition-colors"
          >
            + Novo Paciente
          </Link>
        </div>

        {/* Content */}
        <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
          {loading && (
            <div className="text-center py-12">
              <p className="text-sm text-muted">Carregando pacientes...</p>
            </div>
          )}

          {error && (
            <div className="m-6">
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            </div>
          )}

          {!loading && !error && patients.length === 0 && (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <p className="text-sm text-muted mt-3 mb-4">Nenhum paciente cadastrado ainda</p>
              <Link
                to="/patients/new"
                className="inline-block bg-accent hover:bg-sky-500 text-white px-4 py-2 rounded-lg font-semibold shadow-sm transition-colors"
              >
                Cadastrar Primeiro Paciente
              </Link>
            </div>
          )}

          {!loading && !error && patients.length > 0 && (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b border-border bg-gray-50">
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">
                      Nome
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">
                      Idade
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">
                      Sexo
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">
                      Altura
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">
                      Avaliações
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border bg-white">
                  {patients.map((patient) => (
                    <tr key={patient.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {patient.name}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-muted">
                        {calculateAge(patient.birthDate)} anos
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-muted">
                        {patient.sex === 'M' ? 'Masculino' : patient.sex === 'F' ? 'Feminino' : 'Outro'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-muted">
                        {patient.heightM.toFixed(2)} m
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-muted">
                        {patient.assessments?.length || 0}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <Link
                          to={`/patients/${patient.id}`}
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
