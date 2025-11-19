import { Link } from 'react-router-dom';
import { Layout } from '../../../components/Layout';

const sections = [
  { label: 'Usuários', description: 'Gerenciar usuários e permissões', link: null },
  { label: 'Integrações', description: 'Conectar sistemas externos', link: null },
  { label: 'Segurança', description: 'Configurações de segurança', link: null },
  { label: 'Marca', description: 'Personalizar aparência', link: null },
];

export function SettingsPage() {
  return (
    <Layout>
      <div className="rounded-3xl border border-[#e2e0db] bg-white/90 p-6 shadow-sm">
        <p className="text-[11px] uppercase tracking-[0.4em] text-[#7a838b]">Painel</p>
        <h1 className="mt-2 text-3xl font-semibold text-[#0c2332]">Configurações gerais</h1>
        <p className="mt-2 text-sm text-[#4f5a63]">
          Estruture integrações, usuários, permissões e aparência do sistema clínico.
        </p>
      </div>

      {/* Personalização de Formulários */}
      <div className="rounded-2xl border border-[#e2e0db] bg-white/90 p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-[#0c2332]">Personalização de Formulários</h2>
        <p className="mt-1 text-xs text-[#7a838b]">Configure os campos e opções dos formulários clínicos.</p>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
          <Link
            to="/settings/form-builder"
            className="flex items-center justify-between rounded-xl border border-[#e2e0db] bg-white p-4 hover:border-[#35d0a0] hover:bg-[#f8faf9] transition"
          >
            <div>
              <p className="text-sm font-semibold text-[#0c2332]">Editor de Formulários</p>
              <p className="text-xs text-[#7a838b] mt-0.5">Crie e personalize templates de anamnese</p>
            </div>
            <svg className="h-5 w-5 text-[#7a838b]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
          <Link
            to="/settings/anamnesis"
            className="flex items-center justify-between rounded-xl border border-[#e2e0db] bg-white p-4 hover:border-[#35d0a0] hover:bg-[#f8faf9] transition"
          >
            <div>
              <p className="text-sm font-semibold text-[#0c2332]">Configuração Rápida</p>
              <p className="text-xs text-[#7a838b] mt-0.5">Comorbidades, antecedentes, objetivos</p>
            </div>
            <svg className="h-5 w-5 text-[#7a838b]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>

      {/* Outras configurações */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sections.map((section) => (
          <div key={section.label} className="rounded-2xl border border-[#e2e0db] bg-white/90 p-5 shadow-sm">
            <p className="text-sm font-semibold text-[#0c2332]">{section.label}</p>
            <p className="text-xs text-[#7a838b] mt-1">{section.description}</p>
          </div>
        ))}
      </div>
    </Layout>
  );
}
