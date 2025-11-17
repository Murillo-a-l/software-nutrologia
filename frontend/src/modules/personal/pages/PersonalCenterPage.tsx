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
