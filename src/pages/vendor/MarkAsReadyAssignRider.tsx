import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  ArrowLeft,
  X,
  MapPin,
  CheckCircle,
  Bell,
  Clock,
  ArrowRightCircle,
  Zap,
  ChevronDown,
  User,
  Star,
  Minus,
  Plus,
  Lock,
} from 'lucide-react';
import { Button, Badge, Toggle } from '@stackloop/ui';
import { motion } from 'motion/react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { productApi } from '@/lib/api';



export const MarkAsReadyAssignRider: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const location = useLocation();
  const [selectedRider, setSelectedRider] = useState<string>('');
  const [autoAssign, setAutoAssign] = useState(false);
  const [pickupTime, setPickupTime] = useState(5);
  const [note, setNote] = useState('');

  const orderFromState = location.state?.order;
  const orderId = orderFromState?.orderID || location.state?.orderId;

  // Retrieve the order details
  const { data: orderDetails } = useQuery({
    queryKey: ['vendorOrderDetail', orderId],
    queryFn: () => productApi.getVendorOrderDetails(orderId),
    enabled: !!orderId,
    initialData: orderFromState,
  });

  const order = orderDetails || orderFromState;

  const latitude = order?.extraData?.vendor?.location?.latitude;
  const longitude = order?.extraData?.vendor?.location?.longitude;

  // Fetch nearby riders using productApi.getAllRiders
  const { data: fetchedRiders = [] } = useQuery<any[]>({
    queryKey: ['nearbyRiders', latitude, longitude],
    queryFn: async () => {
      if (!latitude || !longitude) return [];
      const response = await productApi.getAllRiders(latitude, longitude, 'motorbike', 5);
      console.log('Fetched Nearby Riders:', response);
      return response || [];
    },
    enabled: !!latitude && !!longitude,
  });

  const riders = (Array.isArray(fetchedRiders) ? fetchedRiders : []).map((r: any) => ({
    id: r.id || r.riderID || r.riderId || String(r._id || ''),
    name: r.name || r.fullName || r.riderName || 'Rider',
    rating: r.rating || 5.0,
    totalOrders: r.totalOrders || r.ordersCount || 0,
    distance: r.distance ? (typeof r.distance === 'number' ? `${r.distance.toFixed(1)} km` : r.distance) : 'Nearby',
    eta: r.eta || '~5 mins',
    status: r.status || 'available',
    recommended: r.recommended || false,
    avatar: r.avatar || r.avatarUrl || '/placeholder-avatar.webp',
  }));

  useEffect(() => {
    if (riders.length > 0) {
      if (!riders.some(r => r.id === selectedRider)) {
        setSelectedRider(riders[0].id);
      }
    }
  }, [riders, selectedRider]);

  const getItemsText = (ord: any) => {
    if (!ord?.orderItems || ord.orderItems.length === 0) return 'No items';
    return ord.orderItems.map((item: any) => `${item.quantity}x ${item.name}`).join(', ');
  };

  const formatOrderTime = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch (e) {
      return dateStr;
    }
  };

  const handleIncrementTime = () => {
    if (pickupTime < 60) setPickupTime(pickupTime + 1);
  };

  const handleDecrementTime = () => {
    if (pickupTime > 1) setPickupTime(pickupTime - 1);
  };

  const handleMarkAsReady = async () => {
    if (!order) return;
    try {
      const activeRider = autoAssign ? undefined : riders.find(r => r.id === selectedRider);
      const riderObj = activeRider ? { id: activeRider.id, fullName: activeRider.name } : undefined;
      const message = note || `Order ready for pickup. Assigned to ${riderObj?.fullName || 'auto-assigned rider'}.`;

      await productApi.updateOrderStatus(
        order.orderID,
        'on_the_way',
        message,
        note,
        riderObj
      );
      queryClient.invalidateQueries({ queryKey: ['vendorOrders'] });
      navigate('/vendor/dashboard');
    } catch (err) {
      console.error('Failed to mark order as ready:', err);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans antialiased pb-8">
      {/* --- Header --- */}
      <header className="px-4 pt-5 pb-4 flex items-center justify-between sticky top-0 bg-background z-40">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 -ml-2 rounded-full hover:bg-secondary transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <div className="flex-1">
            <h1 className="text-base font-bold text-foreground">
              Mark as Ready & Assign Rider
            </h1>
            <p className="text-[11px] text-foreground/60 mt-0.5 leading-tight">
              Order will be marked ready and a rider will be assigned for pickup.
            </p>
          </div>
          <button
            onClick={() => navigate(-1)}
            className="p-2 -mr-2 rounded-full hover:bg-secondary transition-colors"
          >
            <X className="w-5 h-5 text-foreground/50" />
          </button>
        </div>
      </header>

      <div className="px-4 space-y-4">
        {/* --- Order Summary Card --- */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-4 border border-border/50 shadow-sm"
        >
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-warning/15 rounded-full flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5 text-warning" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-bold text-sm">Order #{order?.orderNo || order?.orderID?.slice(-6).toUpperCase()}</p>
                  <Badge
                    variant="warning"
                    className="bg-warning/10 text-warning text-[9px] font-semibold px-2 py-0.5 rounded-full capitalize"
                  >
                    {order?.orderStatus || 'preparing'}
                  </Badge>
                </div>
                <p className="text-[11px] text-foreground/50">
                  {order?.orderDate ? formatOrderTime(order.orderDate) : ''} • {order?.shippingCharges > 0 ? 'Delivery' : 'Pickup'}
                </p>
                <p className="text-xs text-foreground/70 mt-1">
                  {getItemsText(order)}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-bold text-base">KES {(order?.subTotal || 0).toLocaleString()}</p>
            </div>
          </div>

          <div className="flex items-start justify-between pt-3 border-t border-border/50">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-primary/5 rounded-full flex items-center justify-center shrink-0">
                <MapPin className="w-3.5 h-3.5 text-primary" />
              </div>
              <div>
                <p className="text-[10px] text-foreground/50 font-medium">Deliver to</p>
                <p className="text-xs font-bold text-foreground">{order?.extraData?.customer?.name || 'Customer'}</p>
                <p className="text-[10px] text-foreground/40">{order?.extraData?.distanceKm ? `${order.extraData.distanceKm.toFixed(1)} km` : 'N/A'} away</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                <CheckCircle className="w-3.5 h-3.5 text-primary" />
              </div>
              <div>
                <p className="text-[10px] text-foreground/50 font-medium">Payment</p>
                <p className="text-xs font-bold text-primary flex items-center gap-1 capitalize">
                  {order?.paymentStatus || 'pending'} <CheckCircle className="w-3 h-3" />
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* --- What Happens Section --- */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-primary/5 rounded-2xl p-4 border border-primary/10 space-y-4"
        >
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
              <Bell className="w-4 h-4 text-primary" />
            </div>
            <div>
              <p className="text-sm font-bold text-foreground">Rider will be notified</p>
              <p className="text-[11px] text-foreground/60 mt-0.5">
                Rider will be notified that the order is ready for pickup.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
              <Clock className="w-4 h-4 text-primary" />
            </div>
            <div>
              <p className="text-sm font-bold text-foreground">Prep timer will stop</p>
              <p className="text-[11px] text-foreground/60 mt-0.5">
                Your preparation time will be recorded.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
              <ArrowRightCircle className="w-4 h-4 text-primary" />
            </div>
            <div>
              <p className="text-sm font-bold text-foreground">Order moves to Ready for Pickup</p>
              <p className="text-[11px] text-foreground/60 mt-0.5">
                The order will be moved to the next stage.
              </p>
            </div>
          </div>
        </motion.div>

        {/* --- Assign Rider Section --- */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold text-foreground">Assign Rider</h2>
            <button
              onClick={() => setAutoAssign(!autoAssign)}
              className="flex items-center gap-1.5 text-primary text-xs font-semibold"
            >
              <Zap className="w-3.5 h-3.5" /> Auto-assign <Zap className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-border/50 shadow-sm overflow-hidden">
            {riders.map((rider, index) => (
              <motion.div
                key={rider.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.05 }}
                className={`p-4 flex items-center gap-3 cursor-pointer transition-colors ${
                  index !== riders.length - 1 ? 'border-b border-border/50' : ''
                } ${
                  selectedRider === rider.id
                    ? 'bg-primary/5 border-l-4 border-l-primary'
                    : 'hover:bg-secondary/50 border-l-4 border-l-transparent'
                }`}
                onClick={() => setSelectedRider(rider.id)}
              >
                <input
                  type="radio"
                  name="rider"
                  value={rider.id}
                  checked={selectedRider === rider.id}
                  onChange={() => setSelectedRider(rider.id)}
                  className="w-4 h-4 text-primary border-border focus:ring-primary"
                />
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0 overflow-hidden">
                  <User className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="font-bold text-sm text-foreground">{rider.name}</p>
                    {rider.recommended && (
                      <Badge
                        variant="success"
                        className="bg-primary/10 text-primary text-[9px] font-semibold px-2 py-0.5 rounded-full"
                      >
                        Recommended
                      </Badge>
                    )}
                    {rider.status === 'busy' && (
                      <Badge
                        variant="warning"
                        className="bg-warning/10 text-warning text-[9px] font-semibold px-2 py-0.5 rounded-full"
                      >
                        Busy
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-foreground/60">
                    <Star className="w-3 h-3 text-warning fill-warning" />
                    <span className="font-medium">{rider.rating}</span>
                    <span>({rider.totalOrders} orders)</span>
                  </div>
                  <p className="text-[11px] text-foreground/50 mt-0.5">
                    {rider.distance} away • {rider.eta} to store
                  </p>
                </div>
              </motion.div>
            ))}
            {riders.length === 0 && (
              <div className="p-8 text-center text-foreground/45 text-xs font-semibold">
                No nearby riders found for this vendor location.
              </div>
            )}
            <button className="w-full py-3 text-center text-primary text-xs font-semibold flex items-center justify-center gap-1 hover:bg-secondary/50 transition-colors">
              View more riders <ChevronDown className="w-3.5 h-3.5" />
            </button>
          </div>
        </motion.div>

        {/* --- Estimated Pickup Time --- */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-primary/5 rounded-2xl p-4 border border-primary/10"
        >
          <div className="flex items-start gap-3 mb-3">
            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
              <Clock className="w-4 h-4 text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-foreground">Estimated pickup time</p>
              <p className="text-[11px] text-foreground/60 mt-0.5">
                Inform rider how soon the order will be ready.
              </p>
            </div>
          </div>
          <div className="flex items-center justify-between pl-11">
            <div className="flex items-center gap-3">
              <button
                onClick={handleDecrementTime}
                className="w-8 h-8 bg-white border border-border rounded-lg flex items-center justify-center hover:bg-secondary transition-colors"
              >
                <Minus className="w-4 h-4 text-foreground" />
              </button>
              <div className="text-center" style={{ minWidth: '60px' }}>
                <p className="text-lg font-bold text-foreground">
                  00:{pickupTime.toString().padStart(2, '0')}
                </p>
              </div>
              <button
                onClick={handleIncrementTime}
                className="w-8 h-8 bg-white border border-border rounded-lg flex items-center justify-center hover:bg-secondary transition-colors"
              >
                <Plus className="w-4 h-4 text-foreground" />
              </button>
            </div>
            <p className="text-sm font-semibold text-primary">{pickupTime} min from now</p>
          </div>
        </motion.div>

        {/* --- Note to Rider --- */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <label className="block text-xs font-bold text-foreground/60 mb-2">
            Note to rider <span className="text-foreground/40 font-normal">(optional)</span>
          </label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="E.g. Please call on arrival, leave at the gate, etc."
            maxLength={120}
            className="w-full bg-white border border-border rounded-xl p-3.5 text-sm text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none h-20"
          />
          <p className="text-[10px] text-foreground/40 text-right mt-1">
            {note.length}/120
          </p>
        </motion.div>

        {/* --- Action Buttons --- */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="space-y-3 pt-2"
        >
          <Button
            onClick={handleMarkAsReady}
            className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-3.5 gap-2"
          >
            <CheckCircle className="w-5 h-5" /> Mark as Ready & Assign Rider
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate(-1)}
            className="w-full border-primary/20 text-primary hover:bg-primary/5 font-bold py-3.5"
          >
            Go Back
          </Button>
          <p className="text-center text-[10px] text-foreground/40 flex items-center justify-center gap-1">
            <Lock className="w-3 h-3" /> This action cannot be undone.
          </p>
        </motion.div>
      </div>
    </div>
  );
};