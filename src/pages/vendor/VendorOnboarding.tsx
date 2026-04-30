
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Input, Select, Card, CardContent } from '@stackloop/ui';
import { ArrowRight, ArrowLeft, Store, Briefcase, Camera, CheckCircle2, MapPin, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const STEPS = [
  "Basic Details",
  "Store Details",
  "KYC Documents",
  "Payout Details",
  "Password",
  "Products"
];

export const VendorOnboarding: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = STEPS.length;

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, totalSteps + 1));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  if (currentStep > totalSteps) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-8 text-center">
        <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
          <div className="w-32 h-32 bg-orange-100 rounded-full flex items-center justify-center mb-8 mx-auto">
            <Store className="h-16 w-16 text-orange-600" />
          </div>
          <h2 className="text-3xl font-black mb-4">Store set up!</h2>
          <p className="text-foreground/50 mb-10 max-w-xs">
            Your store is ready to go. Start adding items and receiving orders from thousands of customers.
          </p>
          <Button className="w-full h-14 rounded-2xl font-bold text-lg bg-orange-600 border-none" onClick={() => navigate('/vendor/dashboard')}>
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
                className={`h-1.5 rounded-full transition-all ${i + 1 <= currentStep ? 'w-6 bg-orange-500' : 'w-2 bg-border'}`} 
              />
            ))}
          </div>
        </div>
        <div className="w-10" />
      </header>

      <div className="flex-1 px-6 pt-10">
        <div className="flex items-center gap-4 mb-2">
          <div className="h-8 w-8 bg-orange-100 rounded-lg flex items-center justify-center text-orange-600 font-bold text-sm">
            {currentStep}
          </div>
          <h2 className="text-2xl font-black">{STEPS[currentStep - 1]}</h2>
        </div>
        <p className="text-sm text-foreground/50 mb-8">Help us set up your professional store on KeriGo.</p>

        <AnimatePresence mode="wait">
           {currentStep === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
              <Input label="Full Name" placeholder="Enter your full name" className="rounded-xl h-14" />
              <Input label="Email Address" placeholder="Enter your email" type="email" className="rounded-xl h-14" />
              <Input label="Phone Number" placeholder="Enter phone" type="phone" className="rounded-xl h-14" />
            </motion.div>
          )}

          {currentStep === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
              <Input label="Store Name" placeholder="Enter store name" leftIcon={<Store className="h-4 w-4" />} className="rounded-xl h-14" />
              <Select 
                label="Business Type" 
                placeholder="Select category"
                options={[{value: 'food', label: 'Restaurant'}, {value: 'grocery', label: 'Grocery Store'}]} 
                value=""
                onChange={() => {}}
                className="rounded-xl h-14"
              />
              <Input label="Store Location" placeholder="Search location" leftIcon={<MapPin className="h-4 w-4" />} className="rounded-xl h-14" />
            </motion.div>
          )}

          {currentStep === 6 && (
            <motion.div key="step6" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
               <div className="border-2 border-dashed border-border rounded-3xl p-6 text-center hover:border-orange-500 transition-colors cursor-pointer group mb-6">
                <div className="h-16 w-16 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Camera className="h-8 w-8 text-orange-600" />
                </div>
                <h4 className="font-bold mb-1">Add Product Image</h4>
                <p className="text-xs text-foreground/40">Optional - you can add more later</p>
              </div>
              <Input label="Product Name" placeholder="e.g. Fresh Milk" className="rounded-xl h-14" />
              <Input label="Price (KES)" placeholder="e.g. 50" type="number" className="rounded-xl h-14" />
              <Button variant="ghost" className="w-full text-orange-600 font-bold">+ Add another product</Button>
            </motion.div>
          )}

          {/* Placeholder steps */}
          {(currentStep === 3 || currentStep === 4 || currentStep === 5) && (
             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-10 bg-secondary rounded-3xl border border-border text-center">
               <p className="text-foreground/40">Form fields for {STEPS[currentStep-1]} go here...</p>
             </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="p-6">
        <Button 
          className="w-full h-14 rounded-2xl font-bold text-lg flex justify-between px-8 bg-orange-600 border-none hover:bg-orange-700"
          onClick={nextStep}
          icon={<ArrowRight className="h-6 w-6" />}
        >
          {currentStep === totalSteps ? 'Finish' : 'Continue'}
        </Button>
        <p className="text-center mt-6 text-[10px] text-foreground/40 font-medium">
          You can always update this information later from your account settings.
        </p>
      </div>
    </div>
  );
};
