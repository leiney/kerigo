import React, { useEffect, useState } from 'react';
import { Input } from '@stackloop/ui';
import { User } from 'lucide-react';
import { OnboardingLayout } from '../../../components/onboarding/OnboardingLayout';
import { emailError, phoneError, requiredTextError } from '../../../lib/onboardingValidation';
import { useVendorOnboardingStore } from '../../../store/vendorOnboardingStore';

type AdministratorDetailsStepProps = {
  onNext: () => void;
  onBack: () => void;
};

export const AdministratorDetailsStep: React.FC<AdministratorDetailsStepProps> = ({ onNext, onBack }) => {
  const draft = useVendorOnboardingStore((state) => state.draft);
  const setIdentityDetails = useVendorOnboardingStore((state) => state.setIdentityDetails);
  const [hasAttemptedContinue, setHasAttemptedContinue] = useState(false);

  const [formData, setFormData] = useState({
    fullName: draft.fullName,
    phoneNumber: draft.phoneNo,
    email: draft.email,
  });

  useEffect(() => {
    setIdentityDetails({
      fullName: formData.fullName,
      phoneNo: formData.phoneNumber,
      email: formData.email,
    });
  }, [formData, setIdentityDetails]);

  const fullNameValidationError = requiredTextError(formData.fullName, 'Full name');
  const phoneNumberValidationError = phoneError(formData.phoneNumber, 'Phone number');
  const emailAddressValidationError = emailError(formData.email);
  
  const fullNameError = hasAttemptedContinue ? fullNameValidationError : '';
  const phoneNumberError = hasAttemptedContinue ? phoneNumberValidationError : '';
  const emailAddressError = hasAttemptedContinue ? emailAddressValidationError : '';
  const isFormValid = !fullNameValidationError && !phoneNumberValidationError && !emailAddressValidationError;

  const handleContinue = () => {
    if (!isFormValid) {
      setHasAttemptedContinue(true);
      return;
    }
    onNext();
  };

  return (
    <OnboardingLayout
      currentStep={3}
      stepNumber={3}
      title="Administrator Details"
      subtitle="Add the details of the administrator for this organisation."
      icon={<User className="w-7 h-7 text-primary" />}
      onBack={onBack}
      onContinue={handleContinue}
    >
      <div>
        <Input
          label="Full Name"
          placeholder="Enter full name"
          value={formData.fullName}
          onChange={(value) => setFormData({ ...formData, fullName: String(value) })}
          error={fullNameError}
          className="h-14 rounded-2xl"
          required
        />
      </div>

      <div className="pb-5">
        <Input
          label="Phone Number"
          type="phone"
          placeholder="Enter phone number"
          value={formData.phoneNumber}
          onChange={(value) => setFormData({ ...formData, phoneNumber: String(value) })}
          defaultCountry="KE"
          error={phoneNumberError}
          className="h-14 rounded-2xl"
          required
        />
      </div>

      <div>
        <Input
          label="Email Address"
          type="email"
          placeholder="Enter email address"
          value={formData.email}
          onChange={(value) => setFormData({ ...formData, email: String(value) })}
          error={emailAddressError}
          className="h-14 rounded-2xl"
          required
        />
      </div>
    </OnboardingLayout>
  );
};
