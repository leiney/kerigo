import React, { useEffect, useState } from 'react';
import { Input } from '@stackloop/ui';
import { Smartphone, Info } from 'lucide-react';
import { OnboardingLayout } from '../../../components/onboarding/OnboardingLayout';
import { phoneError } from '../../../lib/onboardingValidation';
import { useRiderOnboardingStore } from '../../../store/riderOnboardingStore';

type MPesaDetailsStepProps = {
  onNext: () => void;
  onBack: () => void;
};

export const MPesaDetailsStep: React.FC<MPesaDetailsStepProps> = ({ onNext, onBack }) => {
  const draft = useRiderOnboardingStore((state) => state.draft);
  const setMpesaDetails = useRiderOnboardingStore((state) => state.setMpesaDetails);
  const [hasAttemptedContinue, setHasAttemptedContinue] = useState(false);
  const savedMpesaNumber = (draft.payoutInfo?.details as { phoneNo?: string } | undefined)?.phoneNo ?? '';
  
  const [formData, setFormData] = useState({
    mpesaNumber: savedMpesaNumber
  });

  useEffect(() => {
    setMpesaDetails(formData.mpesaNumber);
  }, [formData.mpesaNumber, setMpesaDetails]);

  const mpesaNumberValidationError = phoneError(formData.mpesaNumber, 'M-Pesa number');
  const mpesaNumberError = hasAttemptedContinue ? mpesaNumberValidationError : '';
  const isFormValid = !mpesaNumberValidationError;

  const handleContinue = () => {
    if (!isFormValid) {
      setHasAttemptedContinue(true);
      return;
    }
    onNext();
  };

  return (
    <OnboardingLayout
      currentStep={6}
      stepNumber={5}
      title="M-Pesa Details"
      subtitle="Enter your M-Pesa details."
      icon={<Smartphone className="w-7 h-7 text-primary" />}
      onBack={onBack}
      onContinue={handleContinue}
    >
      <div className="bg-primary/5 border border-primary/20 rounded-xl p-3 flex items-start gap-3 mt-2 shrink-0">
        <Info className="w-4 h-4 text-primary shrink-0 mt-0.5" />
        <p className="text-xs text-foreground/70 leading-tight">
          Payouts will be sent to the M-Pesa number you provide.
        </p>
      </div>

      <div className='pb-4'>
        <Input
          label="M-Pesa Number"
          type="phone"
          placeholder="Enter M-Pesa number"
          value={formData.mpesaNumber}
          onChange={(value) => setFormData({ ...formData, mpesaNumber: String(value) })}
          defaultCountry="KE"
          error={mpesaNumberError}
          className="rounded-2xl h-14"
          required
        />
      </div>
    </OnboardingLayout>
  );
};
