import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  Search,
  BarChart3,
  Settings,
  LogOut,
  ShirtIcon,
} from 'lucide-react';
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
    title: 'Dashboard',
    icon: <LayoutDashboard className="h-4 w-4" />,
    href: '/dashboard',
  },
  {
    title: 'Orders',
    icon: <Package className="h-4 w-4" />,
    href: '/orders',
  },
  {
    title: 'Student Lookup',
    icon: <Search className="h-4 w-4" />,
    href: '/students',
  },
  {
    title: 'Statistics',
    icon: <BarChart3 className="h-4 w-4" />,
    href: '/statistics',
  },
  {
    title: 'Settings',
    icon: <Settings className="h-4 w-4" />,
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
      <div className="flex h-16 shrink-0 items-center border-b px-6">
        <div className="flex items-center gap-2">
          <ShirtIcon 
            className="h-6 w-6" 
            style={{ color: '#a30c34' }}
          />
          <h1 
            className="text-xl font-bold" 
            style={{ 
              fontFamily: 'Playfair Display, serif',
              color: '#a30c34'
            }}
          >
            WAR Washerman
          </h1>
        </div>
      </div>

      {/* User Info */}
      {user && (
        <div className="shrink-0 border-b px-6 py-4">
          <div className="flex items-center gap-3">
            <div 
              className="flex h-10 w-10 items-center justify-center rounded-full text-white font-semibold"
              style={{ backgroundColor: '#a30c34' }}
            >
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
      <nav className="flex-1 space-y-1 overflow-y-auto p-4">
        {navItems.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link key={item.href} to={item.href}>
              <Button
                variant={isActive ? 'secondary' : 'ghost'}
                className={`w-full justify-start ${
                  isActive 
                    ? 'text-white hover:text-white' 
                    : 'hover:bg-accent'
                }`}
                style={isActive ? { backgroundColor: '#a30c34' } : {}}
              >
                {item.icon}
                <span className="ml-3">{item.title}</span>
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
          className="w-full justify-start text-destructive hover:bg-destructive/10 hover:text-destructive"
          onClick={logout}
        >
          <LogOut className="h-4 w-4" />
          <span className="ml-3">Logout</span>
        </Button>
      </div>
    </div>
  );
}
