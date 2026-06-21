import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { productApi } from '@/lib/api';
import { returnImageUrl } from '@/config';
import { Button, Badge, BottomSheet } from '@stackloop/ui';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft,
  X,
  ShoppingBag,
  MapPin,
  Truck,
  ChevronRight,
  CheckCircle2,
  XCircle,
  ShieldCheck,
  Info,
  ChevronDown,
  RotateCcw,
  Star,
  Bell,
  Clock,
  Package
} from 'lucide-react';
import BottomNav from '../../components/BottomNav';
import PullToRefresh from '../../components/PullToRefresh';

const EmptyState: React.FC<{ message: string; subMessage?: string }> = ({ message, subMessage }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 bg-white rounded-2xl border border-border/50 shadow-sm text-center">
      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-3">
        <ShoppingBag className="w-6 h-6 text-primary" />
      </div>
      <p className="text-sm font-semibold text-foreground/80">{message}</p>
      {subMessage && (
        <p className="text-xs text-foreground/45 mt-1">{subMessage}</p>
      )}
    </div>
  );
};

export const VendorOrders: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Read initial tab from state if passed, defaulting to 'new'
  const [activeTab, setActiveTab] = useState<'new' | 'preparing' | 'ready' | 'recent'>(
    location.state?.tab || 'new'
  );

  // Full-Screen Order Details Modal State
  const [selectedOrderForDetail, setSelectedOrderForDetail] = useState<any | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  // Bottom Sheet State
  const [showConfirmSheet, setShowConfirmSheet] = useState(false);
  const [showCancelSheet, setShowCancelSheet] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);

  const queryClient = useQueryClient();

  // Fetch Vendor Orders by status parameters
  const { data: newOrders = [], isLoading: isLoadingNew } = useQuery<any[]>({
    queryKey: ['vendorOrders', 'new'],
    queryFn: async () => {
      const response = await productApi.getVendorOrders({ orderStatus: 'new' });
      console.log('Fetched New Vendor Orders:', response);
      return response || [];
    },
    staleTime: 1000 * 15,
    refetchOnWindowFocus: false,
  });

  const { data: preparingOrders = [], isLoading: isLoadingPreparing } = useQuery<any[]>({
    queryKey: ['vendorOrders', 'preparing'],
    queryFn: async () => {
      const response = await productApi.getVendorOrders({ orderStatus: 'preparing' });
      console.log('Fetched Preparing Vendor Orders:', response);
      return response || [];
    },
    staleTime: 1000 * 15,
    refetchOnWindowFocus: false,
  });

  const { data: readyOrders = [], isLoading: isLoadingReady } = useQuery<any[]>({
    queryKey: ['vendorOrders', 'on_the_way'],
    queryFn: async () => {
      const response = await productApi.getVendorOrders({ orderStatus: 'on_the_way' });
      console.log('Fetched Ready Vendor Orders:', response);
      return response || [];
    },
    staleTime: 1000 * 15,
    refetchOnWindowFocus: false,
  });

  const { data: recentOrders = [], isLoading: isLoadingRecent } = useQuery<any[]>({
    queryKey: ['vendorOrders', 'recent'],
    queryFn: async () => {
      const response = await productApi.getVendorOrders({ orderStatus: 'completed,delivered,cancelled' });
      console.log('Fetched Recent Vendor Orders:', response);
      return response || [];
    },
    staleTime: 1000 * 15,
    refetchOnWindowFocus: false,
  });

  const isLoading = isLoadingNew || isLoadingPreparing || isLoadingReady || isLoadingRecent;

  const handleOpenConfirm = (order: any) => {
    setSelectedOrder(order);
    setShowConfirmSheet(true);
  };

  const handleOpenCancel = (order: any) => {
    setSelectedOrder(order);
    setShowCancelSheet(true);
  };

  const handleConfirmOrder = async () => {
    if (!selectedOrder) return;
    try {
      await productApi.updateOrderStatus(selectedOrder.orderID, 'preparing');
      queryClient.invalidateQueries({ queryKey: ['vendorOrders'] });
      setShowConfirmSheet(false);
    } catch (err) {
      console.error('Failed to confirm order:', err);
    }
  };

  const handleCancelOrder = async () => {
    if (!selectedOrder) return;
    try {
      await productApi.updateOrderStatus(selectedOrder.orderID, 'cancelled');
      queryClient.invalidateQueries({ queryKey: ['vendorOrders'] });
      setShowCancelSheet(false);
    } catch (err) {
      console.error('Failed to cancel order:', err);
    }
  };

  const getItemsText = (order: any) => {
    if (!order.orderItems || order.orderItems.length === 0) return 'No items';
    const firstItems = order.orderItems.slice(0, 3).map((item: any) => `${item.quantity}x ${item.name}`);
    let text = firstItems.join(', ');
    if (order.orderItems.length > 3) {
      text += ` + ${order.orderItems.length - 3} more items`;
    }
    return text;
  };

  const formatOrderTime = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch (e) {
      return dateStr;
    }
  };

  const renderOrderCard = (order: any, idx: number, type: 'new' | 'preparing' | 'ready') => {
    const isNew = type === 'new';
    const isPreparing = type === 'preparing';
    const isReady = type === 'ready';

    return (
      <motion.div
        key={order.orderID}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 + idx * 0.05 }}
        className={`bg-white rounded-2xl p-4 border border-border/50 shadow-sm cursor-pointer hover:border-primary/20 transition-all ${isPreparing ? 'bg-warning/5 border-warning/20' : ''
          }`}
        onClick={() => {
          setSelectedOrderForDetail(order);
          setShowDetailModal(true);
        }}
      >
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-start gap-3">
            <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${isPreparing ? 'bg-warning/15' : 'bg-primary/10'
              }`}>
              <ShoppingBag className={`w-4 h-4 ${isPreparing ? 'text-warning' : 'text-primary'}`} />
            </div>
            <div>
              <p className="font-bold text-sm">Order #{order.orderNo || order.orderID.slice(-6).toUpperCase()}</p>
              <p className="text-[11px] text-foreground/50 mt-0.5">{formatOrderTime(order.orderDate)}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="font-bold text-sm">KES {(order.subTotal || 0).toLocaleString()}</p>
            <p className="text-[11px] text-foreground/50 mt-0.5 flex items-center gap-1 justify-end">
              <MapPin className="w-3 h-3" /> {order.extraData?.distanceKm ? `${order.extraData.distanceKm.toFixed(1)} km` : 'N/A'}
            </p>
          </div>
        </div>

        <div className="flex items-start justify-between">
          <div className="min-w-0 flex-1 pr-3">
            <p className="text-xs text-foreground/70 leading-relaxed truncate">
              {getItemsText(order)}
            </p>
            <Badge
              variant={isPreparing ? 'warning' : 'success'}
              className={`text-[10px] font-semibold px-2 py-0.5 rounded-full mt-2 border-0 ${isPreparing
                  ? 'bg-warning/10 text-warning'
                  : isReady
                    ? 'bg-primary/10 text-primary'
                    : 'bg-primary/10 text-primary'
                }`}
            >
              {isReady ? 'Awaiting Rider' : order.shippingCharges > 0 ? 'Delivery' : 'Pickup'}
            </Badge>
          </div>

          <div className="flex flex-col gap-2 ml-2 shrink-0">
            {isNew && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-primary border-primary/30 hover:bg-primary/5 text-xs font-semibold h-8 px-5"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOpenConfirm(order);
                  }}
                >
                  Confirm
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-error border-error/30 hover:bg-error/5 text-xs font-semibold h-8 px-5"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOpenCancel(order);
                  }}
                >
                  Cancel
                </Button>
              </>
            )}
            {isPreparing && (
              <Button
                size="sm"
                className="text-white bg-primary hover:bg-primary/90 text-xs font-semibold h-9 px-6"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate('/vendor/mark-as-ready-assign-rider', { state: { order } });
                }}
              >
                Mark as Ready
              </Button>
            )}
            {isReady && (
              <Button
                size="sm"
                disabled
                className="text-white bg-primary hover:bg-primary/90 text-xs font-semibold h-9 px-6 opacity-65"
                onClick={(e) => e.stopPropagation()}
              >
                Awaiting Rider
              </Button>
            )}
          </div>
        </div>
      </motion.div>
    );
  };

  const renderRecentOrderRow = (order: any, idx: number) => {
    const isCompleted = order.orderStatus === 'delivered' || order.orderStatus === 'completed';
    const statusLabel = isCompleted ? 'Completed' : 'Cancelled';
    return (
      <div
        key={order.orderID}
        onClick={() => {
          setSelectedOrderForDetail(order);
          setShowDetailModal(true);
        }}
        className="flex items-center justify-between p-4 cursor-pointer hover:bg-secondary/20 transition-colors animate-fade-in"
      >
        <div>
          <p className="font-bold text-xs">#{order.orderNo || order.orderID.slice(-6).toUpperCase()}</p>
          <p className="text-[11px] text-foreground/50 mt-0.5">
            {new Date(order.orderDate).toLocaleDateString()} {formatOrderTime(order.orderDate)}
          </p>
        </div>
        <div className="text-center">
          <p className="font-bold text-xs">KES {(order.subTotal || 0).toLocaleString()}</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge
            variant={isCompleted ? 'success' : 'danger'}
            className={`${isCompleted
                ? 'bg-primary/10 text-primary'
                : 'bg-error/10 text-error'
              } text-[10px] font-semibold px-2 py-0.5 rounded-full border-0`}
          >
            {statusLabel}
          </Badge>
          <ChevronRight className="w-3.5 h-3.5 text-foreground/30" />
        </div>
      </div>
    );
  };

  const handleRefresh = async () => {
    await queryClient.invalidateQueries({ queryKey: ['vendorOrders'] });
  };

  return (
    <PullToRefresh onRefresh={handleRefresh}>
      <div className="min-h-screen bg-background text-foreground font-sans antialiased pt-20 pb-20">
      {/* --- Header --- */}
      <header className="px-4 p-4 mb-2 flex items-center justify-between border-b border-border top-0 fixed w-full bg-background z-10">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/vendor/dashboard')}
            className="p-1 -ml-1 rounded-full hover:bg-secondary transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
            <ShoppingBag className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-base font-bold text-foreground">Orders</h1>
            <p className="text-[10px] text-foreground/50">Manage your orders</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="relative p-2">
            <Bell className="w-5 h-5 text-foreground/70" />
            <span className="absolute top-1 right-1 w-4 h-4 bg-primary text-white text-[9px] font-bold rounded-full flex items-center justify-center border border-background">
              3
            </span>
          </button>
        </div>
      </header>

      {/* --- Tabs --- */}
      <section className="px-4 mb-4">
        <div className="flex bg-white rounded-xl border border-border/50 p-1">
          <button
            onClick={() => setActiveTab('new')}
            className={`flex-1 py-2 text-center text-xs font-semibold rounded-lg transition-all ${activeTab === 'new'
                ? 'bg-primary text-white shadow-sm shadow-primary/25'
                : 'text-foreground/60 hover:text-foreground'
              }`}
          >
            New ({newOrders.length})
          </button>
          <button
            onClick={() => setActiveTab('preparing')}
            className={`flex-1 py-2 text-center text-xs font-semibold rounded-lg transition-all ${activeTab === 'preparing'
                ? 'bg-primary text-white shadow-sm shadow-primary/25'
                : 'text-foreground/60 hover:text-foreground'
              }`}
          >
            Preparing ({preparingOrders.length})
          </button>
          <button
            onClick={() => setActiveTab('ready')}
            className={`flex-1 py-2 text-center text-xs font-semibold rounded-lg transition-all ${activeTab === 'ready'
                ? 'bg-primary text-white shadow-sm shadow-primary/25'
                : 'text-foreground/60 hover:text-foreground'
              }`}
          >
            Ready ({readyOrders.length})
          </button>
          <button
            onClick={() => setActiveTab('recent')}
            className={`flex-1 py-2 text-center text-xs font-semibold rounded-lg transition-all ${activeTab === 'recent'
                ? 'bg-primary text-white shadow-sm shadow-primary/25'
                : 'text-foreground/60 hover:text-foreground'
              }`}
          >
            Recent ({recentOrders.length})
          </button>
        </div>
      </section>

      <div className="space-y-4">
        {isLoading ? (
          <section className="px-4 space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-2xl p-4 border border-border/50 shadow-sm animate-pulse space-y-4">
                <div className="flex justify-between items-start">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-full bg-secondary shrink-0" />
                    <div className="space-y-2">
                      <div className="h-4 w-28 bg-secondary rounded-lg" />
                      <div className="h-3 w-16 bg-secondary rounded-lg" />
                    </div>
                  </div>
                  <div className="space-y-2 text-right">
                    <div className="h-4 w-16 bg-secondary rounded-lg" />
                    <div className="h-3 w-12 bg-secondary rounded-lg" />
                  </div>
                </div>
                <div className="space-y-2 pt-2 border-t border-border/40">
                  <div className="h-3.5 w-full bg-secondary rounded-lg" />
                  <div className="h-3 w-48 bg-secondary rounded-lg" />
                </div>
              </div>
            ))}
          </section>
        ) : (
          <>
            {activeTab === 'new' && (
              <section className="px-4">
                {newOrders.length === 0 ? (
                  <EmptyState message="No new orders" subMessage="New orders will appear here as they are placed by customers." />
                ) : (
                  <div className="space-y-3">
                    {newOrders.map((order, idx) => renderOrderCard(order, idx, 'new'))}
                  </div>
                )}
              </section>
            )}

            {activeTab === 'preparing' && (
              <section className="px-4">
                {preparingOrders.length === 0 ? (
                  <EmptyState message="No preparing orders" subMessage="Confirmed orders that you are preparing will show up here." />
                ) : (
                  <div className="space-y-3">
                    {preparingOrders.map((order, idx) => renderOrderCard(order, idx, 'preparing'))}
                  </div>
                )}
              </section>
            )}

            {activeTab === 'ready' && (
              <section className="px-4">
                {readyOrders.length === 0 ? (
                  <EmptyState message="No orders ready for pickup" subMessage="Orders marked as ready for rider collection will be listed here." />
                ) : (
                  <div className="space-y-3">
                    {readyOrders.map((order, idx) => renderOrderCard(order, idx, 'ready'))}
                  </div>
                )}
              </section>
            )}

            {activeTab === 'recent' && (
              <section className="px-4">
                {recentOrders.length === 0 ? (
                  <EmptyState message="No recent orders" subMessage="Completed and cancelled orders will be archived here." />
                ) : (
                  <div className="bg-white rounded-2xl border border-border/50 shadow-sm overflow-hidden divide-y divide-border/50">
                    {recentOrders.map((order, idx) => renderRecentOrderRow(order, idx))}
                  </div>
                )}
              </section>
            )}
          </>
        )}
      </div>

      {/* --- Bottom Navigation --- */}
      <BottomNav />

      {/* --- Bottom Sheets --- */}

      {/* 1. Confirm Order Bottom Sheet */}
      <BottomSheet
        isOpen={showConfirmSheet}
        onClose={() => setShowConfirmSheet(false)}
        className="max-h-[90vh]"
        animate={false}
      >
        <div className="pb-8 text-foreground">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-lg font-bold">
              Confirm Order #{selectedOrder?.orderNo || selectedOrder?.orderID?.slice(-6).toUpperCase()}
            </h3>
          </div>

          <p className="text-sm text-foreground/60 mb-4">
            You are about to confirm and start preparing this order.
          </p>

          {/* Customer & amount card */}
          <div className="bg-white border border-border/50 rounded-xl p-4 mb-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                <MapPin className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="font-bold text-sm">{selectedOrder?.extraData?.customer?.name || 'Customer'}</p>
                <p className="text-[11px] text-foreground/50">
                  {selectedOrder?.shippingCharges > 0 ? 'Delivery' : 'Pickup'} • {selectedOrder?.extraData?.distanceKm ? `${selectedOrder.extraData.distanceKm.toFixed(1)} km` : 'N/A'}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-bold text-sm">KES {(selectedOrder?.subTotal || 0).toLocaleString()}</p>
              <Badge variant="success" className="bg-primary/10 text-primary text-[10px] px-2 py-0.5 rounded-full mt-1 border-0">
                Paid
              </Badge>
            </div>
          </div>

          {/* Confirmation summary card */}
          <div className="bg-primary/5 border border-primary/10 rounded-xl p-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-3.5 h-3.5 text-white" />
              </div>
              <div>
                <p className="font-bold text-sm text-primary">Order will be confirmed</p>
                <p className="text-[11px] text-foreground/60 mt-0.5">The customer will be notified and the order will move to Preparing Orders.</p>
              </div>
            </div>
          </div>

          {/* What happens next */}
          <div className="bg-white border border-border/50 rounded-xl p-4 mb-6">
            <p className="text-xs font-bold text-foreground/40 uppercase tracking-wider mb-3">What happens next?</p>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-warning mt-0.5" />
                <div>
                  <p className="text-xs font-bold">Start preparing</p>
                  <p className="text-[11px] text-foreground/50">The prep timer will start once you confirm.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Truck className="w-4 h-4 text-primary mt-0.5" />
                <div>
                  <p className="text-xs font-bold">Rider assigned</p>
                  <p className="text-[11px] text-foreground/50">A delivery partner will be assigned to pickup.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Bell className="w-4 h-4 text-info mt-0.5" />
                <div>
                  <p className="text-xs font-bold">Customer notified</p>
                  <p className="text-[11px] text-foreground/50">The customer will receive order updates.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <Button className="w-full bg-primary hover:bg-primary/95 text-white font-bold py-3" onClick={handleConfirmOrder}>
              Confirm Order
            </Button>
            <Button
              variant="outline"
              className="w-full border-primary text-primary hover:bg-primary/5 font-bold py-3"
              onClick={() => setShowConfirmSheet(false)}
            >
              Go Back
            </Button>
          </div>
        </div>
      </BottomSheet>

      {/* 2. Cancel Order Bottom Sheet */}
      <BottomSheet isOpen={showCancelSheet} animate={false} onClose={() => setShowCancelSheet(false)} className="max-h-[90vh]">
        <div className="pb-8 text-foreground">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-bold text-error">Cancel Order #{selectedOrder?.orderNo || selectedOrder?.orderID?.slice(-6).toUpperCase()}</h3>
            <button onClick={() => setShowCancelSheet(false)}>
              <XCircle className="w-6 h-6 text-foreground/30" />
            </button>
          </div>

          <p className="text-sm text-foreground/60 mb-4">Canceling this order will notify the customer and process a refund.</p>

          {/* Customer & amount card */}
          <div className="bg-white border border-border/50 rounded-xl p-4 mb-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-error/10 rounded-full flex items-center justify-center">
                <ShoppingBag className="w-5 h-5 text-error" />
              </div>
              <div>
                <p className="font-bold text-sm">{selectedOrder?.extraData?.customer?.name || 'Customer'}</p>
                <p className="text-[11px] text-foreground/50">
                  {selectedOrder?.shippingCharges > 0 ? 'Delivery' : 'Pickup'} • {selectedOrder?.extraData?.distanceKm ? `${selectedOrder.extraData.distanceKm.toFixed(1)} km` : 'N/A'}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-bold text-sm">KES {(selectedOrder?.subTotal || 0).toLocaleString()}</p>
              <Badge variant="success" className="bg-primary/10 text-primary text-[10px] px-2 py-0.5 rounded-full mt-1 border-0">Paid</Badge>
            </div>
          </div>

          {/* Refund summary card */}
          <div className="bg-error/5 border border-error/10 rounded-xl p-4 mb-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-5 h-5 text-primary" />
                <div>
                  <p className="font-bold text-sm">Refund to customer</p>
                  <p className="text-[11px] text-foreground/50 mt-0.5">The full amount will be refunded to the customer.</p>
                </div>
              </div>
              <span className="font-bold text-primary text-xs ">KES {(selectedOrder?.subTotal || 0).toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-2">
              <Info className="w-5 h-5 text-primary" />
              <p className="text-[11px] text-foreground/50">Refund will be processed automatically to the original payment method.</p>
            </div>
          </div>

          <div className="mb-6">
            <label className="text-xs font-bold text-foreground/60 mb-2 block">Reason for cancellation <span className="text-foreground/40 font-normal">(optional)</span></label>
            <div className="bg-white border border-border rounded-xl px-4 py-3 flex items-center justify-between">
              <span className="text-sm text-foreground/40">Select a reason</span>
              <ChevronDown className="w-4 h-4 text-foreground/30" />
            </div>
          </div>

          <div className="space-y-3">
            <Button className="w-full bg-error hover:bg-error/95 text-white font-bold py-3 gap-2" onClick={handleCancelOrder}>
              <RotateCcw className="w-4 h-4" /> Cancel Order & Refund
            </Button>
            <Button variant="outline" className="w-full border-success text-primary hover:bg-primary/5 font-bold py-3" onClick={() => setShowCancelSheet(false)}>
              Keep Order
            </Button>
          </div>

          <p className="text-center text-[10px] text-foreground/40 mt-4 flex items-center justify-center gap-1"><Info className="w-3 h-3" /> This order will be removed from New Orders.</p>
        </div>
      </BottomSheet>

      {/* 3. Full Screen Order Details Modal */}
      <AnimatePresence>
        {showDetailModal && selectedOrderForDetail && (
          <motion.div
            initial={{ opacity: 0, y: '100%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 250 }}
            className="fixed inset-0 bg-background text-foreground z-50 overflow-y-auto flex flex-col"
          >
            {/* Header */}
            <header className="px-4 py-4 flex items-center justify-between border-b border-border bg-white sticky top-0 z-10 shrink-0">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="p-2 -ml-2 rounded-full hover:bg-secondary transition-colors"
                >
                  <ArrowLeft className="w-5 h-5 text-foreground" />
                </button>
                <div>
                  <h1 className="text-base font-bold text-foreground">Order Details</h1>
                  <p className="text-xs text-foreground/50">
                    #{selectedOrderForDetail.orderNo || selectedOrderForDetail.orderID.slice(-6).toUpperCase()}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowDetailModal(false)}
                className="p-2 -mr-2 rounded-full hover:bg-secondary transition-colors"
              >
                <X className="w-5 h-5 text-foreground/50" />
              </button>
            </header>

            {/* Content */}
            <div className="flex-1 p-4 space-y-5 pb-24">
              {/* Status & Date */}
              <div className="bg-white rounded-2xl p-4 border border-border/50 shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-xs text-foreground/45 uppercase tracking-wider font-semibold">Status</p>
                  <Badge
                    variant={
                      selectedOrderForDetail.orderStatus === 'new'
                        ? 'default'
                        : selectedOrderForDetail.orderStatus === 'preparing'
                          ? 'warning'
                          : selectedOrderForDetail.orderStatus === 'on_the_way'
                            ? 'info'
                            : selectedOrderForDetail.orderStatus === 'delivered' || selectedOrderForDetail.orderStatus === 'completed'
                              ? 'success'
                              : 'danger'
                    }
                    className="mt-1 font-bold rounded-full capitalize px-3 py-1 text-xs border-0"
                  >
                    {selectedOrderForDetail.orderStatus}
                  </Badge>
                </div>
                <div className="text-right">
                  <p className="text-xs text-foreground/45 uppercase tracking-wider font-semibold">Order Date</p>
                  <p className="text-xs font-bold text-foreground mt-1">
                    {new Date(selectedOrderForDetail.orderDate).toLocaleDateString()} {formatOrderTime(selectedOrderForDetail.orderDate)}
                  </p>
                </div>
              </div>

              {/* Customer & Location */}
              <div className="bg-white rounded-2xl p-4 border border-border/50 shadow-sm space-y-4">
                <div>
                  <p className="text-xs font-bold text-foreground/45 uppercase tracking-wider mb-2">Customer details</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                      <Star className="w-5 h-5 text-primary fill-primary" />
                    </div>
                    <div>
                      <p className="font-bold text-sm text-foreground">
                        {selectedOrderForDetail.extraData?.customer?.name || 'Customer'}
                      </p>
                      <p className="text-xs text-foreground/50 mt-0.5">
                        Distance: {selectedOrderForDetail.extraData?.distanceKm ? `${selectedOrderForDetail.extraData.distanceKm.toFixed(1)} km` : 'N/A'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-border/50">
                  <p className="text-xs font-bold text-foreground/45 uppercase tracking-wider mb-2">Shipping location</p>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                      <MapPin className="w-4 h-4 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-foreground">
                        {selectedOrderForDetail.extraData?.location?.description ||
                          selectedOrderForDetail.extraData?.location?.address ||
                          'No address description provided'}
                      </p>
                      {selectedOrderForDetail.extraData?.location?.latitude && (
                        <p className="text-[10px] text-foreground/45 mt-1 font-mono">
                          Coordinates: {selectedOrderForDetail.extraData.location.latitude.toFixed(5)}, {selectedOrderForDetail.extraData.location.longitude.toFixed(5)}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="bg-white rounded-2xl p-4 border border-border/50 shadow-sm space-y-3">
                <p className="text-xs font-bold text-foreground/45 uppercase tracking-wider mb-1">Items list</p>
                <div className="divide-y divide-border/50">
                  {selectedOrderForDetail.orderItems?.map((item: any, idx: number) => {
                    const itemImageId = item.variant?.images?.[0] || item.images?.[0];
                    const itemImageUrl = itemImageId ? returnImageUrl(itemImageId.toString()) : '/logo.png';
                    const price = item.variant?.price || item.price || 0;
                    return (
                      <div key={idx} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                        <div className="w-12 h-12 border border-border rounded-xl bg-secondary/30 overflow-hidden shrink-0 flex items-center justify-center">
                          <img src={itemImageUrl} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-sm text-foreground truncate">{item.name}</h4>
                          <p className="text-xs text-foreground/50 mt-0.5">
                            KES {price.toLocaleString()} × {item.quantity}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-sm text-foreground">
                            KES {(price * item.quantity).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Payment Summary */}
              <div className="bg-white rounded-2xl p-4 border border-border/50 shadow-sm space-y-3">
                <p className="text-xs font-bold text-foreground/45 uppercase tracking-wider mb-1">Payment summary</p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-foreground/60">
                    <span>Subtotal</span>
                    <span>KES {(selectedOrderForDetail.subTotal || 0).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-foreground/60">
                    <span>Shipping Charges</span>
                    <span>KES {(selectedOrderForDetail.shippingCharges || 0).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-foreground/60">
                    <span>Taxes</span>
                    <span>KES {(selectedOrderForDetail.tax || 0).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between font-bold text-base text-foreground pt-2 border-t border-border/50">
                    <span>Total Amount</span>
                    <span className="text-primary">KES {(selectedOrderForDetail.total || 0).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Action Bar */}
            <div className="fixed bottom-0 left-0 right-0 p-4 border-t border-border bg-white z-10 flex gap-3 shadow-lg shrink-0">
              {selectedOrderForDetail.orderStatus === 'new' && (
                <>
                  <Button
                    onClick={() => {
                      setShowDetailModal(false);
                      handleOpenConfirm(selectedOrderForDetail);
                    }}
                    className="flex-1 bg-primary hover:bg-primary/95 text-white font-bold py-3"
                  >
                    Confirm Order
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowDetailModal(false);
                      handleOpenCancel(selectedOrderForDetail);
                    }}
                    className="flex-1 border-error text-error hover:bg-error/5 font-bold py-3"
                  >
                    Cancel Order
                  </Button>
                </>
              )}
              {selectedOrderForDetail.orderStatus === 'preparing' && (
                <Button
                  onClick={() => {
                    setShowDetailModal(false);
                    navigate('/vendor/mark-as-ready-assign-rider', { state: { order: selectedOrderForDetail } });
                  }}
                  className="w-full bg-primary hover:bg-primary/95 text-white font-bold py-3"
                >
                  Mark as Ready & Assign Rider
                </Button>
              )}
              {selectedOrderForDetail.orderStatus === 'on_the_way' && (
                <Button
                  disabled
                  className="w-full bg-primary hover:bg-primary/95 text-white font-bold py-3 opacity-65 border-0"
                >
                  Awaiting Rider Collection
                </Button>
              )}
              {(selectedOrderForDetail.orderStatus === 'delivered' || selectedOrderForDetail.orderStatus === 'completed') && (
                <Button
                  disabled
                  className="w-full bg-primary hover:bg-primary/95 text-white font-bold py-3 opacity-65 border-0"
                >
                  Order Delivered & Completed
                </Button>
              )}
              {selectedOrderForDetail.orderStatus === 'cancelled' && (
                <Button
                  disabled
                  className="w-full bg-error text-white font-bold py-3 opacity-65 border-0"
                >
                  Order Cancelled
                </Button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      </div>
    </PullToRefresh>
  );
};
