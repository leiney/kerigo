import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Badge, Button, Input } from '@stackloop/ui';
import {
  ArrowLeft,
  Building2,
  Globe,
  MapPin,
  Navigation,
  RefreshCw,
  Search,
  Target,
} from 'lucide-react';
import { motion } from 'motion/react';
import { MapContainer, Marker, Circle, TileLayer, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import type { LocationDetails } from '../../../lib/types';

// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

type PickerState = {
  returnTo?: string;
  formData?: Record<string, unknown>;
  locationDetails?: LocationDetails;
};

const defaultLocationData: LocationDetails = {
  latitude: -1.2920656,
  longitude: 36.8219467,
  address: 'Kenyatta Avenue, Nairobi, Kenya',
  city: 'Nairobi',
  country: 'Kenya',
  postalCode: '00100',
};

function FitMapView({ center }: { center: [number, number] }) {
  const map = useMap();

  useEffect(() => {
    if (center?.length === 2) {
      map.setView(center, 16);
    }
  }, [center, map]);

  return null;
}

const mapLocationToAddress = (latitude: number, longitude: number): LocationDetails => ({
  latitude,
  longitude,
  address: `Lat ${latitude.toFixed(5)}, Lng ${longitude.toFixed(5)}`,
  city: 'Nairobi',
  country: 'Kenya',
  postalCode: '00100',
});

export const StoreLocationPicker: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = (location.state as PickerState | null) ?? {};
  const returnTo = state.returnTo ?? '/vendor/store-details';
  const [locationData, setLocationData] = useState<LocationDetails>(state.locationDetails ?? defaultLocationData);
  const [editableLocation, setEditableLocation] = useState<LocationDetails>(state.locationDetails ?? defaultLocationData);
  const [isCaptured, setIsCaptured] = useState(Boolean(state.locationDetails));
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleEditableLocationChange =
    (field: 'address' | 'city' | 'postalCode') =>
    (value: unknown) => {
      setEditableLocation((prev) => ({
        ...prev,
        [field]: String(value),
      }));
    };

  useEffect(() => {
    handleRefresh();
    //  capture on mount so the user sees a location immediately.
  }, []);

  const handleRefresh = () => {
    setIsCaptured(false);
    setErrorMsg(null);

    if (!('geolocation' in navigator)) {
      setErrorMsg('Geolocation is not available in this browser.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude, accuracy } = pos.coords;
        const capturedLocation = mapLocationToAddress(latitude, longitude);
        setLocationData(capturedLocation);
        setEditableLocation(capturedLocation);
        setIsCaptured(true);
      },
      (err) => {
        const reason =
          err.code === err.PERMISSION_DENIED
            ? 'Location permission was denied. Allow location access and try again.'
            : err.code === err.POSITION_UNAVAILABLE
              ? 'Unable to determine your position right now. Try again.'
              : err.code === err.TIMEOUT
                ? 'Location request timed out. Try again.'
                : err.message || 'Unable to get location';
        setErrorMsg(reason);
        setIsCaptured(false);
      },
      { enableHighAccuracy: true, maximumAge: 10000, timeout: 10000 }
    );
  };

  const handleUseLocation = () => {
    navigate(returnTo, {
      state: {
        formData: {
          ...(state.formData ?? {}),
          locationDetails: editableLocation,
        },
        locationDetails: editableLocation,
      },
      replace: true,
    });
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans antialiased pb-24">
      <header className="px-4 pt-5 pb-3 flex items-start gap-3 bg-background sticky top-0 z-40">
        <button
          onClick={() => navigate(-1)}
          className="p-2 -ml-2 rounded-full hover:bg-secondary transition-colors mt-1"
        >
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
        <div>
          <h1 className="text-lg font-bold text-foreground leading-tight">Pick Location</h1>
          <p className="text-xs text-foreground/50 mt-0.5">Use GPS to capture the store location</p>
        </div>
      </header>

      <div className="px-4 space-y-4">
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
              <p className="font-bold text-primary text-base">{isCaptured ? 'Location Captured' : 'Capture Location'}</p>
              <p className="text-xs text-foreground/50 mt-0.5">Refresh if you need to capture again</p>
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

        {errorMsg ? (
          <div className="rounded-2xl border border-error/20 bg-error/5 p-3 text-xs text-error">
            {errorMsg}
          </div>
        ) : null}

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="relative rounded-2xl overflow-hidden border border-border/50 shadow-sm"
          style={{ height: '220px' }}
        >
          <MapContainer
            center={[locationData.latitude, locationData.longitude]}
            zoom={15}
            scrollWheelZoom={false}
            className="w-full h-full z-0"
            zoomControl={false}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Circle
              center={[locationData.latitude, locationData.longitude]}
              radius={35}
              fillColor="#3b82f6"
              color="#3b82f6"
              fillOpacity={0.15}
              weight={2}
            />
            <Marker
              position={[locationData.latitude, locationData.longitude]}
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
            <FitMapView center={[locationData.latitude, locationData.longitude]} />
          </MapContainer>
        </motion.div>

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
            <div className="px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Target className="w-4 h-4 text-foreground/40" />
                <span className="text-xs text-foreground/60">Latitude</span>
              </div>
              <span className="text-xs font-semibold text-foreground font-mono">{locationData.latitude}</span>
            </div>

            <div className="px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Navigation className="w-4 h-4 text-foreground/40" />
                <span className="text-xs text-foreground/60">Longitude</span>
              </div>
              <span className="text-xs font-semibold text-foreground font-mono">{locationData.longitude}</span>
            </div>

            <div className="px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-foreground/40" />
                <span className="text-xs text-foreground/60">Address</span>
              </div>
              <span className="text-xs font-semibold text-foreground text-right max-w-[60%]">{locationData.address}</span>
            </div>

            <div className="px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Building2 className="w-4 h-4 text-foreground/40" />
                <span className="text-xs text-foreground/60">City</span>
              </div>
              <span className="text-xs font-semibold text-foreground">{locationData.city}</span>
            </div>

            <div className="px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Globe className="w-4 h-4 text-foreground/40" />
                <span className="text-xs text-foreground/60">Country</span>
              </div>
              <span className="text-xs font-semibold text-foreground">{locationData.country}</span>
            </div>

            <div className="px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Search className="w-4 h-4 text-foreground/40" />
                <span className="text-xs text-foreground/60">Postal Code</span>
              </div>
              <span className="text-xs font-semibold text-foreground">{locationData.postalCode}</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12 }}
          className="bg-white rounded-2xl border border-border/50 shadow-sm p-4 space-y-4"
        >
          <div>
            <h3 className="font-bold text-sm text-foreground">Edit Location Details</h3>
            <p className="text-xs text-foreground/50 mt-0.5">Adjust the address details before returning to the store form.</p>
          </div>

          <div className="space-y-3">
            <Input
              label="Address"
              placeholder="Enter address"
              value={editableLocation.address}
              onChange={handleEditableLocationChange('address')}
            />

            <Input
              label="City / Town"
              placeholder="Enter city or town"
              value={editableLocation.city}
              onChange={handleEditableLocationChange('city')}
            />

            <Input
              label="Postal Code"
              placeholder="Enter postal code"
              value={editableLocation.postalCode}
              onChange={handleEditableLocationChange('postalCode')}
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="space-y-3 pt-2"
        >
          <Button
            className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-3.5 text-sm gap-2 shadow-sm shadow-primary/20"
            onClick={handleUseLocation}
          >
            <MapPin className="w-4 h-4" />
            Use This Location
          </Button>

          <Button
            variant="outline"
            className="w-full border-border hover:bg-secondary text-foreground font-bold py-3.5 text-sm gap-2"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default StoreLocationPicker;