import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Headphones,
  Phone,
  MessageSquare,
  Star,
  ChevronRight,
  Home,
  MapPin,
  Shield,
  Store,
  Navigation,
  Target,
} from 'lucide-react';
import { Button, Badge } from '@stackloop/ui';
import { motion } from 'motion/react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import BottomNav from '../../components/BottomNav';
import { customerApi } from '../../../lib/api';

// Fix for default Leaflet marker icons
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

// Map route coordinates will be derived from API order data when available

// Custom marker icons
const createCustomIcon = (color: string, type: 'store' | 'rider' | 'delivery') => {
  const html = `
    <div style="
      background: ${color};
      border: 3px solid white;
      border-radius: 50%;
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 2px 8px rgba(0,0,0,0.3);
    ">
      ${type === 'store' ? '🏪' : type === 'rider' ? '' : '🏠'}
    </div>
  `;
  
  return L.divIcon({
    html,
    className: 'custom-marker',
    iconSize: [40, 40],
    iconAnchor: [20, 20],
  });
};

// Component to fit map bounds
function FitMapBounds({ bounds }: { bounds: L.LatLngBounds }) {
  const map = useMap();
  React.useEffect(() => {
    map.fitBounds(bounds, { padding: [50, 50], maxZoom: 16 });
  }, [bounds, map]);
  return null;
}

export const TrackOrder: React.FC = () => {
  const navigate = useNavigate();
  const [mapCenter, setMapCenter] = useState<L.LatLngExpression | null>(null);
  const [orderState, setOrderState] = useState<any | null>(null);

  React.useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const latest = await customerApi.getLatestOrder();
        if (!mounted) return;
        setOrderState(latest);
        // set map center if delivery/rider coords exist on latest
        if (latest?.rider?.lat && latest?.rider?.lng) {
          setMapCenter([latest.rider.lat, latest.rider.lng]);
        }
      } catch (e) {
        // ignore and keep UI minimal
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const order = orderState ?? {
    id: '',
    estimatedDelivery: '',
    deliveryTime: '',
    status: '',
    statusDescription: '',
    store: null as any,
    rider: null as any,
    deliveryLocation: null as any,
    items: '',
    total: '',
    steps: [] as any[],
  };

  // Build route coordinates from API data when available
  const routeCoordinates: [number, number][] = orderState?.store && orderState?.rider && orderState?.deliveryLocation
    ? [[orderState.store.lat, orderState.store.lng], [orderState.rider.lat, orderState.rider.lng], [orderState.deliveryLocation.lat, orderState.deliveryLocation.lng]]
    : [];

  const store = order.store;
  const rider = order.rider;
  const deliveryLocation = order.deliveryLocation;
  const estimatedDelivery = order.estimatedDelivery ?? order.eta ?? '';
  const deliveryTime = order.deliveryTime ?? '';
  const statusDescription = order.statusDescription ?? '';
  const orderItems = order.items ?? `${order.itemCount ?? 0} items`;
  const orderTotal = typeof order.total === 'number' ? `KES ${order.total.toLocaleString()}` : order.total;

  const mapBounds = routeCoordinates.length ? L.latLngBounds(routeCoordinates as [number, number][]) : null;

  return (
    <div className="min-h-screen bg-background text-foreground font-sans antialiased pb-20">
      {/* --- Header --- */}
      <header className="px-4 pt-4 pb-2.5 flex items-center justify-between bg-background sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 -ml-2 rounded-full hover:bg-secondary transition-colors"
            aria-label="Back"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <div className="leading-tight">
            <h1 className="text-[17px] font-bold text-foreground">Track Order</h1>
            <p className="text-[11px] text-foreground/50 mt-0.5">Order #{order.id}</p>
          </div>
        </div>
        <button
          className="flex items-center gap-2 text-foreground/70 hover:text-foreground transition-colors"
          aria-label="Help"
        >
          <Headphones className="w-5 h-5" />
        </button>
      </header>

      {/* --- Main Content --- */}
      <div className="px-2.5 space-y-2.5">
        {/* --- Status Card --- */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-3 border border-border/50 shadow-sm"
        >
            <div className="flex items-center justify-between gap-2">
              <div className="flex-1 pr-2 border-r border-border/50">
                <p className="text-[11px] text-foreground/50 mb-1">Estimated Delivery</p>
                <p className="text-[22px] font-extrabold text-primary leading-none">
                  {estimatedDelivery}
                </p>
                <p className="text-[11px] text-foreground/50 mt-1">{deliveryTime}</p>
              </div>

              <div className="flex-1 pl-2">
                <p className="text-[11px] text-foreground/50 mb-1">Order Status</p>
                <p className="text-[18px] font-bold text-primary leading-tight">{order.status}</p>
                <p className="text-[11px] text-foreground/50 mt-0.5">{statusDescription}</p>
              </div>

              {/* Rider photo */}
              <div className="w-18 h-14 shrink-0 ml-1 rounded-2xl overflow-hidden">
                <img
                  src="/rider.png"
                  alt="Rider"
                  className="w-full h-full object-cover rounded-2xl"
                />
              </div>
            </div>
        </motion.div>

        {/* --- Real Map Section --- */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="relative rounded-2xl overflow-hidden border border-border/50 shadow-sm"
          style={{ height: '330px' }}
        >
          {routeCoordinates.length ? (
          <MapContainer
            center={mapCenter ?? [routeCoordinates[1][0], routeCoordinates[1][1]]}
            zoom={14}
            scrollWheelZoom={false}
            className="w-full h-full z-0"
            zoomControl={false}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            
            {/* Route line */}
            <Polyline positions={routeCoordinates} color="#3f940e" weight={4} opacity={0.8} dashArray="5, 5" />

            {/* Store Marker */}
            <Marker position={[store.lat, store.lng]}
              icon={createCustomIcon('#3f940e', 'store')}
            >
              <Popup>
                <div className="p-2">
                    <p className="font-bold text-sm">{store.name}</p>
                      <p className="text-xs text-gray-600">{store.description}</p>
                </div>
              </Popup>
            </Marker>

            {/* Rider Marker */}
            <Marker position={[rider.lat, rider.lng]}
              icon={createCustomIcon('#3f940e', 'rider')}
            >
              <Popup>
                <div className="p-2">
                  <p className="font-bold text-sm">Rider is here</p>
                  <p className="text-xs text-gray-600">5 min away</p>
                </div>
              </Popup>
            </Marker>

            {/* Delivery Location Marker */}
            <Marker position={[deliveryLocation.lat, deliveryLocation.lng]}
              icon={createCustomIcon('#3b82f6', 'delivery')}
            >
              <Popup>
                <div className="p-2">
                  <p className="font-bold text-sm">{deliveryLocation.label}</p>
                  <p className="text-xs text-gray-600">{deliveryLocation.description}</p>
                </div>
              </Popup>
            </Marker>

            {mapBounds && <FitMapBounds bounds={mapBounds} />}
          </MapContainer>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-foreground/40">Map unavailable</div>
          )}

          {/* Map overlay controls */}
          <div className="absolute top-3 left-3 bg-white rounded-xl px-3 py-2 shadow-md border border-border/30 z-400 max-w-[58%]">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-primary/10 rounded-md flex items-center justify-center">
                <Store className="w-3.5 h-3.5 text-primary" />
              </div>
              <div>
                  <p className="text-xs font-bold text-foreground">{store?.name ?? 'Store'}</p>
                  <p className="text-[10px] text-foreground/50 leading-tight">{store?.description ?? 'Preparing your order'}</p>
              </div>
            </div>
          </div>

          <div className="absolute top-3 right-3 bg-white rounded-xl px-3 py-2 shadow-md border border-border/30 z-400">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-primary/10 rounded-md flex items-center justify-center">
                <Navigation className="w-3.5 h-3.5 text-primary" />
              </div>
              <div>
                <p className="text-xs font-bold text-foreground">Rider is here</p>
                <p className="text-[10px] text-foreground/50">5 min away</p>
              </div>
            </div>
          </div>

          <div className="absolute bottom-12 right-3 bg-white rounded-xl px-3 py-2 shadow-md border border-border/30 z-400 max-w-[42%]">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-blue-100 rounded-md flex items-center justify-center">
                <Home className="w-3.5 h-3.5 text-blue-600" />
              </div>
              <div>
                <p className="text-xs font-bold text-foreground">{deliveryLocation?.label ?? 'Delivery location'}</p>
                <p className="text-[10px] text-foreground/50 leading-tight">{deliveryLocation?.description ?? 'Selected address'}</p>
              </div>
            </div>
          </div>

          {/* Locate button */}
          <button className="absolute bottom-3 right-3 w-10 h-10 bg-white rounded-full shadow-md border border-border/30 flex items-center justify-center z-400 hover:bg-secondary transition-colors">
            <Target className="w-5 h-5 text-foreground/70" />
          </button>
        </motion.div>

        {/* --- Rider Card --- */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-white rounded-2xl p-3 border border-border/50 shadow-sm"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-11 h-11 rounded-full bg-primary/10 overflow-hidden shrink-0">
                <img src="/placeholder-avatar.webp" alt="Rider avatar" className="w-full h-full object-cover" />
              </div>
              <div>
                <p className="font-bold text-sm text-foreground">{rider?.name ?? 'Rider'}</p>
                <p className="text-xs text-foreground/50">{rider?.role ?? 'Delivery rider'}</p>
                <div className="flex items-center gap-1 mt-1">
                  <Star className="w-3.5 h-3.5 fill-primary text-primary" />
                    <span className="text-xs font-semibold text-foreground">{rider?.rating ?? '0.0'}</span>
                  <span className="text-xs text-foreground/40">({rider?.reviews ?? ''} reviews)</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="text-primary border-primary/20 hover:bg-primary/5 h-8 px-3 text-[11px] font-semibold gap-1"
              >
                <Phone className="w-4 h-4" />
                Call
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="text-primary border-primary/20 hover:bg-primary/5 h-8 px-3 text-[11px] font-semibold gap-1"
              >
                <MessageSquare className="w-4 h-4" />
                Message
              </Button>
            </div>
          </div>
        </motion.div>

        {/* --- Order Details Card --- */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl p-3 border border-border/50 shadow-sm"
        >
          <div className="flex items-center justify-between mb-1.5">
            <h3 className="font-bold text-sm text-foreground">Order Details</h3>
            <button className="flex items-center gap-1 text-primary text-xs font-semibold hover:underline">
              View Details
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-xs text-foreground/60">{orderItems}</p>
            <p className="text-sm font-bold text-foreground">{orderTotal}</p>
          </div>
        </motion.div>

        {/* --- Step Progress --- */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="bg-white rounded-2xl p-3 border border-border/50 shadow-sm"
        >
          <div className="flex items-center justify-between">
            {order.steps?.map((step: any, index: number) => (
              <div key={index} className="flex flex-col items-center flex-1 relative">
                <div className="relative z-10">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                      step.completed
                        ? 'bg-primary border-primary text-white'
                        : step.active
                        ? 'bg-white border-primary text-primary'
                        : 'bg-white border-border text-border-dark'
                    }`}
                  >
                    {step.completed ? (
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2.5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    ) : step.active ? (
                      <Navigation className="w-5 h-5" />
                    ) : (
                      <Home className="w-5 h-5" />
                    )}
                  </div>
                </div>

                <span
                  className={`text-[11px] font-semibold mt-2 ${
                    step.active || step.completed ? 'text-primary' : 'text-foreground/40'
                  }`}
                >
                  {step.label}
                </span>
                <span className="text-[10px] text-foreground/40 mt-0.5">{step.time}</span>

                {index < ((order.steps?.length ?? 0) - 1) && (
                  <div className="absolute top-5 left-[calc(50%+20px)] w-[calc(100%-40px)] h-0.5 -translate-y-1/2">
                    <div
                      className={`h-full rounded-full ${
                        step.completed ? 'bg-primary' : 'bg-border'
                      }`}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </motion.div>

        {/* --- Safety Banner --- */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-primary/5 border border-primary/10 rounded-xl p-4 flex items-center justify-between cursor-pointer hover:bg-primary/10 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shrink-0 shadow-sm">
              <Shield className="w-4 h-4 text-primary" />
            </div>
            <div>
              <p className="text-sm font-semibold text-primary">
                Your order is safe with us
              </p>
              <p className="text-xs text-foreground/50 mt-0.5">
                We'll notify you when it's delivered
              </p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-foreground/30" />
        </motion.div>
      </div>

      {/* --- Bottom Navigation --- */}
      <BottomNav />
    </div>
  );
};