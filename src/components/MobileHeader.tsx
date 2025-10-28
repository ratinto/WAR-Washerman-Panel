import { useAuth } from '@/contexts/AuthContext';
import { ShirtIcon } from 'lucide-react';

interface MobileHeaderProps {
  title: string;
  subtitle?: string;
}

export function MobileHeader({ title, subtitle }: MobileHeaderProps) {
  const { user } = useAuth();

  return (
    <div className="sticky top-0 z-40 bg-white border-b border-gray-200 px-4 py-3 md:hidden">
      <div className="flex items-center justify-between">
        {/* Logo and Title */}
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-brand-primary">
            <ShirtIcon className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg page-title">
              {title}
            </h1>
            {subtitle && (
              <p className="text-sm text-gray-600">{subtitle}</p>
            )}
          </div>
        </div>

        {/* User Avatar */}
        {user && (
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full text-white text-sm font-semibold bg-brand-primary">
              {user.username.charAt(0).toUpperCase()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
