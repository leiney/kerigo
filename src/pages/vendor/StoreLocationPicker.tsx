import React, { useEffect, useState, useRef } from 'react';
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
import { authApi } from '../../../lib/api';
import { Capacitor } from '@capacitor/core';
import { Geolocation } from '@capacitor/geolocation';
import { useAuth } from '../../context/AuthContext';


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
  fromLogin?: boolean;
  user?: any;
  title?: string;
  subtitle?: string;
};

const defaultLocationData: LocationDetails = {
  latitude: 0,
  longitude: 0,
  address: '',
  city: '',
  country: '',
  postalCode: '',
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

const reverseGeocode = async (latitude: number, longitude: number): Promise<Partial<LocationDetails>> => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`,
      {
        headers: {
          'Accept-Language': 'en',
          'User-Agent': 'KerigoApp/1.0',
        },
      }
    );
    if (!response.ok) throw new Error('Failed to fetch address');
    const data = await response.json();
    const addr = data.address || {};
    
    const cleanWord = (val: string) => {
      if (!val) return '';
      return val
        .replace(/\b(ward|division|location|county|subcounty|province|district)\b/gi, '')
        .trim();
    };

    const rawTown = addr.town || addr.city || addr.village || addr.municipality || addr.county || addr.suburb || addr.neighbourhood || '';
    const townVal = cleanWord(rawTown);

    const parts: string[] = [];

    // Broadest to most specific
    if (addr.country) {
      parts.push(addr.country);
    }

    const stateVal = addr.state || addr.county || addr.region;
    if (stateVal && !parts.some(p => p.toLowerCase().includes(stateVal.toLowerCase()))) {
      parts.push(stateVal);
    }

    const cityVal = addr.city || addr.town || addr.village;
    if (cityVal && !parts.some(p => p.toLowerCase().includes(cityVal.toLowerCase()))) {
      parts.push(cityVal);
    }

    const neighborhood = cleanWord(addr.suburb || addr.neighbourhood || addr.city_block || addr.city_district);
    if (neighborhood && !parts.some(p => p.toLowerCase().includes(neighborhood.toLowerCase()))) {
      parts.push(neighborhood);
    }

    const streetName = addr.road || addr.pedestrian || addr.path || addr.footway;
    if (streetName && !parts.some(p => p.toLowerCase().includes(streetName.toLowerCase()))) {
      parts.push(streetName);
    }

    const placeName = addr.amenity || addr.shop || addr.building || addr.office;
    if (placeName && !parts.some(p => p.toLowerCase().includes(placeName.toLowerCase()))) {
      parts.push(placeName);
    }

    const cleanAddress = parts.length > 0 ? parts.join(', ') : (data.display_name || `${latitude.toFixed(5)}, ${longitude.toFixed(5)}`);

    return {
      address: cleanAddress,
      city: townVal,
      country: addr.country || '',
      postalCode: addr.postcode || '',
    };
  } catch (error) {
    console.error('Reverse geocoding error:', error);
    return {
      address: `Lat ${latitude.toFixed(5)}, Lng ${longitude.toFixed(5)}`,
      city: '',
      country: '',
      postalCode: '',
    };
  }
};

export const StoreLocationPicker: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { updateUser, isAuthenticated, user } = useAuth();
  const state = (location.state as PickerState | null) ?? {};
  const returnTo = state.returnTo ?? '/vendor/store-details';
  const title = state.title ?? 'Pick Location';
  const subtitle = state.subtitle ?? 'Use GPS to capture the location';
  const [locationData, setLocationData] = useState<LocationDetails>(state.locationDetails ?? defaultLocationData);
  const [editableLocation, setEditableLocation] = useState<LocationDetails>(state.locationDetails ?? defaultLocationData);
  const [isCaptured, setIsCaptured] = useState(Boolean(state.locationDetails));
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [requiresLocationPermission, setRequiresLocationPermission] = useState(false);
  const [hasAttemptedContinue, setHasAttemptedContinue] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mapLayer, setMapLayer] = useState<'roadmap' | 'satellite'>('roadmap');


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
  }, []);

  const requestLocationAccess = async () => {
    setErrorMsg(null);
    setRequiresLocationPermission(false);

    if (!Capacitor.isNativePlatform()) {
      return handleRefresh();
    }

    try {
      const perm = await Geolocation.requestPermissions();
      if (perm.location === 'granted') {
        await handleRefresh();
      } else {
        setRequiresLocationPermission(true);
        setErrorMsg('Location permission denied. Allow location access and try again.');
      }
    } catch (err: any) {
      const reason = err?.message || 'Unable to request location permission.';
      setErrorMsg(reason);
      setRequiresLocationPermission(true);
    }
  };

  const handleRefresh = async () => {
    setIsCaptured(false);
    setErrorMsg(null);
    setRequiresLocationPermission(false);

    try {
      let lat: number;
      let lng: number;

      if (Capacitor.isNativePlatform()) {
        let perm = await Geolocation.checkPermissions();
        if (perm.location !== 'granted') {
          perm = await Geolocation.requestPermissions();
        }
        if (perm.location !== 'granted') {
          throw new Error('Location permission was denied. Allow location access and try again.');
        }
        const pos = await Geolocation.getCurrentPosition({
          enableHighAccuracy: true,
          timeout: 10000,
        });
        lat = pos.coords.latitude;
        lng = pos.coords.longitude;
      } else {
        // Web Geolocation
        if (!('geolocation' in navigator)) {
          throw new Error('Geolocation is not available in this browser.');
        }
        const pos = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            maximumAge: 10000,
            timeout: 10000,
          });
        });
        lat = pos.coords.latitude;
        lng = pos.coords.longitude;
      }

      // Reverse geocode to automatically capture town/suburb/village, country, postal code, etc.
      const geoDetails = await reverseGeocode(lat, lng);

      const capturedLocation: LocationDetails = {
        latitude: lat,
        longitude: lng,
        address: geoDetails.address || `Lat ${lat.toFixed(5)}, Lng ${lng.toFixed(5)}`,
        city: geoDetails.city || '',
        country: geoDetails.country || '',
        postalCode: geoDetails.postalCode || '',
      };

      setLocationData(capturedLocation);
      setEditableLocation(capturedLocation);
      setIsCaptured(true);
    } catch (err: any) {
      const reason = err.message || 'Unable to get location';
      setErrorMsg(reason);
      setIsCaptured(false);
    }
  };

  const handleUseLocation = async () => {
    if (!editableLocation.address.trim() || !editableLocation.city.trim()) {
      setHasAttemptedContinue(true);
      return;
    }

    setIsSubmitting(true);
    if (isAuthenticated && user) {
      try {
        await authApi.updateLocation(editableLocation);
        const updatedUser = {
          ...user,
          extraData: {
            location: editableLocation,
          },
        };
        updateUser(updatedUser);
      } catch (err) {
        console.error('Failed to update location:', err);
      }
    } else if (state.fromLogin) {
      try {
        await authApi.updateLocation(editableLocation);
        if (state.user) {
          const updatedUser = {
            ...state.user,
            extraData: {
              location: editableLocation,
            },
          };
          updateUser(updatedUser);
        }
      } catch (err) {
        console.error('Failed to update location:', err);
      }
    }
    setIsSubmitting(false);

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
          <h1 className="text-lg font-bold text-foreground leading-tight">{title}</h1>
          <p className="text-xs text-foreground/50 mt-0.5">{subtitle}</p>
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
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              className="text-primary border-primary/30 hover:bg-primary/5 h-9 px-3 text-xs font-semibold gap-1.5"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${!isCaptured ? 'animate-spin' : ''}`} />
              Refresh
            </Button>           
              <Button
                variant="outline"
                size="sm"
                onClick={requestLocationAccess}
                className="text-primary border-primary/30 hover:bg-primary/5 h-9 px-3 text-xs font-semibold"
              >
                Enable GPS
              </Button>
          </div>
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
          style={{ height: '220px', background: 'transparent' }}
        >
          {locationData.latitude === 0 ? (
            <div className="w-full h-full flex flex-col items-center justify-center bg-secondary/30 text-center p-4">
              <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin mb-2" />
              <p className="text-xs font-semibold text-foreground/50">Determining GPS coordinates...</p>
            </div>
          ) : (
            <>
              {/* Roadmap/Satellite Toggle Button Overlay */}
              <button
                type="button"
                onClick={() => setMapLayer((prev) => (prev === 'roadmap' ? 'satellite' : 'roadmap'))}
                className="absolute top-3 right-3 z-[1000] bg-white hover:bg-secondary border border-border/50 text-foreground px-3 py-1.5 rounded-xl text-[10px] font-bold shadow-md flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer"
              >
                {mapLayer === 'roadmap' ? (
                  <>
                    <Globe className="w-3 h-3 text-primary animate-pulse" />
                    Satellite View
                  </>
                ) : (
                  <>
                    <MapPin className="w-3 h-3 text-primary" />
                    Roadmap View
                  </>
                )}
              </button>

              <MapContainer
                center={[locationData.latitude, locationData.longitude]}
                zoom={15}
                scrollWheelZoom={false}
                className="w-full h-full z-0"
                zoomControl={false}
              >
                <TileLayer
                  attribution={
                    mapLayer === 'roadmap'
                      ? '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                      : 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
                  }
                  url={
                    mapLayer === 'roadmap'
                      ? 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
                      : 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
                  }
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
            </>
          )}
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
            <p className="text-xs text-foreground/50 mt-0.5">Adjust the address details before returning.</p>
          </div>

          <div className="space-y-3">
            <Input
              label="Address"
              placeholder="Enter address"
              value={editableLocation.address}
              onChange={handleEditableLocationChange('address')}
              error={hasAttemptedContinue && !editableLocation.address.trim() ? 'Address is required.' : ''}
              required
            />

            <Input
              label="City / Town"
              placeholder="Enter city or town"
              value={editableLocation.city}
              onChange={handleEditableLocationChange('city')}
              error={hasAttemptedContinue && !editableLocation.city.trim() ? 'City / Town is required.' : ''}
              required
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
            loading={isSubmitting}
            disabled={isSubmitting}
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