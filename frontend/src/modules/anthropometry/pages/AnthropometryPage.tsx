import { Layout } from '../../../components/Layout';

export function AnthropometryPage() {
  return (
    <Layout>
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
        <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Módulo</p>
        <h1 className="text-3xl font-semibold text-slate-900">Antropometria avançada</h1>
        <p className="text-sm text-slate-500 mt-2">
          Registre circunferências com precisão clínica, visualizando alertas de risco cardiometabólico e tendências.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {["Cintura", "Quadril", "Pescoço", "Tórax"].map((label) => (
          <div key={label} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <p className="text-sm font-semibold text-slate-900">{label}</p>
            <p className="text-xs text-slate-500 mt-1">Monitoramento contínuo de evolução.</p>
          </div>
        ))}
      </div>
    </Layout>
  );
}
