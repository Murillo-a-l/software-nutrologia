import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function Login() {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Login fake - apenas redireciona
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary to-blue-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary mb-2">NutroLab</h1>
          <p className="text-gray-600">Sistema de Nutrologia</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              E-mail ou Login
            </label>
            <input
              type="text"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent outline-none transition"
              placeholder="Digite seu e-mail"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-secondary hover:bg-blue-600 text-white font-semibold py-3 rounded-lg transition-colors shadow-lg hover:shadow-xl"
          >
            Entrar
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          Sistema desenvolvido para profissionais de nutrição
        </p>
      </div>
    </div>
  );
}
