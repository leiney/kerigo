import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Badge, Button, Input, Select } from '@stackloop/ui';
import { 
  User, 
  Phone, 
  Mail, 
  FileText, 
  Upload, 
  Plus, 
  Pencil, 
  Trash2, 
  ArrowRight, 
  ChevronLeft,
  CheckCircle2,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { StepDots } from '../../components/shared/StepDots';
import { emailError, phoneError, requiredTextError } from '../../lib/onboardingValidation';
import { useRiderOnboardingStore } from '../../store/riderOnboardingStore';





export const AdministratorDetails: React.FC = () => {
  const navigate = useNavigate();
  const draft = useRiderOnboardingStore((state) => state.draft);
  const setIdentityDetails = useRiderOnboardingStore((state) => state.setIdentityDetails);
  const [hasAttemptedContinue, setHasAttemptedContinue] = useState(false);
  
  const [formData, setFormData] = useState({
    fullName: draft.fullName,
    phoneNumber: draft.phoneNo,
    email: draft.email,
  });

  useEffect(() => {
    setIdentityDetails({
      fullName: formData.fullName,
      phoneNo: formData.phoneNumber,
      email: formData.email,
    });
  }, [formData, setIdentityDetails]);

  const fullNameValidationError = requiredTextError(formData.fullName, 'Full name');
  const phoneNumberValidationError = phoneError(formData.phoneNumber, 'Phone number');
  const emailAddressValidationError = emailError(formData.email);
  const fullNameError = hasAttemptedContinue ? fullNameValidationError : '';
  const phoneNumberError = hasAttemptedContinue ? phoneNumberValidationError : '';
  const emailAddressError = hasAttemptedContinue ? emailAddressValidationError : '';
  const isFormValid = !fullNameValidationError && !phoneNumberValidationError && !emailAddressValidationError;

 

  

  const handleContinue = () => {
    if (!isFormValid) {
      setHasAttemptedContinue(true);
      return;
    }

    navigate('/company/add-riders');
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
      <div className="flex-1 px-6 pt-6 flex flex-col items-center overflow-y-auto">
        
        {/* Step Icon & Title */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6"
        >
          <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-7 h-7 text-primary" />
          </div>
          
          <h1 className="text-lg font-bold text-foreground mb-2">
            <span className="text-primary mr-1"> <Badge className='bg-primary text-white' >2</Badge> </span>
            Administrator Details
          </h1>
          <p className="text-sm text-foreground/60 leading-relaxed max-w-70 mx-auto">
            Add the details of the administrator for this organisation.
          </p>
        </motion.div>

        {/* Form Fields */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="w-full max-w-md space-y-4"
        >
          
          {/* Full Name */}
          <div>
            <Input
              label="Full Name"
              placeholder="Enter full name"
              value={formData.fullName}
              onChange={(value) => setFormData({ ...formData, fullName: String(value) })}
              error={fullNameError}
              className="h-14 rounded-2xl"
            />
          </div>

          {/* Phone Number */}
          <div className='pb-5'>
            <Input
              label="Phone Number"
              type="phone"
              placeholder="Enter phone number"
              value={formData.phoneNumber}
              onChange={(value) => setFormData({ ...formData, phoneNumber: String(value) })}
              defaultCountry="KE"
              error={phoneNumberError}
              className="h-14 rounded-2xl"
            />
          </div>

          {/* Email Address */}
          <div>
            <Input
              label="Email Address"
              type="email"
              placeholder="Enter email address"
              value={formData.email}
              onChange={(value) => setFormData({ ...formData, email: String(value) })}
              error={emailAddressError}
              className="h-14 rounded-2xl"
              required
            />
          </div>

         

       
        </motion.div>

      </div>

      {/* Footer / Action Button */}
      <div className="p-6 pb-8 bg-white border-t border-border/50">
        <Button 
          onClick={handleContinue}
          type="button"
          className="w-full h-14 rounded-2xl text-lg font-bold flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
          icon={<ArrowRight className="w-5 h-5" />}
        >
          Continue
        </Button>
      </div>
    </div>
  );
};