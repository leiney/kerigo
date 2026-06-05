import React from 'react';
import { User, Building2 } from 'lucide-react';
import { OnboardingLayout } from '../../../components/onboarding/OnboardingLayout';
import { SelectionCardList, type SelectionOption } from '../../../components/onboarding/SelectionCardList';
import { useVendorOnboardingStore } from '../../../store/vendorOnboardingStore';
import type { AccountType } from '../../../../lib/types';

type AccountTypeStepProps = {
  onNext: () => void;
  onBack: () => void;
};

export const AccountTypeStep: React.FC<AccountTypeStepProps> = ({ onNext, onBack }) => {
  const accountType = useVendorOnboardingStore((state) => state.draft.accountType ?? 'individual');
  const setAccountType = useVendorOnboardingStore((state) => state.setAccountType);

  const options: SelectionOption<AccountType>[] = [
    {
      value: 'individual',
      label: 'Individual',
      description: 'Join as an individual',
      icon: <User className="w-6 h-6" />,
    },
    {
      value: 'organisation',
      label: 'Organisation',
      description: 'Register as an organisation',
      icon: <Building2 className="w-6 h-6" />,
    },
  ];

  return (
    <OnboardingLayout
      currentStep={1}
      stepNumber={1}
      title="Choose Account Type"
      subtitle="Join as an individual or register your company."
      icon={<User className="w-7 h-7 text-primary" />}
      onBack={onBack}
      onContinue={onNext}
    >
      <SelectionCardList
        options={options}
        selectedValue={accountType}
        onChange={setAccountType}
      />
    </OnboardingLayout>
  );
};
