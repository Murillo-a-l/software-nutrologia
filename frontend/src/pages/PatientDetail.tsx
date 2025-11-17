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

  const latestAssessment = patient.assessments?.[0];

  return (
    <Layout>
      <div className="space-y-8">
        {/* Header com Info do Paciente */}
        <div className="bg-card border border-border rounded-2xl shadow-sm p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted">Paciente</p>
              <h1 className="text-3xl font-semibold text-primary mt-2">{patient.name}</h1>
              <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted">
                <span>{calculateAge(patient.birthDate)} anos</span>
                <span className="text-border">•</span>
                <span>{patient.sex === 'M' ? 'Masculino' : patient.sex === 'F' ? 'Feminino' : 'Outro'}</span>
                <span className="text-border">•</span>
                <span>{patient.heightM.toFixed(2)} m</span>
                {latestAssessment?.metrics?.bmi && (
                  <>
                    <span className="text-border">•</span>
                    <span>IMC {latestAssessment.metrics.bmi.toFixed(1)}</span>
                  </>
                )}
              </div>
            </div>
            <Link
              to={`/patients/${patient.id}/assessments/new`}
              className="bg-accent text-white rounded-xl px-4 py-2 font-semibold shadow-sm hover:bg-sky-500 transition"
            >
              + Nova avaliação
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Informações do paciente */}
          <div className="bg-card border border-border rounded-2xl shadow-sm p-6 space-y-4 lg:col-span-1">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted">Informações</p>
              <h2 className="text-xl font-semibold text-gray-900">Dados do paciente</h2>
            </div>
            <dl className="space-y-3 text-sm">
              <div className="flex justify-between border-b border-border/60 pb-2">
                <dt className="text-muted">Data de nascimento</dt>
                <dd className="font-medium text-gray-900">{patient.birthDate}</dd>
              </div>
              <div className="flex justify-between border-b border-border/60 pb-2">
                <dt className="text-muted">Altura</dt>
                <dd className="font-medium text-gray-900">{patient.heightM.toFixed(2)} m</dd>
              </div>
              <div className="flex justify-between border-b border-border/60 pb-2">
                <dt className="text-muted">Sexo</dt>
                <dd className="font-medium text-gray-900">
                  {patient.sex === 'M' ? 'Masculino' : patient.sex === 'F' ? 'Feminino' : 'Outro'}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted">Último peso registrado</dt>
                <dd className="font-medium text-gray-900">{latestAssessment?.weightKg?.toFixed(1) ?? '—'} kg</dd>
              </div>
            </dl>
          </div>

          {/* Card de Avaliações */}
          <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden lg:col-span-2">
            <div className="flex flex-wrap items-center justify-between gap-3 p-6 border-b border-border">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-muted">Histórico</p>
                <h2 className="text-xl font-semibold text-gray-900">Avaliações</h2>
              </div>
              <Link
                to={`/patients/${patient.id}/assessments/new`}
                className="bg-white text-primary border border-border rounded-xl px-4 py-2 text-sm font-semibold hover:bg-gray-50"
              >
                Registrar nova avaliação
              </Link>
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
                    <tr className="border-b border-border bg-gray-50/70">
                      <th className="px-6 py-3 text-left text-[11px] font-semibold text-muted uppercase tracking-[0.2em]">Data</th>
                      <th className="px-6 py-3 text-left text-[11px] font-semibold text-muted uppercase tracking-[0.2em]">Peso</th>
                      <th className="px-6 py-3 text-left text-[11px] font-semibold text-muted uppercase tracking-[0.2em]">% Gordura</th>
                      <th className="px-6 py-3 text-left text-[11px] font-semibold text-muted uppercase tracking-[0.2em]">IMC</th>
                      <th className="px-6 py-3 text-left text-[11px] font-semibold text-muted uppercase tracking-[0.2em]">Body Comp Score</th>
                      <th className="px-6 py-3 text-left text-[11px] font-semibold text-muted uppercase tracking-[0.2em]">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border bg-card">
                    {patient.assessments.map((assessment) => (
                      <tr key={assessment.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{assessment.dateTime}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-muted">{assessment.weightKg?.toFixed(1) || '-'}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-muted">{assessment.bfPercent?.toFixed(1) || '-'}%</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-muted">{assessment.metrics?.bmi?.toFixed(1) || '-'}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-muted">{assessment.metrics?.bodyCompScore ?? '-'}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold">
                          <Link to={`/assessments/${assessment.id}`} className="text-accent hover:text-sky-500 transition">
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
      </div>
    </Layout>
  );
}
