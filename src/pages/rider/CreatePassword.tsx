import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Badge, Button, Input } from '@stackloop/ui';
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
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Real-time validation states
  const hasMinLength = password.length >= 8;
  const hasNumber = /\d/.test(password);
  const hasUppercase = /[A-Z]/.test(password);
  const passwordsMatch = password === confirmPassword && password.length > 0;

  const handleContinue = () => {
    navigate('/rider/review-confirmation');
    if (hasMinLength && hasNumber && hasUppercase && passwordsMatch) {
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

        <StepDots currentStep={6} />

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
            <span className="text-primary mr-1">
              <Badge className="bg-primary text-white">6</Badge>
            </span>
            Create Password
          </h1>
          <p className="text-sm text-foreground/60 leading-relaxed max-w-70 mx-auto">
            Secure your account with a strong password.
          </p>
        </motion.div>

        {/* Form Fields */}
        <motion.form 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="w-full max-w-md space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            handleContinue();
          }}
        >
          
          {/* Password Input */}
          <Input
            label="Password"
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(value) => setPassword(String(value))}
            className="h-14 rounded-2xl"
          />

          {/* Confirm Password Input */}
          <Input
            label="Confirm Password"
            type="password"
            placeholder="Confirm password"
            value={confirmPassword}
            onChange={(value) => setConfirmPassword(String(value))}
            className="h-14 rounded-2xl"
          />

          {/* Password Requirements Checklist */}
          <div className="space-y-3 mt-4 px-1">
            <div className="flex items-center gap-2.5">
              {hasMinLength ? (
                <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
              ) : (
                <Circle className="w-4 h-4 text-border-dark shrink-0" />
              )}
              <span className={`text-xs transition-colors ${hasMinLength ? 'text-foreground' : 'text-foreground/50'}`}>
                At least 8 characters
              </span>
            </div>

            <div className="flex items-center gap-2.5">
              {hasNumber ? (
                <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
              ) : (
                <Circle className="w-4 h-4 text-border-dark shrink-0" />
              )}
              <span className={`text-xs transition-colors ${hasNumber ? 'text-foreground' : 'text-foreground/50'}`}>
                Include a number
              </span>
            </div>

            <div className="flex items-center gap-2.5">
              {hasUppercase ? (
                <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
              ) : (
                <Circle className="w-4 h-4 text-border-dark shrink-0" />
              )}
              <span className={`text-xs transition-colors ${hasUppercase ? 'text-foreground' : 'text-foreground/50'}`}>
                Include an uppercase letter
              </span>
            </div>
          </div>

        </motion.form>

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