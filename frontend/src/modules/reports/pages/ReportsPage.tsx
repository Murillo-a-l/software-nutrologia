import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Layout } from '../../../components/Layout';
import { apiClient } from '../../../api/client';
import type { Patient } from '../../../types';

export function ReportsPage() {
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
        setError(err instanceof Error ? err.message : 'Erro ao carregar relatórios');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const assessments = useMemo(
    () =>
      patients
        .flatMap((patient) => (patient.assessments ?? []).map((assessment) => ({ ...assessment, patient })))
        .sort((a, b) => parseAssessmentDate(b.dateTime).getTime() - parseAssessmentDate(a.dateTime).getTime()),
    [patients]
  );

  return (
    <Layout>
      <div className="rounded-3xl border border-[#e2e0db] bg-white/90 p-6 shadow-sm">
        <p className="text-[11px] uppercase tracking-[0.4em] text-[#7a838b]">Módulo</p>
        <h1 className="mt-2 text-3xl font-semibold text-[#0c2332]">Relatórios premium</h1>
        <p className="mt-2 text-sm text-[#4f5a63]">
          PDFs com gráficos, barras horizontais, cards clínicos e identidade AntropoMax para entregar laudos exclusivos.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link to="/assessments/workspace" className="rounded-2xl border border-[#e2e0db] px-5 py-2.5 text-sm font-semibold text-[#4f5a63]">
            Abrir wizard
          </Link>
          <Link to="/reports" className="rounded-2xl bg-[#35d0a0] px-5 py-2.5 text-sm font-semibold text-white shadow-sm">
            Gerar relatório premium
          </Link>
        </div>
      </div>

      {error && <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

      <div className="rounded-3xl border border-[#e2e0db] bg-white/90 p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-[#0c2332]">Relatórios recentes</p>
          <span className="text-xs text-[#7a838b]">{assessments.length} avaliações</span>
        </div>
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-[11px] uppercase tracking-[0.3em] text-[#7a838b]">
                <th className="pb-3 pr-4">Paciente</th>
                <th className="pb-3 pr-4">Data</th>
                <th className="pb-3 pr-4">Peso</th>
                <th className="pb-3 pr-4">% Gordura</th>
                <th className="pb-3 pr-4">Ações</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-6 text-center text-[#7a838b]">
                    Carregando relatórios...
                  </td>
                </tr>
              ) : assessments.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-6 text-center text-[#7a838b]">
                    Nenhuma avaliação encontrada.
                  </td>
                </tr>
              ) : (
                assessments.slice(0, 8).map((assessment) => (
                  <tr key={assessment.id} className="border-t border-[#f0ede8]">
                    <td className="py-3 pr-4">
                      <p className="font-semibold text-[#0c2332]">{assessment.patient?.name ?? 'Paciente'}</p>
                      <p className="text-xs text-[#7a838b]">{assessment.patient?.sex}</p>
                    </td>
                    <td className="py-3 pr-4 text-[#0c2332]">{assessment.dateTime}</td>
                    <td className="py-3 pr-4 text-[#0c2332]">{assessment.weightKg ? `${assessment.weightKg.toFixed(1)} kg` : '—'}</td>
                    <td className="py-3 pr-4 text-[#0c2332]">{assessment.bfPercent ? `${assessment.bfPercent.toFixed(1)}%` : '—'}</td>
                    <td className="py-3 pr-4">
                      <Link to={`/assessments/${assessment.id}`} className="text-xs font-semibold text-[#35d0a0]">
                        Abrir laudo
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          import {Layout} from '../../../components/Layout';

          export function ReportsPage() {
  return (
          <Layout>
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Módulo</p>
              <h1 className="text-3xl font-semibold text-slate-900">Relatórios premium</h1>
              <p className="text-sm text-slate-500 mt-2">
                Centralize geração de PDFs com gráficos, barras horizontais e cards clínicos para entregar laudos exclusivos.
              </p>
            </div>
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
              <p className="text-sm font-semibold text-slate-600">Relatórios recentes</p>
              <div className="mt-4 border border-dashed border-slate-200 rounded-2xl p-6 text-slate-500 text-sm">
                Integração com backend pronta para receber o novo PDF premium.
              </div>
            </div>
          </Layout>
  );
}
<<<<<<< HEAD

  function parseAssessmentDate(value: string) {
    const [day, month, year] = (value ?? '01/01/1970').split('/').map(Number);
    return new Date(year || 0, (month || 1) - 1, day || 1);
  }
=======
>>>>>>> 81426ffc81f07d7ec03d3ac1dcf64bb81f065e2c
