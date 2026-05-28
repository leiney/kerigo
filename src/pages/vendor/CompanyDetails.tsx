import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Badge, Button, Input, Select } from '@stackloop/ui';
import { Building2, ArrowRight, ChevronLeft, FileText } from 'lucide-react';
import { motion } from 'motion/react';
import { StepDots } from '../../components/shared/StepDots';
import { businessTypeOptions } from '../../lib/vendorOnboarding';
import { useVendorOnboardingStore } from '../../store/vendorOnboardingStore';

export const CompanyDetails: React.FC = () => {
  const navigate = useNavigate();
  const draft = useVendorOnboardingStore((state) => state.draft);
  const setOrganizationInfo = useVendorOnboardingStore((state) => state.setOrganizationInfo);

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

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    // Navigate to next step
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
              leftIcon={<Building2 className="w-5 h-5 text-foreground/40" />}
              className="h-14 rounded-2xl"
            />
          </div>

          {/* Business Registration Number */}
          <div>
            <Input
              label="Business Registration Number"
              placeholder="Enter registration number"
              value={formData.businessRegistrationNumber}
              onChange={(value) => setFormData({ ...formData, businessRegistrationNumber: String(value) })}
              leftIcon={<FileText className="w-5 h-5 text-foreground/40" />}
              className="h-14 rounded-2xl"
            />
          </div>


          {/* KRA PIN */}
          <div>
            <Input
              label="KRA PIN"
              placeholder="Enter KRA PIN"
              value={formData.kraPIN}
              onChange={(value) => setFormData({ ...formData, kraPIN: String(value) })}
              leftIcon={<FileText className="w-5 h-5 text-foreground/40" />}
              className="h-14 rounded-2xl"
            />
          </div>

          <div className='pb-4'>
            <Select
              label="Business Type"
              placeholder="Select business type"
              options={businessTypeOptions.map((type) => ({ value: type.value, label: type.label }))}
              value={formData.businessType}
              onChange={(value) => setFormData({ ...formData, businessType: String(value) as any })}
              className="h-14 rounded-2xl"
            />
          </div>

        </motion.form>
      </div>

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

export default CompanyDetails;
