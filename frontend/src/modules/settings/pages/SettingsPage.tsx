import { Layout } from '../../../components/Layout';

export function SettingsPage() {
  return (
    <Layout>
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
        <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Painel</p>
        <h1 className="text-3xl font-semibold text-slate-900">Configurações gerais</h1>
        <p className="text-sm text-slate-500 mt-2">
          Estruture integrações, usuários, permissões e aparência do sistema clínico.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {["Usuários", "Integrações", "Segurança", "Marca"].map((label) => (
          <div key={label} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <p className="text-sm font-semibold text-slate-900">{label}</p>
            <p className="text-xs text-slate-500 mt-1">Configurações prontas para expansão.</p>
          </div>
        ))}
      </div>
    </Layout>
  );
}
