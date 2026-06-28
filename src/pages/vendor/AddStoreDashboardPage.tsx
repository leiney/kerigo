import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Badge, Button, Input, Select } from '@stackloop/ui';
import { ChevronLeft, MapPin, Navigation } from 'lucide-react';
import { motion } from 'motion/react';
import { businessTypeOptions } from '../../lib/vendorOnboarding';
import { requiredTextError, selectionError } from '../../lib/onboardingValidation';
import { BusinessType } from '../../../lib/types';
import type { LocationDetails, Store } from '../../../lib/types';
import { storeApi } from '../../../lib/api';

type StoreFormState = {
  storeName: string;
  businessType: string;
  country: string;
  locationDetails: LocationDetails;
};

type PickerState = {
  locationDetails?: LocationDetails;
  formData?: Partial<StoreFormState>;
};

export const AddStoreDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [hasAttemptedContinue, setHasAttemptedContinue] = useState(false);
  const [formData, setFormData] = useState<StoreFormState>({
    storeName: '',
    businessType: '',
    country: 'Kenya',
    locationDetails: {
      latitude: 0,
      longitude: 0,
      address: '',
      city: '',
      country: 'Kenya',
      postalCode: '',
    },
  });

  useEffect(() => {
    const state = location.state as PickerState | null;
    if (!state) return;

    setFormData((prev) => ({
      ...prev,
      ...(state.formData ?? {}),
      locationDetails: state.locationDetails
        ? state.locationDetails
        : prev.locationDetails,
    }));
  }, [location.state]);

  const handlePickLocation = () => {
    navigate('/vendor/location-picker', {
      state: {
        returnTo: '/vendor/products/add-store',
        formData,
        locationDetails: formData.locationDetails,
      },
    });
  };

  const handleContinue = async () => {
    const cityTown = formData.locationDetails.city || '';
    const storeNameError = requiredTextError(formData.storeName, 'Store name');
    const businessTypeError = selectionError(formData.businessType, 'business type');
    const locationError = !formData.locationDetails.address || !cityTown
      ? 'Store location is required.'
      : '';

    if (storeNameError || businessTypeError || locationError) {
      setHasAttemptedContinue(true);
      return;
    }

    const store: Store = {
      storeName: formData.storeName,
      businessType: formData.businessType as BusinessType,
      cityTown,
      locationDetails: {
        longitude: formData.locationDetails.longitude,
        latitude: formData.locationDetails.latitude,
        address: formData.locationDetails.address,
        city: cityTown,
        country: formData.country,
        postalCode: formData.locationDetails.postalCode || undefined,
      },
    };

    try {
      await storeApi.createStore(store);
      navigate('/vendor/dashboard');
    } catch (error) {
      console.error('Failed to create store:', error);
    }
  };

  return (
    <div className="min-h-screen bg-white text-foreground font-sans antialiased flex flex-col relative overflow-hidden">
      <header className="px-5 pt-6 pb-4 flex items-center justify-between">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="p-2 -ml-2 rounded-full hover:bg-secondary transition-colors"
          aria-label="Go back"
        >
          <ChevronLeft className="w-6 h-6 text-foreground" />
        </button>

        <div className="flex-1 text-center">
          <h1 className="text-[22px] font-extrabold tracking-tight text-foreground">Add Store</h1>
          <p className="mt-2 text-sm text-foreground/55">Add basic details to create your store.</p>
        </div>

        <div className="w-10" />
      </header>

      <div className="flex-1 px-6 pt-6 flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="w-full max-w-md space-y-4"
        >
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-foreground block">
              Store Name <span className="text-error ml-0.5">*</span>
            </label>
            <Input
              placeholder="Enter store name"
              value={formData.storeName}
              onChange={(value) => setFormData({ ...formData, storeName: String(value) })}
              error={hasAttemptedContinue ? requiredTextError(formData.storeName, 'Store name') : ''}
              className="h-14 rounded-2xl"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-foreground block">
              Business Type <span className="text-error ml-0.5">*</span>
            </label>
            <Select
              placeholder="Select business type"
              options={businessTypeOptions.map((type) => ({ value: type.value, label: type.label }))}
              value={formData.businessType}
              onChange={(value) => setFormData({ ...formData, businessType: String(value) })}
              error={hasAttemptedContinue ? selectionError(formData.businessType, 'business type') : ''}
              className="h-14 rounded-2xl"
              required
            />
          </div>

          <div className="rounded-2xl border border-border bg-secondary/40 p-4 space-y-3">
            {(() => {
              const cityTown = formData.locationDetails.city || '';
              return hasAttemptedContinue && (!formData.locationDetails.address || !cityTown) ? (
                <p className="text-xs text-error">Store location is required.</p>
              ) : null;
            })()}
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-foreground">Location Details</p>
                <p className="text-xs text-foreground/50">Use GPS to capture the store location</p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handlePickLocation}
                className="h-10 rounded-xl text-xs font-semibold gap-2"
              >
                <Navigation className="w-4 h-4" />
                Pick Location
              </Button>
            </div>

            <div className="grid grid-cols-1 gap-3 text-xs text-foreground/70">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-foreground/40 mt-0.5" />
                <span>{formData.locationDetails.address || 'Address will appear here after location capture'}</span>
              </div>
              <div className="flex items-start gap-2">
                <Navigation className="w-4 h-4 text-foreground/40 mt-0.5" />
                <span>{formData.locationDetails.city || 'City/Town will appear here after location capture'}</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="pt-4 p-6">
        <Button
          type="button"
          onClick={handleContinue}
          className="h-14 w-full rounded-2xl bg-linear-to-r from-[#1b7a14] to-[#0e5f0b] text-lg font-bold shadow-[0_14px_28px_rgba(16,124,18,0.22)]"
        >
          Create Store
        </Button>
      </div>
    </div>
  );
};

export default AddStoreDashboardPage;
