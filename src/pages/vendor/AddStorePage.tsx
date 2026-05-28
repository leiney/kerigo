import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Badge, Button, Input, Select } from '@stackloop/ui';
import { ChevronLeft, MapPin, Navigation, Store, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import { businessTypeOptions, type VendorStoreDraft } from '../../lib/vendorOnboarding';
import { StepDots } from '../../components/shared/StepDots';
import { useVendorOnboardingStore } from '../../store/vendorOnboardingStore';
import type { LocationDetails } from '../../../lib/types';

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

export const AddStorePage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const addStore = useVendorOnboardingStore((state) => state.addStore);
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
        returnTo: '/vendor/add-store',
        formData,
        locationDetails: formData.locationDetails,
      },
    });
  };

  const handleContinue = () => {
    const cityTown = formData.locationDetails.city || '';
    if (!formData.storeName || !formData.businessType || !cityTown) {
      return;
    }

    const store: VendorStoreDraft = {
      id: `store-${Date.now()}`,
      storeName: formData.storeName,
      businessType: formData.businessType as VendorStoreDraft['businessType'],
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

    addStore(store);
    navigate('/vendor/manage-multiple-stores');
  };

  return (
    <div className="min-h-screen bg-white text-foreground font-sans antialiased flex flex-col relative overflow-hidden">
      <div className="px-5 pt-6 pb-2 flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="p-2 -ml-2 rounded-full hover:bg-secondary transition-colors"
        >
          <ChevronLeft className="w-6 h-6 text-foreground" />
        </button>

        <StepDots currentStep={6} />

        <div className="w-8" />
      </div>

      <div className="flex-1 px-6 pt-6 flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Store className="w-7 h-7 text-primary" />
          </div>

          <h1 className="text-lg font-bold text-foreground mb-2">
            <span className="text-primary mr-1">
              <Badge className="bg-primary text-white">5</Badge>
            </span>
            Add Store
          </h1>
          <p className="text-sm text-foreground/60 leading-relaxed max-w-70 mx-auto">
            Add a store and keep adding more if needed.
          </p>
        </motion.div>

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
              className="h-14 rounded-2xl"
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
              className="h-14 rounded-2xl"
            />
          </div>

          <div className="rounded-2xl border border-border bg-secondary/40 p-4 space-y-3">
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

      <div className="p-6 pb-8 bg-white">
        <Button
          onClick={handleContinue}
          className="w-full h-14 rounded-2xl text-lg font-bold flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
          icon={<ArrowRight className="w-5 h-5" />}
        >
          Save Store
        </Button>
      </div>

    </div>
  );
};

export default AddStorePage;