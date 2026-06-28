import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Input, Select, Button } from '@stackloop/ui';
import { Store, MapPin, Navigation } from 'lucide-react';
import { OnboardingLayout } from '../../../components/onboarding/OnboardingLayout';
import { businessTypeOptions, type VendorStoreDraft } from '../../../lib/vendorOnboarding';
import { requiredTextError, selectionError } from '../../../lib/onboardingValidation';
import { useVendorOnboardingStore } from '../../../store/vendorOnboardingStore';
import type { LocationDetails } from '../../../../lib/types';

type AddStoreStepProps = {
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

export const AddStoreStep: React.FC<AddStoreStepProps> = ({ onNext, onBack }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const draft = useVendorOnboardingStore((state) => state.draft);
  const addStore = useVendorOnboardingStore((state) => state.addStore);
  const [hasAttemptedContinue, setHasAttemptedContinue] = useState(false);
  const [formData, setFormData] = useState<StoreFormState>({
    storeName: '',
    businessType: draft.businessType,
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
        returnTo: '/vendor/onboarding?step=add-store',
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
    onNext();
  };

  return (
    <OnboardingLayout
      currentStep={6}
      stepNumber={5}
      title="Add Store"
      subtitle="Add a store and keep adding more if needed."
      icon={<Store className="w-7 h-7 text-primary" />}
      onBack={onBack}
      onContinue={handleContinue}
      continueText="Save Store"
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
        {hasAttemptedContinue && (!formData.locationDetails.address || !formData.locationDetails.city) ? (
          <p className="text-xs text-error">Store location is required.</p>
        ) : null}
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
    </OnboardingLayout>
  );
};
