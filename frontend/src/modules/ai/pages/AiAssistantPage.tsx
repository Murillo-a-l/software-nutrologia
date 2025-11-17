import { Layout } from '../../../components/Layout';

export function AiAssistantPage() {
  return (
    <Layout>
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
        <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Módulo</p>
        <h1 className="text-3xl font-semibold text-slate-900">IA Assistente</h1>
        <p className="text-sm text-slate-500 mt-2">
          Base preparada para recomendações inteligentes de condutas, geração de planos e insights clínicos.
        </p>
      </div>
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
        <p className="text-sm font-semibold text-slate-600">Em breve</p>
        <p className="text-sm text-slate-500 mt-2">
          Integração com modelos de linguagem para apoiar decisões clínicas e geração de relatórios.
        </p>
      </div>
    </Layout>
  );
}
