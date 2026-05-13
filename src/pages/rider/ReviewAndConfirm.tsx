import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Checkbox } from '@stackloop/ui';
import { 
  CheckCircle2, 
  ChevronLeft, 
  ArrowRight 
} from 'lucide-react';
import { motion } from 'motion/react';
import { StepDots } from '../../components/shared/StepDots';

// Mock data representing collected info
const summaryData = {
  orgName: 'Green Leaves Ltd',
  adminName: 'John Doe',
  businessType: 'Logistics & Delivery',
  email: 'john.doe@email.com',
  phone: '+254 712 345 678',
  riders: [
    { name: 'John Doe', phone: '+254 712 345 678' },
    { name: 'Michael Kimani', phone: '+254 723 456 789' }
  ],
  vehicles: [
    { reg: 'KMEH 123A', make: 'Honda', model: 'CG 125', year: '2023' },
    { reg: 'KDG 456B', make: 'TVS', model: 'Radeon', year: '2022' }
  ],
  payoutMethod: 'M-Pesa (+254 712 345 678)'
};

export const ReviewAndConfirm: React.FC = () => {
  const navigate = useNavigate();
  const [agreed, setAgreed] = useState(false);

  const handleContinue = () => {
    if (!agreed) return;
    navigate('/rider/success');
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

        <StepDots currentStep={7} />

        <div className="w-8" />
      </div>

      {/* Main Content */}
      <div className="flex-1 px-6 pt-6 flex flex-col items-center overflow-y-auto pb-32">
        
        {/* Step Icon & Title */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-7 h-7 text-primary" />
          </div>
          
          <h1 className="text-lg font-bold text-foreground mb-2">
            <span className="text-primary mr-1">7</span>
            Review & Confirm
          </h1>
          <p className="text-sm text-foreground/60 leading-relaxed max-w-70 mx-auto">
            Review your information before completing setup.
          </p>
        </motion.div>

        {/* Summary Information */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="w-full max-w-md space-y-6"
        >
          
          {/* Organisation Details */}
          <div className="space-y-3">
            <div className="flex justify-between items-start">
              <span className="text-sm text-foreground/60">Organisation Name</span>
              <span className="text-sm font-medium text-foreground text-right max-w-[60%]">{summaryData.orgName}</span>
            </div>
            <div className="flex justify-between items-start">
              <span className="text-sm text-foreground/60">Administrator</span>
              <span className="text-sm font-medium text-foreground text-right max-w-[60%]">{summaryData.adminName}</span>
            </div>
            <div className="flex justify-between items-start">
              <span className="text-sm text-foreground/60">Phone Number</span>
              <span className="text-sm font-medium text-foreground text-right max-w-[60%]">{summaryData.phone}</span>
            </div>
            <div className="flex justify-between items-start">
              <span className="text-sm text-foreground/60">Email Address</span>
              <span className="text-sm font-medium text-foreground text-right max-w-[60%] break-all">{summaryData.email}</span>
            </div>
            <div className="flex justify-between items-start">
              <span className="text-sm text-foreground/60">Business Type</span>
              <span className="text-sm font-medium text-foreground text-right max-w-[60%]">{summaryData.businessType}</span>
            </div>
          </div>

          {/* Riders Section */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-foreground">Riders ({summaryData.riders.length})</h3>
            <div className="space-y-2 pl-2">
              {summaryData.riders.map((rider, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <span className="text-xs text-foreground/40 w-4">{idx + 1}.</span>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">{rider.name}</p>
                    <p className="text-xs text-foreground/50">{rider.phone}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Vehicles Section */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-foreground">Vehicles ({summaryData.vehicles.length})</h3>
            <div className="space-y-2 pl-2">
              {summaryData.vehicles.map((v, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <span className="text-xs text-foreground/40 w-4">{idx + 1}.</span>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">{v.reg}</p>
                    <p className="text-xs text-foreground/50">{v.make}, {v.model}, {v.year}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Payout Method */}
          <div className="space-y-1">
            <h3 className="text-sm font-semibold text-foreground">Payout Method</h3>
            <p className="text-sm text-foreground/70 pl-2">{summaryData.payoutMethod}</p>
          </div>

          {/* Agreement Checkbox */}
          <div className="pt-4">
            <Checkbox 
              label="I confirm that the information provided is accurate." 
              checked={agreed} 
              onChange={setAgreed}
              className="text-sm"
            />
          </div>

        </motion.div>

      </div>

      {/* Footer / Action Button */}
      <div className="absolute bottom-0 w-full p-6 pb-8 bg-white border-t border-border/50">
        <Button 
          onClick={handleContinue}
          disabled={!agreed}
          className={`w-full h-14 rounded-2xl text-lg font-bold flex items-center justify-center gap-2 shadow-lg transition-all
            ${agreed ? 'shadow-primary/20' : 'opacity-50 cursor-not-allowed shadow-none'}`}
          icon={<ArrowRight className="w-5 h-5" />}
        >
          Continue
        </Button>
      </div>
    </div>
  );
};