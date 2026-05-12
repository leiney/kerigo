import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@stackloop/ui';
import { 
  User, 
  Building2, 
  ArrowRight, 
  ChevronLeft, 
  CheckCircle2,
  Circle
} from 'lucide-react';
import { motion } from 'motion/react';
import { StepDots } from '../../components/shared/StepDots';

export const ChooseAccountType: React.FC = () => {
  const navigate = useNavigate();
  const [accountType, setAccountType] = useState<'individual' | 'company'>('individual');

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

        <StepDots currentStep={1} />

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
            <User className="w-7 h-7 text-primary" />
          </div>
          
          <h1 className="text-lg font-bold text-foreground mb-2">
            <span className="text-primary mr-1">1</span>
            Choose Account Type
          </h1>
          <p className="text-sm text-foreground/60 leading-relaxed max-w-70 mx-auto">
            Join as an individual or register your company.
          </p>
        </motion.div>

        {/* Selection Cards */}
        <div className="w-full space-y-4 max-w-md">
          
          {/* Individual Option */}
          <motion.div
            whileTap={{ scale: 0.98 }}
            onClick={() => setAccountType('individual')}
            className={`
              relative p-4 rounded-2xl border-2 cursor-pointer transition-all duration-200 flex items-center gap-4
              ${accountType === 'individual' 
                ? 'border-primary bg-primary/5 shadow-sm' 
                : 'border-border hover:border-border-dark bg-white'}
            `}
          >
            <div className={`
              w-12 h-12 rounded-xl flex items-center justify-center shrink-0
              ${accountType === 'individual' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-500'}
            `}>
              <User className="w-6 h-6" />
            </div>
            
            <div className="flex-1">
              <h3 className={`font-bold text-base ${accountType === 'individual' ? 'text-foreground' : 'text-foreground/70'}`}>
                Individual
              </h3>
              <p className="text-xs text-foreground/50 mt-0.5">
                Join as an individual
              </p>
            </div>

            <div className="shrink-0">
              {accountType === 'individual' ? (
                <CheckCircle2 className="w-6 h-6 text-primary" />
              ) : (
                <Circle className="w-6 h-6 text-gray-300" />
              )}
            </div>
          </motion.div>

          {/* Company Option */}
          <motion.div
            whileTap={{ scale: 0.98 }}
            onClick={() => setAccountType('company')}
            className={`
              relative p-4 rounded-2xl border-2 cursor-pointer transition-all duration-200 flex items-center gap-4
              ${accountType === 'company' 
                ? 'border-primary bg-primary/5 shadow-sm' 
                : 'border-border hover:border-border-dark bg-white'}
            `}
          >
            <div className={`
              w-12 h-12 rounded-xl flex items-center justify-center shrink-0
              ${accountType === 'company' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-500'}
            `}>
              <Building2 className="w-6 h-6" />
            </div>
            
            <div className="flex-1">
              <h3 className={`font-bold text-base ${accountType === 'company' ? 'text-foreground' : 'text-foreground/70'}`}>
                Company
              </h3>
              <p className="text-xs text-foreground/50 mt-0.5">
                Register as a company
              </p>
            </div>

            <div className="shrink-0">
              {accountType === 'company' ? (
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
          onClick={() => navigate('/vendor/basic-details')}
          className="w-full h-14 rounded-2xl text-lg font-bold flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
          icon={<ArrowRight className="w-5 h-5" />}
        >
          Continue
        </Button>
      </div>

    </div>
  );
};