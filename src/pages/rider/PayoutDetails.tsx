import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Badge, Button } from '@stackloop/ui';
import { 
  Landmark, 
  Smartphone, 
  CheckCircle2, 
  Circle, 
  ArrowRight, 
  ChevronLeft 
} from 'lucide-react';
import { motion } from 'motion/react';
import { StepDots } from '../../components/shared/StepDots';
import { useRiderOnboardingStore } from '../../store/riderOnboardingStore';

export const PayoutDetails: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isCompanyFlow = location.pathname.startsWith('/company');
  const draft = useRiderOnboardingStore((state) => state.draft);
  const setPayoutMode = useRiderOnboardingStore((state) => state.setPayoutMode);
  
  // State to manage selection
  const [payoutMethod, setPayoutMethod] = useState<'bank' | 'mpesa'>(draft.payoutInfo?.mode ?? 'mpesa');

  useEffect(() => {
    setPayoutMode(payoutMethod);
  }, [payoutMethod, setPayoutMode]);

  const handleContinue = () => {
    if (payoutMethod === 'bank') {
      navigate(isCompanyFlow ? '/company/bank-details' : '/individual/bank-details');
    } else {
      navigate(isCompanyFlow ? '/company/mpesa-details' : '/individual/mpesa-details');
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

        <StepDots currentStep={4} />

        {/* Spacer to balance the header */}
        <div className="w-8" />
      </div>

      {/* Main Content */}
      <div className="flex-1 px-6 pt-6 flex flex-col items-center">
        
        {/* Step Icon & Title */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Landmark className="w-7 h-7 text-primary" />
          </div>
          
          <h1 className="text-lg font-bold text-foreground mb-2">
            <span className="text-primary mr-1">
              <Badge className="bg-primary text-white">4</Badge>
            </span>
            Payout Details
          </h1>
          <p className="text-sm text-foreground/60 leading-relaxed max-w-70 mx-auto">
            Choose how you would like to receive your earnings.
          </p>
        </motion.div>

        {/* Selection Cards */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="w-full space-y-4 max-w-md"
        >
          
          {/* Bank Account Option */}
          <motion.div
            whileTap={{ scale: 0.98 }}
            onClick={() => setPayoutMethod('bank')}
            className={`
              relative p-4 rounded-2xl border-2 cursor-pointer transition-all duration-200 flex items-center gap-4
              ${payoutMethod === 'bank' 
                ? 'border-primary bg-primary/5 shadow-sm' 
                : 'border-border hover:border-border-dark bg-white'}
            `}
          >
            <div className={`
              w-12 h-12 rounded-xl flex items-center justify-center shrink-0
              ${payoutMethod === 'bank' ? 'bg-primary text-white' : 'bg-secondary text-foreground/50'}
            `}>
              <Landmark className="w-6 h-6" />
            </div>
            
            <div className="flex-1">
              <h3 className={`font-bold text-base ${payoutMethod === 'bank' ? 'text-foreground' : 'text-foreground/70'}`}>
                Bank Account
              </h3>
              <p className="text-xs text-foreground/50 mt-0.5">
                Receive payouts directly to your bank account.
              </p>
            </div>

            <div className="shrink-0">
              {payoutMethod === 'bank' ? (
                <CheckCircle2 className="w-6 h-6 text-primary" />
              ) : (
                <Circle className="w-6 h-6 text-border-dark" />
              )}
            </div>
          </motion.div>

          {/* M-Pesa Number Option */}
          <motion.div
            whileTap={{ scale: 0.98 }}
            onClick={() => setPayoutMethod('mpesa')}
            className={`
              relative p-4 rounded-2xl border-2 cursor-pointer transition-all duration-200 flex items-center gap-4
              ${payoutMethod === 'mpesa' 
                ? 'border-primary bg-primary/5 shadow-sm' 
                : 'border-border hover:border-border-dark bg-white'}
            `}
          >
            <div className={`
              w-12 h-12 rounded-xl flex items-center justify-center shrink-0
              ${payoutMethod === 'mpesa' ? 'bg-primary text-white' : 'bg-secondary text-foreground/50'}
            `}>
              <Smartphone className="w-6 h-6" />
            </div>
            
            <div className="flex-1">
              <h3 className={`font-bold text-base ${payoutMethod === 'mpesa' ? 'text-foreground' : 'text-foreground/70'}`}>
                M-Pesa Number
              </h3>
              <p className="text-xs text-foreground/50 mt-0.5">
                Receive payouts directly to your M-Pesa account.
              </p>
            </div>

            <div className="shrink-0">
              {payoutMethod === 'mpesa' ? (
                <CheckCircle2 className="w-6 h-6 text-primary" />
              ) : (
                <Circle className="w-6 h-6 text-border-dark" />
              )}
            </div>
          </motion.div>

        </motion.div>

      </div>

      {/* Footer / Action Button */}
      <div className="p-6 pb-8 bg-white">
        <Button 
          onClick={handleContinue}
          className="w-full h-14 rounded-2xl text-lg font-bold flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
          icon={<ArrowRight className="w-5 h-5" />}
        >
          Continue
        </Button>
      </div>
    </div>
  );
};