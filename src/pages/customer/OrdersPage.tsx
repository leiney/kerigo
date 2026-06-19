import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  SlidersHorizontal,
  Phone,
  MessageSquare,
  ShoppingBag,
  Store,
  ChevronRight,
  Clock,
  ArrowDownUp,
} from 'lucide-react';
import { Button, Badge, BottomSheet, Input } from '@stackloop/ui';
import { motion } from 'framer-motion';
import { productApi } from '../../../lib/api';
import { returnImageUrl } from '../../../config';
import type { CustomerOrderCard } from '../../../lib/types';

export const OrdersPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('current');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [orders, setOrders] = useState<CustomerOrderCard[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadPageData = async () => {
      try {
        const rawOrders = await productApi.getAllOrders();
        console.log('getAllOrders raw response:', rawOrders);

        const normalized: CustomerOrderCard[] = (rawOrders || []).map((order: any) => {
          const firstItem = order.orderItems?.[0];
          const firstItemImage = firstItem?.imageURL || firstItem?.variant?.images?.[0];
          const storeImageUrl = firstItemImage ? returnImageUrl(firstItemImage) : '/logo.png';

          const itemCount = order.orderItems?.reduce((acc: number, item: any) => acc + (item.quantity || 1), 0) || 0;

          // Determine status tone
          const rawStatus = (order.orderStatus || 'new').toLowerCase();
          let statusTone: 'success' | 'warning' | 'neutral' | 'error' = 'neutral';
          if (rawStatus === 'new' || rawStatus === 'pending') {
            statusTone = 'warning';
          } else if (rawStatus === 'confirmed' || rawStatus === 'preparing' || rawStatus.includes('way') || rawStatus.includes('ongoing')) {
            statusTone = 'success';
          } else if (rawStatus === 'delivered' || rawStatus === 'completed') {
            statusTone = 'neutral';
          } else if (rawStatus === 'cancelled') {
            statusTone = 'error';
          }

          // Format ETA
          const eta = order.deliveryDurationLength
            ? `${order.deliveryDurationLength} ${order.deliveryDurationType || 'days'}`
            : '2 days';

          // Format title
          let storeName = 'Kerigo Order';
          if (order.orderItems && order.orderItems.length > 0) {
            if (order.orderItems.length === 1) {
              storeName = order.orderItems[0].name || 'Product';
            } else {
              storeName = `${order.orderItems[0].name || 'Product'} + ${order.orderItems.length - 1} more`;
            }
          }

          // Rider details (if any)
          const rider = order.rider || order.extraData?.rider || null;

          return {
            id: order.orderID,
            reference: order.orderNo || order.orderID,
            storeName,
            storeImageUrl,
            itemCount,
            total: order.total || order.subTotal || 0,
            status: order.orderStatus ? order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1) : 'New',
            statusTone,
            eta,
            riderName: rider?.name || rider?.fullName || null,
            riderRole: rider?.role || 'Your Rider',
            riderAvatarUrl: rider?.avatarUrl || rider?.avatar || '/placeholder-avatar.webp',
          };
        });

        if (isMounted) {
          setOrders(normalized);
        }
      } catch (err) {
        console.error('Failed to load orders:', err);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadPageData();

    return () => {
      isMounted = false;
    };
  }, []);

  const currentOrders = orders.filter(
    (o) => o.statusTone === 'success' || o.statusTone === 'warning'
  );
  const completedOrders = orders.filter((o) => o.statusTone === 'neutral');
  const cancelledOrders = orders.filter((o) => o.statusTone === 'error');

  const visibleOrders =
    activeTab === 'current'
      ? currentOrders
      : activeTab === 'completed'
        ? completedOrders
        : cancelledOrders;

  const statusStyles: Record<CustomerOrderCard['statusTone'], { pill: string; dot: string; eta: string; border: string; }> = {
    success: { pill: 'bg-primary/10 text-primary', dot: 'bg-primary', eta: 'text-primary', border: 'border-l-primary' },
    warning: { pill: 'bg-warning/10 text-warning', dot: 'bg-warning', eta: 'text-foreground', border: 'border-l-warning' },
    neutral: { pill: 'bg-foreground/10 text-foreground/70', dot: 'bg-foreground/50', eta: 'text-foreground/70', border: 'border-l-border' },
    error: { pill: 'bg-red-100 text-red-600', dot: 'bg-red-500', eta: 'text-red-600', border: 'border-l-red-500' },
  };

  const getActionButton = (icon: React.ComponentType<{ className?: string }>, label: string) => {
    const Icon = icon;

    return (
      <button
        type="button"
        className="flex h-14 w-14 flex-col items-center justify-center rounded-md border border-border bg-white text-foreground/70 shadow-sm transition-colors hover:bg-secondary"
        onClick={(event) => event.stopPropagation()}
      >
        <Icon className="h-4 w-4 text-primary" />
        <span className="mt-0.5 text-[9px] font-medium text-foreground">{label}</span>
      </button>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background text-foreground pb-24 font-sans animate-pulse">
        {/* Header */}
        <header className="px-4 pt-5 pb-3 flex items-center justify-between sticky top-0 bg-background z-30">
          <div>
            <div className="h-6 w-32 bg-gray-200 rounded-md" />
            <div className="h-4 w-48 bg-gray-200 rounded-md mt-2" />
          </div>
        </header>
        {/* Tabs skeleton */}
        <div className="px-4 border-b border-border z-20 pb-3 flex gap-6">
          <div className="h-4 w-16 bg-gray-200 rounded" />
          <div className="h-4 w-16 bg-gray-200 rounded" />
          <div className="h-4 w-16 bg-gray-200 rounded" />
        </div>
        {/* Orders list skeleton */}
        <div className="px-4 mt-4 space-y-3">
          {[1, 2].map((i) => (
            <div key={i} className="bg-white rounded-md p-4 border border-border/50 h-32" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground pb-24 font-sans">
      {/* --- Header --- */}
      <header className="px-4 pt-5 pb-3 flex items-center justify-between sticky top-0 bg-background z-30">
        <div>
          <h1 className="text-xl font-bold tracking-tight">My Orders</h1>
          <p className="text-sm text-foreground/50 mt-1">Your current orders</p>
        </div>
        <div className="flex items-center gap-4">
          <button className="p-2 rounded-full hover:bg-secondary transition-colors">
            <Search className="w-5 h-5 text-foreground/70" />
          </button>
          <button 
            onClick={() => setIsFilterOpen(true)}
            className="p-2 rounded-full hover:bg-secondary transition-colors"
          >
            <SlidersHorizontal className="w-5 h-5 text-foreground/70" />
          </button>
        </div>
      </header>

      {/* --- Tabs --- */}
      <div className="px-4 border-b border-border sticky top-22 bg-background z-20 pb-0">
        <div className="flex items-center gap-6">
          {['current', 'completed', 'cancelled'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 text-xs font-semibold capitalize flex items-center gap-2 relative ${
                activeTab === tab ? 'text-primary' : 'text-foreground/60'
              }`}
            >
              {tab}
              {tab === 'current' && <span className="text-[10px] text-foreground/40">({currentOrders.length})</span>}
              {tab === 'completed' && <span className="text-[10px] text-foreground/40">({completedOrders.length})</span>}
              {tab === 'cancelled' && <span className="text-[10px] text-foreground/40">({cancelledOrders.length})</span>}
              
              {activeTab === tab && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t-full"
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* --- Info Banner (Only for Current Tab) --- */}
      {activeTab === 'current' && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="px-4 mt-3"
        >
          <div className="bg-primary/5 border border-primary/10 rounded-xl p-3 flex items-start gap-3">
            <div className="p-1.5 bg-primary/10 rounded-lg text-primary shrink-0">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-semibold text-primary text-xs">
                {currentOrders.length > 0
                  ? `You have ${currentOrders.length} active order${currentOrders.length === 1 ? '' : 's'}`
                  : 'You have 0 active orders'}
              </h3>
              <p className="text-[11px] text-foreground/60 mt-0.5">Track and manage your ongoing deliveries</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* --- Orders List --- */}
      <div className="px-4 mt-4 space-y-3">
        {visibleOrders.length === 0 ? (
          <div className="py-12 text-center flex flex-col items-center justify-center bg-white rounded-md border border-border/50 p-6">
            <div className="p-3 bg-primary/5 rounded-full text-primary mb-3">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <h3 className="font-bold text-sm text-foreground">No orders found</h3>
            <p className="text-xs text-foreground/50 mt-1 max-w-[240px]">
              {activeTab === 'current'
                ? "You don't have any active orders right now."
                : activeTab === 'completed'
                  ? "You haven't completed any orders yet."
                  : "You don't have any cancelled orders."}
            </p>
          </div>
        ) : (
          visibleOrders.map((order) => (
            <motion.button
              key={order.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              type="button"
              onClick={() => navigate(`/customer/orders/${encodeURIComponent(order.id)}`)}
              className={`w-full text-left bg-white rounded-md p-3 border border-border/50 border-l-4 shadow-sm active:scale-[0.99] transition-transform ${statusStyles[order.statusTone].border}`}
            >
              {/* Top Section */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start gap-2.5">
                  <div className="w-12 h-12 rounded-md overflow-hidden shrink-0 bg-primary/10 flex items-center justify-center border border-border">
                    <img src={order.storeImageUrl} alt={order.storeName} className="w-full h-full object-contain" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm leading-tight">{order.reference}</h4>
                    <p className="text-xs font-medium text-foreground/80 mt-0.5">{order.storeName}</p>
                    <div className="flex items-center gap-1 mt-1 text-[11px] text-foreground/50">
                      <span>{order.itemCount} item{order.itemCount === 1 ? '' : 's'}</span>
                      <span>•</span>
                      <span>KES {order.total.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
                
                <div className="text-right flex flex-col items-end gap-2">
                  <Badge 
                    variant={order.statusTone === 'error' ? 'warning' : 'success'} 
                    className={`text-[10px] px-2 py-0.5 rounded-full ${statusStyles[order.statusTone].pill}`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${statusStyles[order.statusTone].dot}`}></span>
                    {order.status}
                  </Badge>
                  <div className={`text-[11px] font-semibold ${statusStyles[order.statusTone].eta}`}>
                    Arriving in {order.eta}
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-foreground/30" />
                </div>
              </div>

              {order.riderName ? (
                <>
                  <div className="h-px bg-border/50 w-full my-2.5" />

                  {/* Rider Section */}
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gray-200 overflow-hidden border border-white shadow-sm">
                        <img src={order.riderAvatarUrl} alt={order.riderName} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-foreground">{order.riderName}</p>
                        <p className="text-[10px] text-foreground/50">{order.riderRole}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {getActionButton(Phone, 'Call')}
                      {getActionButton(MessageSquare, 'Message')}
                    </div>
                  </div>
                </>
              ) : null}
            </motion.button>
          ))
        )}
      </div>

      {/* --- Filters Bottom Sheet --- */}
      <FiltersSheet isOpen={isFilterOpen} onClose={() => setIsFilterOpen(false)} />
    </div>
  );
};

// --- Filter Bottom Sheet Component ---
const FiltersSheet: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} title="" className="rounded-t-3xl">
      <div className="p-5 pb-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xl font-bold">Filters</h2>
          <button className="text-primary font-semibold text-sm">Reset</button>
        </div>

        {/* Order Status */}
        <div>
          <h3 className="text-sm font-bold mb-3">Order Status</h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Current', count: 2, active: true, color: 'primary' },
              { label: 'Ongoing', count: 2, active: false, color: 'warning' },
              { label: 'Completed', count: 8, active: false, color: 'success' },
              { label: 'Cancelled', count: 2, active: false, color: 'error' }
            ].map((item) => (
              <button
                key={item.label}
                className={`flex items-center gap-2 p-3 rounded-xl border text-sm font-medium transition-all ${
                  item.active 
                    ? 'border-primary bg-primary/5 text-primary' 
                    : 'border-border hover:bg-secondary'
                }`}
              >
                <div className={`w-6 h-6 rounded-full flex items-center justify-center border ${
                  item.active ? 'border-primary' : 'border-foreground/20'
                }`}>
                  {item.active && <div className="w-3 h-3 rounded-full bg-primary" />}
                </div>
                <span className="flex-1 text-left">{item.label}</span>
                <span className="text-foreground/40">{item.count}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Time */}
        <div>
          <h3 className="text-sm font-bold mb-3">Time</h3>
          <div className="grid grid-cols-3 gap-2">
            {['All time', 'Today', 'Yesterday', 'Last 7 days', 'Last 30 days', 'Custom range'].map((time, idx) => (
              <button
                key={time}
                className={`relative p-3 rounded-xl border text-xs font-medium flex items-center justify-center gap-2 ${
                  idx === 0 ? 'border-primary bg-primary/5 text-primary' : 'border-border hover:bg-secondary'
                }`}
              >
                <Clock className="w-4 h-4 opacity-50" />
                {time}
                {idx === 0 && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-primary rounded-full flex items-center justify-center text-white shadow-sm">
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Store */}
        <div>
          <h3 className="text-sm font-bold mb-3">Store</h3>
          <button className="w-full flex items-center justify-between p-3 rounded-xl border border-border bg-white hover:bg-secondary transition-colors">
            <div className="flex items-center gap-2">
              <Store className="w-5 h-5 text-foreground/50" />
              <span className="text-sm font-medium">All stores</span>
            </div>
            <ChevronRight className="w-4 h-4 text-foreground/30" />
          </button>
        </div>

        {/* Payment Method */}
        <div>
          <h3 className="text-sm font-bold mb-3">Payment Method</h3>
          <button className="w-full flex items-center justify-between p-3 rounded-xl border border-border bg-white hover:bg-secondary transition-colors">
            <div className="flex items-center gap-3">
              {/* Mock Icons */}
              <div className="flex -space-x-2">
                 <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center text-[8px] font-bold text-green-700 border border-white">M</div>
                 <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-[8px] font-bold text-blue-700 border border-white">V</div>
                 <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center text-[8px] font-bold text-red-700 border border-white">MC</div>
              </div>
              <span className="text-sm font-medium">All payment methods</span>
            </div>
            <ChevronRight className="w-4 h-4 text-foreground/30" />
          </button>
        </div>

        {/* Amount Range */}
        <div>
          <h3 className="text-sm font-bold mb-3">Amount Range</h3>
          <div className="flex items-center gap-2">
            <Input placeholder="Min amount" className="bg-white" />
            <span className="text-foreground/30">-</span>
            <Input placeholder="Max amount" className="bg-white" />
          </div>
        </div>

        {/* Sort By */}
        <div>
          <h3 className="text-sm font-bold mb-3">Sort By</h3>
          <div className="grid grid-cols-2 gap-2">
            {[
              { label: 'Latest first', icon: ArrowDownUp, active: true },
              { label: 'Oldest first', icon: ArrowDownUp, active: false },
              { label: 'Amount: High to Low', icon: ArrowDownUp, active: false },
              { label: 'Amount: Low to High', icon: ArrowDownUp, active: false }
            ].map((sort) => (
              <button
                key={sort.label}
                className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-medium ${
                  sort.active ? 'border-primary bg-primary/5 text-primary' : 'border-border hover:bg-secondary'
                }`}
              >
                <span className="rotate-180"><sort.icon className="w-4 h-4" /></span>
                {sort.label}
              </button>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4">
          <Button variant="outline" className="flex-1 border-border text-foreground font-semibold h-11 rounded-xl" onClick={onClose}>
            Clear all
          </Button>
          <Button className="flex-1 bg-primary hover:bg-primary/90 text-white font-bold h-11 rounded-xl" onClick={onClose}>
            Apply Filters
          </Button>
        </div>
      </div>
    </BottomSheet>
  );
};

export default OrdersPage;