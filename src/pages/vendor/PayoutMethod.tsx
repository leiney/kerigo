import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Badge, Button } from '@stackloop/ui';
import { 
  Landmark, 
  Smartphone, 
  ArrowRight, 
  ChevronLeft,
  CheckCircle2,
  Circle
} from 'lucide-react';
import { motion } from 'motion/react';
import { StepDots } from '../../components/shared/StepDots';

export const PayoutMethod: React.FC = () => {
  const navigate = useNavigate();
  const [payoutMethod, setPayoutMethod] = useState<'bank' | 'mpesa'>('bank');

  const handleContinue = () => {
    if (payoutMethod === 'bank') {
      navigate('/vendor/bank-details');
    } else {
      navigate('/vendor/mpesa-details');
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

        <StepDots currentStep={6} className="overflow-hidden" />

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
              <Badge className="bg-primary text-white">6</Badge>
            </span>
            Payout Method
          </h1>
          <p className="text-sm text-foreground/60 leading-relaxed max-w-70 mx-auto">
            Choose how you want to receive payouts.
          </p>
        </motion.div>

        {/* Selection Cards */}
        <div className="w-full space-y-4 max-w-md">
          
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
              ${payoutMethod === 'bank' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-500'}
            `}>
              <Landmark className="w-6 h-6" />
            </div>
            
            <div className="flex-1">
              <h3 className={`font-bold text-base ${payoutMethod === 'bank' ? 'text-foreground' : 'text-foreground/70'}`}>
                Bank Account
              </h3>
              <p className="text-xs text-foreground/50 mt-0.5">
                Receive payouts to your bank
              </p>
            </div>

            <div className="shrink-0">
              {payoutMethod === 'bank' ? (
                <CheckCircle2 className="w-6 h-6 text-primary" />
              ) : (
                <Circle className="w-6 h-6 text-gray-300" />
              )}
            </div>
          </motion.div>

          {/* M-Pesa Option */}
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
              ${payoutMethod === 'mpesa' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-500'}
            `}>
              <Smartphone className="w-6 h-6" />
            </div>
            
            <div className="flex-1">
              <h3 className={`font-bold text-base ${payoutMethod === 'mpesa' ? 'text-foreground' : 'text-foreground/70'}`}>
                M-Pesa
              </h3>
              <p className="text-xs text-foreground/50 mt-0.5">
                Receive payouts to your M-Pesa
              </p>
            </div>

            <div className="shrink-0">
              {payoutMethod === 'mpesa' ? (
                <CheckCircle2 className="w-6 h-6 text-primary" />
              ) : (
                <Circle className="w-6 h-6 text-gray-300" />
              )}
            </div>
          </motion.div>

        </div>

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