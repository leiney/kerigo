import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Badge, Button, Input, Select } from '@stackloop/ui';
import { Building2, ArrowRight, ChevronLeft, FileText } from 'lucide-react';
import { motion } from 'motion/react';
import { StepDots } from '../../components/shared/StepDots';
import { businessTypeOptions } from '../../lib/vendorOnboarding';
import { requiredTextError, selectionError } from '../../lib/onboardingValidation';
import { useVendorOnboardingStore } from '../../store/vendorOnboardingStore';

export const CompanyDetails: React.FC = () => {
  const navigate = useNavigate();
  const draft = useVendorOnboardingStore((state) => state.draft);
  const setOrganizationInfo = useVendorOnboardingStore((state) => state.setOrganizationInfo);
  const [hasAttemptedContinue, setHasAttemptedContinue] = useState(false);

  const [formData, setFormData] = useState({
    companyName: draft.organizationInfo.name,
    businessRegistrationNumber: draft.organizationInfo.registrationNo,
    kraPIN: draft.organizationInfo.taxIDNumber,
    businessType: draft.organizationInfo.businessType,
  });

  useEffect(() => {
    setOrganizationInfo({
      name: formData.companyName,
      registrationNo: formData.businessRegistrationNumber,
      taxIDNumber: formData.kraPIN,
      businessType: formData.businessType || 'other',
    });
  }, [formData, setOrganizationInfo]);

  const companyNameValidationError = requiredTextError(formData.companyName, 'Company name');
  const registrationNumberValidationError = requiredTextError(formData.businessRegistrationNumber, 'Business registration number');
  const kraPinValidationError = requiredTextError(formData.kraPIN, 'KRA PIN');
  const businessTypeValidationError = selectionError(formData.businessType, 'business type');
  const companyNameError = hasAttemptedContinue ? companyNameValidationError : '';
  const registrationNumberError = hasAttemptedContinue ? registrationNumberValidationError : '';
  const kraPinError = hasAttemptedContinue ? kraPinValidationError : '';
  const businessTypeError = hasAttemptedContinue ? businessTypeValidationError : '';
  const isFormValid = !companyNameValidationError && !registrationNumberValidationError && !kraPinValidationError && !businessTypeValidationError;

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) {
      setHasAttemptedContinue(true);
      return;
    }

    navigate('/vendor/administrator-details');
  };

  return (
    <div className="min-h-screen bg-white text-foreground font-sans antialiased flex flex-col relative overflow-hidden">
      
      <div className="px-5 pt-6 pb-2 flex items-center justify-between">
        <button 
          onClick={() => navigate(-1)} 
          className="p-2 -ml-2 rounded-full hover:bg-secondary transition-colors"
        >
          <ChevronLeft className="w-6 h-6 text-foreground" />
        </button>

        <StepDots currentStep={2} />

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
            <Building2 className="w-7 h-7 text-primary" />
          </div>
          
          <h1 className="text-lg font-bold text-foreground mb-2">
            <span className="text-primary mr-1">
              <Badge className="bg-primary text-white">2</Badge>
            </span>
            Company Details
          </h1>
          <p className="text-sm text-foreground/60 leading-relaxed max-w-70 mx-auto">
            Tell us about your business.
          </p>
        </motion.div>

        {/* Form Fields */}
        <motion.form 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          onSubmit={handleContinue}
          className="w-full max-w-md space-y-4"
        >

         
          
          {/* Company Name */}
          <div>
            <Input
              label="Company Name"
              placeholder="Enter your company name"
              value={formData.companyName}
              onChange={(value) => setFormData({ ...formData, companyName: String(value) })}
              error={companyNameError}
              leftIcon={<Building2 className="w-5 h-5 text-foreground/40" />}
              className="h-14 rounded-2xl"
              required
            />
          </div>

          {/* Business Registration Number */}
          <div>
            <Input
              label="Business Registration Number"
              placeholder="Enter registration number"
              value={formData.businessRegistrationNumber}
              onChange={(value) => setFormData({ ...formData, businessRegistrationNumber: String(value) })}
              error={registrationNumberError}
              leftIcon={<FileText className="w-5 h-5 text-foreground/40" />}
              className="h-14 rounded-2xl"
              required
            />
          </div>


          {/* KRA PIN */}
          <div>
            <Input
              label="KRA PIN"
              placeholder="Enter KRA PIN"
              value={formData.kraPIN}
              onChange={(value) => setFormData({ ...formData, kraPIN: String(value) })}
              error={kraPinError}
              leftIcon={<FileText className="w-5 h-5 text-foreground/40" />}
              className="h-14 rounded-2xl"
              required
            />
          </div>

          <div className='pb-5'>
            <Select
              label="Business Type"
              placeholder="Select business type"
              options={businessTypeOptions.map((type) => ({ value: type.value, label: type.label }))}
              value={formData.businessType}
              onChange={(value) => setFormData({ ...formData, businessType: String(value) as any })}
              error={businessTypeError}
              className="h-14 rounded-2xl"
              required
            />
          </div>

        </motion.form>
      </div>

      <div className="p-6 pb-8 bg-white">
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

export default CompanyDetails;
