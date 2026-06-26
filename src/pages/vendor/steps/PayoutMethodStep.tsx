import React, { useEffect, useState } from 'react';
import { Banknote, Landmark, Smartphone } from 'lucide-react';
import { OnboardingLayout } from '../../../components/onboarding/OnboardingLayout';
import { SelectionCardList, type SelectionOption } from '../../../components/onboarding/SelectionCardList';
import { useVendorOnboardingStore } from '../../../store/vendorOnboardingStore';

type PayoutMethodStepProps = {
  onNext: (method: 'bank' | 'mpesa' | 'custom') => void;
  onBack: () => void;
};

export const PayoutMethodStep: React.FC<PayoutMethodStepProps> = ({ onNext, onBack }) => {
  const draft = useVendorOnboardingStore((state) => state.draft);
  const setPayoutMode = useVendorOnboardingStore((state) => state.setPayoutMode);
  const [payoutMethod, setPayoutMethod] = useState<'bank' | 'mpesa' | 'custom'>(draft.payoutInfo?.mode ?? 'custom');

  useEffect(() => {
    setPayoutMode(payoutMethod);
  }, [payoutMethod, setPayoutMode]);

  const options: SelectionOption<'bank' | 'mpesa' | 'custom'>[] = [
   {
      value: 'custom',
      label: 'Custom ',
      description: 'Receive payments to Till or Paybill',
      icon: <Banknote className="w-6 h-6" />,
    },
    {
      value: 'bank',
      label: 'Bank Account',
      description: 'Receive payments to your bank',
      icon: <Landmark className="w-6 h-6" />,
    },
    {
      value: 'mpesa',
      label: 'M-Pesa',
      description: 'Receive payments to your M-Pesa',
      icon: <Smartphone className="w-6 h-6" />,
    },
  ];

  return (
    <OnboardingLayout
      currentStep={7}
      stepNumber={6}
      title="Payment Method"
      subtitle="Choose how you want to receive payments."
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
