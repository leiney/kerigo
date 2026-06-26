import React, { useEffect, useState } from 'react';
import { Landmark, Smartphone } from 'lucide-react';
import { OnboardingLayout } from '../../../components/onboarding/OnboardingLayout';
import { SelectionCardList, type SelectionOption } from '../../../components/onboarding/SelectionCardList';
import { useRiderOnboardingStore } from '../../../store/riderOnboardingStore';

type PayoutDetailsStepProps = {
  onNext: (method: 'bank' | 'mpesa') => void;
  onBack: () => void;
};

export const PayoutDetailsStep: React.FC<PayoutDetailsStepProps> = ({ onNext, onBack }) => {
  const draft = useRiderOnboardingStore((state) => state.draft);
  const setPayoutMode = useRiderOnboardingStore((state) => state.setPayoutMode);
  const [payoutMethod, setPayoutMethod] = useState<'bank' | 'mpesa'>(
    draft.payoutInfo?.mode === 'bank' || draft.payoutInfo?.mode === 'mpesa'
      ? draft.payoutInfo.mode
      : 'mpesa'
  );

  useEffect(() => {
    setPayoutMode(payoutMethod);
  }, [payoutMethod, setPayoutMode]);

  const options: SelectionOption<'bank' | 'mpesa'>[] = [
    {
      value: 'bank',
      label: 'Bank Account',
      description: 'Receive payouts directly to your bank account.',
      icon: <Landmark className="w-6 h-6" />,
    },
    {
      value: 'mpesa',
      label: 'M-Pesa Number',
      description: 'Receive payouts directly to your M-Pesa account.',
      icon: <Smartphone className="w-6 h-6" />,
    },
  ];

  return (
    <OnboardingLayout
      currentStep={5}
      stepNumber={4}
      title="Payout Details"
      subtitle="Choose how you would like to receive your earnings."
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
