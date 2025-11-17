import { Layout } from '../../../components/Layout';

export function ReportsPage() {
  return (
    <Layout>
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
        <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Módulo</p>
        <h1 className="text-3xl font-semibold text-slate-900">Relatórios premium</h1>
        <p className="text-sm text-slate-500 mt-2">
          Centralize geração de PDFs com gráficos, barras horizontais e cards clínicos para entregar laudos exclusivos.
        </p>
      </div>
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
        <p className="text-sm font-semibold text-slate-600">Relatórios recentes</p>
        <div className="mt-4 border border-dashed border-slate-200 rounded-2xl p-6 text-slate-500 text-sm">
          Integração com backend pronta para receber o novo PDF premium.
        </div>
      </div>
    </Layout>
  );
}
