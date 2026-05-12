import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Checkbox } from '@stackloop/ui';
import { 
  ShieldCheck, 
  ChevronLeft, 
  ArrowRight 
} from 'lucide-react';
import { motion } from 'motion/react';
import { StepDots } from '../../components/shared/StepDots';

// In a real app, this data would come from a global store/context
const mockSummaryData = [
  { label: 'Account Type', value: 'Individual' },
  { label: 'Store Name', value: 'Green Leaves Store' },
  { label: 'Store Location', value: 'Nairobi, Kenya' },
  { label: 'Payout Method', value: 'Bank Account (Equity Bank **** 1234)' },
  { label: 'Phone Number', value: '+254 700 123 456' },
  { label: 'Email Address', value: 'john.doe@email.com' },
];

export const ReviewConfirm: React.FC = () => {
  const navigate = useNavigate();
  const [isConfirmed, setIsConfirmed] = useState(false);

  const handleContinue = () => {
    if (isConfirmed) {
      navigate('/vendor/setup-completed');
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

        <StepDots currentStep={9} />

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
            <span className="text-primary mr-1">9</span>
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
          {mockSummaryData.map((item, idx) => (
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
          disabled={!isConfirmed}
          icon={<ArrowRight className="w-5 h-5" />}
          className={`w-full h-14 rounded-2xl text-lg font-bold flex items-center justify-center gap-2 shadow-lg ${
            isConfirmed 
              ? 'shadow-primary/20' 
              : 'opacity-50 cursor-not-allowed shadow-none'
          }`}
        >
          Continue
        </Button>
      </div>

    </div>
  );
};