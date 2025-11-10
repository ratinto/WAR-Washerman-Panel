
import type { ReactNode } from 'react';
import { useState, useRef, useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { MobileNavigation } from './MobileNavigation';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Settings, LogOut, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';


interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  return (
    <div className="flex h-screen w-full overflow-hidden">
      {/* Desktop Sidebar - Hidden on mobile */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      {/* Main Content + Profile Dropdown */}
      <div className="flex-1 flex flex-col">
        {/* Topbar (no profile dropdown, handled by MobileHeader) */}
        <main
          className="flex-1 overflow-y-auto p-0 pb-20 md:pb-0"
          style={{ backgroundColor: '#faf6f3' }}
        >
          {children}
        </main>
      </div>

      {/* Mobile Navigation - Hidden on desktop */}
      <MobileNavigation />
    </div>
  );

  return (
    <div className="flex h-screen w-full overflow-hidden">
      {/* Desktop Sidebar - Hidden on mobile */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      {/* Main Content + Profile Dropdown */}
      <div className="flex-1 flex flex-col">
        {/* Topbar with Profile Dropdown */}
        <div className="flex items-center justify-end px-4 py-2 border-b bg-white/80 sticky top-0 z-30" style={{ minHeight: 56 }}>
          {user && (
            <div className="relative" ref={dropdownRef}>
              <Button
                variant="ghost"
                className="flex items-center gap-2 px-3 py-2 rounded-full border border-gray-200 shadow-sm hover:bg-gray-100"
                onClick={() => setOpen((v) => !v)}
                aria-label="Open profile menu"
              >
                <User className="w-5 h-5 text-brand-primary" />
                <span className="font-medium text-gray-900 text-base">{user?.username || 'User'}</span>
              </Button>
              {open && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                  <button
                    className="flex w-full items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 text-base"
                    onClick={() => { setOpen(false); navigate('/settings'); }}
                  >
                    <Settings className="w-5 h-5 text-gray-500" />
                    Settings
                  </button>
                  <button
                    className="flex w-full items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 text-base border-t border-gray-100"
                    onClick={() => { setOpen(false); logout(); }}
                  >
                    <LogOut className="w-5 h-5" />
                    Log Out
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
        <main 
          className="flex-1 overflow-y-auto p-0 pb-20 md:pb-0"
          style={{ backgroundColor: '#faf6f3' }}
        >
          {children}
        </main>
      </div>

      {/* Mobile Navigation - Hidden on desktop */}
      <MobileNavigation />
    </div>
  );
}
