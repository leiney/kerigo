import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  ArrowLeft, 
  Headphones, 
  MapPin, 
  Phone, 
  ChevronRight, 
  Clock, 
  Store,
  Check,
  Wallet,
  ShoppingBag
} from 'lucide-react';
import { Button, Badge } from '@stackloop/ui';
import { motion } from 'framer-motion';
import { productApi } from '../../../lib/api';
import { returnImageUrl } from '../../../config';
import PullToRefresh from '../../components/PullToRefresh';
import { reverseAddress } from './CustomerOrderPage';
import { OrderStep } from '@/lib/types';

type OrderDetailData = any;

const formatMoney = (amount: number | string | undefined): string => {
  if (amount === undefined || amount === null) return '0.00';
  const num = typeof amount === 'number' ? amount : parseFloat(amount);
  if (isNaN(num)) return '0.00';
  return num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

const OrderDetailsPage: React.FC = () => {
  const navigate = useNavigate();
  const { orderId } = useParams();
  const [orderDetails, setOrderDetails] = useState<OrderDetailData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchDetails = async (isMounted: boolean) => {
    try {
      if (!orderId) {
        return;
      }
      const data = await productApi.getOrderDetails(orderId);
      console.log('OrderDetails raw response:', data);

      const orderItemsList = data.orderItems || [];
      const itemsWithDetails = orderItemsList.map((item: any) => {
        const imageId = item.imageURL || item.variant?.images?.[0];
        const imageUrl = returnImageUrl(imageId);

        return {
          id: item.variantID || item.productID,
          productID: item.productID,
          variantID: item.variantID,
          quantity: item.quantity,
          name: item.name || 'Product',
          description: item.variant?.unit ? `Unit: ${item.variant.unit}` : '',
          price: item.variant?.price ?? item.price ?? 0,
          imageUrl: imageUrl,
        };
      });

      const normalized = {
        ...data,
        reference: data.orderNo ?? data.reference ?? data.orderID ?? '',
        storeName: data.storeName ?? 'Kerigo Store',
        storeCategory: data.storeCategory ?? 'Groceries',
        status: data.orderStatus ?? data.status ?? 'New',
        estimatedDelivery: data.estimatedDelivery ?? (data.deliveryDurationLength ? `${data.deliveryDurationLength} ${data.deliveryDurationType}` : '2 days'),
        deliveryTime: data.deliveryTime ?? '',
        address: data.address ?? 'No address provided',
        addressNote: data.addressNote ?? '',
        rider: data.rider ?? null,
        items: itemsWithDetails,
        summary: data.summary ?? {
          subtotal: data.subTotal ?? 0,
          deliveryFee: data.shippingCharges ?? 0,
          platformFee: 0,
          total: data.total ?? 0,
        },
        paymentMethod: data.paymentMethod ?? 'M-Pesa',
        placedAt: data.placedAt ?? (data.orderDate ? new Date(data.orderDate).toLocaleString() : ''),
      };

      if (isMounted) {
        setOrderDetails(normalized);
      }
    } catch (err) {
      console.error('Failed to load order details', err);
    } finally {
      if (isMounted) {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    fetchDetails(isMounted);
    return () => {
      isMounted = false;
    };
  }, [orderId]);

  const handleRefresh = async () => {
    await fetchDetails(true);
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

  const mapStatusToStepKey = (status: string): string => {
    const normalized = status.trim().toLowerCase();
    if (normalized === 'new' || normalized === 'pending') return 'confirmed';
    if (normalized === 'confirmed') return 'preparing';
    if (normalized.includes('prepare')) return 'preparing';
    if (normalized.includes('way') || normalized.includes('on the way') || normalized.includes('ongoing')) return 'on the way';
    if (normalized.includes('deliver') || normalized.includes('completed')) return 'delivered';
    return 'confirmed';
  }; 
  
  const getLatestStatus = (order: any): string => {
    if (order?.tracking && Array.isArray(order.tracking) && order.tracking.length > 0) {
      const latest = order.tracking[order.tracking.length - 1];
      if (latest && latest.status) {
        return latest.status;
      }
    }
    return order?.status ?? order?.orderStatus ?? 'new';
  };

  const buildFallbackOrderSteps = (order: any): OrderStep[] => {
    const currentStep = mapStatusToStepKey(getLatestStatus(order));
    const stepKeys = ['confirmed', 'preparing', 'on the way', 'delivered'];
    const displayLabels: Record<string, string> = {
      confirmed: 'Confirmed',
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

  const orderSteps: OrderStep[] = buildFallbackOrderSteps(orderDetails);

  if (isLoading || !orderDetails) {
    return (
      <div className="min-h-screen bg-background text-foreground pb-24 font-sans">
        {/* --- Header --- */}
        <header className="px-4 pt-5 pb-3 flex items-center justify-between z-40">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate(-1)} className="p-1.5 -ml-1.5 rounded-full hover:bg-secondary">
              <ArrowLeft className="w-5 h-5 text-foreground" />
            </button>
            <div className="h-5 w-28 bg-gray-200 rounded animate-pulse" />
          </div>
          <div className="h-5 w-12 bg-gray-200 rounded animate-pulse" />
        </header>

        <div className="px-4 space-y-4 mt-2 animate-pulse">
          {/* Store status card skeleton */}
          <div className="bg-white rounded-2xl p-4 border border-border/50 h-28" />

          {/* Map/Delivery status card skeleton */}
          <div className="bg-white rounded-2xl p-4 border border-border/50 h-36" />

          {/* Items card skeleton */}
          <div className="bg-white rounded-2xl p-4 border border-border/50 space-y-4">
            <div className="h-4 w-20 bg-gray-200 rounded" />
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded bg-gray-200" />
              <div className="flex-1 space-y-2">
                <div className="h-3 w-32 bg-gray-200 rounded" />
                <div className="h-2.5 w-16 bg-gray-200 rounded" />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded bg-gray-200" />
              <div className="flex-1 space-y-2">
                <div className="h-3 w-40 bg-gray-200 rounded" />
                <div className="h-2.5 w-20 bg-gray-200 rounded" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <PullToRefresh onRefresh={handleRefresh}>
      <div className="min-h-screen bg-background text-foreground pb-24 font-sans">
      {/* --- Header --- */}
      <header className="px-4 pt-5 pb-3 flex items-center justify-between sticky top-0 bg-background z-40 border-b border-transparent">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-1.5 -ml-1.5 rounded-full hover:bg-secondary">
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold leading-tight">Order Details</h1>
              {(() => {
                const statusStr = formatStatus(getLatestStatus(orderDetails));
                const badgeStyles = getStatusBadgeStyles(statusStr);
                return (
                  <span className={`inline-flex items-center shrink-0 text-[9px] font-bold px-1.5 py-0.5 rounded-full ${badgeStyles.pill}`}>
                    <span className={`w-1 h-1 rounded-full mr-1 shrink-0 ${badgeStyles.dot}`}></span>
                    {statusStr}
                  </span>
                );
              })()}
            </div>
            <p className="text-[11px] text-foreground/50 mt-0.5">Order #{orderDetails.reference}</p>
          </div>
        </div>
        <button className="flex items-center gap-1 text-primary text-xs font-semibold">
          <Headphones className="w-4 h-4" />
          Help
        </button>
      </header>

      <div className="px-4 space-y-3 mt-2">
        
        {/* --- Store Status Card --- 
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-3 border border-border/50 shadow-sm flex items-center justify-between"
        >
          <div className="flex items-start gap-2.5">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center overflow-hidden">
              <img src="/store.png" alt={orderDetails.storeName} className="w-full h-full object-cover" />
            </div>
            <div>
              <h3 className="font-bold text-sm leading-tight">{orderDetails.storeName}</h3>
              <p className="text-[11px] text-foreground/50 mt-0.5">{orderDetails.storeCategory}</p>
              <button className="text-primary text-[11px] font-semibold mt-0.5 flex items-center gap-1">
                View Store <ChevronRight className="w-2.5 h-2.5" />
              </button>
            </div>
          </div>
          <div className="text-right">
            <Badge className="bg-primary/10 text-primary text-[10px] px-2 py-0.5 rounded-full mb-1">
              <span className="w-1.5 h-1.5 bg-primary rounded-full mr-1.5 inline-block"></span>
              {orderDetails.status}
            </Badge>
            <div className="mt-1">
              <p className="text-[11px] text-foreground/50">Estimated delivery</p>
              <p className="text-base font-bold text-primary leading-none">{orderDetails.estimatedDelivery} <span className="text-[11px] font-medium text-foreground/40">{orderDetails.deliveryTime}</span></p>
            </div>
          </div>
        </motion.div>
        */}
        {/* --- Address Card --- */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl p-3 border border-border/50 shadow-sm"
        >
          <div className="flex items-center gap-2.5 mb-2">
            <div className="w-5 h-5 bg-primary/10 rounded-full flex items-center justify-center">
              <MapPin className="w-3.5 h-3.5 text-primary" />
            </div>
            <span className="text-xs font-bold">Delivering to</span>
            <Badge className="bg-primary/5 text-primary text-[10px] px-1.5 py-0">Home</Badge>
          </div>
          <div className="ml-7 flex justify-between items-start gap-3">
            <div>
              <p className="text-xs font-medium">{reverseAddress(orderDetails.extraData.location.address)}</p>
              <p className="text-[11px] text-foreground/50 mt-0.5">{orderDetails.extraData.location.city}</p>
            </div>
            <button className="hidden text-primary text-[11px] font-semibold shrink-0">Change</button>
          </div>

         
           {/* Stepper */}
          <div className="relative pt-2 flex items-start justify-between mb-4 px-1">
            {/* Background line */}
            <div className="absolute top-5 left-[12.5%] right-[12.5%] h-0.5 bg-border rounded-full" />
            {/* Active progress */}
            <div 
              className="absolute top-5 left-[12.5%] h-0.5 bg-primary rounded-full transition-all duration-500" 
              style={{ width: getProgressWidth(orderSteps) }}
            />
            {orderSteps.map((step, index) => (
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
        </motion.div>

        {/* --- Rider Card --- */}
        {orderDetails.rider && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl p-3 border border-border/50 shadow-sm flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gray-200 border border-white shadow-sm flex items-center justify-center text-sm font-bold text-foreground/80">
                {orderDetails.rider.avatarUrl ? (
                  <img src={orderDetails.rider.avatarUrl} alt={orderDetails.rider.name ?? 'Rider'} className="w-full h-full object-cover rounded-full" />
                ) : (
                  <span>{orderDetails.rider.name?.charAt(0).toUpperCase() ?? 'R'}</span>
                )}
              </div>
              <div>
                <p className="font-bold text-sm">{orderDetails.rider.name}</p>
                <p className="text-[11px] text-foreground/50">{orderDetails.rider.role}</p>
                <div className="flex items-center gap-1 mt-0.5">
                  <span className="text-yellow-500 text-[10px]">★</span>
                  <span className="text-[11px] font-bold">{orderDetails.rider.rating}</span>
                  <span className="text-[10px] text-foreground/40">({orderDetails.rider.reviews} reviews)</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  const riderPhone = orderDetails.rider?.phoneNo ?? orderDetails.extraData?.rider?.phoneNo ?? orderDetails.extraData?.customer?.phoneNo ?? '';
                  if (riderPhone) window.location.href = `tel:${riderPhone}`;
                }}
                className="border-primary/30 text-primary h-10 px-4 rounded-lg gap-1.5 text-[11px] font-semibold"
              >
                <Phone className="w-3.5 h-3.5" /> Call
              </Button>
            </div>
          </motion.div>
        )}

        {/* --- Order Items --- */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl border border-border/50 shadow-sm overflow-hidden"
        >

        

          <div className="p-3 border-b border-border/50 flex justify-between items-center">
            <h3 className="font-bold text-sm">Order Items</h3>
            <span className="text-[11px] text-foreground/50">{orderDetails.items.length} items</span>
          </div>

          <div className="divide-y divide-border/50">
            {orderDetails.items.map((item : any) => (
              <div key={item.id} className="p-3 flex items-center gap-3">
                <div className="w-10 h-10 bg-secondary rounded-lg overflow-hidden shrink-0">
                  <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span className="bg-primary/10 text-primary text-[9px] font-bold px-1.5 py-0.5 rounded">{item.quantity}x</span>
                    <p className="text-xs font-bold">{item.name}</p>
                  </div>
                  <p className="text-[11px] text-foreground/50 line-clamp-1">{item.description && item.description.length > 50 ? `${item.description.slice(0, 50)}...` : item.description}</p>
                </div>
                <p className="text-xs font-bold">KES {formatMoney(item.price)}</p>
              </div>
            ))}
          </div>

          {/* Price Breakdown */}
          <div className="p-3 space-y-1.5 bg-secondary/30">
            <div className="flex justify-between text-xs">
              <span className="text-foreground/60">Subtotal</span>
              <span className="font-medium">KES {formatMoney(orderDetails.summary.subtotal)}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-foreground/60">Delivery Fee</span>
              <span className="font-medium">KES {formatMoney(orderDetails.summary.deliveryFee)}</span>
            </div>
            
            <div className="h-px bg-border/50 my-1.5" />
            <div className="flex justify-between text-sm font-bold">
              <span>Total</span>
              <span className="text-primary">KES {formatMoney(orderDetails.summary.total)}</span>
            </div>
          </div>
        </motion.div>

        {/* --- Payment Method --- */}
        <div className="bg-white rounded-2xl p-3 border border-border/50 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-green-50 rounded-full flex items-center justify-center text-primary">
              <Wallet className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold">Payment Method</p>
              <p className="text-[11px] text-foreground/50 mt-0.5 capitalize">{orderDetails.paymentMethod}</p>
            </div>
          </div>
          <span className="text-xs font-bold">KES {formatMoney(orderDetails.summary.total)}</span>
        </div>

        {/* --- Rider contact / tracking card --- */}
        <div className="bg-white rounded-2xl p-3 border border-border/50 shadow-sm space-y-4">
          {(() => {
            const rawStatus = getLatestStatus(orderDetails).toLowerCase();
            const isDelivered = rawStatus === 'delivered' || rawStatus === 'completed';
            const riderName = orderDetails.rider?.name ?? orderDetails.extraData?.rider?.name ?? 'Your rider';
            const riderPhone = orderDetails.rider?.phoneNo ?? orderDetails.extraData?.rider?.phoneNo  ?? '';
            const riderInitial = riderName?.trim()?.charAt(0).toUpperCase() ?? 'R';
            const orderReference = encodeURIComponent(orderDetails.id ?? '');

            return (
              <>
                <div className="flex items-start gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-primary/10 flex items-center justify-center text-primary text-lg">
                    {isDelivered ? '✅' : '🚴'}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-foreground">
                      {isDelivered ? 'Order delivered' : 'Track your delivery'}
                    </p>
                    <p className="text-xs text-foreground/60 mt-1">
                      {isDelivered
                        ? 'Delivery completed successfully. View the full tracking summary.'
                        : 'Follow your rider in real time and see the latest delivery progress.'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => navigate(`/customer/track-order/${orderReference}`)}
                  className="w-full bg-primary text-white rounded-2xl py-3 text-sm font-semibold"
                >
                  {isDelivered ? 'View tracking details' : 'Track order'}
                </button>
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-base">
                      {riderInitial}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-foreground">{riderName}</p>
                      <p className="text-xs text-foreground/60 mt-1">Active delivery rider</p>
                    </div>
                  </div>
                  <button
                    disabled={!riderPhone}
                    onClick={() => {
                      if (riderPhone) window.location.href = `tel:${riderPhone}`;
                    }}
                    className={`rounded-2xl py-2 px-4 text-sm font-semibold ${riderPhone ? 'bg-primary text-white' : 'bg-border text-foreground/50 cursor-not-allowed'}`}
                  >
                    Call rider
                  </button>
                </div>
              </>
            );
          })()}
        </div>

        {/* --- Support --- */}
        <button className="w-full bg-white rounded-2xl p-3 border border-border/50 shadow-sm flex items-center justify-between group">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 bg-primary/10 rounded-full flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
              <Check className="w-3.5 h-3.5" />
            </div>
            <div className="text-left">
              <p className="text-xs font-bold">Need help with this order?</p>
              <p className="text-[11px] text-foreground/50">Get support or report an issue</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-foreground/30" />
        </button>

        <p className="text-center text-[11px] text-foreground/40 pb-4">
          Order placed on {orderDetails.placedAt}
        </p>
      </div>
    </div>
    </PullToRefresh>
  );
};

export default OrderDetailsPage;