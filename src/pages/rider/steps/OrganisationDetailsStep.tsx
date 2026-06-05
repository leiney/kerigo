import React, { useEffect, useState } from 'react';
import { Input, Select } from '@stackloop/ui';
import { Building2, FileText, Hash } from 'lucide-react';
import { OnboardingLayout } from '../../../components/onboarding/OnboardingLayout';
import { requiredTextError, selectionError, alphanumericError } from '../../../lib/onboardingValidation';
import { useRiderOnboardingStore } from '../../../store/riderOnboardingStore';
import type { RiderBusinessType } from '../../../../lib/types';

type OrganisationDetailsStepProps = {
  onNext: () => void;
  onBack: () => void;
};

export const OrganisationDetailsStep: React.FC<OrganisationDetailsStepProps> = ({ onNext, onBack }) => {
  const draft = useRiderOnboardingStore((state) => state.draft);
  const setOrganizationInfo = useRiderOnboardingStore((state) => state.setOrganizationInfo);
  const [hasAttemptedContinue, setHasAttemptedContinue] = useState(false);
  
  const [formData, setFormData] = useState({
    organisationName: draft.organizationInfo.name,
    businessType: draft.organizationInfo.businessType,
    organisationNumber: draft.organizationInfo.registrationNo,
    taxId: draft.organizationInfo.taxIDNumber
  });

  useEffect(() => {
    setOrganizationInfo({
      name: formData.organisationName,
      businessType: (formData.businessType || 'other') as any,
      registrationNo: formData.organisationNumber,
      taxIDNumber: formData.taxId,
    });
  }, [formData, setOrganizationInfo]);

  const organisationNameValidationError = requiredTextError(formData.organisationName, 'Organisation name');
  const businessTypeValidationError = selectionError(formData.businessType, 'business type');
  const organisationNumberValidationError = alphanumericError(formData.organisationNumber, 'Registration number');
  const taxIdValidationError = alphanumericError(formData.taxId, 'KRA PIN');
  
  const organisationNameError = hasAttemptedContinue ? organisationNameValidationError : '';
  const businessTypeError = hasAttemptedContinue ? businessTypeValidationError : '';
  const organisationNumberError = hasAttemptedContinue ? organisationNumberValidationError : '';
  const taxIdError = hasAttemptedContinue ? taxIdValidationError : '';
  const isFormValid = !organisationNameValidationError && !businessTypeValidationError && !organisationNumberValidationError && !taxIdValidationError;

  const businessTypes = [
    { value: 'delivery', label: 'Delivery' },
    { value: 'courier', label: 'Courier' },
    { value: 'logistics', label: 'Logistics' },
    { value: 'transport', label: 'Transport' },
    { value: 'motorbike_taxi', label: 'Motorbike Taxi' },
    { value: 'ecommerce_delivery', label: 'Ecommerce Delivery' },
    { value: 'food_delivery', label: 'Food Delivery' },
    { value: 'parcel_delivery', label: 'Parcel Delivery' },
    { value: 'fleet_management', label: 'Fleet Management' },
    { value: 'other', label: 'Other' },
  ] as const;

  const handleContinue = () => {
    if (!isFormValid) {
      setHasAttemptedContinue(true);
      return;
    }
    onNext();
  };

  return (
    <OnboardingLayout
      currentStep={2}
      stepNumber={2}
      title="Organisation Details"
      subtitle="Tell us about your organisation."
      icon={<Building2 className="w-7 h-7 text-primary" />}
      onBack={onBack}
      onContinue={handleContinue}
    >
      <div>
        <Input
          label="Organisation Name"
          placeholder="Enter name"
          value={formData.organisationName}
          onChange={(value) => setFormData({ ...formData, organisationName: String(value) })}
          error={organisationNameError}
          leftIcon={<Building2 className="w-5 h-5 text-foreground/40" />}
          className="h-14 rounded-2xl"
        />
      </div>

      <div className='pb-6'>
        <Select
          label="Business Type"
          placeholder="Select business type"
          options={businessTypes.map((type) => ({ value: type.value, label: type.label }))}
          value={formData.businessType}
          onChange={(value) => setFormData({ ...formData, businessType: String(value) as RiderBusinessType })}
          error={businessTypeError}
          className="rounded-2xl h-14"
        />
      </div>

      <div>
        <Input
          label="Registration Number"
          placeholder="Enter registration number"
          value={formData.organisationNumber}
          onChange={(value) => setFormData({ ...formData, organisationNumber: String(value) })}
          error={organisationNumberError}
          leftIcon={<Hash className="w-5 h-5 text-foreground/40" />}
          className="h-14 rounded-2xl"
          required
        />
      </div>

      <div>
        <Input
          label="KRA PIN"
          placeholder="Enter KRA PIN"
          value={formData.taxId}
          onChange={(value) => setFormData({ ...formData, taxId: String(value) })}
          error={taxIdError}
          leftIcon={<FileText className="w-5 h-5 text-foreground/40" />}
          className="h-14 rounded-2xl"
          required
        />
      </div>
    </OnboardingLayout>
  );
};
