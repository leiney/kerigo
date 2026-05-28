import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Badge, Button, Checkbox } from '@stackloop/ui';
import { 
  ShieldCheck, 
  ChevronLeft, 
  ArrowRight 
} from 'lucide-react';
import { motion } from 'motion/react';
import { StepDots } from '../../components/shared/StepDots';
import { authApi } from '../../../lib/api';
import { buildVendorSignupPayload } from '../../lib/vendorOnboarding';
import { useAuth } from '../../context/AuthContext';
import { useVendorOnboardingStore } from '../../store/vendorOnboardingStore';

export const ReviewConfirm: React.FC = () => {
  const navigate = useNavigate();
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const draft = useVendorOnboardingStore((state) => state.draft);
  const resetDraft = useVendorOnboardingStore((state) => state.reset);

  const summaryData = useMemo(() => {
    const payoutSummary = draft.payoutInfo?.mode === 'bank'
      ? `Bank Account (${(draft.payoutInfo.details as any).bank || 'Bank'} ${(draft.payoutInfo.details as any).accountNumber ? `**** ${(draft.payoutInfo.details as any).accountNumber.slice(-4)}` : ''})`
      : `M-Pesa (${(draft.payoutInfo?.details as any)?.phoneNo || '—'})`;

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
      const payload = buildVendorSignupPayload(draft);
      const response = await authApi.signupVendor(payload);
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
      navigate('/vendor/setup-completed', { replace: true });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-foreground font-sans antialiased flex flex-col relative overflow-hidden">
      
      {/* Top Header / Navigation */}
      <div className="px-5 pt-6 pb-2 flex items-center justify-between">
        <button 
          onClick={() => navigate(-1)} 
          className="p-2 -ml-2 rounded-full hover:bg-secondary transition-colors"
        >
          <ChevronLeft className="w-6 h-6 text-foreground" />
        </button>

        <StepDots currentStep={10} />

        {/* Spacer to balance the header */}
        <div className="w-8" />
      </div>

      {/* Main Content */}
      <div className="flex-1 px-6 pt-6 flex flex-col items-center">
        
        {/* Step Icon & Title */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6"
        >
          <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShieldCheck className="w-7 h-7 text-primary" />
          </div>
          
          <h1 className="text-lg font-bold text-foreground mb-2">
            <span className="text-primary mr-1">
              <Badge className="bg-primary text-white">9</Badge>
            </span>
            Review & Confirm
          </h1>
          <p className="text-sm text-foreground/60 leading-relaxed max-w-70 mx-auto">
            Review your information before completing setup.
          </p>
        </motion.div>

        {/* Summary List */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="w-full max-w-md space-y-5"
        >
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
        </motion.div>

        {/* Confirmation Checkbox */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="w-full max-w-md mt-8"
        >
          <Checkbox
            label="I confirm that the information provided is accurate."
            checked={isConfirmed}
            onChange={(checked) => setIsConfirmed(checked)}
            className="text-sm font-medium"
          />
        </motion.div>

      </div>

      {/* Footer / Action Button */}
      <div className="p-6 pb-8 bg-white">
        <Button 
          onClick={handleContinue}
          disabled={!isConfirmed || isSubmitting}
          icon={<ArrowRight className="w-5 h-5" />}
          className={`w-full h-14 rounded-2xl text-lg font-bold flex items-center justify-center gap-2 shadow-lg ${
            isConfirmed && !isSubmitting
              ? 'shadow-primary/20' 
              : 'opacity-50 cursor-not-allowed shadow-none'
          }`}
        >
          {isSubmitting ? 'Submitting...' : 'Continue'}
        </Button>
      </div>

    </div>
  );
};