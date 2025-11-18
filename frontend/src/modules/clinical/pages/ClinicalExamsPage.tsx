import { Layout } from '../../../components/Layout';

export function ClinicalExamsPage() {
  const panels = [
    { title: 'Laboratoriais', description: 'Perfil lipídico, hemograma, marcadores inflamatórios e hormonais.' },
    { title: 'Imagem', description: 'RX, ultrassom, bioimpedância avançada e DEXA.' },
    { title: 'Funcionais', description: 'Teste cardiopulmonar, dinamometria e ergoespirometria.' },
  ];

  return (
    <Layout>
      <div className="rounded-3xl border border-[#e2e0db] bg-white/90 p-6 shadow-sm">
        <p className="text-[11px] uppercase tracking-[0.4em] text-[#7a838b]">Clínico</p>
        <h1 className="mt-2 text-3xl font-semibold text-[#0c2332]">Exames e integrações</h1>
        <p className="mt-2 text-sm text-[#4f5a63]">
          Registre resultados, importe PDFs e sincronize com laboratórios parceiros de forma centralizada.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {panels.map((panel) => (
          <div key={panel.title} className="rounded-2xl border border-[#f0ede8] bg-white/80 p-5 shadow-sm">
            <p className="text-sm font-semibold text-[#0c2332]">{panel.title}</p>
            <p className="mt-2 text-xs text-[#7a838b]">{panel.description}</p>
            <button className="mt-4 text-xs font-semibold text-[#35d0a0]">Adicionar registros</button>
          </div>
        ))}
      </div>
    </Layout>
  );
}
