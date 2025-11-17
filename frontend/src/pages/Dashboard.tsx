import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { apiClient } from '../api/client';
import type { Patient } from '../types';
import { calculateAge } from '../utils/date';

export function Dashboard() {
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

  const recentPatients = patients.slice(0, 5);

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">Dashboard</h1>
          <p className="text-sm text-muted mt-1">Visão geral do sistema</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-card border border-border rounded-xl shadow-sm p-4">
            <p className="text-xs uppercase tracking-wide text-muted font-medium">Total de Pacientes</p>
            <p className="text-2xl font-semibold text-gray-900 mt-2">
              {loading ? '...' : patients.length}
            </p>
          </div>

          <div className="bg-card border border-border rounded-xl shadow-sm p-4">
            <p className="text-xs uppercase tracking-wide text-muted font-medium">Avaliações Hoje</p>
            <p className="text-2xl font-semibold text-gray-900 mt-2">-</p>
          </div>

          <div className="bg-card border border-border rounded-xl shadow-sm p-4">
            <p className="text-xs uppercase tracking-wide text-muted font-medium">Novos este Mês</p>
            <p className="text-2xl font-semibold text-gray-900 mt-2">-</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-card border border-border rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Ações Rápidas</h2>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/patients/new"
              className="bg-accent hover:bg-sky-500 text-white px-4 py-2 rounded-lg font-semibold shadow-sm transition-colors"
            >
              + Cadastrar Novo Paciente
            </Link>
            <Link
              to="/patients"
              className="bg-white border border-border text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-50 font-medium transition-colors"
            >
              Ver Lista Completa
            </Link>
          </div>
        </div>

        {/* Recent Patients */}
        <div className="bg-card border border-border rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Pacientes Recentes
          </h2>

          {loading && (
            <div className="text-center py-8">
              <p className="text-sm text-muted">Carregando pacientes...</p>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {!loading && !error && recentPatients.length === 0 && (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <p className="text-sm text-muted mt-3">Nenhum paciente cadastrado ainda</p>
              <p className="text-xs text-muted mt-1">Comece cadastrando seu primeiro paciente</p>
            </div>
          )}

          {!loading && !error && recentPatients.length > 0 && (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b border-border bg-gray-50">
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">
                      Nome
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">
                      Idade
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">
                      Sexo
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">
                      Ação
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {recentPatients.map((patient) => (
                    <tr key={patient.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">
                        {patient.name}
                      </td>
                      <td className="px-4 py-3 text-sm text-muted">
                        {calculateAge(patient.birthDate)} anos
                      </td>
                      <td className="px-4 py-3 text-sm text-muted">
                        {patient.sex === 'M' ? 'Masculino' : patient.sex === 'F' ? 'Feminino' : 'Outro'}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <Link
                          to={`/patients/${patient.id}`}
                          className="text-accent hover:text-sky-600 font-medium"
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
