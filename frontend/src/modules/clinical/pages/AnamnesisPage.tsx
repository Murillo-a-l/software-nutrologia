import { Layout } from '../../../components/Layout';

export function AnamnesisPage() {
  return (
    <Layout>
      <div className="rounded-3xl border border-[#e2e0db] bg-white/90 p-6 shadow-sm">
        <p className="text-[11px] uppercase tracking-[0.4em] text-[#7a838b]">Clínico</p>
        <h1 className="mt-2 text-3xl font-semibold text-[#0c2332]">Anamnese inteligente</h1>
        <p className="mt-2 text-sm text-[#4f5a63]">Colete antecedentes clínicos, estilo de vida e sintomas com cartões modulares.</p>
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {[
          'Motivo da consulta',
          'Histórico familiar',
          'Uso de medicamentos',
          'Hábitos alimentares',
          'Rotina de sono',
          'Observações gerais',
        ].map((section) => (
          <div key={section} className="rounded-2xl border border-[#f0ede8] bg-white/80 p-5 shadow-sm">
            <p className="text-sm font-semibold text-[#0c2332]">{section}</p>
            <p className="mt-2 text-xs text-[#7a838b]">Área preparada para formulários shadcn/ui e automações de IA.</p>
          </div>
        ))}
      </div>
    </Layout>
  );
}
