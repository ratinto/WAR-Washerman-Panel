import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Home, Package2, Search, BarChart3 } from 'lucide-react';

interface NavItem {
  title: string;
  icon: React.ReactNode;
  href: string;
  label: string;
}

const navItems: NavItem[] = [
  {
    title: 'Home',
    icon: <Home className="h-6 w-6" />,
    href: '/dashboard',
    label: 'Home',
  },
  {
    title: 'Bags',
    icon: <Package2 className="h-6 w-6" />,
    href: '/orders',
    label: 'Bags',
  },
  {
    title: 'Search',
    icon: <Search className="h-6 w-6" />,
    href: '/students',
    label: 'Search',
  },
  // {
  //   title: 'Stats',
  //   icon: <BarChart3 className="h-6 w-6" />,
  //   href: '/statistics',
  //   label: 'Stats',
  // },
  // Settings moved to profile dropdown
];

export function MobileNavigation() {
  const location = useLocation();
  useAuth(); // Only for auth context if needed

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 safe-area-padding-bottom md:hidden">
      <div className="flex items-center justify-around px-2 py-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.href}
              to={item.href}
              className={`flex flex-col items-center justify-center min-w-0 flex-1 px-1 py-2 rounded-lg transition-all duration-200 ${
                isActive 
                  ? 'text-white transform scale-105' 
                  : 'text-gray-600 hover:text-gray-900 active:scale-95'
              }`}
              style={isActive ? { backgroundColor: 'var(--color-brand-primary)' } : {}}
            >
              <div className="mb-1">
                {item.icon}
              </div>
              <span className="text-xs font-medium truncate">
                {item.label}
              </span>
            </Link>
          );
        })}
        
  {/* Logout moved to profile dropdown */}
      </div>
    </div>
  );
}
