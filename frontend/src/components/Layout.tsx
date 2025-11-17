import { Link, useNavigate } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Por enquanto apenas redireciona para login
    navigate('/');
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-primary text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/dashboard" className="flex items-center">
              <h1 className="text-2xl font-bold">NutroLab</h1>
            </Link>

            <nav className="flex items-center space-x-6">
              <Link
                to="/dashboard"
                className="hover:text-secondary transition-colors"
              >
                Dashboard
              </Link>
              <Link
                to="/patients"
                className="hover:text-secondary transition-colors"
              >
                Pacientes
              </Link>
              <button
                onClick={handleLogout}
                className="bg-secondary hover:bg-blue-600 px-4 py-2 rounded-lg transition-colors"
              >
                Sair
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-primary text-white mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <p className="text-center text-sm text-gray-300">
            © 2024 NutroLab - Sistema de Nutrologia
          </p>
        </div>
      </footer>
    </div>
  );
}
