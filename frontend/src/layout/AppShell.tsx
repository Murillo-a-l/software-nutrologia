import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useMemo } from 'react';

interface AppShellProps {
  children?: React.ReactNode;
}

const navItems = [
  { label: 'Dashboard', to: '/dashboard', icon: DashboardIcon },
  { label: 'Pacientes', to: '/patients', icon: UsersIcon },
  { label: 'Avaliação Física', to: '/assessments/workspace', icon: ClipboardIcon },
  { label: 'Bioimpedância', to: '/bioimpedance', icon: BioIcon },
  { label: 'Dobras Cutâneas', to: '/skinfold', icon: SkinfoldIcon },
  { label: 'Metabolismo', to: '/metabolism', icon: FlameIcon },
  { label: 'Dietas', to: '/diet', icon: PlateIcon },
  { label: 'Relatórios', to: '/reports', icon: ReportIcon },
  { label: 'IA Assistente', to: '/ai', icon: SparkIcon },
  { label: 'Painel pessoal', to: '/personal', icon: UserIcon },
  { label: 'Configurações', to: '/settings', icon: SettingsIcon },
];

export function AppShell({ children }: AppShellProps) {
  const location = useLocation();
  const navigate = useNavigate();

  const content = children ?? <Outlet />;

  const pageTitle = useMemo(() => {
    const active = navItems.find((item) => location.pathname.startsWith(item.to));
    if (active) return active.label;
    if (location.pathname.startsWith('/patients/')) return 'Paciente';
    if (location.pathname.startsWith('/assessments')) return 'Avaliações';
    return 'Painel Clínico';
  }, [location.pathname]);

  const handleLogout = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex">
      <aside className="hidden lg:flex w-72 bg-[#0F172A] text-white flex-col border-r border-white/5">
        <div className="px-6 py-8 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-2xl bg-white/10 flex items-center justify-center text-2xl font-semibold">
              NL
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-white/60">Nutrologia</p>
              <p className="text-lg font-semibold">NutroLab Pro</p>
            </div>
          </div>
        </div>
        <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-colors ${
                  isActive || location.pathname.startsWith(item.to)
                    ? 'bg-white/10 text-white shadow-lg shadow-black/10'
                    : 'text-white/70 hover:bg-white/5'
                }`
              }
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="px-6 py-6 border-t border-white/5">
          <button
            onClick={handleLogout}
            className="w-full rounded-2xl border border-white/20 px-4 py-2 text-sm font-semibold text-white/90 hover:bg-white/10 transition"
          >
            Encerrar sessão
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 sm:px-6">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-slate-400">Painel</p>
            <h1 className="text-lg font-semibold text-slate-900">{pageTitle}</h1>
          </div>
          <div className="flex items-center gap-3">
            <input
              type="search"
              placeholder="Buscar paciente ou avaliação"
              className="hidden md:block rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-600 focus:outline-none focus:ring-2 focus:ring-[#38BDF8]/40"
            />
            <button className="rounded-full border border-slate-200 p-2 text-slate-500 hover:text-slate-900">
              <BellIcon className="h-5 w-5" />
            </button>
            <div className="h-10 w-10 rounded-full bg-[#38BDF8]/20 text-[#0F172A] font-semibold flex items-center justify-center">
              DR
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-[#F8FAFC]">
          <div className="max-w-7xl mx-auto w-full space-y-6">{content}</div>
        </main>
      </div>
    </div>
  );
}

interface IconProps {
  className?: string;
}

function DashboardIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 12h18M12 3v18" />
    </svg>
  );
}

function UsersIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
      <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 21v-1a4 4 0 014-4h4a4 4 0 014 4v1" />
    </svg>
  );
}

function ClipboardIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 3h6a2 2 0 012 2v1h1a2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2h1V5a2 2 0 012-2z" />
    </svg>
  );
}

function BioIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v18m7-11a7 7 0 01-14 0" />
    </svg>
  );
}

function SkinfoldIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c2.5 2 4 4.667 4 8s-1.5 6-4 8c-2.5-2-4-4.667-4-8s1.5-6 4-8z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 12h12" />
    </svg>
  );
}

function FlameIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c2 3 5 4 5 8a5 5 0 11-10 0c0-4 3-5 5-8z" />
    </svg>
  );
}

function PlateIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
      <circle cx="12" cy="12" r="7" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14" />
    </svg>
  );
}

function ReportIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
      <path strokeLinecap="round" strokeLinejoin="round" d="M7 3h10l4 4v14a2 2 0 01-2 2H7a2 2 0 01-2-2V5a2 2 0 012-2z" />
    </svg>
  );
}

function SparkIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3l2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5L12 3z" />
    </svg>
  );
}

function UserIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
      <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 21v-1a4 4 0 014-4h4a4 4 0 014 4v1" />
    </svg>
  );
}

function SettingsIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 15a3 3 0 100-6 3 3 0 000 6zm7.5-3a5.5 5.5 0 00-.11-1.09l2.41-1.86-2-3.46-2.84 1.14a5.49 5.49 0 00-1.89-1.09L15 2h-6l-.07 3.64c-.69.24-1.34.6-1.89 1.09L4.2 5.59l-2 3.46 2.41 1.86A5.5 5.5 0 004.5 12c0 .37.04.73.11 1.09l-2.41 1.86 2 3.46 2.84-1.14c.55.49 1.2.85 1.89 1.09L9 22h6l.07-3.64c.69-.24 1.34-.6 1.89-1.09l2.84 1.14 2-3.46-2.41-1.86c.07-.36.11-.72.11-1.09z"
      />
    </svg>
  );
}

function BellIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.4-2.8A2 2 0 0118 13V9a6 6 0 10-12 0v4c0 .43-.11.85-.3 1.22L4 17h5m1 0v1a2 2 0 104 0v-1" />
    </svg>
  );
}
