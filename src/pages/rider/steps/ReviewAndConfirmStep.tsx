import React, { useMemo, useState } from 'react';
import { Checkbox } from '@stackloop/ui';
import { CheckCircle2 } from 'lucide-react';
import { OnboardingLayout } from '../../../components/onboarding/OnboardingLayout';
import { authApi } from '../../../../lib/api';
import { buildRiderSignupFormData } from '../../../lib/riderOnboarding';
import { deleteOnboardingAttachmentSnapshot } from '../../../lib/onboardingAttachmentStorage';
import { useRiderOnboardingStore } from '../../../store/riderOnboardingStore';
import { useAuth } from '../../../context/AuthContext';
import type { UserProfile } from '../../../types';

type ReviewAndConfirmStepProps = {
  onNext: () => void;
  onBack: () => void;
};

export const ReviewAndConfirmStep: React.FC<ReviewAndConfirmStepProps> = ({ onNext, onBack }) => {
  const { login } = useAuth();
  const [agreed, setAgreed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const draft = useRiderOnboardingStore((state) => state.draft);
  const attachments = useRiderOnboardingStore((state) => state.attachments);
  const reset = useRiderOnboardingStore((state) => state.reset);
  const isIndividual = draft.accountType !== 'organisation';
  const riderAttachmentKeys = ['rider-individual-kyc-documents', 'rider-company-kyc-documents'];

  const summaryData = useMemo(() => {
    const payoutLabel = draft.payoutInfo
      ? draft.payoutInfo.mode === 'mpesa'
        ? `M-Pesa (${(draft.payoutInfo.details as { phoneNo?: string }).phoneNo || draft.phoneNo})`
        : `Bank (${(draft.payoutInfo.details as { bank?: string }).bank || 'Bank account'})`
      : 'Not provided';

    return {
      accountType: draft.accountType,
      applicantName: draft.fullName || '—',
      email: draft.email || '—',
      phone: draft.phoneNo || '—',
      individualVehicle: draft.individualVehicleInfo.registrationNo
        ? {
            vehicleType: draft.individualVehicleInfo.vehicleType,
            registrationNo: draft.individualVehicleInfo.registrationNo,
            make: draft.individualVehicleInfo.make,
            model: draft.individualVehicleInfo.model,
            regYear: String(draft.individualVehicleInfo.regYear),
            color: draft.individualVehicleInfo.color,
          }
        : null,
      individualDocuments: draft.individualDocuments,
      organizationInfo: draft.organizationInfo,
      organizationVehicles: draft.organizationVehicles,
      riders: draft.riders,
      payoutMethod: payoutLabel,
    };
  }, [draft]);

  const handleContinue = async () => {
    if (!agreed || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const payload = buildRiderSignupFormData(draft, attachments);
      const response = await authApi.signupRider(payload);
      const user: UserProfile = {
        id: response.id,
        name: response.fullName,
        email: response.email,
        phone: response.phoneNo,
        userType: 'rider',
      };

      login({ token: response.token, user });
      reset();
      await Promise.all(riderAttachmentKeys.map((key) => deleteOnboardingAttachmentSnapshot(key)));
      onNext();
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <OnboardingLayout
      currentStep={7}
      stepNumber={6}
      title="Review & Confirm"
      subtitle="Review your information before completing setup."
      icon={<CheckCircle2 className="w-7 h-7 text-primary" />}
      onBack={onBack}
      onContinue={handleContinue}
      isContinueDisabled={!agreed || isSubmitting}
      isContinueLoading={isSubmitting}
      continueText={isSubmitting ? 'Submitting...' : 'Continue'}
    >
      <div className="w-full space-y-6">
        {isIndividual ? (
          <>
            <div className="space-y-3">
              <div className="flex justify-between items-start">
                <span className="text-sm text-foreground/60">Full Name</span>
                <span className="text-sm font-medium text-foreground text-right max-w-[60%]">{summaryData.applicantName}</span>
              </div>
              <div className="flex justify-between items-start">
                <span className="text-sm text-foreground/60">Phone Number</span>
                <span className="text-sm font-medium text-foreground text-right max-w-[60%]">{summaryData.phone}</span>
              </div>
              <div className="flex justify-between items-start">
                <span className="text-sm text-foreground/60">Email Address</span>
                <span className="text-sm font-medium text-foreground text-right max-w-[60%] break-all">{summaryData.email}</span>
              </div>
            </div>

            {summaryData.individualVehicle && (
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-foreground">Vehicle</h3>
                <div className="space-y-2 pl-2">
                  <div className="flex items-start gap-3">
                    <span className="text-xs text-foreground/40 w-4">1.</span>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">{summaryData.individualVehicle.registrationNo}</p>
                      <p className="text-xs text-foreground/50">
                        {summaryData.individualVehicle.vehicleType}, {summaryData.individualVehicle.make}, {summaryData.individualVehicle.model}, {summaryData.individualVehicle.regYear}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-foreground">KYC Documents ({summaryData.individualDocuments.length})</h3>
              <div className="space-y-2 pl-2">
                {summaryData.individualDocuments.map((document, idx) => (
                  <div key={`${document.documentType}-${idx}`} className="flex items-start gap-3">
                    <span className="text-xs text-foreground/40 w-4">{idx + 1}.</span>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">{document.documentType}</p>
                      <p className="text-xs text-foreground/50">{document.serialNumber}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="space-y-3">
              <div className="flex justify-between items-start">
                <span className="text-sm text-foreground/60">Organisation Name</span>
                <span className="text-sm font-medium text-foreground text-right max-w-[60%]">{summaryData.organizationInfo.name || '—'}</span>
              </div>
              <div className="flex justify-between items-start">
                <span className="text-sm text-foreground/60">Business Type</span>
                <span className="text-sm font-medium text-foreground text-right max-w-[60%]">{summaryData.organizationInfo.businessType || 'other'}</span>
              </div>
              <div className="flex justify-between items-start">
                <span className="text-sm text-foreground/60">Registration No.</span>
                <span className="text-sm font-medium text-foreground text-right max-w-[60%]">{summaryData.organizationInfo.registrationNo || '—'}</span>
              </div>
              <div className="flex justify-between items-start">
                <span className="text-sm text-foreground/60">Tax ID</span>
                <span className="text-sm font-medium text-foreground text-right max-w-[60%]">{summaryData.organizationInfo.taxIDNumber || '—'}</span>
              </div>
              <div className="flex justify-between items-start">
                <span className="text-sm text-foreground/60">Administrator</span>
                <span className="text-sm font-medium text-foreground text-right max-w-[60%]">{summaryData.applicantName}</span>
              </div>
              <div className="flex justify-between items-start">
                <span className="text-sm text-foreground/60">Phone Number</span>
                <span className="text-sm font-medium text-foreground text-right max-w-[60%]">{summaryData.phone}</span>
              </div>
              <div className="flex justify-between items-start">
                <span className="text-sm text-foreground/60">Email Address</span>
                <span className="text-sm font-medium text-foreground text-right max-w-[60%] break-all">{summaryData.email}</span>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-foreground">Riders ({summaryData.riders.length})</h3>
              <div className="space-y-2 pl-2">
                {summaryData.riders.map((rider, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <span className="text-xs text-foreground/40 w-4">{idx + 1}.</span>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">{rider.fullName}</p>
                      <p className="text-xs text-foreground/50">{rider.phoneNo}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-foreground">Vehicles ({summaryData.organizationVehicles.length})</h3>
              <div className="space-y-2 pl-2">
                {summaryData.organizationVehicles.map((vehicle, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <span className="text-xs text-foreground/40 w-4">{idx + 1}.</span>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">{vehicle.registrationNo}</p>
                      <p className="text-xs text-foreground/50">
                        {vehicle.vehicleType}, {vehicle.make}, {vehicle.model}, {vehicle.regYear}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        <div className="space-y-1">
          <h3 className="text-sm font-semibold text-foreground">Payout Method</h3>
          <p className="text-sm text-foreground/70 pl-2">{summaryData.payoutMethod}</p>
        </div>

        <div className="pt-4 shrink-0">
          <Checkbox 
            label="I confirm that the information provided is accurate." 
            checked={agreed} 
            onChange={setAgreed}
            className="text-sm font-medium"
          />
        </div>
      </div>
    </OnboardingLayout>
  );
};
