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
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted">Gestão clínica</p>
            <h1 className="text-3xl font-semibold text-primary mt-1">Pacientes</h1>
            <p className="text-sm text-muted mt-2">Acompanhe todos os pacientes cadastrados e acesse seus históricos e avaliações.</p>
          </div>
          <Link
            to="/patients/new"
            className="bg-accent text-white rounded-xl px-4 py-2 font-semibold shadow-sm hover:bg-sky-500 transition"
          >
            + Novo paciente
          </Link>
        </div>

        {/* Content */}
        <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
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
                  <tr className="border-b border-border bg-gray-50/80">
                    <th className="px-6 py-3 text-left text-[11px] font-semibold text-muted uppercase tracking-[0.2em]">Nome</th>
                    <th className="px-6 py-3 text-left text-[11px] font-semibold text-muted uppercase tracking-[0.2em]">Idade</th>
                    <th className="px-6 py-3 text-left text-[11px] font-semibold text-muted uppercase tracking-[0.2em]">Sexo</th>
                    <th className="px-6 py-3 text-left text-[11px] font-semibold text-muted uppercase tracking-[0.2em]">Altura</th>
                    <th className="px-6 py-3 text-left text-[11px] font-semibold text-muted uppercase tracking-[0.2em]">Avaliações</th>
                    <th className="px-6 py-3 text-left text-[11px] font-semibold text-muted uppercase tracking-[0.2em]">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border bg-card">
                  {patients.map((patient) => (
                    <tr key={patient.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{patient.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-muted">
                        {calculateAge(patient.birthDate)} anos
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-muted">
                        {patient.sex === 'M' ? 'Masculino' : patient.sex === 'F' ? 'Feminino' : 'Outro'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-muted">{patient.heightM.toFixed(2)} m</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-muted">{patient.assessments?.length || 0}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold">
                        <Link to={`/patients/${patient.id}`} className="text-accent hover:text-sky-500 transition">
                          Ver detalhes
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
