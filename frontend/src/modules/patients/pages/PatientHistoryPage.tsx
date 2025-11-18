import { useEffect, useMemo, useState } from 'react';
import { Layout } from '../../../components/Layout';
import { apiClient } from '../../../api/client';
import type { Patient } from '../../../types';
import { calculateAge } from '../../../utils/date';

export function PatientHistoryPage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const response = await apiClient.getPatients();
        setPatients(response);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao buscar histórico');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const timeline = useMemo(() => {
    return patients
      .flatMap((patient) => (patient.assessments ?? []).map((assessment) => ({ ...assessment, patient })))
      .sort((a, b) => parseAssessmentDate(b.dateTime).getTime() - parseAssessmentDate(a.dateTime).getTime())
      .slice(0, 20);
  }, [patients]);

  return (
    <Layout>
      <div className="rounded-3xl border border-[#e2e0db] bg-white/80 p-6 shadow-sm">
        <p className="text-[11px] uppercase tracking-[0.4em] text-[#7a838b]">Histórico clínico</p>
        <h1 className="mt-2 text-3xl font-semibold text-[#0c2332]">Linha do tempo dos pacientes</h1>
        <p className="mt-2 text-sm text-[#4f5a63]">
          Visualize rapidamente as últimas avaliações registradas, ideal para revisões antes da consulta.
        </p>
      </div>

      {error && <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

      <div className="rounded-3xl border border-[#e2e0db] bg-white/90 p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-[#0c2332]">Últimas 20 avaliações</h2>
          <span className="text-xs font-semibold uppercase tracking-[0.3em] text-[#7a838b]">{timeline.length} registros</span>
        </div>
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-[11px] uppercase tracking-[0.35em] text-[#8b939b]">
                <th className="pb-3 pr-4">Paciente</th>
                <th className="pb-3 pr-4">Data</th>
                <th className="pb-3 pr-4">Peso</th>
                <th className="pb-3 pr-4">% Gordura</th>
                <th className="pb-3 pr-4">Notas</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-6 text-center text-[#7a838b]">
                    Carregando histórico...
                  </td>
                </tr>
              ) : timeline.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-6 text-center text-[#7a838b]">
                    Nenhum registro encontrado.
                  </td>
                </tr>
              ) : (
                timeline.map((item) => (
                  <tr key={`${item.id}-${item.patientId}`} className="border-t border-[#f0ede8]">
                    <td className="py-3 pr-4">
                      <div className="font-semibold text-[#0c2332]">{item.patient?.name}</div>
                      <p className="text-xs text-[#7a838b]">
                        {item.patient && `${calculateAge(item.patient.birthDate)} anos · ${item.patient.sex}`}
                      </p>
                    </td>
                    <td className="py-3 pr-4 text-[#0c2332]">{item.dateTime}</td>
                    <td className="py-3 pr-4 text-[#0c2332]">{item.weightKg ? `${item.weightKg.toFixed(1)} kg` : '—'}</td>
                    <td className="py-3 pr-4 text-[#0c2332]">{item.bfPercent ? `${item.bfPercent.toFixed(1)} %` : '—'}</td>
                    <td className="py-3 pr-4 text-[#7a838b]">{item.metrics?.bmiCategory ?? 'Acompanhamento contínuo'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}

function parseAssessmentDate(value: string) {
  const [day, month, year] = value.split('/').map(Number);
  return new Date(year || 0, (month || 1) - 1, day || 1);
}
