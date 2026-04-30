
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Input, Select, StepProgress, FileUploader, Badge } from '@stackloop/ui';
import { ArrowRight, ArrowLeft, Camera, CheckCircle2, Bike, Mail, User, Phone, MapPin, CreditCard } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const STEPS = [
  "Basic Details",
  "Rider Details",
  "Vehicle info",
  "Payout Details",
  "KYC Documents",
  "Password",
  "Verification"
];

export const RiderOnboarding: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = STEPS.length;

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, totalSteps + 1));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  if (currentStep > totalSteps) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-8 text-center">
        <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
          <div className="w-32 h-32 bg-primary/10 rounded-full flex items-center justify-center mb-8 mx-auto">
            <CheckCircle2 className="h-16 w-16 text-primary" />
          </div>
          <h2 className="text-3xl font-black mb-4">You're all set!</h2>
          <p className="text-foreground/50 mb-10 max-w-xs">
            Your rider account has been created successfully. You can now go online and start earning.
          </p>
          <Button className="w-full h-14 rounded-2xl font-bold text-lg" onClick={() => navigate('/rider/dashboard')}>
            Go to Dashboard
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <header className="px-6 pt-8 flex items-center justify-between">
        <button onClick={prevStep} className="h-10 w-10 flex items-center justify-center rounded-full bg-secondary border border-border">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div className="flex-1 px-4">
          <div className="flex gap-1 justify-center">
            {STEPS.map((_, i) => (
              <div 
                key={i} 
                className={`h-1.5 rounded-full transition-all ${i + 1 <= currentStep ? 'w-6 bg-primary' : 'w-2 bg-border'}`} 
              />
            ))}
          </div>
        </div>
        <div className="w-10" />
      </header>

      <div className="flex-1 px-6 pt-10">
        <div className="flex items-center gap-4 mb-2">
          <div className="h-8 w-8 bg-primary/10 rounded-lg flex items-center justify-center text-primary font-bold text-sm">
            {currentStep}
          </div>
          <h2 className="text-2xl font-black">{STEPS[currentStep - 1]}</h2>
        </div>
        <p className="text-sm text-foreground/50 mb-8">Tell us more about your riding experience.</p>

        <AnimatePresence mode="wait">
          {currentStep === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
              <Input label="Full Name" placeholder="Enter your full name" leftIcon={<User className="h-4 w-4" />} className="rounded-xl h-14" />
              <Input label="Email Address" placeholder="Enter your email" leftIcon={<Mail className="h-4 w-4" />} className="rounded-xl h-14" />
              <Input label="Phone Number" placeholder="Enter your phone number" type="phone" className="rounded-xl h-14" />
            </motion.div>
          )}

          {currentStep === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
              <Input label="Date of Birth" type="date" className="rounded-xl h-14" />
              <Select 
                label="ID Type" 
                placeholder="Select ID type"
                options={[{value: 'nat', label: 'National ID'}, {value: 'pass', label: 'Passport'}]} 
                value=""
                onChange={() => {}}
                className="rounded-xl h-14"
              />
              <Input label="ID Number" placeholder="Enter ID number" className="rounded-xl h-14" />
              <Select 
                label="Riding Experience" 
                placeholder="Select experience"
                options={[{value: '1', label: '1-2 years'}, {value: '2', label: '3+ years'}]} 
                value=""
                onChange={() => {}}
                className="rounded-xl h-14"
              />
            </motion.div>
          )}

          {currentStep === 3 && (
            <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
              <Select 
                label="Vehicle Type" 
                placeholder="Select type"
                options={[{value: 'moto', label: 'Motorbike'}, {value: 'cycle', label: 'Bicycle'}, {value: 'car', label: 'Car'}]} 
                value="moto"
                onChange={() => {}}
                className="rounded-xl h-14"
              />
              <Input label="Registration Number" placeholder="Enter registration number" className="rounded-xl h-14" />
              <div className="grid grid-cols-2 gap-4">
                <Input label="Make" placeholder="e.g. Honda" className="rounded-xl h-14" />
                <Input label="Model" placeholder="e.g. CG 125" className="rounded-xl h-14" />
              </div>
            </motion.div>
          )}

          {currentStep === 5 && (
            <motion.div key="step5" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
              <div className="border-2 border-dashed border-border rounded-3xl p-6 text-center hover:border-primary transition-colors cursor-pointer group">
                <div className="h-16 w-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Camera className="h-8 w-8 text-primary" />
                </div>
                <h4 className="font-bold mb-1">Upload National ID</h4>
                <p className="text-xs text-foreground/40">Front and back, PNG, JPG or PDF (max 5MB)</p>
              </div>

               <div className="border-2 border-dashed border-border rounded-3xl p-6 text-center hover:border-primary transition-colors cursor-pointer group">
                <div className="h-16 w-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Camera className="h-8 w-8 text-primary" />
                </div>
                <h4 className="font-bold mb-1">Driving License</h4>
                <p className="text-xs text-foreground/40">PNG, JPG or PDF (max 5MB)</p>
              </div>
            </motion.div>
          )}
          
          {currentStep === 4 && (
            <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
               <Select 
                label="Payout Method" 
                placeholder="Choose preferred method"
                options={[{value: 'bank', label: 'Bank Account'}, {value: 'mpesa', label: 'M-Pesa Number'}]} 
                value="mpesa"
                onChange={() => {}}
                className="rounded-xl h-14"
              />
              <Input label="M-Pesa Number" placeholder="+254 7XX XXX XXX" type="phone" className="rounded-xl h-14" />
            </motion.div>
          )}

          {currentStep === 6 && (
            <motion.div key="step6" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
              <Input label="Password" type="password" placeholder="Create a strong password" className="rounded-xl h-14" />
              <Input label="Confirm Password" type="password" placeholder="Repeat your password" className="rounded-xl h-14" />
              <div className="space-y-2 pt-2">
                <div className="flex items-center gap-2 text-[10px] text-green-500 font-bold">
                  <CheckCircle2 className="h-3 w-3" /> At least 8 characters
                </div>
                <div className="flex items-center gap-2 text-[10px] text-green-500 font-bold">
                  <CheckCircle2 className="h-3 w-3" /> Includes a number
                </div>
              </div>
            </motion.div>
          )}
          
          {/* Default placeholders for other steps */}
          {currentStep === 7 && (
             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-10 bg-secondary rounded-3xl border border-border text-center">
               <p className="text-foreground/40 text-sm">OTP verification code will be sent to your number for final verification.</p>
             </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="p-6">
        <Button 
          className="w-full h-14 rounded-2xl font-bold text-lg flex justify-between px-8"
          onClick={nextStep}
          icon={<ArrowRight className="h-6 w-6" />}
        >
          Continue
        </Button>
        <p className="text-center mt-6 text-[11px] text-foreground/40 font-medium px-10">
          Why we need this information? <br />
          <span className="text-foreground/30 font-normal">This helps us verify your identity, ensure safety and provide a secure experience.</span>
        </p>
      </div>
    </div>
  );
};
