import React, { useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useRiderOnboardingStore } from '../../store/riderOnboardingStore';

// Step components
import { RiderTypeSelectionStep } from './steps/RiderTypeSelectionStep';
import { BasicDetailsStep } from './steps/BasicDetailsStep';
import { KYCDocumentsStep } from './steps/KYCDocumentsStep';
import { VehicleInformationStep } from './steps/VehicleInformationStep';
import { PayoutDetailsStep } from './steps/PayoutDetailsStep';
import { BankDetailsStep } from './steps/BankDetailsStep';
import { MPesaDetailsStep } from './steps/MPesaDetailsStep';
import { CreatePasswordStep } from './steps/CreatePasswordStep';
import { ReviewAndConfirmStep } from './steps/ReviewAndConfirmStep';
import { SuccessPageStep } from './steps/SuccessPageStep';
import { OrganisationDetailsStep } from './steps/OrganisationDetailsStep';
import { CompanyKYCDocumentsStep } from './steps/CompanyKYCDocumentsStep';
import { AdministratorDetailsStep } from './steps/AdministratorDetailsStep';
import { AddRidersStep } from './steps/AddRidersStep';
import { VehicleInformation3AStep } from './steps/VehicleInformation3AStep';

export const RiderOnboarding: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const accountType = useRiderOnboardingStore((state) => state.draft.accountType ?? 'individual');
  const payoutMode = useRiderOnboardingStore((state) => state.draft.payoutInfo?.mode ?? 'mpesa');

  // Get current step from search query, default to first step
  const currentStepKey = searchParams.get('step') || 'choose-type';

  // Compute the linear step sequence dynamically
  const stepSequence = useMemo(() => {
    const sequence = ['choose-type'];
    
    if (accountType === 'organisation') {
      sequence.push(
        'organisation-details',
        'company-kyc-documents',
        'administrator-details',
        'add-riders',
        'fleet-vehicles'
      );
    } else {
      sequence.push('basic-details', 'kyc-documents', 'vehicle-info');
    }

    sequence.push('payout-details');

    if (payoutMode === 'bank') {
      sequence.push('bank-details');
    } else {
      sequence.push('mpesa-details');
    }

    sequence.push('create-password', 'review-confirmation', 'success');
    return sequence;
  }, [accountType, payoutMode]);

  const handleNext = (customStep?: string) => {
    if (customStep) {
      setSearchParams({ step: customStep });
      return;
    }

    const currentIndex = stepSequence.indexOf(currentStepKey);
    if (currentIndex !== -1 && currentIndex < stepSequence.length - 1) {
      setSearchParams({ step: stepSequence[currentIndex + 1] });
    }
  };

  const handleBack = () => {
    const currentIndex = stepSequence.indexOf(currentStepKey);
    if (currentIndex > 0) {
      setSearchParams({ step: stepSequence[currentIndex - 1] });
    } else {
      navigate('/rider-landing');
    }
  };

  // Render the appropriate step component
  const renderStep = () => {
    switch (currentStepKey) {
      case 'choose-type':
        return <RiderTypeSelectionStep onNext={() => handleNext()} onBack={handleBack} />;
      case 'basic-details':
        return <BasicDetailsStep onNext={() => handleNext()} onBack={handleBack} />;
      case 'kyc-documents':
        return <KYCDocumentsStep onNext={() => handleNext()} onBack={handleBack} />;
      case 'vehicle-info':
        return <VehicleInformationStep onNext={() => handleNext()} onBack={handleBack} />;
      case 'organisation-details':
        return <OrganisationDetailsStep onNext={() => handleNext()} onBack={handleBack} />;
      case 'company-kyc-documents':
        return <CompanyKYCDocumentsStep onNext={() => handleNext()} onBack={handleBack} />;
      case 'administrator-details':
        return <AdministratorDetailsStep onNext={() => handleNext()} onBack={handleBack} />;
      case 'add-riders':
        return <AddRidersStep onNext={() => handleNext()} onBack={handleBack} />;
      case 'fleet-vehicles':
        return <VehicleInformation3AStep onNext={() => handleNext()} onBack={handleBack} />;
      case 'payout-details':
        return (
          <PayoutDetailsStep 
            onNext={(method) => {
              if (method === 'bank') {
                handleNext('bank-details');
              } else {
                handleNext('mpesa-details');
              }
            }} 
            onBack={handleBack} 
          />
        );
      case 'bank-details':
        return <BankDetailsStep onNext={() => handleNext()} onBack={handleBack} />;
      case 'mpesa-details':
        return <MPesaDetailsStep onNext={() => handleNext()} onBack={handleBack} />;
      case 'create-password':
        return <CreatePasswordStep onNext={() => handleNext()} onBack={handleBack} />;
      case 'review-confirmation':
        return <ReviewAndConfirmStep onNext={() => handleNext()} onBack={handleBack} />;
      case 'success':
        return <SuccessPageStep onNext={() => navigate('/rider/dashboard')} onBack={handleBack} />;
      default:
        return <RiderTypeSelectionStep onNext={() => handleNext()} onBack={handleBack} />;
    }
  };

  return <>{renderStep()}</>;
};

export default RiderOnboarding;
