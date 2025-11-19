import { Layout } from '../../../components/Layout';

export function PrescriptionsPage() {
  return (
    <Layout>
      <div className="rounded-3xl border border-[#e2e0db] bg-white/90 p-6 shadow-sm">
        <p className="text-[11px] uppercase tracking-[0.4em] text-[#7a838b]">Clínico</p>
        <h1 className="mt-2 text-3xl font-semibold text-[#0c2332]">Prescrições inteligentes</h1>
        <p className="mt-2 text-sm text-[#4f5a63]">
          Padronize protocolos, suplementos e recomendações farmacológicas com assinatura digital.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {["Suplementação", "Farmacológicos", "Condutas", "Observações"].map((section) => (
          <div key={section} className="rounded-2xl border border-[#f0ede8] bg-white/80 p-5 shadow-sm">
            <p className="text-sm font-semibold text-[#0c2332]">{section}</p>
            <p className="mt-2 text-xs text-[#7a838b]">Templates prontos para prescrição personalizada.</p>
          </div>
        ))}
      </div>
    </Layout>
  );
}
