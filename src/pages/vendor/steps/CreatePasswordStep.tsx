import React, { useEffect, useState } from 'react';
import { Input } from '@stackloop/ui';
import { Lock, CheckCircle2, Circle } from 'lucide-react';
import { OnboardingLayout } from '../../../components/onboarding/OnboardingLayout';
import { getPasswordValidation } from '../../../lib/passwordValidation';
import { useVendorOnboardingStore } from '../../../store/vendorOnboardingStore';

type CreatePasswordStepProps = {
  onNext: () => void;
  onBack: () => void;
};

export const CreatePasswordStep: React.FC<CreatePasswordStepProps> = ({ onNext, onBack }) => {
  const draft = useVendorOnboardingStore((state) => state.draft);
  const setPassword = useVendorOnboardingStore((state) => state.setPassword);
  const [hasAttemptedContinue, setHasAttemptedContinue] = useState(false);
  const [formData, setFormData] = useState({
    password: draft.password || '',
    confirmPassword: draft.password || ''
  });

  const passwordValidation = getPasswordValidation(formData.password, formData.confirmPassword);
  const showPasswordError = hasAttemptedContinue || formData.password.length > 0;
  const showConfirmError = hasAttemptedContinue || formData.confirmPassword.length > 0;
  const passwordError = showPasswordError ? passwordValidation.passwordError : '';
  const confirmPasswordError = showConfirmError ? passwordValidation.confirmPasswordError : '';

  useEffect(() => {
    setPassword(formData.password);
  }, [formData.password, setPassword]);

  const isFormValid = passwordValidation.isValid;

  const handleContinue = () => {
    if (!isFormValid) {
      setHasAttemptedContinue(true);
      return;
    }
    onNext();
  };

  const RequirementItem = ({ met, label }: { met: boolean; label: string }) => (
    <div className="flex items-center gap-2">
      {met ? (
        <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
      ) : (
        <Circle className="w-4 h-4 text-gray-300 shrink-0" />
      )}
      <span className={`text-xs ${met ? 'text-primary' : 'text-foreground/40'}`}>
        {label}
      </span>
    </div>
  );

  return (
    <OnboardingLayout
      currentStep={9}
      stepNumber={8}
      title="Create Password"
      subtitle="Secure your account with a strong password."
      icon={<Lock className="w-7 h-7 text-primary" />}
      onBack={onBack}
      onContinue={handleContinue}
    >
      <Input
        type="password"
        label="Password"
        placeholder="Enter password"
        value={formData.password}
        onChange={(value) => setFormData({ ...formData, password: String(value) })}
        error={passwordError}
        leftIcon={<Lock className="w-5 h-5 text-foreground/40" />}
        className="rounded-2xl h-14"
        required
      />

      <Input
        type="password"
        label="Confirm Password"
        placeholder="Confirm password"
        value={formData.confirmPassword}
        onChange={(value) => setFormData({ ...formData, confirmPassword: String(value) })}
        error={confirmPasswordError}
        leftIcon={<Lock className="w-5 h-5 text-foreground/40" />}
        className="rounded-2xl h-14"
        required
      />

      <div className="bg-gray-50/50 rounded-xl p-4 space-y-3 mt-2 shrink-0">
        <RequirementItem met={passwordValidation.validation.length} label="At least 8 characters" />
        <RequirementItem met={passwordValidation.validation.number} label="Include a number" />
        <RequirementItem met={passwordValidation.validation.uppercase} label="Include an uppercase letter" />
      </div>
    </OnboardingLayout>
  );
};
