
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, ShoppingBag, User, ListChecks, Briefcase, Bike } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useAuthStore } from '../../store/authStore';

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentRole } = useAuthStore();

  const getNavItems = () => {
    switch (currentRole) {
      case 'customer':
        return [
          { label: 'Home', icon: Home, path: '/customer/' },
          { label: 'Orders', icon: ShoppingBag, path: '/customer/orders' },
          { label: 'Account', icon: User, path: '/customer/profile' },
        ];
      case 'vendor':
        return [
          { label: 'Dashboard', icon: Home, path: '/vendor/dashboard' },
          { label: 'Inventory', icon: ListChecks, path: '/vendor/inventory' },
          { label: 'Orders', icon: ShoppingBag, path: '/vendor/orders' },
          { label: 'Store', icon: Briefcase, path: '/vendor/profile' },
        ];
      case 'rider':
        return [
          { label: 'Tasks', icon: Bike, path: '/rider/dashboard' },
          { label: 'Earnings', icon: Home, path: '/rider/earnings' },
          { label: 'Profile', icon: User, path: '/rider/profile' },
        ];
      default:
        return [];
    }
  };

  const navItems = getNavItems();

  return (
    <div className="flex flex-col min-h-screen bg-secondary">
      {/* Top Bar - Simplified for mobile */}
      <header className="sticky top-0 z-50 bg-white border-b border-border px-4 py-3 flex justify-between items-center sm:hidden">
        <h1 className="text-xl font-bold text-primary italic">KeriGo</h1>
        <div className="flex gap-4">
          <User className="h-6 w-6 text-foreground" />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 pb-20 sm:pb-0 overflow-y-auto w-full max-w-7xl mx-auto">
        {children}
      </main>

      {/* Desktop Sidebar (Intelligent expansion) */}
      {/* For now, focus on Mobile bottom nav as per wireframe */}

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-border px-2 py-1 flex justify-around items-center sm:hidden h-16">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.label}
              onClick={() => navigate(item.path)}
              className={cn(
                "flex flex-col items-center justify-center gap-1 min-w-[64px] transition-colors",
                isActive ? "text-primary font-medium" : "text-foreground/60"
              )}
            >
              <item.icon className={cn("h-6 w-6", isActive && "stroke-[2.5px]")} />
              <span className="text-[10px] uppercase tracking-wider">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};
