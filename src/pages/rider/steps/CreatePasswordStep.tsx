import React, { useEffect, useState } from 'react';
import { Input } from '@stackloop/ui';
import { Lock, CheckCircle2, Circle } from 'lucide-react';
import { OnboardingLayout } from '../../../components/onboarding/OnboardingLayout';
import { getPasswordValidation } from '../../../lib/passwordValidation';
import { useRiderOnboardingStore } from '../../../store/riderOnboardingStore';

type CreatePasswordStepProps = {
  onNext: () => void;
  onBack: () => void;
};

export const CreatePasswordStep: React.FC<CreatePasswordStepProps> = ({ onNext, onBack }) => {
  const draftPassword = useRiderOnboardingStore((state) => state.draft.password);
  const setPassword = useRiderOnboardingStore((state) => state.setPassword);
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);
  
  const [password, setPasswordLocal] = useState(draftPassword);
  const [confirmPassword, setConfirmPassword] = useState(draftPassword);

  useEffect(() => {
    setPassword(password);
  }, [password, setPassword]);

  const passwordValidation = getPasswordValidation(password, confirmPassword);
  const hasMinLength = passwordValidation.validation.length;
  const hasNumber = passwordValidation.validation.number;
  const hasUppercase = passwordValidation.validation.uppercase;
  const showPasswordError = hasAttemptedSubmit || password.length > 0;
  const showConfirmError = hasAttemptedSubmit || confirmPassword.length > 0;

  const handleContinue = () => {
    if (!passwordValidation.isValid) {
      setHasAttemptedSubmit(true);
      return;
    }
    onNext();
  };

  return (
    <OnboardingLayout
      currentStep={7}
      stepNumber={6}
      title="Create Password"
      subtitle="Secure your account with a strong password."
      icon={<Lock className="w-7 h-7 text-primary" />}
      onBack={onBack}
      onContinue={handleContinue}
    >
      <Input
        label="Password"
        type="password"
        placeholder="Enter password"
        value={password}
        onChange={(value) => setPasswordLocal(String(value))}
        error={showPasswordError ? passwordValidation.passwordError : ''}
        className="h-14 rounded-2xl"
      />

      <Input
        label="Confirm Password"
        type="password"
        placeholder="Confirm password"
        value={confirmPassword}
        onChange={(value) => setConfirmPassword(String(value))}
        error={showConfirmError ? passwordValidation.confirmPasswordError : ''}
        className="h-14 rounded-2xl"
      />

      <div className="space-y-3 mt-4 px-1 shrink-0">
        <div className="flex items-center gap-2.5">
          {hasMinLength ? (
            <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
          ) : (
            <Circle className="w-4 h-4 text-border-dark shrink-0" />
          )}
          <span className={`text-xs transition-colors ${hasMinLength ? 'text-foreground' : 'text-foreground/50'}`}>
            At least 8 characters
          </span>
        </div>

        <div className="flex items-center gap-2.5">
          {hasNumber ? (
            <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
          ) : (
            <Circle className="w-4 h-4 text-border-dark shrink-0" />
          )}
          <span className={`text-xs transition-colors ${hasNumber ? 'text-foreground' : 'text-foreground/50'}`}>
            Include a number
          </span>
        </div>

        <div className="flex items-center gap-2.5">
          {hasUppercase ? (
            <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
          ) : (
            <Circle className="w-4 h-4 text-border-dark shrink-0" />
          )}
          <span className={`text-xs transition-colors ${hasUppercase ? 'text-foreground' : 'text-foreground/50'}`}>
            Include an uppercase letter
          </span>
        </div>
      </div>
    </OnboardingLayout>
  );
};
