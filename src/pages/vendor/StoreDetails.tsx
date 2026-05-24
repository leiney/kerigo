import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Badge, Button, Input, Select } from '@stackloop/ui';
import { 
  Store, 
  Tags, 
  MapPin, 
  ArrowRight, 
  ChevronLeft,
  ShoppingBag
} from 'lucide-react';
import { motion } from 'motion/react';
import { StepDots } from '../../components/shared/StepDots';

export const StoreDetails: React.FC = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    storeName: '',
    businessType: '',
    storeLocation: '',
    physicalAddress: ''
  });

  const handleContinue = () => {
    // Navigate to next step (Payout Method - Step 7)
    navigate('/vendor/payout-method');
  };

  const businessTypeOptions = [
    { value: 'retail', label: 'Retail Store' },
    { value: 'grocery', label: 'Grocery Store' },
    { value: 'pharmacy', label: 'Pharmacy' },
    { value: 'restaurant', label: 'Restaurant / Cafe' },
    { value: 'service', label: 'Service Provider' },
    { value: 'other', label: 'Other' }
  ];

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

        <StepDots currentStep={5} />

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
            <Store className="w-7 h-7 text-primary" />
          </div>
          
          <h1 className="text-lg font-bold text-foreground mb-2">
            <span className="text-primary mr-1">
              <Badge className="bg-primary text-white">5</Badge>
            </span>
            Store Details
          </h1>
          <p className="text-sm text-foreground/60 leading-relaxed max-w-70 mx-auto">
            Tell us about your store.
          </p>
        </motion.div>

        {/* Form Fields */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="w-full max-w-md space-y-4"
        >
          
          {/* Store Name */}
          <Input
            label="Store Name"
            placeholder="Enter your store name"
            value={formData.storeName}
            onChange={(value) => setFormData({ ...formData, storeName: String(value) })}
            leftIcon={<ShoppingBag className="w-5 h-5 text-foreground/40" />}
            className="rounded-2xl h-14"
          />

          {/* Business Type */}
          <div className='pb-4'>

            <Select
              label="Business Type"
              placeholder="Select business type"
              options={businessTypeOptions}
              value={formData.businessType}
              onChange={(value) => setFormData({ ...formData, businessType: String(value) })}
              className="rounded-2xl h-14"
            />
          </div>

          {/* Store Location */}
          <Input
            label="Store Location"
            placeholder="Enter your store location"
            value={formData.storeLocation}
            onChange={(value) => setFormData({ ...formData, storeLocation: String(value) })}
            leftIcon={<MapPin className="w-5 h-5 text-foreground/40" />}
            className="rounded-2xl h-14"
          />

          {/* Physical Address (Optional) */}
          <div className="relative">
            <Input
              label="Physical Address (Optional)"
              placeholder="Enter physical address"
              value={formData.physicalAddress}
              onChange={(value) => setFormData({ ...formData, physicalAddress: String(value) })}
              leftIcon={<MapPin className="w-5 h-5 text-foreground/40" />}
              className="rounded-2xl h-14"
            />
          </div>

        </motion.div>

      </div>

      {/* Footer / Action Button */}
      <div className="p-6 pb-8 bg-white">
        <Button 
          onClick={handleContinue}
          className="w-full h-14 rounded-2xl text-lg font-bold flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
        >
          Continue
          <ArrowRight className="w-5 h-5" />
        </Button>
      </div>

    </div>
  );
};