import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  ArrowLeft,
  X,
  ShieldCheck,
  MapPin,
  Clock,
  Route,
  Phone,
  MessageCircle,
  Check,
  CheckCircle2,
  Lock,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { Button, Badge, BottomSheet } from '@stackloop/ui';
import { startDeliveryTracking } from '../../lib/backgroundGeolocation';
import { motion, AnimatePresence } from 'motion/react';
import { productApi } from '@/lib/api';
import { returnImageUrl } from '@/config';

// --- Mock Order Items ---
const orderItems = [
  { qty: '1x', name: 'Milk 500ml', img: '/milk.jpeg' },
  { qty: '2x', name: 'Bread', img: '/bread.jpeg' },
  { qty: '6x', name: 'Eggs', img: '/eggs.jpeg' },
];

export const MarkAsPickedUpPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const order = location.state?.order;

  const [note, setNote] = useState('');
  const [itemsExpanded, setItemsExpanded] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showLocationSheet, setShowLocationSheet] = useState(false);

  const formatOrderDate = (dateStr: string) => {
    if (!dateStr) return '';
    try {
      const date = new Date(dateStr);
      const now = new Date();
      
      const dateMidnight = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      const nowMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      
      const diffTime = nowMidnight.getTime() - dateMidnight.getTime();
      const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
      
      const timeOptions: Intl.DateTimeFormatOptions = { hour: '2-digit', minute: '2-digit', hour12: true };
      const timeString = date.toLocaleTimeString([], timeOptions);
      
      if (diffDays === 0) {
        return timeString;
      } else if (diffDays === 1) {
        return `Yesterday, ${timeString}`;
      } else {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const month = months[date.getMonth()];
        const day = date.getDate();
        const year = date.getFullYear();
        return `${month}, ${day}, ${year} ${timeString.toLowerCase()}`;
      }
    } catch (e) {
      return dateStr;
    }
  };

  const handleConfirmPickup = async () => {
    setShowLocationSheet(true);
  };

  const handleConfirmLocationAccess = async () => {
    if (!order) return;
    setShowLocationSheet(false);
    setIsSubmitting(true);
    try {
      // Request background location permission by starting delivery tracking first
      try {
        await startDeliveryTracking(order.orderID);
      } catch (trackErr) {
        console.error('Failed to start delivery tracking:', trackErr);
        alert('Location tracking could not start. Please make sure to grant "Allow all the time" location access in your system settings.');
        setIsSubmitting(false);
        return;
      }

      const message = note || 'Order picked up by rider.';
      await productApi.updateOrderStatus(order.orderID, 'on_the_way', message, note, true);

      navigate('/rider/dashboard');
    } catch (err) {
      console.error('Failed to mark order as picked up:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelLocationAccess = () => {
    setShowLocationSheet(false);
  };

  if (!order) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-6 text-center">
        <h1 className="text-xl font-bold text-error mb-2">No Order Selected</h1>
        <p className="text-sm text-foreground/60 mb-6">Please select an order from the dashboard.</p>
        <Button onClick={() => navigate('/rider/dashboard')} className="bg-primary text-white font-bold py-2.5 px-6 rounded-full text-sm">
          Go to Dashboard
        </Button>
      </div>
    );
  }

  const storeName = order.extraData?.vendor?.name || 'Vendor';
  const storeAddress = order.extraData?.vendor?.location?.address || 'Pickup Address';
  const dropoffArea = order.extraData?.location?.city || order.extraData?.location?.address || 'Customer Location';
  const dropoffAddress = order.extraData?.location?.address || 'Dropoff Address';

  const earnings = order.shippingCharges || 0;
  const distance = order.extraData?.distanceKm ? `${order.extraData.distanceKm.toFixed(1)} km` : 'N/A';
  const estTime = order.extraData?.durationMinutes ? `${order.extraData.durationMinutes} mins` : 'N/A';
  const itemsToRender = order.orderItems || [];

  return (
    <div className="min-h-screen bg-background text-foreground font-sans antialiased pb-8">
      {/* --- Header --- */}
      <header className="px-4 pt-5 pb-3 flex items-center justify-between sticky top-0 bg-background z-40">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 -ml-2 rounded-full hover:bg-secondary transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <div>
            <h1 className="text-base font-bold text-foreground leading-tight">
              Mark as Picked Up
            </h1>
            <p className="text-[11px] text-foreground/60 mt-0.5">
              Confirm that you have picked up the order from the store.
            </p>
          </div>
        </div>
        <button
          onClick={() => navigate(-1)}
          className="p-2 -mr-2 rounded-full hover:bg-secondary transition-colors"
        >
          <X className="w-5 h-5 text-foreground/50" />
        </button>
      </header>

      <div className="px-4 space-y-4">
        {/* --- Safety First Banner --- */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-primary/10 rounded-2xl p-4 flex items-start gap-3 border border-primary/20"
        >
          <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shrink-0 shadow-sm">
            <ShieldCheck className="w-4 h-4 text-primary" />
          </div>
          <div>
            <p className="text-sm font-bold text-foreground">Safety first!</p>
            <p className="text-xs text-foreground/60 mt-0.5">
              Make sure the order is complete and secured before continuing.
            </p>
          </div>
        </motion.div>

        {/* --- Order Summary Card --- */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-4 shadow-sm border border-border/50"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-foreground">Order #{order.orderNo || order.orderID.slice(-6).toUpperCase()}</span>
              <Badge
                variant="success"
                className="bg-primary/10 text-primary text-[10px] font-semibold px-2 py-0.5 rounded-full"
              >
                {order.orderStatus}
              </Badge>
            </div>
            <span className="text-xs font-medium text-foreground/50">{formatOrderDate(order.orderDate)}</span>
          </div>

          <div className="flex gap-4">
            {/* Left: Route */}
            <div className="flex-1">
              <div className="flex items-start gap-3 mb-5">
                <div className="flex flex-col items-center pt-1">
                  <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center">
                    <MapPin className="w-3.5 h-3.5 text-primary" />
                  </div>
                  <div className="w-0.5 h-10 border-l-2 border-dashed border-primary/30 my-1" />
                  <div className="w-6 h-6 bg-warning/10 rounded-full flex items-center justify-center">
                    <MapPin className="w-3.5 h-3.5 text-warning" />
                  </div>
                </div>
                <div className="flex-1 space-y-6">
                  <div>
                    <p className="text-[10px] text-foreground/50 font-bold uppercase tracking-wider">
                      Pickup
                    </p>
                    <p className="text-sm font-bold text-foreground mt-0.5">{storeName}</p>
                    <p className="text-xs text-foreground/50 mt-0.5">{storeAddress}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-foreground/50 font-bold uppercase tracking-wider">
                      Drop-off
                    </p>
                    <p className="text-sm font-bold text-foreground mt-0.5">{dropoffArea}</p>
                    <p className="text-xs text-foreground/50 mt-0.5">{dropoffAddress}</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1 border-border hover:bg-secondary text-foreground/70 h-9 text-xs font-semibold gap-2"
                  onClick={() => {
                    if (order.extraData?.vendor?.phoneNo) {
                      window.location.href = `tel:${order.extraData.vendor.phoneNo}`;
                    }
                  }}
                >
                  <Phone className="w-3.5 h-3.5" /> Call store
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 border-border hover:bg-secondary text-foreground/70 h-9 text-xs font-semibold gap-2"
                >
                  <MessageCircle className="w-3.5 h-3.5" /> Chat
                </Button>
              </div>
            </div>

            {/* Right: Stats */}
            <div className="flex flex-col gap-3 shrink-0 w-24">
              <div className="bg-primary/5 rounded-xl p-2 text-center">
                <p className="text-base font-extrabold text-primary">KES {earnings.toLocaleString()}</p>
                <p className="text-[9px] text-foreground/50 font-medium">Earnings</p>
              </div>
              <div className="space-y-2 text-right">
                <div>
                  <div className="flex items-center gap-1 justify-end text-foreground/70">
                    <Route className="w-3 h-3" />
                    <span className="text-xs font-bold">{distance}</span>
                  </div>
                  <p className="text-[9px] text-foreground/40">Total distance</p>
                </div>
                <div>
                  <div className="flex items-center gap-1 justify-end text-foreground/70">
                    <Clock className="w-3 h-3" />
                    <span className="text-xs font-bold">{estTime}</span>
                  </div>
                  <p className="text-[9px] text-foreground/40">Est. time</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* --- Order Items Accordion --- */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl border border-border/50 shadow-sm overflow-hidden"
        >
          <button
            onClick={() => setItemsExpanded(!itemsExpanded)}
            className="w-full p-4 flex items-center justify-between hover:bg-secondary/30 transition-colors"
          >
            <span className="text-sm font-bold text-foreground">Order items ({itemsToRender.length})</span>
            {itemsExpanded ? (
              <ChevronUp className="w-4 h-4 text-foreground/40" />
            ) : (
              <ChevronDown className="w-4 h-4 text-foreground/40" />
            )}
          </button>

          <AnimatePresence>
            {itemsExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="px-4 pb-4 space-y-3">
                  {itemsToRender.map((item: any, idx: number) => {
                    const itemImageId = item.variant?.images?.[0] || item.images?.[0] || item.imageURL;
                    const itemImageUrl = itemImageId ? returnImageUrl(itemImageId.toString()) : '/logo.png';
                    return (
                      <div key={idx} className="flex items-center justify-between py-1">
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-bold text-foreground/60 w-6">{item.quantity}x</span>
                          <span className="text-sm text-foreground font-medium">{item.name}</span>
                        </div>
                        <div className="w-8 h-8 rounded-lg bg-gray-100 overflow-hidden shrink-0">
                          <img
                            src={itemImageUrl}
                            alt={item.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = 'none';
                              (e.target as HTMLImageElement).parentElement!.classList.add('flex', 'items-center', 'justify-center', 'text-gray-300');
                              (e.target as HTMLImageElement).parentElement!.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-image"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>';
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* --- Confirm Pickup Checklist --- */}
        <div className="bg-primary/5 border border-primary/10 rounded-2xl p-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-sm font-bold text-foreground">Confirm pickup</p>
              <p className="text-[11px] text-foreground/60 mt-0.5">
                Please review and confirm the following:
              </p>
            </div>
          </div>

          <div className="space-y-3 pl-9">
            <div className="flex items-start gap-2">
              <Check className="w-4 h-4 text-primary mt-0.5 shrink-0" />
              <p className="text-xs text-foreground/80 leading-tight">
                I have arrived at the store and collected the order
              </p>
            </div>
            <div className="flex items-start gap-2">
              <Check className="w-4 h-4 text-primary mt-0.5 shrink-0" />
              <p className="text-xs text-foreground/80 leading-tight">
                I have verified the items and quantities
              </p>
            </div>
            <div className="flex items-start gap-2">
              <Check className="w-4 h-4 text-primary mt-0.5 shrink-0" />
              <p className="text-xs text-foreground/80 leading-tight">
                The order is complete and securely packed
              </p>
            </div>
          </div>
        </div>

        {/* --- Note (Optional) --- */}
        <div>
          <label className="block text-xs font-bold text-foreground/60 mb-2">
            Note <span className="text-foreground/40 font-normal">(optional)</span>
          </label>
          <div className="relative">
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Add any note for the store (e.g. item not available, substitute)"
              maxLength={120}
              className="w-full bg-white border border-border rounded-xl p-3.5 text-sm text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none h-20"
            />
            <p className="text-[10px] text-foreground/40 absolute bottom-3 right-3">
              {note.length}/120
            </p>
          </div>
        </div>

        {/* --- Action Buttons --- */}
        <div className="space-y-3 pt-2">
          <Button
            onClick={handleConfirmPickup}
            disabled={isSubmitting}
            className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-3.5 gap-2 text-sm"
          >
            <CheckCircle2 className="w-5 h-5" /> {isSubmitting ? 'Submitting...' : 'Mark as Picked Up'}
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate(-1)}
            disabled={isSubmitting}
            className="w-full border-primary/20 text-primary hover:bg-primary/5 font-bold py-3.5 text-sm"
          >
            Go Back
          </Button>
          <p className="text-center text-[10px] text-foreground/40 flex items-center justify-center gap-1">
            <Lock className="w-3 h-3" /> This action cannot be undone.
          </p>
        </div>
      </div>

      {/* Background Location Disclosure Bottom Sheet */}
      <BottomSheet
        isOpen={showLocationSheet}
        onClose={handleCancelLocationAccess}
        className="max-h-[90vh]"
        animate={false}
      >
        <div className="pb-8 text-foreground px-4">
          <div className="flex flex-col items-center text-center mt-4 mb-6">
            <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <MapPin className="w-7 h-7 text-primary animate-bounce" />
            </div>
            <h3 className="text-lg font-bold text-foreground">
              Background Location Permission
            </h3>
            <p className="text-xs text-foreground/50 mt-1">
              Active Delivery Tracking Required
            </p>
          </div>

          <div className="bg-secondary/40 rounded-2xl p-4 mb-6 border border-border/40">
            <p className="text-sm text-foreground/75 leading-relaxed text-center">
              Kerigo collects your location in the background while you are actively delivering orders. This allows customers and vendors to track delivery progress in real time, even if the app is minimized or the screen is off. Location tracking stops when your delivery ends.
            </p>
          </div>

          <div className="space-y-3">
            <Button
              className="w-full bg-primary hover:bg-primary/95 text-white font-bold py-3.5 text-sm rounded-xl flex items-center justify-center gap-2"
              onClick={handleConfirmLocationAccess}
            >
              Allow Location Access
            </Button>
            <Button
              variant="outline"
              className="w-full border-border text-foreground/60 hover:bg-secondary font-bold py-3.5 text-sm rounded-xl"
              onClick={handleCancelLocationAccess}
            >
              Not Now
            </Button>
          </div>
        </div>
      </BottomSheet>
    </div>
  );
};