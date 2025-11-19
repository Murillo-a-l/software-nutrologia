import { Layout } from '../../../components/Layout';

const foods = [
  { name: 'Salmão selvagem', kcal: 208, protein: 20, fat: 13 },
  { name: 'Quinoa tricolor', kcal: 120, protein: 4.4, fat: 1.9 },
  { name: 'Abacate hass', kcal: 160, protein: 2, fat: 15 },
];

export function FoodDatabasePage() {
  return (
    <Layout>
      <div className="rounded-3xl border border-[#e2e0db] bg-white/90 p-6 shadow-sm">
        <p className="text-[11px] uppercase tracking-[0.4em] text-[#7a838b]">Nutrição</p>
        <h1 className="mt-2 text-3xl font-semibold text-[#0c2332]">Banco de alimentos clínico</h1>
        <p className="mt-2 text-sm text-[#4f5a63]">Integração com tabelas TACO/USDA e tags funcionais.</p>
      </div>
      <div className="rounded-3xl border border-[#f0ede8] bg-white/80 p-5 shadow-sm">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left text-[11px] uppercase tracking-[0.35em] text-[#7a838b]">
              <th className="pb-3 pr-4">Alimento</th>
              <th className="pb-3 pr-4">kcal</th>
              <th className="pb-3 pr-4">Proteína</th>
              <th className="pb-3 pr-4">Gorduras</th>
            </tr>
          </thead>
          <tbody>
            {foods.map((food) => (
              <tr key={food.name} className="border-t border-[#f0ede8]">
                <td className="py-3 pr-4 font-semibold text-[#0c2332]">{food.name}</td>
                <td className="py-3 pr-4 text-[#0c2332]">{food.kcal}</td>
                <td className="py-3 pr-4 text-[#0c2332]">{food.protein} g</td>
                <td className="py-3 pr-4 text-[#0c2332]">{food.fat} g</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}
