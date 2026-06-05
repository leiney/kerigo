import React, { useEffect, useState } from 'react';
import { Landmark, Smartphone } from 'lucide-react';
import { OnboardingLayout } from '../../../components/onboarding/OnboardingLayout';
import { SelectionCardList, type SelectionOption } from '../../../components/onboarding/SelectionCardList';
import { useVendorOnboardingStore } from '../../../store/vendorOnboardingStore';

type PayoutMethodStepProps = {
  onNext: (method: 'bank' | 'mpesa') => void;
  onBack: () => void;
};

export const PayoutMethodStep: React.FC<PayoutMethodStepProps> = ({ onNext, onBack }) => {
  const draft = useVendorOnboardingStore((state) => state.draft);
  const setPayoutMode = useVendorOnboardingStore((state) => state.setPayoutMode);
  const [payoutMethod, setPayoutMethod] = useState<'bank' | 'mpesa'>(draft.payoutInfo?.mode ?? 'bank');

  useEffect(() => {
    setPayoutMode(payoutMethod);
  }, [payoutMethod, setPayoutMode]);

  const options: SelectionOption<'bank' | 'mpesa'>[] = [
    {
      value: 'bank',
      label: 'Bank Account',
      description: 'Receive payouts to your bank',
      icon: <Landmark className="w-6 h-6" />,
    },
    {
      value: 'mpesa',
      label: 'M-Pesa',
      description: 'Receive payouts to your M-Pesa',
      icon: <Smartphone className="w-6 h-6" />,
    },
  ];

  return (
    <OnboardingLayout
      currentStep={7}
      stepNumber={6}
      title="Payout Method"
      subtitle="Choose how you want to receive payouts."
      icon={<Landmark className="w-7 h-7 text-primary" />}
      onBack={onBack}
      onContinue={() => onNext(payoutMethod)}
    >
      <SelectionCardList
        options={options}
        selectedValue={payoutMethod}
        onChange={setPayoutMethod}
      />
    </OnboardingLayout>
  );
};
