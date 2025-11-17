import { Link, NavLink, useNavigate } from 'react-router-dom';

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
    <div className="bg-background min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-primary text-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link to="/dashboard" className="flex items-center gap-2">
              <div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center font-semibold text-lg">
                NL
              </div>
              <div>
                <p className="text-sm uppercase tracking-[0.2em] text-white/70">Nutrologia</p>
                <h1 className="text-xl font-semibold leading-none">NutroLab</h1>
              </div>
            </Link>

            <nav className="flex items-center gap-6 text-sm">
              {[{ label: 'Dashboard', to: '/dashboard' }, { label: 'Pacientes', to: '/patients' }].map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `transition-colors ${isActive ? 'text-accent font-semibold' : 'text-white/80 hover:text-accent'}`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
              <button
                onClick={handleLogout}
                className="bg-white/10 border border-white/20 text-sm font-medium rounded-xl px-4 py-1.5 hover:bg-white/20 transition-colors"
              >
                Sair
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <div className="max-w-6xl mx-auto px-4 py-6 md:py-10">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-primary text-white/80 mt-auto">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <p className="text-center text-xs tracking-wide">
            © 2024 NutroLab – Sistema de Nutrologia
          </p>
        </div>
      </footer>
    </div>
  );
}
