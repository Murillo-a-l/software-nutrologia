import { Layout } from '../../../components/Layout';

export function PersonalCenterPage() {
  return (
    <Layout>
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
        <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Painel</p>
        <h1 className="text-3xl font-semibold text-slate-900">Centro pessoal</h1>
        <p className="text-sm text-slate-500 mt-2">
          Configure notificações, assinatura, identidade visual e preferências do profissional.
        </p>
      </div>
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
        <p className="text-sm font-semibold text-slate-600">Configurações rápidas</p>
        <ul className="mt-4 space-y-3 text-sm text-slate-500">
          <li>Atualize sua assinatura digital</li>
          <li>Personalize a identidade visual do PDF premium</li>
          <li>Sincronize notificações por e-mail</li>
        </ul>
      </div>
    </Layout>
  );
}

import { Layout } from '../../../components/Layout';

export function PersonalCenterPage() {
  const settings = [
    'Atualize sua assinatura digital',
    'Personalize a identidade visual do PDF premium',
    'Sincronize notificações por e-mail',
  ];

  return (
    <Layout>
      <div className="rounded-3xl border border-[#e2e0db] bg-white/90 p-6 shadow-sm">
        <p className="text-[11px] uppercase tracking-[0.4em] text-[#7a838b]">Painel</p>
        <h1 className="mt-2 text-3xl font-semibold text-[#0c2332]">Centro pessoal</h1>
        <p className="mt-2 text-sm text-[#4f5a63]">
          Configure notificações, assinatura, identidade visual e preferências do profissional.
        </p>
      </div>
      <div className="rounded-3xl border border-[#e2e0db] bg-white/90 p-6 shadow-sm">
        <p className="text-sm font-semibold text-[#0c2332]">Configurações rápidas</p>
        <ul className="mt-4 space-y-3 text-sm text-[#4f5a63]">
          {settings.map((item) => (
            <li key={item} className="rounded-2xl border border-[#f0ede8] bg-white/70 px-4 py-3">
              {item}
            </li>
          ))}
        </ul>
      </div>
    </Layout>
  );
}
