import { Layout } from '../../../components/Layout';

export function CaloricPlannerPage() {
  const steps = ['Objetivo energético', 'Macronutrientes', 'Distribuição diária'];

  return (
    <Layout>
      <div className="rounded-3xl border border-[#e2e0db] bg-white/90 p-6 shadow-sm">
        <p className="text-[11px] uppercase tracking-[0.4em] text-[#7a838b]">Nutrição</p>
        <h1 className="mt-2 text-3xl font-semibold text-[#0c2332]">Planejamento calórico</h1>
        <p className="mt-2 text-sm text-[#4f5a63]">Simule TDEE, déficit ou superávit com ajustes responsivos.</p>
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {steps.map((step, index) => (
          <div key={step} className="rounded-2xl border border-[#f0ede8] bg-white/80 p-5 shadow-sm">
            <p className="text-xs uppercase tracking-[0.3em] text-[#7a838b]">Etapa 0{index + 1}</p>
            <p className="mt-2 text-lg font-semibold text-[#0c2332]">{step}</p>
            <p className="mt-2 text-xs text-[#7a838b]">Campos prontos para fórmulas automáticas.</p>
          </div>
        ))}
      </div>
    </Layout>
  );
}
