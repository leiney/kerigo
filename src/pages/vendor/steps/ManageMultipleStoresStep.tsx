import React from 'react';
import { Badge } from '@stackloop/ui';
import { Plus, LayoutList, Store, Layers } from 'lucide-react';
import { OnboardingLayout } from '../../../components/onboarding/OnboardingLayout';
import { useVendorOnboardingStore } from '../../../store/vendorOnboardingStore';

type ManageMultipleStoresStepProps = {
  onNext: () => void;
  onBack: () => void;
  onAddStore: () => void;
};

export const ManageMultipleStoresStep: React.FC<ManageMultipleStoresStepProps> = ({ onNext, onBack, onAddStore }) => {
  const stores = useVendorOnboardingStore((state) => state.draft.stores);
  const removeStore = useVendorOnboardingStore((state) => state.removeStore);
  const canContinue = stores.length > 0;

  return (
    <OnboardingLayout
      currentStep={5}
      stepNumber={4}
      title="Manage Multiple Stores"
      subtitle="Add multiple stores and keep them in your onboarding draft."
      icon={<Layers className="w-7 h-7 text-primary" />}
      onBack={onBack}
      onContinue={onNext}
      isContinueDisabled={!canContinue}
      continueText={canContinue ? 'Continue' : 'Add at least one store'}
    >
      <div className="w-full flex-1 flex flex-col">
        <div className="space-y-4 pt-2">
          <div className="flex items-start gap-2.5">
            <div className="w-6 h-6 bg-primary/10 rounded-lg flex items-center justify-center mt-0.5 shrink-0">
              <Plus className="w-3.5 h-3.5 text-primary" />
            </div>
            <p className="text-xs text-foreground/70 leading-tight font-medium">
              Add your stores
            </p>
          </div>
          
          <div className="flex items-start gap-2.5">
            <div className="w-6 h-6 bg-primary/10 rounded-lg flex items-center justify-center mt-0.5 shrink-0">
              <LayoutList className="w-3.5 h-3.5 text-primary" />
            </div>
            <p className="text-xs text-foreground/70 leading-tight font-medium">
              View and switch between stores
            </p>
          </div>
          
          <div className="flex items-start gap-2.5">
            <div className="w-6 h-6 bg-primary/10 rounded-lg flex items-center justify-center mt-0.5 shrink-0">
              <Store className="w-3.5 h-3.5 text-primary" />
            </div>
            <p className="text-xs text-foreground/70 leading-tight font-medium">
              Manage all store details easily
            </p>
          </div>
        </div>

        <div className="mt-6">
          <button 
            type="button"
            onClick={onAddStore}
            className="w-full py-3.5 border-2 border-dashed border-primary/40 rounded-2xl text-primary font-bold text-sm flex items-center justify-center gap-2 hover:bg-primary/5 hover:border-primary/60 transition-all active:scale-[0.98]"
          >
            <Plus className="w-4 h-4" />
            Add Store
          </button>
        </div>

        <div className="mt-6 space-y-3">
          {stores.map((store) => (
            <div key={store.id} className="flex items-center gap-3 bg-secondary rounded-2xl p-3">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{store.storeName}</p>
                <p className="text-xs text-foreground/50 truncate">{store.cityTown} · {store.businessType}</p>
              </div>
              <button
                type="button"
                onClick={() => removeStore(store.id)}
                className="p-2 hover:bg-error/10 rounded-lg transition-colors shrink-0"
              >
                <Plus className="w-4 h-4 text-error rotate-45" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </OnboardingLayout>
  );
};
