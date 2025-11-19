import { Layout } from '../../../components/Layout';

const riskBadges = [
  { label: 'Cardiometabólico', value: 'Moderado', color: 'bg-[#fb923c]/20 text-[#b45309]' },
  { label: 'RED-S', value: 'Baixo', color: 'bg-[#35d0a0]/20 text-[#047857]' },
  { label: 'Metabólico', value: 'Elevado', color: 'bg-[#f87171]/15 text-[#b91c1c]' },
];

export function DiagnosticsPage() {
  return (
    <Layout>
      <div className="rounded-3xl border border-[#e2e0db] bg-white/90 p-6 shadow-sm">
        <p className="text-[11px] uppercase tracking-[0.4em] text-[#7a838b]">Clínico</p>
        <h1 className="mt-2 text-3xl font-semibold text-[#0c2332]">Diagnósticos automatizados</h1>
        <p className="mt-2 text-sm text-[#4f5a63]">Combine antropometria, bioimpedância e exames para gerar insights clínicos.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {riskBadges.map((badge) => (
          <div key={badge.label} className="rounded-2xl border border-[#f0ede8] bg-white/80 p-5 shadow-sm">
            <p className="text-xs uppercase tracking-[0.3em] text-[#7a838b]">{badge.label}</p>
            <p className="mt-2 text-2xl font-semibold text-[#0c2332]">{badge.value}</p>
            <span className={`mt-3 inline-flex rounded-full px-3 py-1 text-xs font-semibold ${badge.color}`}>Monitorado</span>
          </div>
        ))}
      </div>
    </Layout>
  );
}
