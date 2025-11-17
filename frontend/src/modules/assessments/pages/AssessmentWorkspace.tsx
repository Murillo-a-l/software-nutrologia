import { Link } from 'react-router-dom';
import { Layout } from '../../../components/Layout';

export function AssessmentWorkspace() {
  return (
    <Layout>
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
        <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Fluxo assistencial</p>
        <h1 className="text-3xl font-semibold text-slate-900">Central de Avaliação Física</h1>
        <p className="text-sm text-slate-500 mt-2 max-w-3xl">
          Gerencie avaliações físicas com o wizard em etapas, acompanhe o preview em tempo real e distribua os módulos de
          antropometria, bioimpedância e dobras cutâneas em um fluxo organizado.
        </p>
        <div className="flex flex-wrap gap-3 mt-6">
          <Link to="/patients" className="border border-slate-200 px-4 py-2 rounded-2xl text-sm font-semibold text-slate-600">
            Selecionar paciente
          </Link>
          <Link
            to="/patients/new"
            className="bg-[#38BDF8] text-white px-4 py-2 rounded-2xl text-sm font-semibold shadow-sm hover:bg-sky-500"
          >
            Cadastrar paciente
          </Link>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { title: 'Antropometria', description: 'Circunferências, perímetros e indicadores estruturados.' },
          { title: 'Bioimpedância', description: 'FFM, SMM, água corporal e ângulo de fase.' },
          { title: 'Dobras cutâneas', description: 'Protocolos Jackson & Pollock com visual auxiliar.' },
        ].map((card) => (
          <div key={card.title} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <p className="text-sm font-semibold text-slate-900">{card.title}</p>
            <p className="text-sm text-slate-500 mt-2">{card.description}</p>
          </div>
        ))}
      </div>
    </Layout>
  );
}
