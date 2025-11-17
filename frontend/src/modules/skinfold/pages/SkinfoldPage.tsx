import { Layout } from '../../../components/Layout';

export function SkinfoldPage() {
  const sites = [
    { name: 'Tríceps', tip: 'Dobra vertical no meio do braço posterior.' },
    { name: 'Subescapular', tip: 'Dobra oblíqua abaixo da escápula.' },
    { name: 'Supra-ilíaca', tip: 'Dobra diagonal acima da crista ilíaca.' },
    { name: 'Abdominal', tip: 'Dobra vertical lateral ao umbigo.' },
    { name: 'Coxa', tip: 'Dobra vertical na parte anterior da coxa.' },
    { name: 'Peitoral', tip: 'Dobra diagonal entre axila e mamilo.' },
    { name: 'Axilar média', tip: 'Dobra vertical na linha média axilar.' },
  ];

  return (
    <Layout>
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
        <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Módulo</p>
        <h1 className="text-3xl font-semibold text-slate-900">Dobras cutâneas</h1>
        <p className="text-sm text-slate-500 mt-2">
          Configure protocolos JP7 ou JP3, visualize o corpo alvo e insira valores com feedback imediato do % de gordura.
        </p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm lg:col-span-2">
          <p className="text-sm font-semibold text-slate-600 mb-3">Locais de dobras</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {sites.map((site) => (
              <div key={site.name} className="border border-slate-200 rounded-2xl p-4">
                <p className="text-sm font-semibold text-slate-900">{site.name}</p>
                <p className="text-xs text-slate-500 mt-1">{site.tip}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
          <p className="text-sm font-semibold text-slate-600 mb-4">Guia visual</p>
          <div className="aspect-[3/5] bg-gradient-to-b from-slate-100 to-slate-200 rounded-2xl flex items-center justify-center">
            <svg viewBox="0 0 120 200" className="h-full w-full max-h-80">
              <path d="M60 10c-12 0-22 10-22 22v30c0 16-10 28-10 46 0 34 14 70 32 70s32-36 32-70c0-18-10-30-10-46V32c0-12-10-22-22-22z" fill="#CBD5F5" />
              <circle cx="60" cy="40" r="4" fill="#F97316" />
              <circle cx="40" cy="80" r="4" fill="#38BDF8" />
              <circle cx="80" cy="80" r="4" fill="#38BDF8" />
              <circle cx="60" cy="110" r="4" fill="#22C55E" />
            </svg>
          </div>
        </div>
      </div>
    </Layout>
  );
}
