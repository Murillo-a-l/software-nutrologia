import type { SVGProps } from 'react';

export type Icon = (props: SVGProps<SVGSVGElement>) => JSX.Element;

function createIcon(paths: JSX.Element[]): Icon {
  return function IconComponent({ strokeWidth = 1.8, ...props }: SVGProps<SVGSVGElement>) {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={strokeWidth}
        {...props}
      >
        {paths}
      </svg>
    );
  };
}

export const LayoutDashboard = createIcon([
  <rect key="1" x="3" y="3" width="7" height="9" rx="2" />,
  <rect key="2" x="14" y="3" width="7" height="5" rx="2" />,
  <rect key="3" x="14" y="11" width="7" height="10" rx="2" />,
  <rect key="4" x="3" y="15" width="7" height="6" rx="2" />,
]);

export const UsersRound = createIcon([
  <circle key="1" cx="9" cy="7" r="3.5" />,
  <circle key="2" cx="17" cy="9" r="2.5" />,
  <path key="3" d="M3 21c0-3.5 3-6 6-6s6 2.5 6 6" />,
  <path key="4" d="M13 21c0-2.5 2-4.5 4-4.5 1.2 0 2.3.4 3 1" />,
]);

export const UserRound = createIcon([
  <circle key="1" cx="12" cy="8" r="4" />,
  <path key="2" d="M5 21c0-3.5 3-6 7-6s7 2.5 7 6" />,
]);

export const ClipboardCheck = createIcon([
  <rect key="1" x="5" y="4" width="14" height="16" rx="2" />,
  <path key="2" d="M9 4V3h6v1" />,
  <path key="3" d="M9 12l2 2 4-4" />,
]);

export const Waves = createIcon([
  <path key="1" d="M3 7c2 0 2-2 4-2s2 2 4 2 2-2 4-2 2 2 4 2" />,
  <path key="2" d="M3 12c2 0 2-2 4-2s2 2 4 2 2-2 4-2 2 2 4 2" />,
  <path key="3" d="M3 17c2 0 2-2 4-2s2 2 4 2 2-2 4-2 2 2 4 2" />,
]);

export const ActivitySquare = createIcon([
  <rect key="1" x="3" y="3" width="18" height="18" rx="3" />,
  <path key="2" d="M7 13l3-4 3 6 3-5 2 3" />,
]);

export const History = createIcon([
  <path key="1" d="M3 12a9 9 0 1 0 3.3-6.9" />,
  <path key="2" d="M3 5v4h4" />,
  <path key="3" d="M12 7v5l3 2" />,
]);

export const FileChartColumn = createIcon([
  <path key="1" d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />,
  <path key="2" d="M14 2v6h6" />,
  <path key="3" d="M8 18v-5" />,
  <path key="4" d="M12 18v-3" />,
  <path key="5" d="M16 18v-7" />,
]);

export const Stethoscope = createIcon([
  <path key="1" d="M5 4v5a4 4 0 0 0 8 0V4" />,
  <circle key="2" cx="18" cy="10" r="2" />,
  <path key="3" d="M18 12v3a6 6 0 0 1-6 6h-1a6 6 0 0 1-6-6v-1" />,
]);

export const FlaskConical = createIcon([
  <path key="1" d="M10 2h4" />,
  <path key="2" d="M9 2 7 8a6 6 0 0 0 5 8 6 6 0 0 0 5-8l-2-6" />,
  <path key="3" d="M7 16h10" />,
]);

export const HeartPulse = createIcon([
  <path key="1" d="M3 12c0-3.6 2.4-6 5.5-6a4.7 4.7 0 0 1 3.5 1.6A4.7 4.7 0 0 1 15.5 6C18.6 6 21 8.4 21 12c0 6-9 10-9 10s-9-4-9-10" />,
  <path key="2" d="M3 12h3l2 4 2-6 2 4h3" />,
]);

export const Pill = createIcon([
  <rect key="1" x="3" y="8" width="18" height="8" rx="4" />,
  <path key="2" d="M12 8v8" />,
]);

export const Flame = createIcon([
  <path key="1" d="M12 3c3 4 6 5 6 9a6 6 0 0 1-12 0c0-4 3-5 6-9z" />,
]);

export const Utensils = createIcon([
  <path key="1" d="M4 3v7" />,
  <path key="2" d="M8 3v7" />,
  <path key="3" d="M4 10h4" />,
  <path key="4" d="M6 10v11" />,
  <path key="5" d="M14 3h2a3 3 0 0 1 3 3v5h-5" />,
  <path key="6" d="M16 14v7" />,
]);

export const ChefHat = createIcon([
  <path key="1" d="M12 3c-2.5 0-4.5 2-4.5 4.5a4.5 4.5 0 0 0 1 2.8H6v4h12v-4h-2.5a4.5 4.5 0 0 0 1-2.8C16.5 5 14.5 3 12 3z" />,
  <path key="2" d="M6 18h12" />,
  <path key="3" d="M9 22v-4" />,
  <path key="4" d="M15 22v-4" />,
]);

export const Bot = createIcon([
  <rect key="1" x="6" y="9" width="12" height="9" rx="2" />,
  <path key="2" d="M12 2v5" />,
  <path key="3" d="M9 2h6" />,
  <circle key="4" cx="9" cy="13" r="1" />,
  <circle key="5" cx="15" cy="13" r="1" />,
  <path key="6" d="M8 22h8" />,
]);

export const Settings = createIcon([
  <circle key="1" cx="12" cy="12" r="3" />,
  <path key="2" d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />,
]);

export const ChevronLeft = createIcon([
  <path key="1" d="M15 18l-6-6 6-6" />,
]);

export const ChevronRight = createIcon([
  <path key="1" d="M9 6l6 6-6 6" />,
]);

export const Bell = createIcon([
  <path key="1" d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />,
  <path key="2" d="M10.3 21a1.7 1.7 0 0 0 3.4 0" />,
]);

export const Search = createIcon([
  <circle key="1" cx="11" cy="11" r="7" />,
  <path key="2" d="m21 21-4.3-4.3" />,
]);

export const Plus = createIcon([
  <path key="1" d="M12 5v14" />,
  <path key="2" d="M5 12h14" />,
]);

export const ArrowRight = createIcon([
  <path key="1" d="M5 12h14" />,
  <path key="2" d="m12 5 7 7-7 7" />,
]);

export const Sparkles = createIcon([
  <path key="1" d="M12 3l1.2 3.5 3.3 1L13.5 10l.8 3.5-2.3-2-2.3 2 .8-3.5-3-2.5 3.3-1z" />,
  <path key="2" d="M5 16l.7 2 2 .7-2 .7-.7 2-.7-2-2-.7 2-.7z" />,
  <path key="3" d="M19 14l.5 1.5L21 16l-1.5.5L19 18l-.5-1.5L17 16l1.5-.5z" />,
]);

export const Shield = createIcon([
  <path key="1" d="M12 3l8 4v5c0 5-3.5 9.5-8 10-4.5-.5-8-5-8-10V7z" />,
]);

export const FileText = createIcon([
  <path key="1" d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />,
  <path key="2" d="M14 2v6h6" />,
  <path key="3" d="M16 13H8" />,
  <path key="4" d="M16 17H8" />,
]);

export const BarChart3 = createIcon([
  <path key="1" d="M4 21V9" />,
  <path key="2" d="M9 21V3" />,
  <path key="3" d="M14 21v-6" />,
  <path key="4" d="M19 21v-9" />,
]);

export const LineChart = createIcon([
  <path key="1" d="M3 3v18h18" />,
  <path key="2" d="M19 9l-5 5-4-4-5 6" />,
]);

export const ShieldPlus = createIcon([
  <path key="1" d="M12 3l8 4v5c0 5-3.5 9.5-8 10-4.5-.5-8-5-8-10V7z" />,
  <path key="2" d="M12 9v6" />,
  <path key="3" d="M9 12h6" />,
]);

export const Apple = createIcon([
  <path key="1" d="M16 2c-1.5 0-3 1-4 2-1-1-2.5-2-4-2C5 2 3 4.5 3 8c0 4.5 3 9 6 9 1.2 0 2.2-.6 3-1.5.8.9 1.8 1.5 3 1.5 3 0 6-4.5 6-9 0-3.5-2-6-5-6z" />,
  <path key="2" d="M12 4s0-2 2-2" />,
]);

export const Salad = createIcon([
  <path key="1" d="M4 15a8 8 0 0 1 16 0v1a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5z" />,
  <path key="2" d="M7 9c0-2 1-3 3-3" />,
  <path key="3" d="M17 9c0-2-1-3-3-3" />,
]);

export const Gauge = createIcon([
  <path key="1" d="M12 15l3-3" />,
  <path key="2" d="M5.5 20A9 9 0 1 1 18.5 20z" />,
  <path key="3" d="M12 12v-3" />,
]);

export const ClipboardList = createIcon([
  <rect key="1" x="4" y="3" width="16" height="18" rx="2" />,
  <path key="2" d="M9 3V2h6v1" />,
  <path key="3" d="M9 8h6" />,
  <path key="4" d="M9 12h6" />,
  <path key="5" d="M9 16h6" />,
  <path key="6" d="M7 8h.01" />,
  <path key="7" d="M7 12h.01" />,
  <path key="8" d="M7 16h.01" />,
]);

export const BookOpen = createIcon([
  <path key="1" d="M12 3v18" />,
  <path key="2" d="M3 6h7c1.1 0 2 .9 2 2v13H5a2 2 0 0 1-2-2z" />,
  <path key="3" d="M21 6h-7c-1.1 0-2 .9-2 2v13h7a2 2 0 0 0 2-2z" />,
]);

export const NotepadText = createIcon([
  <path key="1" d="M7 3h10" />,
  <path key="2" d="M12 12h6" />,
  <path key="3" d="M6 16h6" />,
  <rect key="4" x="4" y="5" width="16" height="16" rx="2" />,
]);

export const Wand2 = Sparkles;
