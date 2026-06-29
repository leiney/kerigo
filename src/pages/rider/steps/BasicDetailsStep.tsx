import React, { useEffect, useState } from 'react';
import { Input } from '@stackloop/ui';
import { User, Mail } from 'lucide-react';
import { OnboardingLayout } from '../../../components/onboarding/OnboardingLayout';
import { emailError, phoneError, requiredTextError } from '../../../lib/onboardingValidation';
import { nameKeyDown, emailKeyDown, sanitizeName, sanitizeEmail } from '../../../lib/useAlphanumericInput';
import { useRiderOnboardingStore } from '../../../store/riderOnboardingStore';

type BasicDetailsStepProps = {
  onNext: () => void;
  onBack: () => void;
};

export const BasicDetailsStep: React.FC<BasicDetailsStepProps> = ({ onNext, onBack }) => {
  const draft = useRiderOnboardingStore((state) => state.draft);
  const setIdentityDetails = useRiderOnboardingStore((state) => state.setIdentityDetails);
  const [hasAttemptedContinue, setHasAttemptedContinue] = useState(false);
  
  const [formData, setFormData] = useState({
    fullName: draft.fullName,
    phoneNumber: draft.phoneNo,
    email: draft.email
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
      currentStep={2}
      stepNumber={2}
      title="Basic Details"
      subtitle="Let's start with some basic information about you."
      icon={<User className="w-7 h-7 text-primary" />}
      onBack={onBack}
      onContinue={handleContinue}
    >
      <div>
        <Input
          label="Full Name"
          placeholder="Enter your full name"
          value={formData.fullName}
          onChange={(value) => setFormData({ ...formData, fullName: sanitizeName(String(value)) })}
          onKeyDown={nameKeyDown}
          error={fullNameError}
          leftIcon={<User className="w-5 h-5 text-foreground/40" />}
          className="h-14 rounded-2xl"
        />
      </div>

      <div className="pb-5">
        <Input
          label="Phone Number"
          placeholder="Enter phone number"
          value={formData.phoneNumber}
          onChange={(value) => setFormData({ ...formData, phoneNumber: String(value) })}
          defaultCountry="KE"
          autoDetect={false}
          error={phoneNumberError}
          className="h-14 rounded-2xl"
          type="tel"
        />
      </div>

      <div>
        <Input
          label="Email Address"
          placeholder="Enter your email address"
          type="email"
          value={formData.email}
          onChange={(value) => setFormData({ ...formData, email: sanitizeEmail(String(value)) })}
          onKeyDown={emailKeyDown}
          error={emailAddressError}
          leftIcon={<Mail className="w-5 h-5 text-foreground/40" />}
          className="h-14 rounded-2xl"
        />
      </div>
    </OnboardingLayout>
  );
};
