import type { ReactNode } from 'react';
import { Sidebar } from './Sidebar';

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="flex h-screen w-full overflow-hidden">
      <Sidebar />
      <main 
        className="flex-1 overflow-y-auto p-0"
        style={{ backgroundColor: '#faf6f3' }}
      >
        {children}
      </main>
    </div>
  );
}
