import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Badge, Button, Input, Select } from '@stackloop/ui';
import { 
  Building2, 
  FileText, 
  Hash, 
  ArrowRight, 
  ChevronLeft 
} from 'lucide-react';
import { motion } from 'motion/react';
import { StepDots } from '../../components/shared/StepDots';
import { requiredTextError, selectionError } from '../../lib/onboardingValidation';
import { useRiderOnboardingStore } from '../../store/riderOnboardingStore';
import type { RiderBusinessType } from '../../../lib/types';

export const OrganisationDetails: React.FC = () => {
  const navigate = useNavigate();
  const draft = useRiderOnboardingStore((state) => state.draft);
  const setOrganizationInfo = useRiderOnboardingStore((state) => state.setOrganizationInfo);
  const [hasAttemptedContinue, setHasAttemptedContinue] = useState(false);
  
  const [formData, setFormData] = useState({
    organisationName: draft.organizationInfo.name,
    businessType: draft.organizationInfo.businessType,
    organisationNumber: draft.organizationInfo.registrationNo,
    taxId: draft.organizationInfo.taxIDNumber
  });

  useEffect(() => {
    setOrganizationInfo({
      name: formData.organisationName,
      businessType: (formData.businessType || 'other') as any,
      registrationNo: formData.organisationNumber,
      taxIDNumber: formData.taxId,
    });
  }, [formData, setOrganizationInfo]);

  const organisationNameValidationError = requiredTextError(formData.organisationName, 'Organisation name');
  const businessTypeValidationError = selectionError(formData.businessType, 'business type');
  const organisationNumberValidationError = requiredTextError(formData.organisationNumber, 'Registration number');
  const taxIdValidationError = requiredTextError(formData.taxId, 'KRA PIN');
  const organisationNameError = hasAttemptedContinue ? organisationNameValidationError : '';
  const businessTypeError = hasAttemptedContinue ? businessTypeValidationError : '';
  const organisationNumberError = hasAttemptedContinue ? organisationNumberValidationError : '';
  const taxIdError = hasAttemptedContinue ? taxIdValidationError : '';
  const isFormValid = !organisationNameValidationError && !businessTypeValidationError && !organisationNumberValidationError && !taxIdValidationError;

  const businessTypes = [
    { value: 'delivery', label: 'Delivery' },
    { value: 'courier', label: 'Courier' },
    { value: 'logistics', label: 'Logistics' },
    { value: 'transport', label: 'Transport' },
    { value: 'motorbike_taxi', label: 'Motorbike Taxi' },
    { value: 'ecommerce_delivery', label: 'Ecommerce Delivery' },
    { value: 'food_delivery', label: 'Food Delivery' },
    { value: 'parcel_delivery', label: 'Parcel Delivery' },
    { value: 'fleet_management', label: 'Fleet Management' },
    { value: 'other', label: 'Other' },
  ] as const;

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) {
      setHasAttemptedContinue(true);
      return;
    }

    navigate('/company/kyc-documents');
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

        <StepDots currentStep={2} />

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
            <Building2 className="w-7 h-7 text-primary" />
          </div>
          
          <h1 className="text-lg font-bold text-foreground mb-2">
            <span className="text-primary mr-1">
              <Badge className="bg-primary text-white">2</Badge>
            </span>
            Organisation Details
          </h1>
          <p className="text-sm text-foreground/60 leading-relaxed max-w-70 mx-auto">
            Tell us about your organisation.
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
          
          {/* Organisation Name */}
          <div>
            <Input
              label="Organisation Name"
              placeholder="Enter  name"
              value={formData.organisationName}
              onChange={(value) => setFormData({ ...formData, organisationName: String(value) })}
              error={organisationNameError}
              leftIcon={<Building2 className="w-5 h-5 text-foreground/40" />}
              className="h-14 rounded-2xl"
            />
          </div>

          {/* Business Type */}
          <div className='pb-6'>
            <Select
              label="Business Type"
              placeholder="Select business type"
              options={businessTypes.map((type) => ({ value: type.value, label: type.label }))}
              value={formData.businessType}
              onChange={(value) => setFormData({ ...formData, businessType: String(value) as RiderBusinessType })}
              error={businessTypeError}
              className="rounded-2xl h-14"
            />
          </div>

          {/* Organisation Number (Optional) */}
          <div>
            <Input
              label="Registration Number"
              placeholder="Enter registration number"
              value={formData.organisationNumber}
              onChange={(value) => setFormData({ ...formData, organisationNumber: String(value) })}
              error={organisationNumberError}
              leftIcon={<Hash className="w-5 h-5 text-foreground/40" />}
              className="h-14 rounded-2xl"
              required
            />
          </div>

          {/* Tax Identification Number (Optional) */}
          <div>
            <Input
              label="KRA PIN"
              placeholder="Enter KRA PIN"
              value={formData.taxId}
              onChange={(value) => setFormData({ ...formData, taxId: String(value) })}
              error={taxIdError}
              leftIcon={<FileText className="w-5 h-5 text-foreground/40" />}
              className="h-14 rounded-2xl"
              required
            />
          </div>

        </motion.form>

      </div>

      {/* Footer / Action Button */}
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