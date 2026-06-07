import React from 'react';
import { Store, Building2 } from 'lucide-react';
import { OnboardingLayout } from '../../../components/onboarding/OnboardingLayout';
import { SelectionCardList, type SelectionOption } from '../../../components/onboarding/SelectionCardList';
import { useVendorOnboardingStore } from '../../../store/vendorOnboardingStore';

type AddYourStoresStepProps = {
  onNext: (storeSetup: 'one' | 'multiple') => void;
  onBack: () => void;
};

export const AddYourStoresStep: React.FC<AddYourStoresStepProps> = ({ onNext, onBack }) => {
  const storeSetup = useVendorOnboardingStore((state) => state.draft.storeSetup ?? 'one');
  const setStoreSetup = useVendorOnboardingStore((state) => state.setStoreSetup);

  const options: SelectionOption<'one' | 'multiple'>[] = [
    { 
      value: 'one', 
      label: 'One Store',
      icon: <Store className="w-6 h-6" />,
      description: 'I have one store'
    },
    { 
      value: 'multiple', 
      label: 'Multiple Stores',
      icon: <Building2 className="w-6 h-6" />,
      description: 'I have more than one store'
    }
  ];

  return (
    <OnboardingLayout
      currentStep={5}
      stepNumber={4}
      title="Add Your Stores"
      subtitle="Add details for all your stores."
      icon={<Store className="w-7 h-7 text-primary" />}
      onBack={onBack}
      onContinue={() => onNext(storeSetup)}
    >
      <SelectionCardList
        options={options}
        selectedValue={storeSetup}
        onChange={setStoreSetup}
      />
    </OnboardingLayout>
  );
};
