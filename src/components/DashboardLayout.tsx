import type { ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { MobileNavigation } from './MobileNavigation';

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="flex h-screen w-full overflow-hidden">
      {/* Desktop Sidebar - Hidden on mobile */}
      <div className="hidden md:block">
        <Sidebar />
      </div>
      
      {/* Main Content */}
      <main 
        className="flex-1 overflow-y-auto p-0 pb-20 md:pb-0"
        style={{ backgroundColor: '#faf6f3' }}
      >
        {children}
      </main>
      
      {/* Mobile Navigation - Hidden on desktop */}
      <MobileNavigation />
    </div>
  );
}
