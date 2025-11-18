import { Layout } from '../../../components/Layout';

const meals = ['Pré-treino', 'Pós-treino', 'Almoço clínico', 'Ceia funcional'];

export function DietDesignerPage() {
  return (
    <Layout>
      <div className="rounded-3xl border border-[#e2e0db] bg-white/90 p-6 shadow-sm">
        <p className="text-[11px] uppercase tracking-[0.4em] text-[#7a838b]">Nutrição</p>
        <h1 className="mt-2 text-3xl font-semibold text-[#0c2332]">Dietas personalizadas</h1>
        <p className="mt-2 text-sm text-[#4f5a63]">Monte planos completos com arrastar e soltar de alimentos clínicos.</p>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {meals.map((meal) => (
          <div key={meal} className="rounded-2xl border border-[#f0ede8] bg-white/80 p-5 shadow-sm">
            <p className="text-sm font-semibold text-[#0c2332]">{meal}</p>
            <p className="mt-2 text-xs text-[#7a838b]">Calorias alvo, macros e sugestões inteligentes.</p>
            <button className="mt-4 text-xs font-semibold text-[#35d0a0]">Adicionar alimentos</button>
          </div>
        ))}
      </div>
    </Layout>
  );
}
