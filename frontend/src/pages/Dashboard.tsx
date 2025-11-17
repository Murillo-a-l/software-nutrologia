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
      <div className="space-y-8">
        {/* Header */}
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-muted">Painel clínico</p>
          <div className="mt-2 flex flex-wrap items-center gap-3">
            <h1 className="text-3xl font-semibold text-primary">Dashboard</h1>
            <span className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1 text-xs font-medium text-muted border border-border">
              Operacional
            </span>
          </div>
          <p className="text-sm text-muted mt-2 max-w-2xl">
            Acompanhe indicadores assistenciais, cadastre pacientes e visualize rapidamente o histórico das últimas avaliações.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-2">
          {[
            { label: 'Total de pacientes', value: loading ? '...' : patients.length, icon: (
              <svg className="h-8 w-8 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM6 21v-1a4 4 0 014-4h4a4 4 0 014 4v1" />
              </svg>
            ) },
            { label: 'Avaliações hoje', value: '—', icon: (
              <svg className="h-8 w-8 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            ) },
            { label: 'Novos no mês', value: '—', icon: (
              <svg className="h-8 w-8 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
            ) },
          ].map((kpi) => (
            <div key={kpi.label} className="bg-card border border-border rounded-2xl shadow-sm p-4 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <p className="text-xs font-medium uppercase tracking-wide text-muted">{kpi.label}</p>
                {kpi.icon}
              </div>
              <p className="text-3xl font-semibold text-gray-900">{kpi.value}</p>
              <span className="text-xs text-muted">Atualizado em tempo real</span>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="bg-card border border-border rounded-2xl shadow-sm p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted">Fluxo diário</p>
              <h2 className="text-xl font-semibold text-gray-900">Ações rápidas</h2>
              <p className="text-sm text-muted mt-1">Acelere o atendimento iniciando um novo cadastro ou navegando pela lista completa.</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link to="/patients/new" className="bg-accent text-white rounded-xl px-4 py-2 font-semibold shadow-sm hover:bg-sky-500 transition">
                + Cadastrar novo paciente
              </Link>
              <Link to="/patients" className="bg-white text-primary border border-border rounded-xl px-4 py-2 hover:bg-gray-50 font-semibold">
                Ver lista completa de pacientes
              </Link>
            </div>
          </div>
        </div>

        {/* Recent Patients */}
        <div className="bg-card border border-border rounded-2xl shadow-sm p-6">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted">Últimos atendimentos</p>
              <h2 className="text-xl font-semibold text-gray-900">Pacientes recentes</h2>
            </div>
            <Link to="/patients" className="text-sm font-semibold text-accent hover:text-sky-500">
              Ver todos
            </Link>
          </div>

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
