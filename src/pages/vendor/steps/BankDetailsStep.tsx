import React, { useEffect, useState } from 'react';
import { Input, Select } from '@stackloop/ui';
import { Landmark, Lock, User, CheckCircle2 } from 'lucide-react';
import { OnboardingLayout } from '../../../components/onboarding/OnboardingLayout';
import { requiredTextError, selectionError } from '../../../lib/onboardingValidation';
import { BANK_OPTIONS } from '../../../lib/banks';
import { useVendorOnboardingStore } from '../../../store/vendorOnboardingStore';

type BankDetailsStepProps = {
  onNext: () => void;
  onBack: () => void;
};

export const BankDetailsStep: React.FC<BankDetailsStepProps> = ({ onNext, onBack }) => {
  const draft = useVendorOnboardingStore((state) => state.draft);
  const setBankDetails = useVendorOnboardingStore((state) => state.setBankDetails);
  const [hasAttemptedContinue, setHasAttemptedContinue] = useState(false);
  const [formData, setFormData] = useState({
    bank: (draft.payoutInfo?.details as { bank?: string } | undefined)?.bank ?? '',
    accountNumber: (draft.payoutInfo?.details as { accountNumber?: string } | undefined)?.accountNumber ?? '',
    branchCode: (draft.payoutInfo?.details as { branch?: string } | undefined)?.branch ?? '',
    accountName: (draft.payoutInfo?.details as { accountName?: string } | undefined)?.accountName ?? draft.fullName,
    swiftCode: (draft.payoutInfo?.details as { swiftCode?: string } | undefined)?.swiftCode ?? '',
  });

  useEffect(() => {
    setBankDetails({
      bank: formData.bank,
      branch: formData.branchCode,
      accountNumber: formData.accountNumber,
      swiftCode: formData.swiftCode,
      accountName: formData.accountName,
    });
  }, [formData, setBankDetails]);

  const bankValidationError = selectionError(formData.bank, 'bank');
  const accountNumberValidationError = requiredTextError(formData.accountNumber, 'Account number');
  const accountNameValidationError = requiredTextError(formData.accountName, 'Account name');

  const bankError = hasAttemptedContinue ? bankValidationError : '';
  const accountNumberError = hasAttemptedContinue ? accountNumberValidationError : '';
  const accountNameError = hasAttemptedContinue ? accountNameValidationError : '';
  const isFormValid = !bankValidationError && !accountNumberValidationError && !accountNameValidationError;

  const handleContinue = () => {
    if (!isFormValid) {
      setHasAttemptedContinue(true);
      return;
    }
    onNext();
  };

  return (
    <OnboardingLayout
      currentStep={8}
      stepNumber={7}
      title="Bank Details"
      subtitle="Select or add your bank account."
      icon={<Landmark className="w-7 h-7 text-primary" />}
      onBack={onBack}
      onContinue={handleContinue}
    >
      <div className='pb-5'>
        <Select
          label="Select your bank"
          placeholder="Choose your bank"
          options={BANK_OPTIONS}
          searchable={true}
          value={formData.bank}
          onChange={(value) => setFormData({ ...formData, bank: String(value) })}
          error={bankError}
          className="rounded-2xl h-14"
          required
        />
      </div>

      <Input
        label="Branch Code (Optional)"
        type="number"
        placeholder="Enter branch code"
        value={formData.branchCode}
        onChange={(value) => setFormData({ ...formData, branchCode: String(value) })}
        leftIcon={<Lock className="w-5 h-5 text-foreground/40" />}
        className="rounded-2xl h-14"
      />

      <Input
        label="SWIFT Code (Optional)"
        placeholder="Enter SWIFT code"
        value={formData.swiftCode}
        onChange={(value) => setFormData({ ...formData, swiftCode: String(value) })}
        leftIcon={<Lock className="w-5 h-5 text-foreground/40" />}
        className="rounded-2xl h-14"
      />

      <Input
        label="Account Number"
        type="number"
        placeholder="Enter account number"
        value={formData.accountNumber}
        onChange={(value) => setFormData({ ...formData, accountNumber: String(value) })}
        error={accountNumberError}
        leftIcon={<Lock className="w-5 h-5 text-foreground/40" />}
        className="rounded-2xl h-14"
        required
      />

      <Input
        label="Account Name"
        placeholder="Enter account name"
        value={formData.accountName}
        onChange={(value) => setFormData({ ...formData, accountName: String(value) })}
        error={accountNameError}
        leftIcon={<User className="w-5 h-5 text-foreground/40" />}
        className="rounded-2xl h-14"
        required
      />

      <div className="bg-primary/5 border border-primary/20 rounded-xl p-3 flex items-start gap-3 mt-2 shrink-0">
        <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
        <p className="text-xs text-foreground/70 leading-tight">
          Ensure your account name matches your business or personal name.
        </p>
      </div>
    </OnboardingLayout>
  );
};
