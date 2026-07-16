import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  Bell,
  ShoppingBag,
  MapPin,
  Clock,
  Wallet,
  ChevronRight,
  RotateCw,
  ShoppingCart,
  Check
} from 'lucide-react';
import { Button } from '@stackloop/ui';
import { motion } from 'motion/react';
import BottomNav from '../../components/BottomNav';
import { useAuthStore } from '../../store/authStore';
import { selectCartCount, useCartStore } from '../../store/cartStore';
import { productApi, VendorsApi } from '../../../lib/api';
import { returnImageUrl } from '../../../config';
import type {  OrderStep, ProductPayload } from '../../../lib/types';
import PullToRefresh from '../../components/PullToRefresh';



export function reverseAddress(address: string): string {
    //capitalize each part and trim whitespace
    return address
      .split(",")
      .map(part => part.trim().replace(/\b\w/g, char => char.toUpperCase()))
      .reverse()
      .join(", ");
  }

export const CustomerHomePage: React.FC = () => {
  const navigate = useNavigate();
  const cartItems = useCartStore((state) => state.items);
  const cartCount = selectCartCount(cartItems);
  const user = useAuthStore((state) => state.user);
  const [addingProductId, setAddingProductId] = useState<string | null>(null);
  const greetingName = user?.fullName
    ? user.fullName.split(' ')[0]
    : (user?.username ?? 'User');
  const userInitial = greetingName.charAt(0).toUpperCase();

  const latestOrderQuery = useQuery<any>({
    queryKey: ['customerLatestOrder'],
    queryFn: async () => {
      const response = await productApi.getLatestOrder();
      console.log('Latest Order:', response);
      return response;
    },
    staleTime: 1000 * 60,
    refetchOnWindowFocus: false,
  });

  const pastOrdersQuery = useQuery<any>({
    queryKey: ['customerPastOrders'],
    queryFn: async () => {
      const response = await productApi.getPastOrder();
      console.log('Past Orders:', response);
      return response;
    },
    staleTime: 1000 * 60,
    refetchOnWindowFocus: false,
  });

  const normalizePastOrders = (raw: any): any[] => {
    if (!raw) return [];
    if (Array.isArray(raw)) return raw;
    return [];
  };

  const formatTime = (value: string | undefined): string => {
    if (!value) return '';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return date.toLocaleTimeString(undefined, {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const formatDate = (value: string | undefined): string => {
    if (!value) return '';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return date.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatRelativeDate = (value: string | undefined): string => {
    if (!value) return '';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    
    const now = new Date();
    
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfYesterday = new Date(startOfToday.getTime() - 24 * 60 * 60 * 1000);
    const startOf7DaysAgo = new Date(startOfToday.getTime() - 7 * 24 * 60 * 60 * 1000);
    const startOf14DaysAgo = new Date(startOfToday.getTime() - 14 * 24 * 60 * 60 * 1000);

    const timeStr = date.toLocaleTimeString(undefined, {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    }).toLowerCase();

    if (date >= startOfToday) {
      return `Today, ${timeStr}`;
    } else if (date >= startOfYesterday) {
      return `Yesterday, ${timeStr}`;
    } else if (date >= startOf7DaysAgo) {
      const diffDays = Math.floor((startOfToday.getTime() - date.getTime()) / (24 * 60 * 60 * 1000)) + 1;
      return `${diffDays} days ago, ${timeStr}`;
    } else if (date >= startOf14DaysAgo) {
      return `Last Week, ${timeStr}`;
    } else {
      const weeks = Math.floor((startOfToday.getTime() - date.getTime()) / (7 * 24 * 60 * 60 * 1000)) + 1;
      return `${weeks} Weeks Ago, ${timeStr}`;
    }
  };

  const formatStatus = (status: string | undefined): string => {
    if (!status) return 'New';
    const s = status.toLowerCase().trim();
    if (s === 'new' || s === 'pending') return 'Received';
    if (s === 'preparing') return 'Preparing';
    if (s === 'on_the_way' || s === 'on the way') return 'On the Way';
    if (s === 'delivered' || s === 'completed') return 'Delivered';
    if (s === 'cancelled') return 'Cancelled';
    return status.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  };

  const getPastOrderImageUrl = (order: any): string => {
    if (!order?.imageURL) return '/logo.png';
    return returnImageUrl(order.imageURL);
  };

  const getPastOrderDisplayNumber = (order: any): string => order.orderNo ?? order.orderID ?? '';
  const getPastOrderRouteId = (order: any): string => order.orderID ?? '';
  const getPastOrderLabel = (order: any): string => order.productName ?? '';
  const getPastOrderStatus = (order: any): string => {
    return formatStatus(order.orderStatus ?? 'Unknown');
  };
 
  const getPastOrderPrice = (order: any): number => Number(order.amount ?? 0);
  const getPastOrderDate = (order: any): string => {
    return formatRelativeDate(order?.orderDate ?? order?.date);
  };

  const formatEstimateDelivery = (order: any): string => {
    if (!order?.deliveryDurationType || order?.deliveryDurationLength === undefined) return '';
    return `${order.deliveryDurationLength} ${order.deliveryDurationType}`;
  };

  const mapStatusToStepKey = (status: string): string => {
    const normalized = status.trim().toLowerCase();
    if (normalized === 'new' || normalized === 'pending') return 'confirmed';
    if (normalized === 'confirmed') return 'preparing';
    if (normalized.includes('prepare')) return 'preparing';
    if (normalized.includes('way') || normalized.includes('on the way') || normalized.includes('ongoing')) return 'on the way';
    if (normalized.includes('deliver') || normalized.includes('completed')) return 'delivered';
    return 'confirmed';
  };

  const getStatusBadgeStyles = (status: string) => {
    const s = status.toLowerCase().trim();
    if (s === 'received' || s === 'new' || s === 'pending') {
      return {
        pill: 'bg-yellow-50 text-yellow-700 border border-yellow-100',
        dot: 'bg-yellow-500',
      };
    }
    if (s === 'preparing') {
      return {
        pill: 'bg-amber-50 text-amber-600 border border-amber-100',
        dot: 'bg-amber-500',
      };
    }
    if (s === 'on the way' || s === 'on_the_way' || s === 'ongoing') {
      return {
        pill: 'bg-primary/10 text-primary border border-primary/20',
        dot: 'bg-primary',
      };
    }
    if (s === 'delivered' || s === 'completed') {
      return {
        pill: 'bg-green-50 text-green-700 border border-green-100',
        dot: 'bg-green-600',
      };
    }
    if (s === 'cancelled') {
      return {
        pill: 'bg-rose-50 text-rose-600 border border-rose-100',
        dot: 'bg-rose-500',
      };
    }
    return {
      pill: 'bg-gray-50 text-gray-600 border border-gray-100',
      dot: 'bg-gray-400',
    };
  };

  const getLatestStatus = (order: any): string => {
    if (order?.tracking && Array.isArray(order.tracking) && order.tracking.length > 0) {
      const latest = order.tracking[order.tracking.length - 1];
      if (latest && latest.status) {
        return latest.status;
      }
    }
    return order?.orderStatus ?? order?.status ?? 'new';
  };

  const buildFallbackOrderSteps = (order: any): OrderStep[] => {
    const currentStep = mapStatusToStepKey(getLatestStatus(order));
    const stepKeys = ['confirmed', 'preparing', 'on the way', 'delivered'];
    const displayLabels: Record<string, string> = {
      confirmed: 'Received',
      preparing: 'Preparing',
      'on the way': 'On the way',
      delivered: 'Delivered',
    };
    const currentIndex = stepKeys.indexOf(currentStep);

    return stepKeys.map((key, index) => {
      const isCompleted = index <= currentIndex;
      const isActive = index === currentIndex + 1 && currentIndex < stepKeys.length - 1;
      return {
        label: displayLabels[key],
        completed: isCompleted,
        active: isActive,
        time: '',
      };
    });
  };

  const getProgressWidth = (steps: OrderStep[]) => {
    const totalSteps = steps.length;
    if (totalSteps <= 1) return '0%';
    const completedCount = steps.filter(s => s.completed).length;
    if (completedCount === 0) return '0%';
    if (completedCount === totalSteps) return '75%';
    
    return `${((completedCount - 1) / (totalSteps - 1)) * 75}%`;
  };

  const latestOrder = latestOrderQuery.data;
  const pastOrders = normalizePastOrders(pastOrdersQuery.data);
  
  const { data: relatedProducts = [], isLoading: relatedProductsLoading } = useQuery<ProductPayload[]>({
    queryKey: ['relatedProducts', latestOrder?.orderID],
    queryFn: async () => {
      const response = await productApi.getRelatedProducts(latestOrder?.orderID, 1, 10);
      console.log('Related Products Response:', response);
      return response || [];
    },
    staleTime: 1000 * 60,
    refetchOnWindowFocus: false,
  });

  const latestOrderSteps: OrderStep[] =
    Array.isArray(latestOrder?.steps) && latestOrder.steps.length
      ? latestOrder.steps
      : buildFallbackOrderSteps(latestOrder);
  const handleRefresh = async () => {
    await Promise.all([
      latestOrderQuery.refetch(),
      pastOrdersQuery.refetch(),
    ]);
  };

  

  return (
    <PullToRefresh onRefresh={handleRefresh}>
      <div className="min-h-screen bg-background text-foreground font-sans antialiased pb-24">
      {/* --- Header --- */}
      <header className="px-4 pt-5 pb-3 flex items-start justify-between sticky top-0 bg-background z-40">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center border border-border shadow-sm">
            <span className="text-primary font-bold text-lg">{userInitial}</span>
          </div>
          <div>
          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xl font-bold text-foreground"
          >
            Hello, {greetingName}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-xs text-foreground/60 mt-1"
          >
            What would you like to get today?
          </motion.p>
          </div>
        </div>

        <motion.button
          whileTap={{ scale: 0.9 }}
          className="relative p-2 rounded-full bg-white border border-border shadow-sm"
        >
          <Bell className="w-4 h-4 text-foreground" />
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary text-white text-[9px] font-bold rounded-full flex items-center justify-center border border-white">
            {2}
          </span>
        </motion.button>
      </header>

      {/* --- Main Content --- */}
      <div className="px-3 space-y-3.5">
        
        {/* --- Latest Order Card --- */}
        {latestOrderQuery.isLoading ? (
          <div className="bg-white rounded-2xl p-4 shadow-xs border border-border/50 animate-pulse">
            <div className="flex items-center justify-between mb-4">
              <div className="h-5 w-28 bg-gray-200 rounded-md" />
              <div className="h-4 w-16 bg-gray-200 rounded-full" />
            </div>
            <div className="flex items-start justify-between gap-3 mb-6">
              <div className="flex-1 space-y-2">
                <div className="h-3 w-24 bg-gray-200 rounded-md" />
                <div className="h-3 w-40 bg-gray-200 rounded-md" />
                <div className="h-6 w-32 bg-gray-200 rounded-md mt-2" />
              </div>
              <div className="w-20 h-20 bg-gray-200 rounded-xl shrink-0" />
            </div>
            <div className="flex justify-between mb-6 px-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex flex-col items-center space-y-2 flex-1">
                  <div className="w-8 h-8 rounded-full bg-gray-200" />
                  <div className="h-2 w-12 bg-gray-200 rounded-md" />
                </div>
              ))}
            </div>
            <div className="pt-3 border-t border-border/50 grid grid-cols-3 gap-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="space-y-1.5">
                  <div className="h-2 w-10 bg-gray-200 rounded-md" />
                  <div className="h-3 w-16 bg-gray-200 rounded-md" />
                </div>
              ))}
            </div>
          </div>
        ) : !latestOrder ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl p-6 text-center border border-border/50 shadow-xs flex flex-col items-center justify-center"
          >
            <div className="p-3 bg-primary/5 rounded-full text-primary mb-2.5">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-sm text-foreground">No active orders</h3>
            <p className="text-xs text-foreground/40 mt-1 max-w-[200px]">
              You don't have any ongoing deliveries at the moment.
            </p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl p-4 shadow-xs border border-border/50"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <h2 className="font-bold text-base text-foreground">Latest Order</h2>
                {(() => {
                  const statusStr = formatStatus(getLatestStatus(latestOrder));
                  const badgeStyles = getStatusBadgeStyles(statusStr);
                  return (
                    <span className={`inline-flex items-center shrink-0 text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${badgeStyles.pill}`}>
                      <span className={`w-1 h-1 rounded-full mr-1 shrink-0 ${badgeStyles.dot}`}></span>
                      {statusStr}
                    </span>
                  );
                })()}
              </div>
              <button
                onClick={() => navigate('/customer/orders')}
                className="text-primary text-xs font-semibold flex items-center gap-1 hover:underline"
              >
                View all orders <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Order Info & Illustration */}
            <div className="flex items-start justify-between gap-3 mb-4">
              <div className="flex-1 min-w-0">
                <p className="max-w-16 truncate text-[10px] text-foreground/70 font-medium">Order #{latestOrder?.orderNo ?? latestOrder?.orderID ?? 'KR1024'}</p>
                <p className="text-[10px] text-foreground/50 mt-0.5">{formatRelativeDate(latestOrder?.orderDate ?? latestOrder?.date)} • {(latestOrder?.orderItems?.length ?? latestOrder?.itemCount ?? 0)} items</p>
                <h3 className="text-xl font-bold text-foreground mt-1.5">
                  <span className="text-xl font-bold text-foreground">KES</span>{' '}
                  <span className="text-xl font-bold text-foreground">{(latestOrder?.total ?? latestOrder?.amount ?? 0).toLocaleString() ?? '--'}</span>
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[11px] text-foreground/50">Paid via {latestOrder?.paymentMethod ? latestOrder.paymentMethod.toUpperCase() : '—'}</span>
                </div>
                <button
                  onClick={() => navigate(`/customer/orders/${encodeURIComponent(latestOrder?.orderID ?? 'KR1024')}`)}
                  className="text-primary text-xs font-semibold mt-2.5 flex items-center gap-1"
                >
                  View order details <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
              
              <div className="w-24 h-24 shrink-0 relative">
                <img
                  src="/shopping-bag.png"
                  alt="Groceries"
                  className="w-full h-full object-contain drop-shadow-sm"
                />
              </div>
            </div>

            {/* Stepper */}
            <div className="relative flex items-start justify-between mb-4 px-1 pt-1">

              {/* Background line */}
              <div className="absolute top-5 left-[12.5%] right-[12.5%] h-0.5 bg-border rounded-full" />

              {/* Active progress */}
              <div 
                className="absolute top-5 left-[12.5%] h-0.5 bg-primary rounded-full transition-all duration-500" 
                style={{ width: getProgressWidth(latestOrderSteps) }}
              />

              {latestOrderSteps.map((step, index) => (
                <div
                  key={index}
                  className="relative z-10 flex flex-1 flex-col items-center"
                >
                  <div
                    className={`flex items-center justify-center rounded-full border-2 ${
                      step.completed
                        ? 'w-8 h-8 bg-primary border-primary text-white'
                        : step.active
                          ? 'w-8 h-8 bg-white border-primary text-primary'
                          : 'w-8 h-8 bg-white border-gray-200 text-gray-300'
                    }`}
                  >
                    {step.completed ? (
                      <Check className="w-3.5 h-3.5" />
                    ) : (
                      <ShoppingBag className="w-3.5 h-3.5" />
                    )}
                  </div>

                  <span
                    className={`text-[10px] font-medium mt-1.5 ${
                      step.active || step.completed
                        ? 'text-primary'
                        : 'text-gray-400'
                    }`}
                  >
                    {step.label}
                  </span>

                  {step.time && (
                    <span className="text-[9px] text-gray-400 mt-0.5">
                      {step.time}
                    </span>
                  )}
                </div>
              ))}
            </div>

            {/* Footer Details */}
            <div className="pt-3 border-t border-border/50 grid grid-cols-3 gap-1.5">
              <div className="col-span-1 flex flex-col items-center justify-center gap-2 w-full text-center">
                <div className="w-7 h-7 bg-primary/5 rounded-full flex items-center justify-center shrink-0">
                  <MapPin className="w-3.5 h-3.5 text-primary" />
                </div>
                <div className="w-full">
                  <p className="text-[9px] text-foreground/50 font-medium">Deliver to</p>
                  <p className="text-xs font-bold text-foreground max-w-full truncate leading-tight capitalize">{reverseAddress(latestOrder?.extraData.location.address ?? '')}</p>
                  <p className="text-[9px] text-foreground/40 max-w-full truncate">{latestOrder?.extraData.location.city ?? ''}</p>
                </div>
              </div>
              
              <div className="col-span-1 flex flex-col items-center justify-center gap-2 w-full text-center border-x border-border px-2">
                <div className="w-7 h-7 bg-primary/5 rounded-full flex items-center justify-center shrink-0">
                  <Clock className="w-3.5 h-3.5 text-primary" />
                </div>
                <div className="w-full">
                  <p className="text-[9px] text-foreground/50 font-medium">Est. delivery</p>
                  <p className="text-xs font-bold text-primary">{formatEstimateDelivery(latestOrder)}</p>
                </div>
              </div>

              <div className="col-span-1 flex flex-col items-center justify-center gap-2 w-full text-center">
                <div className="w-7 h-7 bg-primary/5 rounded-full flex items-center justify-center shrink-0">
                  <Wallet className="w-3.5 h-3.5 text-primary" />
                </div>
                <div className="w-full">
                  <p className="text-[9px] text-foreground/50 font-medium">Payment</p>
                  <p className="text-xs font-bold text-foreground capitalize">{latestOrder?.paymentMethod ?? ''}</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* --- Past Orders --- */}
        <section className='bg-white rounded-2xl shadow-sm border border-border/50 p-3.5'>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-base text-foreground">Past Orders</h3>
            <button onClick={()=>navigate("/customer/orders")} className="text-primary text-xs font-semibold flex items-center gap-1">
              See all <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="bg-white rounded-lg border border-border/50 overflow-hidden divide-y divide-border/50">
            {pastOrdersQuery.isLoading ? (
              <div className="divide-y divide-border/50 animate-pulse">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="p-3.5 flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-gray-200 shrink-0" />
                    <div className="flex-1 min-w-0 space-y-2">
                      <div className="h-3 w-16 bg-gray-200 rounded-md" />
                      <div className="h-3.5 w-24 bg-gray-200 rounded-md" />
                      <div className="h-2.5 w-20 bg-gray-200 rounded-md" />
                    </div>
                    <div className="text-right space-y-1.5 flex-1">
                      <div className="h-3.5 w-16 bg-gray-200 rounded-md ml-auto" />
                      <div className="h-4 w-12 bg-gray-200 rounded-full ml-auto" />
                    </div>
                  </div>
                ))}
              </div>
            ) : pastOrders.length === 0 ? (
              <div className="p-6 text-center flex flex-col items-center justify-center">
                <div className="p-3 bg-primary/5 rounded-full text-primary mb-2">
                  <Clock className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-xs text-foreground">No past orders</h4>
                <p className="text-[11px] text-foreground/45 mt-0.5">
                  Your order history is empty.
                </p>
              </div>
            ) : (
              pastOrders.map((order, idx) => (
                <motion.div
                  key={getPastOrderRouteId(order) || getPastOrderDisplayNumber(order)}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + idx * 0.1 }}
                  onClick={() => navigate(`/customer/orders/${encodeURIComponent(getPastOrderRouteId(order))}`)}
                  role="button"
                  tabIndex={0}
                  className="p-3.5 flex items-center gap-3 cursor-pointer active:bg-secondary/40 transition-colors"
                >
                  {/* Image */}
                  <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0 bg-gray-100">
                      <img src={getPastOrderImageUrl(order)} alt={getPastOrderLabel(order)} className="w-full h-full object-cover" />
                  </div>

                  {/* Details */}
                  <div className="min-w-0">
                    <p className="max-w-16 truncate font-bold text-[10px] text-foreground">{getPastOrderDisplayNumber(order)}</p>
                    <p className="text-[11px] text-foreground/60 truncate">{getPastOrderLabel(order)}</p>
                    <p className="text-[10px] text-foreground/40 mt-0.5">{getPastOrderDate(order)}</p>
                  </div>

                  {/* Price & Status */}
                  <div className="text-right flex-1 ">
                      <p className="font-bold text-[10px] text-foreground">
                        <span className="text-[9px] font-semibold text-foreground/60">KES</span>{' '}
                        <span className="text-[10px] font-bold text-foreground">{getPastOrderPrice(order).toLocaleString()}</span>
                      </p>
                    {(() => {
                      const statusStr = getPastOrderStatus(order);
                      const badgeStyles = getStatusBadgeStyles(statusStr);
                      return (
                        <span className={`inline-flex items-center shrink-0 text-[9px] font-bold px-1.5 py-0.5 rounded-full mt-1 ${badgeStyles.pill}`}>
                          <span className={`w-1 h-1 rounded-full mr-1 shrink-0 ${badgeStyles.dot}`}></span>
                          {statusStr}
                        </span>
                      );
                    })()}
                  </div>

                  {/* Reorder Button */}
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-primary text-[10px] font-semibold h-7 px-2.5 border-primary/20 hover:bg-primary/5 gap-1 shrink-0"
                  >
                    <RotateCw className="w-3 h-3" /> Reorder
                  </Button>
                </motion.div>
              ))
            )}
          </div>
        </section>

        {/* --- Recommendations --- */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-foreground">You may also be interested in</h3>
            <button className="text-primary text-xs font-semibold flex items-center gap-1">
              See all <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide -mx-3 px-3">
            {relatedProductsLoading ? (
              // Loading skeleton
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="min-w-36 bg-white rounded-2xl p-2 border border-border/50 shadow-sm animate-pulse">
                  <div className="w-full h-20 rounded-lg bg-gray-200 mb-2.5" />
                  <div className="h-3 w-20 bg-gray-200 rounded-md mb-1.5" />
                  <div className="h-2.5 w-16 bg-gray-200 rounded-md" />
                </div>
              ))
            ) : relatedProducts.length === 0 ? (
              <div className="text-center py-6 text-foreground/40 text-xs">
                No recommendations available
              </div>
            ) : (
              relatedProducts.map((product, idx) => {
                const variant = product.variants?.[0];
                if (!variant) return null;
                
                const imageId = variant.images?.[0];
                const imageUrl = (typeof imageId === 'string') ? returnImageUrl(imageId) : '/logo.png';
                const price = variant.price;
                const unit = variant.unit || 'Piece';
                const productId = product.productID || product.name;
                const variantId = variant.variantID;
                const ownerId = product.ownerID;
                
                const handleAddToCart = async () => {
                  if (!ownerId || !variantId) return;

                  setAddingProductId(productId);
                  try {
                    const vendorDetails = await VendorsApi.getVendorsDetails(ownerId);
                    const vendorName = vendorDetails?.vendorName || vendorDetails?.name || product.name || 'Vendor';
                    const location = vendorDetails?.location;
                    const pickupLocation = location ? {
                      latitude: location.latitude,
                      longitude: location.longitude,
                      address: location.address || '',
                      city: location.city || '',
                      country: location.country || '',
                      postalCode: location.postalCode || location.postcode || '',
                    } : undefined;

                    const cartStore = useCartStore.getState();
                    cartStore.addItem({
                      id: variantId,
                      name: product.name,
                      store: vendorName,
                      price: price,
                      image: imageUrl,
                      productID: productId,
                      variantID: variantId,
                      vendorId: ownerId,
                      vendorName: vendorName,
                      pickupLocation: pickupLocation,
                    });
                  } catch (error) {
                    console.error('Failed to fetch vendor details:', error);
                    const cartStore = useCartStore.getState();
                    cartStore.addItem({
                      id: variantId,
                      name: product.name,
                      store: product.name || 'Vendor',
                      price: price,
                      image: imageUrl,
                      productID: productId,
                      variantID: variantId,
                      vendorId: ownerId,
                      vendorName: product.name || 'Vendor',
                    });
                  } finally {
                    setAddingProductId(null);
                  }
                };

                 return (
                   <motion.div
                     key={variantId || idx}
                     initial={{ opacity: 0, scale: 0.95 }}
                     animate={{ opacity: 1, scale: 1 }}
                     transition={{ delay: 0.6 + idx * 0.1 }}
                     whileTap={{ scale: 0.98 }}
                     className="min-w-36 bg-white rounded-2xl p-2 border border-border/50 shadow-sm flex flex-col items-start text-start"
                   >
                     <div className="w-full h-20 rounded-lg overflow-hidden mb-2.5 bg-gray-100">
                       <img src={imageUrl} alt={product.name} className="w-full h-full object-cover" />
                     </div>
                     <h4 className="font-bold text-xs text-foreground line-clamp-1">{product.name}</h4>
                     <p className="text-[11px] text-foreground/50 mt-0.5">
                       KES {price.toLocaleString()} {unit}
                     </p>
                     <Button
                       variant="ghost"
                       onClick={handleAddToCart}
                       disabled={addingProductId === productId}
                       className="mt-2.5 w-full bg-primary/5 text-primary hover:bg-primary/10 rounded-lg h-7 text-[10px] font-bold px-2 py-0"
                     >
                       {addingProductId === productId ? (
                         <span>Adding...</span>
                       ) : (
                         <>
                           <ShoppingCart className="w-3.5 h-3.5 mr-1" /> Buy
                         </>
                       )}
                     </Button>
                   </motion.div>
                 );
              })
            )}
          </div>
        </section>
      </div>

      {/* --- Bottom Navigation --- */}
      <BottomNav cartCount={cartCount} />
    </div>
    </PullToRefresh>
  );
};