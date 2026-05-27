import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Bike, DollarSign, Home, LayoutDashboard, Package, ShoppingBag, ShoppingCart, User } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

type NavRole = 'customer' | 'vendor' | 'rider';

type NavItem = {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  path: string;
  active: (pathname: string) => boolean;
  badge?: number;
};

const inferRoleFromPath = (pathname: string): NavRole => {
  if (pathname.startsWith('/vendor')) return 'vendor';
  if (pathname.startsWith('/rider')) return 'rider';
  return 'customer';
};

const navItemsByRole: Record<NavRole, NavItem[]> = {
  customer: [
    {
      label: 'Home',
      icon: Home,
      path: '/customer/',
      active: (pathname) => pathname === '/' || pathname === '/customer/',
    },
    {
      label: 'Orders',
      icon: ShoppingBag,
      path: '/customer/orders',
      active: (pathname) => pathname.startsWith('/customer/orders'),
    },
    {
      label: 'Cart',
      icon: ShoppingCart,
      path: '/cart',
      active: (pathname) => pathname.startsWith('/cart'),
    },
    {
      label: 'Account',
      icon: User,
      path: '/customer/profile',
      active: (pathname) =>
        pathname.startsWith('/customer/profile') ||
        pathname.startsWith('/account') ||
        pathname.startsWith('/settings'),
    },
  ],
  vendor: [
    {
      label: 'Dashboard',
      icon: LayoutDashboard,
      path: '/vendor/dashboard',
      active: (pathname) => pathname.startsWith('/vendor/dashboard'),
    },
    {
      label: 'Orders',
      icon: ShoppingBag,
      path: '/vendor/orders',
      active: (pathname) => pathname.startsWith('/vendor/orders'),
    },
    {
      label: 'Products',
      icon: Package,
      path: '/vendor/products',
      active: (pathname) => pathname.startsWith('/vendor/products') || pathname.startsWith('/vendor-store'),
    },
    {
      label: 'Profile',
      icon: User,
      path: '/vendor/profile',
      active: (pathname) => pathname.startsWith('/vendor/profile'),
    },
  ],
  rider: [
    {
      label: 'Dashboard',
      icon: Bike,
      path: '/rider/dashboard',
      active: (pathname) => pathname.startsWith('/rider/dashboard'),
    },
    {
      label: 'Orders',
      icon: ShoppingBag,
      path: '/rider/orders',
      active: (pathname) => pathname.startsWith('/rider/orders'),
    },
    {
      label: 'Earnings',
      icon: DollarSign,
      path: '/rider/earnings',
      active: (pathname) => pathname.startsWith('/rider/earnings'),
    },
    {
      label: 'Profile',
      icon: User,
      path: '/rider/profile',
      active: (pathname) => pathname.startsWith('/rider/profile'),
    },
  ],
};

export const BottomNav: React.FC<{ cartCount?: number }> = ({ cartCount }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentRole } = useAuthStore();

  const inferredRole = inferRoleFromPath(location.pathname);
  const role: NavRole = currentRole === 'customer' || currentRole === 'vendor' || currentRole === 'rider'
    ? currentRole
    : inferredRole;
  const navItems = navItemsByRole[role] ?? navItemsByRole.customer;

  const itemClasses = (isActive: boolean) =>
    `flex flex-col items-center gap-1 cursor-pointer transition-colors ${
      isActive ? 'text-primary' : 'text-foreground/40 hover:text-foreground/70'
    }`;

  return (
    <div className="fixed bottom-0 left-0 w-full h-16 bg-white border border-border shadow-lg grid grid-cols-4 items-center z-50">
      {navItems.map((item) => {
        const isActive = item.active(location.pathname);
        const Icon = item.icon;

        return (
          <button
            key={item.label}
            onClick={() => navigate(item.path)}
            className={`${itemClasses(isActive)} relative`}
          >
            <Icon className={`h-6 w-6 ${isActive ? 'text-primary' : 'text-current'}`} />
            {item.label === 'Cart' && typeof cartCount === 'number' && cartCount > 0 && (
              <span className={`absolute -top-1 right-[calc(50%-20px)] rounded-full text-[10px] font-bold px-2 ${isActive ? 'bg-primary text-white' : 'bg-foreground/10 text-foreground/60'}`}>
                {cartCount}
              </span>
            )}
            <span className="text-[10px] font-bold">{item.label}</span>
          </button>
        );
      })}
    </div>
  );
};

export default BottomNav;
