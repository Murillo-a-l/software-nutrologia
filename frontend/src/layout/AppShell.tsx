import { useMemo, useState } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  ActivitySquare,
  ArrowRight,
  Bell,
  Bot,
  ChefHat,
  ChevronLeft,
  ChevronRight,
  FileChartColumn,
  Flame,
  Gauge,
  History,
  LayoutDashboard,
  Search,
  Settings,
  Stethoscope,
  UsersRound,
  Waves,
  HeartPulse,
  Pill,
  Utensils,
  BookOpen,
  FlaskConical,
  ClipboardCheck,
  UserRound,
} from 'lucide-react';

interface AppShellProps {
  children?: React.ReactNode;
}

interface NavItem {
  label: string;
  to: string;
  icon: (props: { className?: string }) => JSX.Element;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

const navSections: NavSection[] = [
  {
    title: 'Principal',
    items: [{ label: 'Dashboard', to: '/dashboard', icon: LayoutDashboard }],
  },
  {
    title: 'Pacientes',
    items: [
      { label: 'Lista de pacientes', to: '/patients', icon: UsersRound },
      { label: 'Wizard de avaliação', to: '/assessments/workspace', icon: ClipboardCheck },
      { label: 'Bioimpedância', to: '/bioimpedance', icon: Waves },
      { label: 'Dobras cutâneas', to: '/skinfold', icon: ActivitySquare },
      { label: 'Antropometria', to: '/anthropometry', icon: Gauge },
      { label: 'Histórico completo', to: '/patients/history', icon: History },
      { label: 'Relatórios', to: '/reports', icon: FileChartColumn },
    ],
  },
  {
    title: 'Clínico',
    items: [
      { label: 'Anamnese', to: '/clinical/anamnesis', icon: Stethoscope },
      { label: 'Exames', to: '/clinical/exams', icon: FlaskConical },
      { label: 'Diagnósticos', to: '/clinical/diagnostics', icon: HeartPulse },
      { label: 'Prescrições', to: '/clinical/prescriptions', icon: Pill },
      { label: 'Metabolismo', to: '/metabolism', icon: Flame },
    ],
  },
  {
    title: 'Nutrição',
    items: [
      { label: 'Planejamento calórico', to: '/nutrition/caloric-planning', icon: Utensils },
      { label: 'Dietas personalizadas', to: '/nutrition/diets', icon: BookOpen },
      { label: 'Banco de alimentos', to: '/nutrition/food-bank', icon: ChefHat },
    ],
  },
  {
    title: 'Inteligência',
    items: [{ label: 'IA Assistente', to: '/ai', icon: Bot }],
  },
  {
    title: 'Sistema',
    items: [
      { label: 'Centro pessoal', to: '/personal', icon: UserRound },
      { label: 'Configurações', to: '/settings', icon: Settings },
    ],
  },
];

export function AppShell({ children }: AppShellProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const content = children ?? <Outlet />;

  const pageTitle = useMemo(() => {
    const activeItem = navSections.flatMap((section) => section.items).find((item) => location.pathname.startsWith(item.to));
    if (activeItem) return activeItem.label;
    if (location.pathname.startsWith('/patients/')) return 'Paciente';
    if (location.pathname.startsWith('/assessments')) return 'Avaliações';
    return 'AntropoMax';
  }, [location.pathname]);

  const handleLogout = () => {
    navigate('/');
  };

  return (
    <div className="flex min-h-screen bg-[#faf8f5] text-[#0c2332]">
      <aside
        className={`hidden lg:flex flex-col border-r border-white/10 transition-all duration-300 bg-gradient-to-b from-[#0c2332] via-[#12354a] to-[#1d5472] text-white ${collapsed ? 'w-20' : 'w-72'
          }`}
      >
        <div className="relative px-5 py-6">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-2xl bg-white/15 flex items-center justify-center text-xl font-semibold tracking-tight">
              AX
            </div>
            {!collapsed && (
              <div>
                <p className="text-[11px] uppercase tracking-[0.45em] text-white/60">AntropoMax</p>
                <p className="text-lg font-semibold">Clínica Digital</p>
              </div>
            )}
          </div>
          <button
            type="button"
            className="absolute -right-3 top-8 flex h-7 w-7 items-center justify-center rounded-full border border-white/30 bg-white/10 text-white/80"
            onClick={() => setCollapsed((prev) => !prev)}
            aria-label={collapsed ? 'Expandir menu' : 'Recolher menu'}
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-3 pb-6">
          {navSections.map((section) => (
            <div key={section.title} className="mb-6">
              {!collapsed && <p className="px-3 text-[11px] uppercase tracking-[0.4em] text-white/50">{section.title}</p>}
              <nav className="mt-3 space-y-1">
                {section.items.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    title={collapsed ? item.label : undefined}
                    className={({ isActive }) =>
                      `flex items-center gap-3 rounded-2xl px-3 py-2 text-sm font-medium transition ${isActive || location.pathname.startsWith(item.to)
                        ? 'bg-white/15 text-white shadow-lg shadow-black/20'
                        : 'text-white/70 hover:bg-white/5'
                      }`
                    }
                  >
                    <item.icon className="h-4 w-4" />
                    {!collapsed && <span>{item.label}</span>}
                  </NavLink>
                ))}
              </nav>
            </div>
          ))}
        </div>

        <div className="px-5 pb-6">
          <div className="rounded-2xl border border-white/15 bg-white/5 p-4 text-xs text-white/80">
            {!collapsed ? (
              <>
                <p className="font-semibold text-sm">Modo premium</p>
                <p className="mt-1 text-white/60">Experiência desenhada para healthtechs de alta performance.</p>
                <button
                  onClick={handleLogout}
                  className="mt-3 inline-flex items-center gap-2 rounded-full bg-white/90 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.25em] text-[#0c2332]"
                >
                  <ArrowRight className="h-3 w-3" /> Sair
                </button>
              </>
            ) : (
              <button onClick={handleLogout} className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/20 text-white">
                <ArrowRight className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex flex-col gap-4 border-b border-white/10 bg-gradient-to-r from-[#0c2332] to-[#1f608b] px-4 py-5 text-white shadow-lg shadow-[#0c2332]/25 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <div>
            <p className="text-[11px] uppercase tracking-[0.45em] text-white/60">AntropoMax</p>
            <h1 className="text-2xl font-semibold tracking-tight">{pageTitle}</h1>
            <p className="text-xs text-white/70">Software clínico inteligente para composição corporal.</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative hidden md:block">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/50" />
              <input
                type="search"
                placeholder="Buscar pacientes, avaliações ou relatórios"
                className="h-11 w-64 rounded-2xl border border-white/20 bg-white/10 pl-10 pr-4 text-sm placeholder:text-white/60 focus:border-white/40 focus:outline-none"
              />
            </div>
            <button className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/30 bg-white/10 text-white">
              <Bell className="h-5 w-5" />
            </button>
            <div className="flex items-center gap-3 rounded-2xl border border-white/25 bg-white/10 px-4 py-2">
              <div className="text-right text-xs leading-tight">
                <p className="font-semibold">Dra. Aurora Lima</p>
                <p className="text-white/60">Nutrologia avançada</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-white/70 text-[#0c2332] font-semibold flex items-center justify-center">AL</div>
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto px-4 py-6 sm:px-8">
          <div className="mx-auto w-full max-w-7xl space-y-6">{content}</div>
        </main>
      </div>
    </div>
  );
}
