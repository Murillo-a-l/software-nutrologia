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

import { Link } from 'react-router-dom';
import { Layout } from '../../../components/Layout';

const steps = [
  { title: 'Dados básicos', detail: 'Data, peso, altura e nível de atividade.' },
  { title: 'Antropometria', detail: 'Cintura, quadril, RCA e RCQ automáticos.' },
  { title: 'Bioimpedância', detail: 'FFM, TBW, ângulo de fase e ECW/TBW.' },
  { title: 'Dobras', detail: 'Protocolos JP7/JP3 com guia visual.' },
  { title: 'Riscos', detail: 'IMC, SMI, FFMI, FMI, BMR e TDEE.' },
  { title: 'Revisão', detail: 'Resumo premium com gráfico atual x ideal.' },
];

export function AssessmentWorkspace() {
  return (
    <Layout>
      <div className="rounded-3xl border border-[#e2e0db] bg-gradient-to-r from-[#0c2332] via-[#12354a] to-[#1f608b] p-6 text-white shadow-lg">
        <p className="text-[11px] uppercase tracking-[0.45em] text-white/70">Fluxo assistencial</p>
        <h1 className="mt-2 text-3xl font-semibold">Central de Avaliação Física</h1>
        <p className="mt-2 max-w-3xl text-sm text-white/80">
          Conduza wizards premium, acompanhe o preview em tempo real e conecte antropometria, bioimpedância e dobras em um único lugar.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link to="/patients" className="rounded-2xl border border-white/30 px-5 py-2.5 text-sm font-semibold text-white">
            Selecionar paciente
          </Link>
          <Link to="/patients/new" className="rounded-2xl bg-white/95 px-5 py-2.5 text-sm font-semibold text-[#0c2332]">
            Cadastrar paciente
          </Link>
          <Link to="/patients/history" className="rounded-2xl border border-white/30 px-5 py-2.5 text-sm font-semibold text-white/80">
            Ver histórico completo
          </Link>
        </div>
      </div>

      <div className="rounded-3xl border border-[#e2e0db] bg-white/90 p-6 shadow-sm">
        <p className="text-sm font-semibold text-[#0c2332] mb-4">Passos do wizard AntropoMax</p>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {steps.map((step, index) => (
            <div key={step.title} className="rounded-2xl border border-[#f0ede8] bg-white/70 p-4">
              <p className="text-xs uppercase tracking-[0.3em] text-[#7a838b]">Passo 0{index + 1}</p>
              <p className="mt-1 text-lg font-semibold text-[#0c2332]">{step.title}</p>
              <p className="text-sm text-[#4f5a63]">{step.detail}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {[
          { title: 'Antropometria', description: 'Circunferências e alertas RCA/RCQ sincronizados.' },
          { title: 'Bioimpedância', description: 'FFM, SMM, TBW, ECW/TBW e ângulo de fase integrados.' },
          { title: 'Dobras cutâneas', description: 'Protocolos JP7 e JP3 com mapa anatômico minimalista.' },
        ].map((card) => (
          <div key={card.title} className="rounded-2xl border border-[#e2e0db] bg-white/90 p-5 shadow-sm">
            <p className="text-sm font-semibold text-[#0c2332]">{card.title}</p>
            <p className="text-xs text-[#7a838b] mt-2">{card.description}</p>
          </div>
        ))}
      </div>
    </Layout>
  );
}
