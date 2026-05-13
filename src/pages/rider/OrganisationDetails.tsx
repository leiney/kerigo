import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Input, Select } from '@stackloop/ui';
import { 
  Building2, 
  FileText, 
  Hash, 
  ArrowRight, 
  ChevronLeft 
} from 'lucide-react';
import { motion } from 'motion/react';
import { StepDots } from '../../components/shared/StepDots';

export const OrganisationDetails: React.FC = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    organisationName: '',
    businessType: '',
    organisationNumber: '',
    taxId: ''
  });

  const businessTypes = [
    'Transport & Logistics',
    'Retail',
    'Food & Beverage',
    'Professional Services',
    'Construction',
    'Manufacturing',
    'Agriculture',
    'Other'
  ];

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    // Navigate to next step: Administrator Details (Step 2A)
    navigate('/company/administrator-details');
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
            <span className="text-primary mr-1">2</span>
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
              placeholder="Enter organisation name"
              value={formData.organisationName}
              onChange={(value) => setFormData({ ...formData, organisationName: String(value) })}
              leftIcon={<Building2 className="w-5 h-5 text-foreground/40" />}
              className="h-14 rounded-2xl"
            />
          </div>

          {/* Business Type */}
          <div className='pb-4'>
            <Select
              label="Business Type"
              placeholder="Select business type"
              options={businessTypes.map(type => ({ value: type.toLowerCase().replace(/\s+/g, '-'), label: type }))}
              value={formData.businessType}
              onChange={(value) => setFormData({ ...formData, businessType: String(value) })}
              className="rounded-2xl h-14"
            />
          </div>

          {/* Organisation Number (Optional) */}
          <div>
            <Input
              label="Organisation Number (Optional)"
              placeholder="Enter registration number"
              value={formData.organisationNumber}
              onChange={(value) => setFormData({ ...formData, organisationNumber: String(value) })}
              leftIcon={<Hash className="w-5 h-5 text-foreground/40" />}
              className="h-14 rounded-2xl"
            />
          </div>

          {/* Tax Identification Number (Optional) */}
          <div>
            <Input
              label="Tax Identification Number (Optional)"
              placeholder="Enter TIN"
              value={formData.taxId}
              onChange={(value) => setFormData({ ...formData, taxId: String(value) })}
              leftIcon={<FileText className="w-5 h-5 text-foreground/40" />}
              className="h-14 rounded-2xl"
            />
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