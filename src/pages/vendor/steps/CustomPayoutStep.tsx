import React, { useEffect, useState } from 'react';
import { Banknote, Info } from 'lucide-react';
import { OnboardingLayout } from '../../../components/onboarding/OnboardingLayout';
import { useVendorOnboardingStore } from '../../../store/vendorOnboardingStore';

type CustomPayoutStepProps = {
  onNext: () => void;
  onBack: () => void;
};

export const CustomPayoutStep: React.FC<CustomPayoutStepProps> = ({ onNext, onBack }) => {
  const draft = useVendorOnboardingStore((state) => state.draft);
  const setCustomInstructions = useVendorOnboardingStore((state) => state.setCustomInstructions);
  const [hasAttemptedContinue, setHasAttemptedContinue] = useState(false);
  const [customInstructions, setLocalInstructions] = useState(draft.customInstructions ?? '');

  useEffect(() => {
    setCustomInstructions(customInstructions);
  }, [customInstructions, setCustomInstructions]);

  const validationError = !customInstructions.trim() ? 'Please enter your custom details.' : '';
  const error = hasAttemptedContinue ? validationError : '';
  const isFormValid = !validationError;

  const handleContinue = () => {
    if (!isFormValid) {
      setHasAttemptedContinue(true);
      return;
    }
    onNext();
  };

  return (
    <OnboardingLayout
      currentStep={8}
      stepNumber={7}
      title="Custom Details"
      subtitle="Enter your custom payment instructions."
      icon={<Banknote className="w-7 h-7 text-primary" />}
      onBack={onBack}
      onContinue={handleContinue}
    >    
      <div className="flex flex-col gap-2 pb-4 mt-4">
        <label className="text-xs font-bold text-foreground/60 uppercase tracking-wider">
          Custom Payment Instructions
        </label>
        <textarea
          className={`w-full min-h-[140px] p-4 rounded-2xl border ${
            error ? 'border-destructive focus:border-destructive' : 'border-border focus:border-primary'
          } focus:ring-1 focus:ring-primary outline-none text-sm transition-all resize-none bg-transparent`}
          placeholder="e.g. Go to Lipa Na M-PESA, Buy Goods and Services, Enter Till Number 123456..."
          value={customInstructions}
          onChange={(e) => setLocalInstructions(e.target.value)}
          required
        />
        {error && <span className="text-xs text-destructive mt-1 font-medium">{error}</span>}
      </div>
    </OnboardingLayout>
  );
};
