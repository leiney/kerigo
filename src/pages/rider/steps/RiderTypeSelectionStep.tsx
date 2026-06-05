import React from 'react';
import { User, Building2 } from 'lucide-react';
import { OnboardingLayout } from '../../../components/onboarding/OnboardingLayout';
import { SelectionCardList, type SelectionOption } from '../../../components/onboarding/SelectionCardList';
import { useRiderOnboardingStore } from '../../../store/riderOnboardingStore';
import type { AccountType } from '../../../../lib/types';

type RiderTypeSelectionStepProps = {
  onNext: () => void;
  onBack: () => void;
};

export const RiderTypeSelectionStep: React.FC<RiderTypeSelectionStepProps> = ({ onNext, onBack }) => {
  const accountType = useRiderOnboardingStore((state) => state.draft.accountType) ?? 'individual';
  const setAccountType = useRiderOnboardingStore((state) => state.setAccountType);

  const options: SelectionOption<AccountType>[] = [
    {
      value: 'individual',
      label: 'Individual',
      description: 'Join as an individual',
      icon: <User className="w-6 h-6" />,
    },
    {
      value: 'organisation',
      label: 'Company / Organisation',
      description: 'Register as a company or organisation',
      icon: <Building2 className="w-6 h-6" />,
    },
  ];

  return (
    <OnboardingLayout
      currentStep={1}
      stepNumber={1}
      title="Rider Type"
      subtitle="Select how you want to register."
      icon={<User className="w-7 h-7 text-primary" />}
      onBack={onBack}
      onContinue={onNext}
    >
      <div className="w-full flex-1">
        <p className="text-sm font-medium text-foreground/70 mb-4 self-start max-w-md">
          I am registering as
        </p>
        <SelectionCardList
          options={options}
          selectedValue={accountType}
          onChange={setAccountType}
        />
        <p className="text-xs text-foreground/50 text-center mt-6 max-w-60 mx-auto">
          You can change this later from your account settings.
        </p>
      </div>
    </OnboardingLayout>
  );
};
