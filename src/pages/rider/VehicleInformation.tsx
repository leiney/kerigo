import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Badge, Button, Input, Select } from '@stackloop/ui';
import { 
  Bike, 
  FileText, 
  Hash, 
  Palette, 
  CalendarDays, 
  ArrowRight, 
  ChevronLeft 
} from 'lucide-react';
import { motion } from 'motion/react';
import { StepDots } from '../../components/shared/StepDots';

// Generate years for the dropdown (e.g., current year down to 2010)
const currentYear = new Date().getFullYear();
const yearOptions = Array.from({ length: currentYear - 2009 }, (_, i) => {
  const year = currentYear - i;
  return { value: String(year), label: String(year) };
});

export const VehicleInformation: React.FC = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    vehicleType: '',
    registrationNumber: '',
    make: '',
    model: '',
    year: '',
    color: ''
  });

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    // Navigate to Payout Details (Step 4)
    navigate('/individual/payout-details');
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

        <StepDots currentStep={3} />

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
            <Bike className="w-7 h-7 text-primary" />
          </div>
          
          <h1 className="text-lg font-bold text-foreground mb-2">
            <span className="text-primary mr-1">
              <Badge className="bg-primary text-white">3</Badge>
            </span>
            Vehicle Information
          </h1>
          <p className="text-sm text-foreground/60 leading-relaxed max-w-70 mx-auto">
            Add details about your motorbike.
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
          
          {/* Vehicle Type */}
          <div className='pb-4'>
            <Select
              label="Vehicle Type"
              placeholder="Select vehicle type"
              options={[
                { value: 'motorbike', label: 'Motorbike' },
                { value: 'tricycle', label: 'Tricycle' },
                { value: 'bicycle', label: 'Bicycle' },
                { value: 'van', label: 'Van' }
              ]}
              value={formData.vehicleType}
              onChange={(value) => setFormData({ ...formData, vehicleType: String(value) })}
              className="rounded-2xl h-14"
            />
          </div>

          {/* Registration Number */}
          <div>
            <Input
              label="Registration Number"
              placeholder="Enter registration number"
              value={formData.registrationNumber}
              onChange={(value) => setFormData({ ...formData, registrationNumber: String(value) })}
              leftIcon={<FileText className="w-5 h-5 text-foreground/40" />}
              className="h-14 rounded-2xl"
            />
          </div>

          {/* Make */}
          <div>
            <Input
              label="Make"
              placeholder="e.g. Honda, TVS"
              value={formData.make}
              onChange={(value) => setFormData({ ...formData, make: String(value) })}
              className="h-14 rounded-2xl"
            />
          </div>

          {/* Model */}
          <div>
            <Input
              label="Model"
              placeholder="e.g. CG 125"
              value={formData.model}
              onChange={(value) => setFormData({ ...formData, model: String(value) })}
              className="h-14 rounded-2xl"
            />
          </div>

          {/* Year */}
          <div className='pb-4'>
            <Select
              label="Year"
              placeholder="Select year"
              options={yearOptions}
              value={formData.year}
              onChange={(value) => setFormData({ ...formData, year: String(value) })}
              className="rounded-2xl h-14"
            />
          </div>

          {/* Color */}
          <div>
            <Input
              label="Color"
              placeholder="e.g. Black"
              value={formData.color}
              onChange={(value) => setFormData({ ...formData, color: String(value) })}
              leftIcon={<Palette className="w-5 h-5 text-foreground/40" />}
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