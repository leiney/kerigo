import React, { useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useVendorOnboardingStore } from '../../store/vendorOnboardingStore';

// Step components
import { AccountTypeStep } from './steps/AccountTypeStep';
import { BasicDetailsStep } from './steps/BasicDetailsStep';
import { CompanyDetailsStep } from './steps/CompanyDetailsStep';
import { AdministratorDetailsStep } from './steps/AdministratorDetailsStep';
import { KYCDocumentsStep } from './steps/KYCDocumentsStep';
import { CompanyKYCDocumentsStep } from './steps/CompanyKYCDocumentsStep';
import { AddYourStoresStep } from './steps/AddYourStoresStep';
import { StoreDetailsStep } from './steps/StoreDetailsStep';
import { ManageMultipleStoresStep } from './steps/ManageMultipleStoresStep';
import { AddStoreStep } from './steps/AddStoreStep';
import { PayoutMethodStep } from './steps/PayoutMethodStep';
import { BankDetailsStep } from './steps/BankDetailsStep';
import { MPesaDetailsStep } from './steps/MPesaDetailsStep';
import { CustomPayoutStep } from './steps/CustomPayoutStep';
import { CreatePasswordStep } from './steps/CreatePasswordStep';
import { ReviewConfirmStep } from './steps/ReviewConfirmStep';
import { SetupCompleteStep } from './steps/SetupCompleteStep';

export const VendorOnboarding: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const accountType = useVendorOnboardingStore((state) => state.draft.accountType ?? 'individual');
  const payoutMode = useVendorOnboardingStore((state) => state.draft.payoutInfo?.mode ?? 'bank');
  const storeCount = useVendorOnboardingStore((state) => state.draft.stores.length);

  const storeSetup = useVendorOnboardingStore((state) => state.draft.storeSetup ?? 'one');

  // Get current step from search query, default to first step
  const currentStepKey = searchParams.get('step') || 'choose-account';

  // Compute the linear step sequence dynamically
  const stepSequence = useMemo(() => {
    const sequence = ['choose-account'];
    
    if (accountType === 'organisation') {
      sequence.push('company-details', 'administrator-details', 'company-kyc-documents');
    } else {
      sequence.push('basic-details', 'kyc-documents');
    }

    sequence.push('add-your-stores');

    if (storeSetup === 'multiple' || storeCount > 0) {
      sequence.push('manage-multiple-stores');
    } else {
      sequence.push('store-details');
    }

    sequence.push('payout-method');

    if (payoutMode === 'mpesa') {
      sequence.push('mpesa-details');
    } else if (payoutMode === 'custom') {
      sequence.push('custom-details');
    } else {
      sequence.push('bank-details');
    }

    sequence.push('create-password', 'review-confirmation', 'setup-completed');
    return sequence;
  }, [accountType, payoutMode, storeSetup, storeCount]);

  const handleNext = (customStep?: string) => {
    if (customStep) {
      navigate(`/vendor/onboarding?step=${customStep}`, { state: null });
      return;
    }

    const currentIndex = stepSequence.indexOf(currentStepKey);
    if (currentIndex !== -1 && currentIndex < stepSequence.length - 1) {
      navigate(`/vendor/onboarding?step=${stepSequence[currentIndex + 1]}`, { state: null });
    }
  };

  const handleBack = () => {
    // If we are on the add-store sub-page, go back to manage-multiple-stores
    if (currentStepKey === 'add-store') {
      navigate('/vendor/onboarding?step=manage-multiple-stores', { state: null });
      return;
    }

    const currentIndex = stepSequence.indexOf(currentStepKey);
    if (currentIndex > 0) {
      navigate(`/vendor/onboarding?step=${stepSequence[currentIndex - 1]}`, { state: null });
    } else {
      navigate('/vendor-landing');
    }
  };

  // Render the appropriate step component
  const renderStep = () => {
    switch (currentStepKey) {
      case 'choose-account':
        return <AccountTypeStep onNext={() => handleNext()} onBack={handleBack} />;
      case 'basic-details':
        return <BasicDetailsStep onNext={() => handleNext()} onBack={handleBack} />;
      case 'company-details':
        return <CompanyDetailsStep onNext={() => handleNext()} onBack={handleBack} />;
      case 'administrator-details':
        return <AdministratorDetailsStep onNext={() => handleNext()} onBack={handleBack} />;
      case 'kyc-documents':
        return <KYCDocumentsStep onNext={() => handleNext()} onBack={handleBack} />;
      case 'company-kyc-documents':
        return <CompanyKYCDocumentsStep onNext={() => handleNext()} onBack={handleBack} />;
      case 'add-your-stores':
        return (
          <AddYourStoresStep 
            onNext={(setup) => {
              if (setup === 'multiple') {
                handleNext('manage-multiple-stores');
              } else {
                handleNext('store-details');
              }
            }} 
            onBack={handleBack} 
          />
        );
      case 'store-details':
        return <StoreDetailsStep onNext={() => handleNext()} onBack={handleBack} />;
      case 'manage-multiple-stores':
        return (
          <ManageMultipleStoresStep 
            onNext={() => handleNext()} 
            onBack={handleBack} 
            onAddStore={() => handleNext('add-store')} 
          />
        );
      case 'add-store':
        return <AddStoreStep onNext={() => handleNext('manage-multiple-stores')} onBack={handleBack} />;
      case 'payout-method':
        return (
          <PayoutMethodStep 
            onNext={(method) => {
              if (method === 'mpesa') {
                handleNext('mpesa-details');
              } else if (method === 'custom') {
                handleNext('custom-details');
              } else {
                handleNext('bank-details');
              }
            }} 
            onBack={handleBack} 
          />
        );
      case 'bank-details':
        return <BankDetailsStep onNext={() => handleNext()} onBack={handleBack} />;
      case 'mpesa-details':
        return <MPesaDetailsStep onNext={() => handleNext()} onBack={handleBack} />;
      case 'custom-details':
        return <CustomPayoutStep onNext={() => handleNext()} onBack={handleBack} />;
      case 'create-password':
        return <CreatePasswordStep onNext={() => handleNext()} onBack={handleBack} />;
      case 'review-confirmation':
        return <ReviewConfirmStep onNext={() => handleNext()} onBack={handleBack} />;
      case 'setup-completed':
        return <SetupCompleteStep onNext={() => navigate('/vendor/dashboard')} onBack={handleBack} />;
      default:
        return <AccountTypeStep onNext={() => handleNext()} onBack={handleBack} />;
    }
  };

  return <>{renderStep()}</>;
};

export default VendorOnboarding;
