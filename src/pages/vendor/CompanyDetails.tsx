import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Input, Select } from '@stackloop/ui';
import { 
  Building2, 
  Mail, 
  ArrowRight, 
  ChevronLeft,
  Phone,
  FileText
} from 'lucide-react';
import { motion } from 'motion/react';
import { StepDots } from '../../components/shared/StepDots';

export const CompanyDetails: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    companyName: '',
    businessRegistrationNumber: '',
    kraPIN: '',
    phoneNumber: '',
    email: '',
    businessType: ''
  });

  const businessTypes = [
    'Retail',
    'Wholesale',
    'Manufacturing',
    'Services',
    'Logistics',
    'Food & Beverage',
    'Technology',
    'Other'
  ];

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    // Navigate to next step
    navigate('/vendor/company-kyc-documents');
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


          {/* Email */}
          <div>
            <Input
              label="Email"
              placeholder="Enter your business email"
              type="email"
              value={formData.email}
              onChange={(value) => setFormData({ ...formData, email: String(value) })}
              leftIcon={<Mail className="w-5 h-5 text-foreground/40" />}
              className="h-14 rounded-2xl"
            />
          </div>

          {/* Phone Number */}
          <div className='pb-4'>
            <Input
              label="Phone Number"
              placeholder="Enter your business phone number"
              value={formData.phoneNumber}
              onChange={(value) => setFormData({ ...formData, phoneNumber: String(value) })}
              defaultCountry="KE"
              autoDetect={false}
              className="h-14 rounded-2xl"
              type='tel'
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
