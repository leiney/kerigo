import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bell,
  ChevronDown,
  ChevronRight,
  Eye,
  Package,
  Clock,
  Star,
  ShoppingBag,
  Truck,
  MapPin,
  CircleDot,
  ArrowUp,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Info,
  ShieldCheck,
  RotateCcw,
} from 'lucide-react';
import { Button, Badge, BottomSheet } from '@stackloop/ui';
import { motion, AnimatePresence } from 'motion/react';
import BottomNav from '../../components/BottomNav';

// --- Mock Data ---
const storeData = {
  name: 'KeriGo Store',
  location: 'Westlands, Nairobi',
  revenue: 12400,
  orders: 24,
  prepTime: '18m',
  rating: 4.8,
  revenueChange: 18,
};

const newOrders = [
  {
    id: 'KR1024',
    time: '2 mins ago',
    items: ['Milk 500ml', 'Bread', 'Eggs (6)'],
    extraItems: 2,
    amount: 1240,
    distance: '2.4 km',
    type: 'Delivery',
    customer: 'John M.',
  },
  {
    id: 'KR1025',
    time: '5 mins ago',
    items: ['Tomatoes', 'Onions', 'Cooking Oil'],
    extraItems: 1,
    amount: 780,
    distance: '3.1 km',
    type: 'Delivery',
    customer: 'Jane D.',
  },
];

const preparingOrders = [
  {
    id: 'KR1021',
    time: '10:25 AM',
    items: ['Chicken 1kg', 'Potatoes', 'Carrots'],
    amount: 1560,
    prepTime: '05:32',
    type: 'Delivery',
  },
];

const readyOrders = [
  {
    id: 'KR1018',
    time: '09:50 AM',
    items: ['Bananas', 'Apples', 'Milk 500ml'],
    amount: 650,
    rider: 'John M.',
    type: 'Pickup',
  },
];

const recentOrders = [
  { id: 'KR1017', time: 'Today, 09:15 AM', amount: 920, status: 'Completed' },
  { id: 'KR1016', time: 'Today, 08:40 AM', amount: 1230, status: 'Completed' },
  { id: 'KR1015', time: 'Yesterday, 07:30 PM', amount: 540, status: 'Cancelled' },
];

// --- Types ---
type OrderType = typeof newOrders[0];

export const VendorDashboard: React.FC = () => {
  const navigate = useNavigate();
  
  // Bottom Sheet State
  const [showConfirmSheet, setShowConfirmSheet] = useState(false);
  const [showCancelSheet, setShowCancelSheet] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<OrderType | null>(null);

  const handleOpenConfirm = (order: OrderType) => {
    setSelectedOrder(order);
    setShowConfirmSheet(true);
  };

  const handleOpenCancel = (order: OrderType) => {
    setSelectedOrder(order);
    setShowCancelSheet(true);
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans antialiased pb-24">
      {/* --- Header --- */}
      <header className="px-4 pt-6 pb-2 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
            <ShoppingBag className="w-5 h-5 text-primary" />
          </div>
          <div>
            <button className="flex items-center gap-1 font-bold text-lg leading-none">
              {storeData.name} <ChevronDown className="w-4 h-4 text-foreground/50" />
            </button>
            <p className="text-xs text-foreground/50 mt-1">{storeData.location}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-1.5 bg-primary/10 text-primary text-xs font-semibold px-3 py-1.5 rounded-full">
            <CircleDot className="w-3 h-3 fill-current" /> Open <ChevronDown className="w-3 h-3" />
          </button>
          <button className="relative p-2">
            <Bell className="w-5 h-5 text-foreground/70" />
            <span className="absolute top-1 right-1 w-4 h-4 bg-primary text-white text-[9px] font-bold rounded-full flex items-center justify-center border border-background">
              3
            </span>
          </button>
        </div>
      </header>

      {/* --- Revenue Card (slim, right-aligned metrics) --- */}
      <section className="px-4 mb-6">
        <div className="bg-primary rounded-2xl p-3 text-white shadow-sm shadow-primary/10">
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1">
              <p className="text-sm text-white/90">Today's Revenue</p>
              <div className="flex items-end relative gap-3">
                <p className="text-xl sm:text-2xl font-extrabold tracking-tight">KES {storeData.revenue.toLocaleString()}</p>
                {/* <span className="text-xs text-white/80 absolute bottom-0 right-0 font-semibold flex items-center gap-1">
                  <ArrowUp className="w-3 h-3" /> {storeData.revenueChange}%
                </span> */}
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="flex flex-col items-center text-right">
                <Package className="w-4 h-4 text-white/90 mb-1" />
                <span className="font-bold text-sm">{storeData.orders}</span>
                <span className="text-[11px] text-white/75">Orders</span>
              </div>
              <div className="flex flex-col items-center text-right">
                <Clock className="w-4 h-4 text-white/90 mb-1" />
                <span className="font-bold text-sm">{storeData.prepTime}</span>
                <span className="text-[11px] text-white/75">Avg. prep time</span>
              </div>
              <div className="flex flex-col items-center text-right">
                <Star className="w-4 h-4 text-white/90 mb-1" />
                <span className="font-bold text-sm">{storeData.rating}</span>
                <span className="text-[11px] text-white/75">Rating</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- New Orders --- */}
      <section className="px-4 mb-6">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <h2 className="font-bold text-base">New Orders</h2>
            <Badge variant="default" className="bg-primary/10 text-primary text-[11px] font-semibold px-2 py-0.5 rounded-full">
              {newOrders.length}
            </Badge>
          </div>
          <button className="text-primary text-xs font-semibold flex items-center gap-1">
            View all <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="space-y-3">
          {newOrders.map((order, idx) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + idx * 0.05 }}
              className="bg-white rounded-2xl p-4 border border-border/50 shadow-sm"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                    <ShoppingBag className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-bold text-sm">Order #{order.id}</p>
                    <p className="text-[11px] text-foreground/50 mt-0.5">{order.time}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-sm">KES {order.amount.toLocaleString()}</p>
                  <p className="text-[11px] text-foreground/50 mt-0.5 flex items-center gap-1 justify-end">
                    <MapPin className="w-3 h-3" /> {order.distance}
                  </p>
                </div>
              </div>

              <div className="flex items-start justify-between">
                <div className="min-w-0 flex-1 pr-3">
                  <p className="text-xs text-foreground/70 leading-relaxed">
                    {order.items.slice(0, 3).join(', ')}
                    {order.extraItems > 0 && (
                      <span className="text-foreground/40"> + {order.extraItems} more items</span>
                    )}
                  </p>
                  <Badge variant="success" className="bg-primary/10 text-primary text-[10px] font-semibold px-2 py-0.5 rounded-full mt-2">
                    <Truck className="w-3 h-3 mr-1" /> {order.type}
                  </Badge>
                </div>
                <div className="flex flex-col gap-2 ml-2 shrink-0">
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-primary border-primary/30 hover:bg-primary/5 text-xs font-semibold h-8 px-5"
                    onClick={() => handleOpenConfirm(order)}
                  >
                    Confirm
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-error border-error/30 hover:bg-error/5 text-xs font-semibold h-8 px-5"
                    onClick={() => handleOpenCancel(order)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* --- Preparing Orders --- */}
      <section className="px-4 mb-6">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <h2 className="font-bold text-base">Preparing Orders</h2>
            <Badge variant="default" className="bg-warning/10 text-warning text-[11px] font-semibold px-2 py-0.5 rounded-full">
              {preparingOrders.length}
            </Badge>
          </div>
          <button className="text-primary text-xs font-semibold flex items-center gap-1">
            View all <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {preparingOrders.map((order, idx) => (
          <motion.div
            key={order.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + idx * 0.05 }}
            className="bg-warning/5 rounded-2xl p-4 border border-warning/20 shadow-sm"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 bg-warning/15 rounded-full flex items-center justify-center shrink-0">
                  <ShoppingBag className="w-4 h-4 text-warning" />
                </div>
                <div>
                  <p className="font-bold text-sm">Order #{order.id}</p>
                  <p className="text-[11px] text-foreground/50 mt-0.5">{order.time}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-sm">KES {order.amount.toLocaleString()}</p>
                <p className="text-[11px] text-warning font-bold mt-0.5 flex items-center gap-1 justify-end">
                  <Clock className="w-3 h-3" /> {order.prepTime}
                </p>
              </div>
            </div>

            <div className="flex items-start justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-xs text-foreground/70">{order.items.join(', ')}</p>
                <Badge variant="warning" className="bg-warning/10 text-warning text-[10px] font-semibold px-2 py-0.5 rounded-full mt-2">
                  {order.type}
                </Badge>
              </div>
              <Button
                size="sm"
                className="text-white bg-primary hover:bg-primary/90 text-xs font-semibold h-9 px-6"
                onClick={() => navigate('/vendor/mark-as-ready-assign-rider')}
              >
                Mark as Ready
              </Button>
            </div>
          </motion.div>
        ))}
      </section>

      {/* --- Ready for Pickup --- */}
      <section className="px-4 mb-6">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <h2 className="font-bold text-base">Ready for Pickup</h2>
            <Badge variant="default" className="bg-primary/10 text-primary text-[11px] font-semibold px-2 py-0.5 rounded-full">
              {readyOrders.length}
            </Badge>
          </div>
          <button className="text-primary text-xs font-semibold flex items-center gap-1">
            View all <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {readyOrders.map((order, idx) => (
          <motion.div
            key={order.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 + idx * 0.05 }}
            className="bg-white rounded-2xl p-4 border border-border/50 shadow-sm"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                  <ShoppingBag className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="font-bold text-sm">Order #{order.id}</p>
                  <p className="text-[11px] text-foreground/50 mt-0.5">{order.time}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-sm">KES {order.amount.toLocaleString()}</p>
                <p className="text-[11px] text-primary font-bold mt-0.5">
                  Rider: {order.rider}
                </p>
              </div>
            </div>

            <div className="flex items-start justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-xs text-foreground/70">{order.items.join(', ')}</p>
                <Badge variant="info" className="bg-primary/10 text-primary text-[10px] font-semibold px-2 py-0.5 rounded-full mt-2">
                  {order.type}
                </Badge>
              </div>
              <Button
                size="sm"
                disabled
                className="text-white bg-primary hover:bg-primary/90 text-xs font-semibold h-9 px-6"
              >
                Handed Over
              </Button>
            </div>
          </motion.div>
        ))}
      </section>

      {/* --- Recent Orders --- */}
      <section className="px-4 mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-bold text-base">Recent Orders</h2>
          <button className="text-primary text-xs font-semibold flex items-center gap-1">
            View all <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="bg-white rounded-2xl border border-border/50 shadow-sm overflow-hidden">
          {recentOrders.map((order, idx) => (
            <div
              key={order.id}
              className={`flex items-center justify-between p-4 ${
                idx !== recentOrders.length - 1 ? 'border-b border-border/50' : ''
              }`}
            >
              <div>
                <p className="font-bold text-xs">#{order.id}</p>
                <p className="text-[11px] text-foreground/50 mt-0.5">{order.time}</p>
              </div>
              <div className="text-center">
                <p className="font-bold text-xs">KES {order.amount.toLocaleString()}</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge
                  variant={order.status === 'Completed' ? 'success' : 'danger'}
                  className={`${
                    order.status === 'Completed'
                      ? 'bg-primary/10 text-primary'
                      : 'bg-error/10 text-error'
                  } text-[10px] font-semibold px-2 py-0.5 rounded-full`}
                >
                  {order.status}
                </Badge>
                <ChevronRight className="w-3.5 h-3.5 text-foreground/30" />
              </div>
            </div>
          ))}
        </div>
      </section>

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
        <div className="pb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-lg font-bold">
              Confirm Order #{selectedOrder?.id}
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
                <p className="font-bold text-sm">{selectedOrder?.customer}</p>
                <p className="text-[11px] text-foreground/50">Delivery • {selectedOrder?.distance}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-bold text-sm">KES {selectedOrder?.amount.toLocaleString()}</p>
              <Badge variant="success" className="bg-primary/10 text-primary text-[10px] px-2 py-0.5 rounded-full mt-1">
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

          {/* What happens next - separate card */}
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
            <Button className="w-full bg-primary hover:bg-primary/95 text-white font-bold py-3">
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
        <div className="pb-8">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-bold text-error">Cancel Order #{selectedOrder?.id}</h3>
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
                <p className="font-bold text-sm">{selectedOrder?.customer}</p>
                <p className="text-[11px] text-foreground/50">Delivery • {selectedOrder?.distance}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-bold text-sm">KES {selectedOrder?.amount.toLocaleString()}</p>
              <Badge variant="success" className="bg-primary/10 text-primary text-[10px] px-2 py-0.5 rounded-full mt-1">Paid</Badge>
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
              <span className="font-bold text-primary text-xs ">KES {selectedOrder?.amount.toLocaleString()}</span>
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
            <Button className="w-full bg-error hover:bg-error/95 text-white font-bold py-3 gap-2">
              <RotateCcw className="w-4 h-4" /> Cancel Order & Refund
            </Button>
            <Button variant="outline" className="w-full border-success text-primary hover:bg-primary/5 font-bold py-3" onClick={() => setShowCancelSheet(false)}>
              Keep Order
            </Button>
          </div>

          <p className="text-center text-[10px] text-foreground/40 mt-4 flex items-center justify-center gap-1"><Info className="w-3 h-3" /> This order will be removed from New Orders.</p>
        </div>
      </BottomSheet>
    </div>
  );
};