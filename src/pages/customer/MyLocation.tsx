import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  MapPin,
  RefreshCw,
  Target,
  Navigation,
  Globe,
  Mail,
  Building2,
  Hash,
  Search,
} from 'lucide-react';
import { Button } from '@stackloop/ui';
import { motion } from 'motion/react';
import { MapContainer, TileLayer, Circle, Marker, useMap } from 'react-leaflet';
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

// --- Default location (used until we capture real coords) ---
const defaultLocationData = {
  lat: -1.2920656,
  lng: 36.8219467,
  accuracy: 8,
  address: 'Kenyatta Avenue, Nairobi, Kenya',
  city: 'Nairobi',
  country: 'Kenya',
  postalCode: '00100',
};

// Helper to fit map view
function FitMapView({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    if (center && center.length === 2) map.setView(center, 16);
  }, [center, map]);
  return null;
}

export const MyLocation: React.FC = () => {
  const navigate = useNavigate();
  const [isCaptured, setIsCaptured] = useState(false);
  const [locationData, setLocationData] = useState(defaultLocationData);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    // On mount, load saved location from mock API if present.
    let mounted = true;
    (async () => {
      try {
        const saved = await customerApi.getLocation();
        if (!mounted) return;
        if (saved && typeof saved.lat === 'number' && typeof saved.lng === 'number') {
          setLocationData((prev) => ({ ...prev, ...saved }));
          setIsCaptured(true);
          return;
        }
      } catch (e) {
        // ignore
      }
      if (mounted) setIsCaptured(false);
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const handleRefresh = () => {
    setIsCaptured(false);
    setErrorMsg(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude, accuracy } = pos.coords;
        setLocationData((prev) => ({
          ...prev,
          lat: latitude,
          lng: longitude,
          accuracy: Math.round(accuracy),
        }));
        setIsCaptured(true);
      },
      (err) => {
        setErrorMsg(err.message || 'Unable to get location');
        setIsCaptured(false);
      },
      { enableHighAccuracy: true, maximumAge: 10000, timeout: 10000 }
    );
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans antialiased pb-24">
      {/* --- Header --- */}
      <header className="px-4 pt-5 pb-3 flex items-start gap-3 bg-background sticky top-0 z-40">
        <button
          onClick={() => navigate(-1)}
          className="p-2 -ml-2 rounded-full hover:bg-secondary transition-colors mt-1"
        >
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
        <div>
          <h1 className="text-lg font-bold text-foreground leading-tight">My Location</h1>
          <p className="text-xs text-foreground/50 mt-0.5">Capture your current location</p>
        </div>
      </header>

      {/* --- Main Content --- */}
      <div className="px-4 space-y-4">
        {/* --- Location Status Card --- */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-4 border border-border/50 shadow-sm flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
              <Target className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="font-bold text-primary text-base">Location Captured</p>
              <p className="text-xs text-foreground/50 mt-0.5">Accuracy: {locationData.accuracy} meters</p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            className="text-primary border-primary/30 hover:bg-primary/5 h-9 px-3 text-xs font-semibold gap-1.5"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${!isCaptured ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </motion.div>

        {/* --- Map Section --- */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="relative rounded-2xl overflow-hidden border border-border/50 shadow-sm"
          style={{ height: '200px' }}
        >
          <MapContainer
            center={[locationData.lat, locationData.lng]}
            zoom={15}
            scrollWheelZoom={false}
            className="w-full h-full z-0"
            zoomControl={false}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            
            {/* Accuracy Circle (Scaled for visual clarity in UI) */}
            <Circle
              center={[locationData.lat, locationData.lng]}
              radius={35}
              fillColor="#3b82f6"
              color="#3b82f6"
              fillOpacity={0.15}
              weight={2}
            />

            {/* Current Location Marker */}
            <Marker
              position={[locationData.lat, locationData.lng]}
              icon={L.divIcon({
                className: 'custom-location-marker',
                html: `<div style="
                  background: #3b82f6;
                  border: 3px solid white;
                  border-radius: 50%;
                  width: 16px;
                  height: 16px;
                  box-shadow: 0 2px 6px rgba(0,0,0,0.2);
                "></div>`,
                iconSize: [16, 16],
                iconAnchor: [8, 8],
              })}
            />

            <FitMapView center={[locationData.lat, locationData.lng]} />
          </MapContainer>
        </motion.div>

        {/* --- Location Details Card --- */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl border border-border/50 shadow-sm overflow-hidden"
        >
          <div className="px-4 pt-4 pb-2 border-b border-border/50">
            <h3 className="font-bold text-sm text-foreground">Location Details</h3>
          </div>
          
          <div className="divide-y divide-border/50">
            {/* Latitude */}
            <div className="px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Target className="w-4 h-4 text-foreground/40" />
                <span className="text-xs text-foreground/60">Latitude</span>
              </div>
              <span className="text-xs font-semibold text-foreground font-mono">{locationData.lat}</span>
            </div>

            {/* Longitude */}
            <div className="px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Navigation className="w-4 h-4 text-foreground/40" />
                <span className="text-xs text-foreground/60">Longitude</span>
              </div>
              <span className="text-xs font-semibold text-foreground font-mono">{locationData.lng}</span>
            </div>

            {/* Address */}
            <div className="px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-foreground/40" />
                <span className="text-xs text-foreground/60">Address</span>
              </div>
              <span className="text-xs font-semibold text-foreground text-right max-w-[60%]">{locationData.address}</span>
            </div>

            {/* City */}
            <div className="px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Building2 className="w-4 h-4 text-foreground/40" />
                <span className="text-xs text-foreground/60">City</span>
              </div>
              <span className="text-xs font-semibold text-foreground">{locationData.city}</span>
            </div>

            {/* Country */}
            <div className="px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Globe className="w-4 h-4 text-foreground/40" />
                <span className="text-xs text-foreground/60">Country</span>
              </div>
              <span className="text-xs font-semibold text-foreground">{locationData.country}</span>
            </div>

            {/* Postal Code */}
            <div className="px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-foreground/40" />
                <span className="text-xs text-foreground/60">Postal Code</span>
              </div>
              <span className="text-xs font-semibold text-foreground">{locationData.postalCode}</span>
            </div>
          </div>
        </motion.div>

        {/* --- Action Buttons --- */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="space-y-3 pt-2"
        >
          <Button
            className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-3.5 text-sm gap-2 shadow-sm shadow-primary/20"
            onClick={async () => {
              try {
                await customerApi.saveLocation(locationData);
              } catch (e) {
                // ignore
              }
              navigate('/cart', { state: { location: locationData } });
            }}
          >
            <MapPin className="w-4 h-4" />
            Use This Location
          </Button>
          
          <Button
            variant="outline"
            className="w-full border-border hover:bg-secondary text-foreground font-bold py-3.5 text-sm gap-2"
            onClick={() => navigate('/search-places')}
          >
            <Search className="w-4 h-4" />
            Search Places
          </Button>
        </motion.div>
      </div>

      {/* --- Bottom Navigation --- */}
      <BottomNav />
    </div>
  );
};