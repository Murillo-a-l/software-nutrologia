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
        <section className="pt-12 lg:pt-16 pb-12 lg:pb-16 bg-slate-50 border border-border rounded-[2rem] shadow-sm">
          <div className="max-w-6xl mx-auto px-4 xl:px-0">
            <div className="flex flex-col items-center gap-y-3 text-center md:text-left md:items-start">
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-muted">Fluxo diário</p>
              <h2 className="text-2xl md:text-3xl font-semibold text-primary">Ações rápidas</h2>
              <p className="text-sm text-muted max-w-2xl">
                Estruture o atendimento com cadastros rápidos e acesso imediato ao histórico. Use os atalhos abaixo para navegar pelas
                principais etapas do NutroLab.
              </p>
            </div>

            <div className="mt-10 grid gap-y-6 md:grid-cols-2 md:gap-x-9 md:gap-y-0 md:px-4 lg:px-20 xl:px-32">
              {[{
                title: 'Advanced Analytics',
                eyebrow: 'Cadastro assistido',
                description: 'Inicie um novo prontuário completo com dados clínicos, contatos e histórico alimentar.',
                action: '+ Cadastrar paciente',
                to: '/patients/new',
                icon: (
                  <svg className="h-6 text-slate-400 md:h-7 lg:h-8" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path
                      fillRule="evenodd"
                      d="M14.615 1.595a.75.75 0 0 1 .359.852L12.982 9.75h7.268a.75.75 0 0 1 .548 1.262l-10.5 11.25a.75.75 0 0 1-1.272-.71l1.992-7.302H3.75a.75.75 0 0 1-.548-1.262l10.5-11.25a.75.75 0 0 1 .913-.143Z"
                      clipRule="evenodd"
                    />
                  </svg>
                ),
                variant: 'primary',
              }, {
                title: 'Seamless Integration',
                eyebrow: 'Lista inteligente',
                description: 'Consulte pacientes cadastrados, filtre avaliações recentes e abra prontuários completos em segundos.',
                action: 'Ver lista completa',
                to: '/patients',
                icon: (
                  <svg className="h-6 text-slate-400 md:h-7 lg:h-8" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path
                      fillRule="evenodd"
                      d="M3 6a3 3 0 0 1 3-3h12a3 3 0 0 1 3 3v12a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3V6Zm4.5 7.5a.75.75 0 0 1 .75.75v2.25a.75.75 0 0 1-1.5 0v-2.25a.75.75 0 0 1 .75-.75Zm3.75-1.5a.75.75 0 0 0-1.5 0v4.5a.75.75 0 0 0 1.5 0V12Zm2.25-3a.75.75 0 0 1 .75.75v6.75a.75.75 0 0 1-1.5 0V9.75A.75.75 0 0 1 13.5 9Zm3.75-1.5a.75.75 0 0 0-1.5 0v9a.75.75 0 0 0 1.5 0v-9Z"
                      clipRule="evenodd"
                    />
                  </svg>
                ),
                variant: 'secondary',
              }].map((action) => (
                <article key={action.title} className="flex flex-col items-start gap-y-4 lg:gap-y-6">
                  <figure>{action.icon}</figure>
                  <div className="lg:w-4/5 xl:w-3/4">
                    <p className="text-xs font-medium text-muted uppercase tracking-wide">{action.eyebrow}</p>
                    <div className="text-xl font-medium text-neutral-800 md:text-2xl xl:text-3xl">{action.title}</div>
                    <p className="mt-2 text-sm font-medium text-neutral-500">{action.description}</p>
                  </div>
                  <Link
                    to={action.to}
                    className={
                      action.variant === 'primary'
                        ? 'items-center justify-center whitespace-nowrap text-sm font-semibold transition-all focus:shadow-[0_0px_0px_2px_rgba(15,23,42,0.25),0_2px_10px_0px_rgba(0,0,0,0.05)] shadow-[0_2px_10px_0px_rgba(0,0,0,0.05)] border border-transparent bg-accent text-white hover:bg-sky-500 px-4 py-2 rounded-[0.625rem] flex'
                        : 'items-center justify-center whitespace-nowrap text-sm font-semibold transition-all focus:shadow-[0_0px_0px_2px_rgba(15,23,42,0.25),0_2px_10px_0px_rgba(0,0,0,0.05)] shadow-[0_2px_10px_0px_rgba(0,0,0,0.05)] border border-neutral-100 bg-white text-primary hover:border-neutral-200 hover:bg-neutral-100 px-4 py-2 rounded-[0.625rem] flex'
                    }
                  >
                    {action.action}
                    <svg className="shrink-0 ml-1.5 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path
                        fillRule="evenodd"
                        d="M12.97 3.97a.75.75 0 0 1 1.06 0l7.5 7.5a.75.75 0 0 1 0 1.06l-7.5 7.5a.75.75 0 1 1-1.06-1.06l6.22-6.22H3a.75.75 0 0 1 0-1.5h16.19l-6.22-6.22a.75.75 0 0 1 0-1.06Z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </section>

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
