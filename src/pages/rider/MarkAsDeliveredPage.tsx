import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
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
  User,
  Camera,
  Image as ImageIcon,
  PenTool,
  CheckCircle,
} from 'lucide-react';
import { Button, Badge } from '@stackloop/ui';
import { motion, AnimatePresence } from 'motion/react';
import { productApi } from '@/lib/api';
import { returnImageUrl } from '@/config';
import { Geolocation } from '@capacitor/geolocation';
import { Browser } from '@capacitor/browser';

interface Coordinates {
  lat: number;
  lng: number;
}

async function startRiderNavigation(destination: Coordinates | string): Promise<void> {
  try {
    const permissionStatus = await Geolocation.checkPermissions();
    if (permissionStatus.location !== 'granted') {
      const requestStatus = await Geolocation.requestPermissions();
      if (requestStatus.location !== 'granted') {
        throw new Error('Location permission denied by the rider.');
      }
    }

    const riderPosition = await Geolocation.getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 10000
    });

    const originLat = riderPosition.coords.latitude;
    const originLng = riderPosition.coords.longitude;

    let mapsUrl = '';
    if (typeof destination === 'string') {
      mapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${originLat},${originLng}&destination=${encodeURIComponent(destination)}&travelmode=driving`;
    } else {
      mapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${originLat},${originLng}&destination=${destination.lat},${destination.lng}&travelmode=driving`;
    }

    await Browser.open({ url: mapsUrl });
  } catch (error) {
    console.error('Navigation could not start:', error);
    alert(`Could not start navigation: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export const MarkAsDeliveredPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const order = location.state?.order;

  const [note, setNote] = useState('');

  const formatDuration = (minutes: number) => {
    if (!minutes) return 'N/A';
    if (minutes < 60) {
      return `${minutes} mins`;
    }
    const hours = minutes / 60;
    if (hours < 24) {
      const roundedHours = Math.round(hours * 10) / 10;
      return `${roundedHours} hrs`;
    }
    const days = hours / 24;
    const roundedDays = Math.round(days * 10) / 10;
    return `${roundedDays} days`;
  };
  const [selectedProof, setSelectedProof] = useState<'camera' | 'gallery'>('camera');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedPreviewItem, setSelectedPreviewItem] = useState<any | null>(null);
  const [proofImage, setProofImage] = useState<string | null>(null);
  const [proofBlob, setProofBlob] = useState<Blob | null>(null);

  const handleCaptureImage = async (source: any) => {
    try {
      const { Camera, CameraResultType } = await import('@capacitor/camera');
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.Uri,
        source: source,
      });

      if (image.webPath) {
        setProofImage(image.webPath);
        const res = await fetch(image.webPath);
        const blob = await res.blob();
        setProofBlob(blob);
      }
    } catch (err) {
      console.error('Failed to capture image:', err);
    }
  };

  const formatStatus = (status: string) => {
    if (!status) return '';
    const mapped: Record<string, string> = {
      'new': 'Received',
      'preparing': 'Preparing',
      'on_the_way': 'On the Way',
      'delivered': 'Delivered',
      'cancelled': 'Cancelled'
    };
    return mapped[status] || status.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  };

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
        return `${month}, ${day}, ${timeString.toLowerCase()}`;
      }
    } catch (e) {
      return dateStr;
    }
  };

  const handleConfirmDelivery = async () => {
    if (!order) return;
    
    if (!proofBlob) {
      alert('Please take or choose a photo as proof of delivery first.');
      return;
    }

    setIsSubmitting(true);
    try {
      // 1. Upload proof of delivery photo first
      const file = new File([proofBlob], `proof_${order.orderID}.jpg`, { type: 'image/jpeg' });
      await productApi.uploadOrderResource(order.orderID, 'proofOfDelivery', file);
      console.log('Proof of delivery photo uploaded successfully');

      // 2. Mark order as delivered
      const message = note || 'Order delivered to customer.';
      await productApi.updateOrderStatus(order.orderID, 'delivered', message, note);

      // 3. Stop geolocation tracking
      try {
        const { stopTracking } = await import('../../lib/backgroundGeolocation');
        await stopTracking();
      } catch (trackErr) {
        console.error('Failed to stop geolocation tracking:', trackErr);
      }

      await queryClient.invalidateQueries({ queryKey: ['riderOrders'] });
      navigate('/rider/dashboard');
    } catch (err) {
      console.error('Failed to mark order as delivered:', err);
      alert(`Failed to complete delivery: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setIsSubmitting(false);
    }
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
  const estTime = formatDuration(order.extraData?.durationMinutes);
  const customerName = order.extraData?.customer?.name || 'Customer';
  const customerPhone = order.extraData?.customer?.phoneNo || '';
  const deliveryInstructions = order.extraData?.orderNotes || 'No special delivery instructions.';

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
              Mark as Delivered
            </h1>
            <p className="text-[11px] text-foreground/60 mt-0.5">
              Confirm that the order has been delivered to the customer.
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
              Ensure the order is delivered to the right customer.
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
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <span className="font-bold text-sm text-foreground shrink-0">Order #{(order.orderNo || order.orderID).slice(-6).toUpperCase()}</span>
              <Badge
                variant="success"
                className="bg-primary/10 text-primary text-[10px] font-semibold px-2 py-0.5 rounded-full truncate"
              >
                {formatStatus(order.orderStatus)}
              </Badge>
            </div>
            <span className="text-xs font-medium text-foreground/50 shrink-0 text-right ml-2">{formatOrderDate(order.orderDate)}</span>
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
                  <div className="flex-1">
                    <p className="text-[10px] text-foreground/50 font-bold uppercase tracking-wider">
                      Drop-off
                    </p>
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-sm font-bold text-foreground mt-0.5">{dropoffArea}</p>
                        <p className="text-xs text-foreground/50 mt-0.5">{dropoffAddress}</p>
                      </div>
                      {order.extraData?.location?.latitude !== undefined && order.extraData?.location?.longitude !== undefined && (
                        <button
                          onClick={() => {
                            const loc = order.extraData.location;
                            startRiderNavigation({ lat: loc.latitude, lng: loc.longitude });
                          }}
                          className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-primary shrink-0"
                          title="Navigate to Customer"
                        >
                          <MapPin className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1 border-border hover:bg-secondary text-foreground/70 h-9 text-[11px] font-semibold gap-1.5 px-2"
                  onClick={() => {
                    const loc = order.extraData?.location;
                    const dest = (loc?.latitude !== undefined && loc?.longitude !== undefined)
                      ? { lat: loc.latitude, lng: loc.longitude }
                      : dropoffAddress;
                    startRiderNavigation(dest);
                  }}
                >
                  <MapPin className="w-3.5 h-3.5 text-primary" /> Find User
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 border-border hover:bg-secondary text-foreground/70 h-9 text-[11px] font-semibold gap-1.5 px-2"
                  onClick={() => {
                    if (customerPhone) {
                      window.location.href = `tel:${customerPhone}`;
                    }
                  }}
                >
                  <Phone className="w-3.5 h-3.5" /> Call
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

        {/* --- Customer Info --- */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-border/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-primary/10 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="text-[10px] text-foreground/50 font-medium">Customer</p>
                <p className="text-sm font-bold text-foreground">{customerName}</p>
                {customerPhone && (
                  <p className="text-xs text-foreground/60 font-semibold mt-0.5">{customerPhone}</p>
                )}
              </div>
            </div>
            <div className="flex gap-2">
              {order.extraData?.location?.latitude !== undefined && order.extraData?.location?.longitude !== undefined && (
                <button
                  onClick={() => {
                    const loc = order.extraData.location;
                    startRiderNavigation({ lat: loc.latitude, lng: loc.longitude });
                  }}
                  className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-primary"
                  title="Navigate to Customer"
                >
                  <MapPin className="w-4 h-4" />
                </button>
              )}
              {customerPhone && (
                <button
                  onClick={() => {
                    window.location.href = `tel:${customerPhone}`;
                  }}
                  className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-primary"
                >
                  <Phone className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Delivery Instructions Accordion */}
          <div className="mt-3 pt-3 border-t border-border/50">
            <div className="text-left">
              <p className="text-xs font-bold text-foreground/60">
                Delivery instructions
              </p>
              <p className="text-xs text-foreground/80 mt-0.5">{deliveryInstructions}</p>
            </div>
          </div>
        </div>

        {/* --- Order Items --- */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-border/50">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-foreground">Order Items</h3>
            <Badge
              variant="default"
              className="bg-primary/10 text-primary text-[10px] font-semibold px-2 py-0.5 rounded-full"
            >
              {order.orderItems?.length || 0} {order.orderItems?.length === 1 ? 'Item' : 'Items'}
            </Badge>
          </div>
          <div className="space-y-3">
            {order.orderItems?.map((item: any, itemIdx: number) => {
              const itemImage = item.variant?.images?.[0] || '';
              return (
                <div
                  key={itemIdx}
                  onClick={() => setSelectedPreviewItem(item)}
                  className="flex items-center gap-3 p-2 hover:bg-secondary/40 rounded-xl cursor-pointer transition-colors border border-transparent hover:border-border/30"
                >
                  <div className="w-12 h-12 rounded-lg bg-secondary overflow-hidden shrink-0 flex items-center justify-center border border-border/40">
                    {itemImage ? (
                      <img
                        src={returnImageUrl(itemImage)}
                        alt={item.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=120';
                        }}
                      />
                    ) : (
                      <ImageIcon className="w-5 h-5 text-foreground/30" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-foreground truncate">{item.name}</p>
                    <p className="text-xs text-foreground/50 mt-0.5">
                      Qty: {item.quantity} • {item.variant?.unit || 'Piece'}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-bold text-foreground">
                      KES {(item.variant?.price || 0).toLocaleString()}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* --- Proof of Delivery --- */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-sm font-bold text-foreground">Proof of delivery</h3>
              <p className="text-[11px] text-foreground/50 mt-0.5">
                Add proof to complete the delivery.
              </p>
            </div>
            <Badge
              variant="success"
              className="bg-primary/10 text-primary text-[10px] font-semibold px-2 py-0.5 rounded-full"
            >
              Recommended
            </Badge>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Camera */}
            <button
              onClick={async () => {
                setSelectedProof('camera');
                try {
                  const { CameraSource } = await import('@capacitor/camera');
                  await handleCaptureImage(CameraSource.Camera);
                } catch (err) {
                  console.error('Failed to import CameraSource:', err);
                }
              }}
              className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all ${
                selectedProof === 'camera'
                  ? 'border-primary bg-primary/5'
                  : 'border-border/50 bg-white hover:border-border'
              }`}
            >
              <div className="relative w-10 h-10 mb-2">
                <Camera className="w-6 h-6 text-foreground/60 mx-auto" />
                {selectedProof === 'camera' && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-primary rounded-full flex items-center justify-center border-2 border-white">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                )}
              </div>
              <p className="text-xs font-bold text-foreground">Take a photo</p>
              <p className="text-[10px] text-foreground/50 text-center mt-0.5 leading-tight">
                Capture from your camera
              </p>
            </button>

            {/* Gallery */}
            <button
              onClick={async () => {
                setSelectedProof('gallery');
                try {
                  const { CameraSource } = await import('@capacitor/camera');
                  await handleCaptureImage(CameraSource.Photos);
                } catch (err) {
                  console.error('Failed to import CameraSource:', err);
                }
              }}
              className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all ${
                selectedProof === 'gallery'
                  ? 'border-primary bg-primary/5'
                  : 'border-border/50 bg-white hover:border-border'
              }`}
            >
              <div className="relative w-10 h-10 mb-2">
                <ImageIcon className="w-6 h-6 text-foreground/60 mx-auto" />
                {selectedProof === 'gallery' && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-primary rounded-full flex items-center justify-center border-2 border-white">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                )}
              </div>
              <p className="text-xs font-bold text-foreground">Choose from gallery</p>
              <p className="text-[10px] text-foreground/50 text-center mt-0.5 leading-tight">
                Select existing photo
              </p>
            </button>

            {/* Signature removed: proof now only supports camera or gallery */}
          </div>

          {/* Captured Proof Preview */}
          {proofImage && (
            <div className="mt-3 relative rounded-xl overflow-hidden border border-border bg-secondary flex items-center justify-center aspect-video max-h-48">
              <img src={proofImage} alt="Proof of delivery preview" className="w-full h-full object-cover" />
              <button
                onClick={() => {
                  setProofImage(null);
                  setProofBlob(null);
                }}
                className="absolute top-2 right-2 p-1.5 bg-black/60 hover:bg-black/80 text-white rounded-full transition-colors"
                title="Remove photo"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* --- Confirm Delivery Checklist --- */}
        <div className="bg-primary/5 border border-primary/10 rounded-2xl p-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-sm font-bold text-foreground">Confirm delivery</p>
              <p className="text-[11px] text-foreground/60 mt-0.5">
                Please confirm the following:
              </p>
            </div>
          </div>

          <div className="space-y-3 pl-9">
            <div className="flex items-start gap-2">
              <Check className="w-4 h-4 text-primary mt-0.5 shrink-0" />
              <p className="text-xs text-foreground/80 leading-tight">
                I handed the order to the customer or left it in a safe place
              </p>
            </div>
            <div className="flex items-start gap-2">
              <Check className="w-4 h-4 text-primary mt-0.5 shrink-0" />
              <p className="text-xs text-foreground/80 leading-tight">
                I have confirmed the customer details
              </p>
            </div>
            <div className="flex items-start gap-2">
              <Check className="w-4 h-4 text-primary mt-0.5 shrink-0" />
              <p className="text-xs text-foreground/80 leading-tight">
                The order is complete and delivered
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
              placeholder="Add any note about the delivery (e.g. handed to security)"
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
            onClick={handleConfirmDelivery}
            disabled={isSubmitting}
            className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-3.5 gap-2 text-sm"
          >
            <CheckCircle className="w-5 h-5" /> {isSubmitting ? 'Submitting...' : 'Mark as Delivered'}
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

      {/* --- Item Image/Details Preview Modal --- */}
      <AnimatePresence>
        {selectedPreviewItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-4 backdrop-blur-xs"
            onClick={() => setSelectedPreviewItem(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl overflow-hidden max-w-sm w-full shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Image Preview Container */}
              <div className="relative aspect-square w-full bg-secondary flex items-center justify-center">
                {selectedPreviewItem.variant?.images?.[0] ? (
                  <img
                    src={returnImageUrl(selectedPreviewItem.variant.images[0])}
                    alt={selectedPreviewItem.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600';
                    }}
                  />
                ) : (
                  <ImageIcon className="w-16 h-16 text-foreground/20" />
                )}
                <button
                  onClick={() => setSelectedPreviewItem(null)}
                  className="absolute top-4 right-4 w-9 h-9 bg-black/50 text-white rounded-full flex items-center justify-center backdrop-blur-md hover:bg-black/70 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Item Info */}
              <div className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h4 className="text-base font-bold text-foreground">{selectedPreviewItem.name}</h4>
                    <p className="text-[10px] text-foreground/50 mt-1">
                      SKU: {selectedPreviewItem.variant?.sku || 'N/A'}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-base font-extrabold text-primary">
                      KES {(selectedPreviewItem.variant?.price || 0).toLocaleString()}
                    </p>
                    <p className="text-[9px] text-foreground/40 font-medium mt-0.5">Unit Price</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-border/50">
                  <div className="bg-secondary/40 rounded-xl p-2.5 text-center">
                    <p className="text-xs font-bold text-foreground">{selectedPreviewItem.quantity}</p>
                    <p className="text-[9px] text-foreground/50 mt-0.5">Quantity Ordered</p>
                  </div>
                  <div className="bg-secondary/40 rounded-xl p-2.5 text-center">
                    <p className="text-xs font-bold text-foreground">
                      KES {((selectedPreviewItem.variant?.price || 0) * selectedPreviewItem.quantity).toLocaleString()}
                    </p>
                    <p className="text-[9px] text-foreground/50 mt-0.5">Total Price</p>
                  </div>
                </div>

                <div className="mt-5">
                  <Button
                    onClick={() => setSelectedPreviewItem(null)}
                    className="w-full bg-primary hover:bg-primary/90 text-white font-bold h-10 rounded-xl text-xs"
                  >
                    Close Preview
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};