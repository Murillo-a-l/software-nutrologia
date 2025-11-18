import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function Login() {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-[#faf8f5]">
      <div className="flex min-h-screen flex-col lg:flex-row">
        <div className="relative hidden flex-1 flex-col justify-between overflow-hidden rounded-br-[80px] bg-gradient-to-b from-[#0c2332] via-[#12354a] to-[#1d5472] p-10 text-white lg:flex">
          <div>
            <p className="text-[11px] uppercase tracking-[0.4em] text-white/70">Bem-vindo ao</p>
            <h1 className="mt-4 text-5xl font-semibold tracking-tight">AntropoMax</h1>
            <p className="mt-4 max-w-md text-sm text-white/80">
              Plataforma clínica premium para avaliações físicas, bioimpedância avançada e prescrição nutricional integrada.
            </p>
          </div>
          <div className="space-y-2 text-sm text-white/70">
            <p>© {new Date().getFullYear()} AntropoMax Labs</p>
            <p>Healthtech para profissionais de elite</p>
          </div>
          <div className="absolute inset-y-0 right-0 w-1/2 translate-x-1/4 bg-gradient-to-l from-white/10 to-transparent" />
        </div>

        <div className="flex flex-1 items-center justify-center px-6 py-12">
          <div className="w-full max-w-md rounded-[32px] border border-[#e2e0db] bg-white/95 p-10 shadow-2xl shadow-[#0c2332]/15">
            <div className="mb-8 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#35d0a0]/20 text-[#0c2332] font-semibold">
                AX
              </div>
              <p className="text-[11px] uppercase tracking-[0.45em] text-[#7a838b]">Console clínico</p>
              <h2 className="mt-2 text-3xl font-semibold text-[#0c2332]">Entrar no AntropoMax</h2>
              <p className="text-sm text-[#5c6772]">Use suas credenciais profissionais para continuar.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="text-xs font-semibold uppercase tracking-[0.3em] text-[#7a838b]">
                  E-mail ou login
                </label>
                <input
                  type="text"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-2 w-full rounded-2xl border border-[#dcd3ca] bg-white px-4 py-3 text-sm text-[#0c2332] outline-none transition focus:border-[#35d0a0] focus:ring-2 focus:ring-[#35d0a0]/30"
                  placeholder="dr@antropomax.com"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-2xl bg-[#35d0a0] px-4 py-3 text-sm font-semibold text-[#0c2332] shadow-lg shadow-[#35d0a0]/40 transition hover:bg-[#2eb48a]"
              >
                Acessar painel
              </button>
            </form>

            <p className="mt-8 text-center text-xs uppercase tracking-[0.3em] text-[#7a838b]">
              Plataforma exclusiva para profissionais da saúde
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
