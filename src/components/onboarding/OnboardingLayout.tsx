import React from 'react';
import { Badge, Button } from '@stackloop/ui';
import { ChevronLeft, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import { StepDots } from '../shared/StepDots';

type OnboardingLayoutProps = {
  currentStep: number;
  totalSteps?: number;
  stepNumber?: number;
  title: string;
  subtitle?: string;
  icon: React.ReactNode;
  onBack?: () => void;
  onContinue?: (e: React.FormEvent) => void;
  continueText?: string;
  continueIcon?: React.ReactNode;
  isContinueDisabled?: boolean;
  isContinueLoading?: boolean;
  children: React.ReactNode;
  hideFooter?: boolean;
};

export const OnboardingLayout: React.FC<OnboardingLayoutProps> = ({
  currentStep,
  totalSteps = 9,
  stepNumber,
  title,
  subtitle,
  icon,
  onBack,
  onContinue,
  continueText = 'Continue',
  continueIcon = <ArrowRight className="w-5 h-5" />,
  isContinueDisabled = false,
  isContinueLoading = false,
  children,
  hideFooter = false,
}) => {
  return (
    <div className="min-h-screen bg-white text-foreground font-sans antialiased flex flex-col relative overflow-hidden">
      
      {/* Top Header / Navigation */}
      <div className="px-5 pt-6 pb-2 flex items-center justify-between">
        {onBack ? (
          <button 
            type="button"
            onClick={onBack} 
            className="p-2 -ml-2 rounded-full hover:bg-secondary transition-colors"
          >
            <ChevronLeft className="w-6 h-6 text-foreground" />
          </button>
        ) : (
          <div className="w-10" />
        )}

        <StepDots currentStep={currentStep} totalSteps={totalSteps} className="overflow-hidden" />

        {/* Spacer to balance the header */}
        <div className="w-8" />
      </div>

      {/* Main Content */}
      <div className="flex-1 px-6 pt-6 flex flex-col items-center overflow-y-auto">
        
        {/* Step Icon & Title */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8 shrink-0"
        >
          <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            {icon}
          </div>
          
          <h1 className="text-lg font-bold text-foreground mb-2">
            {stepNumber !== undefined && (
              <span className="text-primary mr-1">
                <Badge className="bg-primary text-white">{stepNumber}</Badge>
              </span>
            )}
            {title}
          </h1>
          {subtitle && (
            <p className="text-sm text-foreground/60 leading-relaxed max-w-70 mx-auto">
              {subtitle}
            </p>
          )}
        </motion.div>

        {/* Form or Step Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="w-full max-w-md flex-1 flex flex-col pb-8"
        >
          {onContinue ? (
            <form 
              onSubmit={(e) => { e.preventDefault(); onContinue(e); }} 
              className="flex-1 flex flex-col justify-between h-full"
            >
              <div className="space-y-4 flex-1">
                {children}
              </div>
              
              {/* Footer inside form to submit properly */}
              {!hideFooter && (
                <div className="pt-6 bg-white mt-auto shrink-0">
                  <Button 
                    type="submit"
                    disabled={isContinueDisabled}
                    loading={isContinueLoading}
                    className="w-full h-14 rounded-2xl text-lg font-bold flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
                    icon={continueIcon}
                  >
                    {continueText}
                  </Button>
                </div>
              )}
            </form>
          ) : (
            <div className="flex-1 flex flex-col justify-between h-full">
              <div className="space-y-4 flex-1">
                {children}
              </div>
              
              {!hideFooter && onContinue && (
                <div className="pt-6 bg-white mt-auto shrink-0">
                  <Button 
                    onClick={onContinue}
                    type="button"
                    disabled={isContinueDisabled}
                    loading={isContinueLoading}
                    className="w-full h-14 rounded-2xl text-lg font-bold flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
                    icon={continueIcon}
                  >
                    {continueText}
                  </Button>
                </div>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};
