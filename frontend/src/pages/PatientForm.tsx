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
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Cadastrar Novo Paciente</h1>
          <p className="text-gray-600 mt-1">Preencha os dados do paciente</p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow-md p-6">
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Nome Completo <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent outline-none transition"
                placeholder="Digite o nome completo"
                required
              />
            </div>

            <div>
              <label
                htmlFor="sex"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Sexo <span className="text-red-500">*</span>
              </label>
              <select
                id="sex"
                value={formData.sex}
                onChange={(e) =>
                  setFormData({ ...formData, sex: e.target.value as 'M' | 'F' | 'OUTRO' })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent outline-none transition"
                required
              >
                <option value="M">Masculino</option>
                <option value="F">Feminino</option>
                <option value="OUTRO">Outro</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="birthDate"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Data de Nascimento <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="birthDate"
                value={formData.birthDate}
                onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent outline-none transition"
                placeholder="DD/MM/AAAA"
                maxLength={10}
                required
              />
              <p className="mt-1 text-sm text-gray-500">Formato: DD/MM/AAAA (ex: 21/03/1995)</p>
            </div>

            <div>
              <label
                htmlFor="heightM"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Altura (metros) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                id="heightM"
                value={formData.heightM}
                onChange={(e) => setFormData({ ...formData, heightM: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent outline-none transition"
                placeholder="1.75"
                step="0.01"
                min="0"
                max="3"
                required
              />
              <p className="mt-1 text-sm text-gray-500">Ex: 1.75 para 1 metro e 75 centímetros</p>
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-secondary hover:bg-blue-600 disabled:bg-gray-400 text-white font-semibold py-3 rounded-lg transition-colors shadow-md hover:shadow-lg"
              >
                {loading ? 'Salvando...' : 'Cadastrar Paciente'}
              </button>
              <button
                type="button"
                onClick={() => navigate('/patients')}
                className="px-6 py-3 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
}
