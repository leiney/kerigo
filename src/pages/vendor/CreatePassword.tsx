import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Input } from '@stackloop/ui';
import { 
  Lock, 
  ArrowRight, 
  ChevronLeft,
  CheckCircle2,
  Circle
} from 'lucide-react';
import { motion } from 'motion/react';
import { StepDots } from '../../components/shared/StepDots';

export const CreatePassword: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });

  // Validation state
  const [requirements, setRequirements] = useState({
    length: false,
    uppercase: false,
    number: false,
    match: false
  });

  // Update validation whenever passwords change
  useEffect(() => {
    const { password, confirmPassword } = formData;
    
    setRequirements({
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      number: /\d/.test(password),
      match: password.length > 0 && password === confirmPassword
    });
  }, [formData]);

  const isFormValid = 
    requirements.length && 
    requirements.uppercase && 
    requirements.number && 
    requirements.match;

  const handleContinue = () => {
    navigate('/vendor/review-confirmation');
    if (isFormValid) {
    }
  };

  const RequirementItem = ({ met, label }: { met: boolean; label: string }) => (
    <div className="flex items-center gap-2">
      {met ? (
        <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
      ) : (
        <Circle className="w-4 h-4 text-gray-300 shrink-0" />
      )}
      <span className={`text-xs ${met ? 'text-primary' : 'text-foreground/40'}`}>
        {label}
      </span>
    </div>
  );

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

        <StepDots currentStep={8} />

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
            <Lock className="w-7 h-7 text-primary" />
          </div>
          
          <h1 className="text-lg font-bold text-foreground mb-2">
            <span className="text-primary mr-1">8</span>
            Create Password
          </h1>
          <p className="text-sm text-foreground/60 leading-relaxed max-w-70 mx-auto">
            Secure your account with a strong password.
          </p>
        </motion.div>

        {/* Form Fields */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="w-full max-w-md space-y-4"
        >
          
          {/* Password */}
          <Input
            type="password"
            label="Password"
            placeholder="Enter password"
            value={formData.password}
            onChange={(value) => setFormData({ ...formData, password: String(value) })}
            leftIcon={<Lock className="w-5 h-5 text-foreground/40" />}
            className="rounded-2xl h-14"
          />

          {/* Confirm Password */}
          <Input
            type="password"
            label="Confirm Password"
            placeholder="Confirm password"
            value={formData.confirmPassword}
            onChange={(value) => setFormData({ ...formData, confirmPassword: String(value) })}
            leftIcon={<Lock className="w-5 h-5 text-foreground/40" />}
            className={`rounded-2xl h-14 ${formData.confirmPassword.length > 0 && !requirements.match ? 'border-error focus:ring-error/20' : ''}`}
          />

          {/* Password Requirements */}
          <div className="bg-gray-50/50 rounded-xl p-4 space-y-3 mt-2">
            <RequirementItem met={requirements.length} label="At least 8 characters" />
            <RequirementItem met={requirements.number} label="Include a number" />
            <RequirementItem met={requirements.uppercase} label="Include an uppercase letter" />
          </div>

        </motion.div>

      </div>

      {/* Footer / Action Button */}
      <div className="p-6 pb-8 bg-white">
        <Button 
          onClick={handleContinue}
         /*  disabled={!isFormValid} */
          className={`w-full h-14 rounded-2xl text-lg font-bold flex items-center justify-center gap-2 shadow-lg ${
            isFormValid ? 'shadow-primary/20' : ''
          }`}
        >
          Continue
          <ArrowRight className="w-5 h-5" />
        </Button>
      </div>

    </div>
  );
};