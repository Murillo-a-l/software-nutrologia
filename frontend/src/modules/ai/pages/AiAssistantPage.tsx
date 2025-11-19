import { Layout } from '../../../components/Layout';

const prompts = [
  { role: 'Profissional', text: 'Gerar resumo metabólico para paciente com RED-S moderado.' },
  { role: 'AntropoMax AI', text: 'Sugiro déficit leve (15%), reforço proteico 1.8 g/kg e monitorar RED-S em 30 dias.' },
  { role: 'Profissional', text: 'Criar checklist pré-consulta focado em bioimpedância.' },
];

export function AiAssistantPage() {
  return (
    <Layout>
      <div className="rounded-3xl border border-[#e2e0db] bg-gradient-to-r from-[#0c2332] to-[#1f608b] p-6 text-white shadow-lg">
        <p className="text-[11px] uppercase tracking-[0.4em] text-white/70">Módulo</p>
        <h1 className="mt-2 text-3xl font-semibold">IA Assistente</h1>
        <p className="mt-2 text-sm text-white/80">Recomendações inteligentes, geração de planos e insights clínicos contextuais.</p>
      </div>

      <div className="rounded-3xl border border-[#e2e0db] bg-white/90 p-6 shadow-sm">
        <p className="text-sm font-semibold text-[#0c2332]">Pré-visualização de prompts</p>
        <div className="mt-4 space-y-4">
          {prompts.map((prompt) => (
            <div key={prompt.text} className="rounded-2xl border border-[#f0ede8] bg-white/70 p-4">
              <p className="text-xs uppercase tracking-[0.3em] text-[#7a838b]">{prompt.role}</p>
              <p className="mt-1 text-sm text-[#0c2332]">{prompt.text}</p>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
