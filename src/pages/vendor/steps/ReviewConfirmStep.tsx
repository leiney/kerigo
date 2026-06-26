import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Checkbox } from '@stackloop/ui';
import { ShieldCheck } from 'lucide-react';
import { OnboardingLayout } from '../../../components/onboarding/OnboardingLayout';
import { authApi } from '../../../../lib/api';
import { buildVendorSignupFormData } from '../../../lib/vendorOnboarding';
import { deleteOnboardingAttachmentSnapshot } from '../../../lib/onboardingAttachmentStorage';
import { useAuth } from '../../../context/AuthContext';
import { useVendorOnboardingStore } from '../../../store/vendorOnboardingStore';

type ReviewConfirmStepProps = {
  onNext: () => void;
  onBack: () => void;
};

export const ReviewConfirmStep: React.FC<ReviewConfirmStepProps> = ({ onNext, onBack }) => {
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const draft = useVendorOnboardingStore((state) => state.draft);
  const attachments = useVendorOnboardingStore((state) => state.attachments);
  const resetDraft = useVendorOnboardingStore((state) => state.reset);
  const vendorAttachmentKeys = ['vendor-kyc-documents', 'vendor-company-kyc-documents'];

  const summaryData = useMemo(() => {
    const payoutSummary = draft.payoutInfo?.mode === 'bank'
      ? `Bank Account (${(draft.payoutInfo.details as any).bank || 'Bank'} ${(draft.payoutInfo.details as any).accountNumber ? `**** ${(draft.payoutInfo.details as any).accountNumber.slice(-4)}` : ''})`
      : draft.payoutInfo?.mode === 'mpesa'
      ? `M-Pesa (${(draft.payoutInfo?.details as any)?.phoneNo || '—'})`
      : `Custom (${draft.customInstructions ? (draft.customInstructions.length > 25 ? `${draft.customInstructions.slice(0, 25)}...` : draft.customInstructions) : '—'})`;

    return [
      { label: 'Account Type', value: draft.accountType || 'individual' },
      { label: 'Full Name', value: draft.fullName || '—' },
      { label: 'Email Address', value: draft.email || '—' },
      { label: 'Phone Number', value: draft.phoneNo || '—' },
      { label: 'Payout Method', value: payoutSummary },
      { label: 'Stores', value: String(draft.stores.length) },
      ...(draft.accountType === 'organisation'
        ? [
            { label: 'Organization Name', value: draft.organizationInfo.name || '—' },
            { label: 'Business Type', value: draft.organizationInfo.businessType || 'other' },
            { label: 'KRA PIN', value: draft.organizationInfo.taxIDNumber || '—' },
          ]
        : []),
    ];
  }, [draft]);

  const handleContinue = async () => {
    if (!isConfirmed || isSubmitting) {
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = buildVendorSignupFormData(draft, attachments as any);
      const response = await authApi.signupVendor(payload as any);
      login({
        token: response.token ?? `vendor-${response.vendorId ?? Date.now()}`,
        user: {
          id: response.vendorId ?? response.token ?? String(Date.now()),
          email: draft.email,
          userType: 'vendor',
          fullName: draft.fullName,
          phoneNo: draft.phoneNo,
          token: response.token,
          username: draft.email,
        },
      });
      resetDraft();
      await Promise.all(vendorAttachmentKeys.map((key) => deleteOnboardingAttachmentSnapshot(key)));
      onNext();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <OnboardingLayout
      currentStep={10}
      stepNumber={9}
      title="Review & Confirm"
      subtitle="Review your information before completing setup."
      icon={<ShieldCheck className="w-7 h-7 text-primary" />}
      onBack={onBack}
      onContinue={handleContinue}
      isContinueDisabled={!isConfirmed || isSubmitting}
      isContinueLoading={isSubmitting}
      continueText={isSubmitting ? 'Submitting...' : 'Continue'}
    >
      <div className="w-full space-y-5">
        {summaryData.map((item, idx) => (
          <div key={idx} className="flex justify-between items-start gap-4">
            <span className="text-sm text-foreground/50 font-medium">
              {item.label}
            </span>
            <span className="text-sm text-foreground font-bold text-right max-w-[60%] wrap-break-word">
              {item.value}
            </span>
          </div>
        ))}
      </div>

      <div className="w-full mt-8 shrink-0">
        <Checkbox
          label="I confirm that the information provided is accurate."
          checked={isConfirmed}
          onChange={(checked) => setIsConfirmed(checked)}
          className="text-sm font-medium"
        />
      </div>
    </OnboardingLayout>
  );
};
