import { Layout } from '../../../components/Layout';

const sections = ['Usuários', 'Integrações', 'Segurança', 'Marca'];

export function SettingsPage() {
  return (
    <Layout>
      <div className="rounded-3xl border border-[#e2e0db] bg-white/90 p-6 shadow-sm">
        <p className="text-[11px] uppercase tracking-[0.4em] text-[#7a838b]">Painel</p>
        <h1 className="mt-2 text-3xl font-semibold text-[#0c2332]">Configurações gerais</h1>
        <p className="mt-2 text-sm text-[#4f5a63]">
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
<<<<<<< HEAD
  {
    sections.map((label) => (
      <div key={label} className="rounded-2xl border border-[#e2e0db] bg-white/90 p-5 shadow-sm">
        <p className="text-sm font-semibold text-[#0c2332]">{label}</p>
        <p className="text-xs text-[#7a838b] mt-1">Configurações prontas para expansão.</p>
=======
        {["Usuários", "Integrações", "Segurança", "Marca"].map((label) => (
          <div key={label} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <p className="text-sm font-semibold text-slate-900">{label}</p>
            <p className="text-xs text-slate-500 mt-1">Configurações prontas para expansão.</p>
>>>>>>> 81426ffc81f07d7ec03d3ac1dcf64bb81f065e2c
          </div>
        ))}
      </div>
    </Layout >
  );
  }
