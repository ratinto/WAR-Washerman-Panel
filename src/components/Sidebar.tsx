import { Link, useLocation } from 'react-router-dom';
import { Home, Package2, Search, BarChart3, Settings, LogOut, Shirt } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/AuthContext';

interface NavItem {
  title: string;
  icon: React.ReactNode;
  href: string;
}

const navItems: NavItem[] = [
  {
    title: 'My Work',
    icon: <Home className="w-6 h-6" />,
    href: '/dashboard',
  },
  {
    title: 'All Bags',
    icon: <Package2 className="w-6 h-6" />,
    href: '/orders',
  },
  {
    title: 'Find Student',
    icon: <Search className="w-6 h-6" />,
    href: '/students',
  },
  // {
  //   title: 'My Stats',
  //   icon: <BarChart3 className="w-6 h-6" />,
  //   href: '/statistics',
  // },
  {
    title: 'Settings',
    icon: <Settings className="w-6 h-6" />,
    href: '/settings',
  },
];

export function Sidebar() {
  const location = useLocation();
  const { logout, user } = useAuth();

  return (
    <div 
      className="flex h-screen w-64 flex-col border-r"
      style={{ backgroundColor: 'hsl(var(--card))' }}
    >
      {/* Logo */}
      <div className="flex h-20 shrink-0 items-center border-b px-6 bg-linear-to-r from-maroon/5 to-maroon/10">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-brand-primary">
            <Shirt className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl brand-logo leading-tight">
              WAR
            </h1>
            <p className="text-sm text-gray-600">Washerman Panel</p>
          </div>
        </div>
      </div>

      {/* User Info */}
      {user && (
        <div className="shrink-0 border-b px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full text-white font-semibold bg-brand-primary">
              {user.username.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user.username}</p>
              <p className="text-xs text-muted-foreground">Washerman</p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 space-y-3 overflow-y-auto p-4">
        {navItems.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link key={item.href} to={item.href}>
              <Button
                variant={isActive ? 'secondary' : 'ghost'}
                className={`w-full justify-start h-16 text-lg font-semibold rounded-xl ${
                  isActive 
                    ? 'text-white hover:text-white shadow-lg' 
                    : 'hover:bg-accent hover:scale-105 transition-transform'
                }`}
                style={isActive ? { backgroundColor: 'var(--color-brand-primary)' } : {}}
              >
                <div className="flex items-center gap-4">
                  {item.icon}
                  <span>{item.title}</span>
                </div>
              </Button>
            </Link>
          );
        })}
      </nav>

      <Separator />

      {/* Logout */}
      <div className="shrink-0 p-4">
        <Button
          variant="ghost"
          className="w-full justify-start h-16 text-lg font-semibold rounded-xl text-red-600 hover:bg-red-50 hover:text-red-700 hover:scale-105 transition-all"
          onClick={logout}
        >
          <div className="flex items-center gap-4">
            <LogOut className="w-6 h-6" />
            <span>Log Out</span>
          </div>
        </Button>
      </div>
    </div>
  );
}
