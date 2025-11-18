import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { apiClient } from '../api/client';
import { isValidBrazilianDate } from '../utils/date';

export function PatientForm() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    sex: 'M' as 'M' | 'F' | 'OUTRO',
    birthDate: '',
    heightM: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validações
    if (!formData.name.trim()) {
      setError('Nome é obrigatório');
      return;
    }

    if (!formData.birthDate.trim()) {
      setError('Data de nascimento é obrigatória');
      return;
    }

    if (!isValidBrazilianDate(formData.birthDate)) {
      setError('Data de nascimento inválida. Use o formato DD/MM/AAAA');
      return;
    }

    const heightM = parseFloat(formData.heightM);
    if (isNaN(heightM) || heightM <= 0 || heightM > 3) {
      setError('Altura inválida. Digite um valor entre 0 e 3 metros');
      return;
    }

    try {
      setLoading(true);
      const patient = await apiClient.createPatient({
        name: formData.name.trim(),
        sex: formData.sex,
        birthDate: formData.birthDate,
        heightM,
      });

      // Redireciona para a página do paciente
      navigate(`/patients/${patient.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar paciente');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="rounded-[36px] bg-gradient-to-r from-[#0c2332] via-[#12354a] to-[#1f608b] px-8 py-10 text-white shadow-2xl shadow-[#0c2332]/30">
          <p className="text-[11px] uppercase tracking-[0.4em] text-white/70">Novo paciente</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight">Ficha clínica AntropoMax</h1>
          <p className="mt-2 max-w-2xl text-sm text-white/80">
            Cadastre os dados essenciais para iniciar a jornada de avaliação física, bioimpedância e prescrição personalizada.
          </p>
        </div>

        <div className="rounded-[30px] border border-[#e2e0db] bg-white/95 p-8 shadow-2xl shadow-[#0c2332]/10">
          {error && (
            <div className="mb-6 rounded-2xl border border-red-200 bg-red-50/80 px-4 py-3 text-sm font-semibold text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="md:col-span-2">
                <label htmlFor="name" className="text-xs font-semibold uppercase tracking-[0.3em] text-[#7a838b]">
                  Nome completo*
                </label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="mt-2 w-full rounded-2xl border border-[#dcd3ca] bg-[#faf8f5] px-4 py-3 text-sm text-[#0c2332] outline-none transition focus:border-[#35d0a0] focus:ring-2 focus:ring-[#35d0a0]/30"
                  placeholder="Ex: Luna Monteiro"
                  required
                />
              </div>

              <div>
                <label htmlFor="sex" className="text-xs font-semibold uppercase tracking-[0.3em] text-[#7a838b]">
                  Sexo*
                </label>
                <select
                  id="sex"
                  value={formData.sex}
                  onChange={(e) => setFormData({ ...formData, sex: e.target.value as 'M' | 'F' | 'OUTRO' })}
                  className="mt-2 w-full rounded-2xl border border-[#dcd3ca] bg-white px-4 py-3 text-sm text-[#0c2332] outline-none transition focus:border-[#35d0a0] focus:ring-2 focus:ring-[#35d0a0]/30"
                  required
                >
                  <option value="M">Masculino</option>
                  <option value="F">Feminino</option>
                  <option value="OUTRO">Outro</option>
                </select>
              </div>

              <div>
                <label htmlFor="birthDate" className="text-xs font-semibold uppercase tracking-[0.3em] text-[#7a838b]">
                  Data de nascimento*
                </label>
                <input
                  type="text"
                  id="birthDate"
                  value={formData.birthDate}
                  onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                  className="mt-2 w-full rounded-2xl border border-[#dcd3ca] bg-white px-4 py-3 text-sm text-[#0c2332] outline-none transition focus:border-[#35d0a0] focus:ring-2 focus:ring-[#35d0a0]/30"
                  placeholder="DD/MM/AAAA"
                  maxLength={10}
                  required
                />
                <p className="mt-1 text-xs text-[#7a838b]">Formato oficial brasileiro (ex: 21/03/1995)</p>
              </div>

              <div>
                <label htmlFor="heightM" className="text-xs font-semibold uppercase tracking-[0.3em] text-[#7a838b]">
                  Altura em metros*
                </label>
                <input
                  type="number"
                  id="heightM"
                  value={formData.heightM}
                  onChange={(e) => setFormData({ ...formData, heightM: e.target.value })}
                  className="mt-2 w-full rounded-2xl border border-[#dcd3ca] bg-white px-4 py-3 text-sm text-[#0c2332] outline-none transition focus:border-[#35d0a0] focus:ring-2 focus:ring-[#35d0a0]/30"
                  placeholder="1.75"
                  step="0.01"
                  min="0"
                  max="3"
                  required
                />
                <p className="mt-1 text-xs text-[#7a838b]">Utilize ponto para casas decimais.</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 pt-2">
              <button
                type="button"
                onClick={() => navigate('/patients')}
                className="flex-1 rounded-2xl border border-[#dcd3ca] px-6 py-3 text-sm font-semibold text-[#5c6772] transition hover:bg-[#faf8f5]"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 rounded-2xl bg-[#35d0a0] px-6 py-3 text-sm font-semibold text-[#0c2332] shadow-lg shadow-[#35d0a0]/40 transition hover:bg-[#2eb48a] disabled:opacity-60"
              >
                {loading ? 'Salvando...' : 'Cadastrar paciente'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
}
