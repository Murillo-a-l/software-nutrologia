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
        <div className="rounded-[32px] bg-gradient-to-r from-[#0c2332] via-[#12354a] to-[#1f608b] p-6 text-white shadow-xl shadow-[#0c2332]/30 flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-[11px] uppercase tracking-[0.45em] text-white/70">Gestão clínica</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight">Pacientes</h1>
            <p className="text-sm text-white/80 max-w-2xl">Monitoramento completo da carteira com acesso rápido aos históricos, avaliações e relatórios.</p>
          </div>
          <Link
            to="/patients/new"
            className="rounded-2xl bg-[#35d0a0] px-5 py-3 text-sm font-semibold text-[#0c2332] shadow-lg shadow-black/20 transition hover:bg-[#2eb48a]"
          >
            + Novo paciente
          </Link>
        </div>

        <div className="rounded-[28px] border border-[#e2e0db] bg-white/95 shadow-2xl shadow-[#0c2332]/5 overflow-hidden">
          {loading && (
            <div className="text-center py-12">
              <p className="text-sm text-[#5c6772]">Carregando pacientes...</p>
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
            <div className="text-center py-16 px-6 bg-gradient-to-br from-[#f7f2ed] to-white">
              <svg className="mx-auto h-14 w-14 text-[#d3c9c0]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <p className="text-sm text-[#5c6772] mt-4 mb-6">Nenhum paciente cadastrado ainda</p>
              <Link
                to="/patients/new"
                className="inline-flex items-center justify-center rounded-full bg-[#35d0a0] px-5 py-2 text-sm font-semibold text-[#0c2332] shadow-md"
              >
                Cadastrar Primeiro Paciente
              </Link>
            </div>
          )}

          {!loading && !error && patients.length > 0 && (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b border-[#ece7e1] bg-[#f4f0eb]/60">
                    <th className="px-6 py-3 text-left text-[11px] font-semibold text-[#7a838b] uppercase tracking-[0.3em]">Nome</th>
                    <th className="px-6 py-3 text-left text-[11px] font-semibold text-[#7a838b] uppercase tracking-[0.3em]">Idade</th>
                    <th className="px-6 py-3 text-left text-[11px] font-semibold text-[#7a838b] uppercase tracking-[0.3em]">Sexo</th>
                    <th className="px-6 py-3 text-left text-[11px] font-semibold text-[#7a838b] uppercase tracking-[0.3em]">Altura</th>
                    <th className="px-6 py-3 text-left text-[11px] font-semibold text-[#7a838b] uppercase tracking-[0.3em]">Avaliações</th>
                    <th className="px-6 py-3 text-left text-[11px] font-semibold text-[#7a838b] uppercase tracking-[0.3em]">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f0ebe4] bg-transparent">
                  {patients.map((patient) => (
                    <tr key={patient.id} className="transition-colors hover:bg-[#f7f2ed]/80">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-[#0c2332]">{patient.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#5c6772]">
                        {calculateAge(patient.birthDate)} anos
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#5c6772]">
                        {patient.sex === 'M' ? 'Masculino' : patient.sex === 'F' ? 'Feminino' : 'Outro'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#5c6772]">{patient.heightM.toFixed(2)} m</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#5c6772]">{patient.assessments?.length || 0}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold">
                        <Link
                          to={`/patients/${patient.id}`}
                          className="inline-flex items-center gap-1 text-[#0c2332] hover:text-[#35d0a0] transition"
                        >
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
