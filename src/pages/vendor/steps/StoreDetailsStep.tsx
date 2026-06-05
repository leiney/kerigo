import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Input, Select, Button } from '@stackloop/ui';
import { Store, MapPin, ShoppingBag, Navigation } from 'lucide-react';
import { OnboardingLayout } from '../../../components/onboarding/OnboardingLayout';
import { businessTypeOptions, type VendorStoreDraft } from '../../../lib/vendorOnboarding';
import { requiredTextError, selectionError } from '../../../lib/onboardingValidation';
import { useVendorOnboardingStore } from '../../../store/vendorOnboardingStore';
import type { LocationDetails } from '../../../../lib/types';

type StoreDetailsStepProps = {
  onNext: () => void;
  onBack: () => void;
};

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

export const StoreDetailsStep: React.FC<StoreDetailsStepProps> = ({ onNext, onBack }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const addStore = useVendorOnboardingStore((state) => state.addStore);
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
        returnTo: '/vendor/onboarding?step=store-details',
        formData,
        locationDetails: formData.locationDetails,
      },
    });
  };

  const handleContinue = () => {
    const cityTown = formData.locationDetails.city || '';
    const storeNameError = requiredTextError(formData.storeName, 'Store name');
    const businessTypeError = selectionError(formData.businessType, 'business type');
    const locationError = (!formData.locationDetails.address || !cityTown) ? 'Store location is required.' : '';

    if (storeNameError || businessTypeError || locationError) {
      setHasAttemptedContinue(true);
      return;
    }

    const store: VendorStoreDraft = {
      id: `store-${Date.now()}`,
      storeName: formData.storeName,
      businessType: formData.businessType as any,
      cityTown,
      locationDetails: {
        address: formData.locationDetails.address,
        city: cityTown,
        country: formData.country,
        latitude: formData.locationDetails.latitude,
        longitude: formData.locationDetails.longitude,
        postalCode: formData.locationDetails.postalCode || undefined,
      },
    };

    addStore(store);
    onNext();
  };

  return (
    <OnboardingLayout
      currentStep={6}
      stepNumber={5}
      title="Store Details"
      subtitle="Tell us about your store."
      icon={<Store className="w-7 h-7 text-primary" />}
      onBack={onBack}
      onContinue={handleContinue}
    >
      {/* Store Name */}
      <Input
        label="Store Name"
        placeholder="Enter your store name"
        value={formData.storeName}
        onChange={(value) => setFormData({ ...formData, storeName: String(value) })}
        error={hasAttemptedContinue ? requiredTextError(formData.storeName, 'Store name') : ''}
        leftIcon={<ShoppingBag className="w-5 h-5 text-foreground/40" />}
        className="rounded-2xl h-14"
        required
      />

      {/* Business Type */}
      <div className='pb-4'>
        <Select
          label="Business Type"
          placeholder="Select business type"
          options={businessTypeOptions.map((type) => ({ value: type.value, label: type.label }))}
          value={formData.businessType}
          onChange={(value) => setFormData({ ...formData, businessType: String(value) })}
          error={hasAttemptedContinue ? selectionError(formData.businessType, 'business type') : ''}
          className="rounded-2xl h-14"
          required
        />
      </div>

      {/* Store Location */}
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
            <ShoppingBag className="w-4 h-4 text-foreground/40 mt-0.5" />
            <span>{formData.locationDetails.city || 'City/Town will appear here after location capture'}</span>
          </div>
        </div>

        {hasAttemptedContinue && (!formData.locationDetails.address || !formData.locationDetails.city) ? (
          <p className="text-xs text-error">Store location is required.</p>
        ) : null}
      </div>
    </OnboardingLayout>
  );
};
