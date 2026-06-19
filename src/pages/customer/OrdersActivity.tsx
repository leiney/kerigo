import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  ChevronRight,
  History,
  Heart,
  Star,
  Gift,
  RefreshCw,
  Clock,
} from 'lucide-react';
import BottomNav from '../../components/BottomNav';
import CustomSettingsHeader from '@/src/components/layout/CustomSettingsHeader';
import { productApi } from '../../../lib/api';

export const OrdersActivity: React.FC = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    let isMounted = true;

    const loadOrders = async () => {
      try {
        const data = await productApi.getAllOrders();
        if (isMounted) {
          setOrders(data || []);
        }
      } catch (err) {
        console.error('Failed to load orders count:', err);
      }
    };

    loadOrders();

    return () => {
      isMounted = false;
    };
  }, []);

  const MenuItem = ({
    icon: Icon,
    title,
    subtitle,
    onClick,
  }: {
    icon: React.ElementType;
    title: string;
    subtitle: string;
    onClick?: () => void;
  }) => (
    <button
      onClick={onClick}
      className="w-full flex items-center justify-between p-4 transition-colors hover:bg-secondary/50"
    >
      <div className="flex items-center gap-3">
        <Icon className="w-5 h-5 text-foreground/60" />
        <div className="text-left">
          <p className="text-sm font-semibold text-foreground">{title}</p>
          <p className="text-xs text-foreground/50 mt-0.5">{subtitle}</p>
        </div>
      </div>
      <ChevronRight className="w-5 h-5 text-foreground/30" />
    </button>
  );

  return (
    <div className="min-h-screen bg-background text-foreground font-sans antialiased pb-24">
      <CustomSettingsHeader title="Orders & Activity" />

      <div className="px-4 space-y-6 pt-2">
        <div className="bg-white rounded-2xl border border-border/50 shadow-sm overflow-hidden divide-y divide-border/50">
          <MenuItem
            icon={History}
            title="Order History"
            subtitle={`${orders.length} past orders available`}
            onClick={() => navigate('/settings/orders/history')}
          />
          <MenuItem
            icon={Heart}
            title="Wishlist"
            subtitle="View and manage your wishlist"
            onClick={() => navigate('/settings/orders/wishlist')}
          />
          <MenuItem
            icon={Star}
            title="Reviews"
            subtitle="View and manage your reviews"
            onClick={() => navigate('/settings/orders/reviews')}
          />
          <MenuItem
            icon={Gift}
            title="Coupons & Offers"
            subtitle="View your saved coupons and offers"
            onClick={() => navigate('/settings/orders/coupons')}
          />
          <MenuItem
            icon={RefreshCw}
            title="Returns & Refunds"
            subtitle="Track your returns and refunds"
            onClick={() => navigate('/settings/orders/returns')}
          />
          <MenuItem
            icon={Clock}
            title="Recently Viewed"
            subtitle="Products you've recently viewed"
            onClick={() => navigate('/settings/orders/recently-viewed')}
          />
        </div>
      </div>

      {/* --- Bottom Navigation --- */}
      <BottomNav />
    </div>
  );
};