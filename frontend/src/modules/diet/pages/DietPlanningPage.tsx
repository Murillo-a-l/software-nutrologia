import { Layout } from '../../../components/Layout';

export function DietPlanningPage() {
  return (
    <Layout>
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
        <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Módulo</p>
        <h1 className="text-3xl font-semibold text-slate-900">Planejamento de dietas</h1>
        <p className="text-sm text-slate-500 mt-2">
          Estruture necessidades energéticas, macros ideais e distribuição por refeição pronta para futuras automações.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {["Necessidades energéticas", "Macronutrientes", "Refeições"].map((label) => (
          <div key={label} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <p className="text-sm font-semibold text-slate-900">{label}</p>
            <p className="text-xs text-slate-500 mt-1">Interface pronta para cálculos nutricionais.</p>
          </div>
        ))}
      </div>
    </Layout>
  );
}
