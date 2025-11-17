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
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="bg-primary text-white shadow-sm">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex justify-between items-center h-14">
            <Link to="/dashboard" className="flex items-center">
              <h1 className="text-xl font-semibold tracking-tight">NutroLab</h1>
            </Link>

            <nav className="flex items-center gap-6">
              <Link
                to="/dashboard"
                className="text-sm hover:text-accent transition-colors"
              >
                Dashboard
              </Link>
              <Link
                to="/patients"
                className="text-sm hover:text-accent transition-colors"
              >
                Pacientes
              </Link>
              <button
                onClick={handleLogout}
                className="text-sm bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-md transition-colors"
              >
                Sair
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <div className="max-w-6xl mx-auto px-6 py-8">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-border mt-auto">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <p className="text-center text-xs text-muted">
            © 2024 NutroLab - Sistema de Nutrologia
          </p>
        </div>
      </footer>
    </div>
  );
}
