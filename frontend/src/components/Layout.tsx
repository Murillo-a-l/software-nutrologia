import type { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
}

/**
 * Transitional wrapper used inside pages to preserve spacing now that the global AppShell
 * handles sidebar/header rendering.
 */
export function Layout({ children }: LayoutProps) {
  return <div className="space-y-6">{children}</div>;
}
