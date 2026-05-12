import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, RadioPills } from '@stackloop/ui';
import { 
  Store, 
  Building2, 
  ArrowRight, 
  ChevronLeft
} from 'lucide-react';
import { motion } from 'motion/react';
import { StepDots } from '../../components/shared/StepDots';

export const AddYourStores: React.FC = () => {
  const navigate = useNavigate();
  const [storeSetup, setStoreSetup] = useState<'one' | 'multiple'>('one');

  const handleContinue = () => {
    if (storeSetup === 'one') {
      navigate('/vendor/store-details');
    } else {
      navigate('/vendor/manage-multiple-stores');
    }
  };

  const options = [
    { 
      value: 'one', 
      label: 'One Store',
      icon: <Store className="w-6 h-6" />,
      description: 'I have one store'
    },
    { 
      value: 'multiple', 
      label: 'Multiple Stores',
      icon: <Building2 className="w-6 h-6" />,
      description: 'I have more than one store'
    }
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

        <StepDots currentStep={4} />

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
            <span className="text-primary mr-1">4</span>
            Add Your Stores
          </h1>
          <p className="text-sm text-foreground/60 leading-relaxed max-w-70 mx-auto">
            Add details for all your stores.
          </p>
        </motion.div>

        {/* Store Setup Options */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="w-full max-w-md space-y-4"
        >
          {/* One Store Option */}
          <div
            onClick={() => setStoreSetup('one')}
            className={`
              relative p-5 rounded-2xl border-2 cursor-pointer transition-all duration-200
              ${storeSetup === 'one' 
                ? 'border-primary bg-primary/5 shadow-sm' 
                : 'border-border hover:border-border-dark bg-white'}
            `}
          >
            <div className="flex items-center gap-4">
              <div className={`
                w-14 h-14 rounded-2xl flex items-center justify-center shrink-0
                ${storeSetup === 'one' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-500'}
              `}>
                <Store className="w-7 h-7" />
              </div>
              
              <div className="flex-1">
                <h3 className={`font-bold text-base mb-1 ${storeSetup === 'one' ? 'text-foreground' : 'text-foreground/70'}`}>
                  One Store
                </h3>
                <p className="text-xs text-foreground/50">
                  I have one store
                </p>
              </div>

              <div className="shrink-0">
                <div className={`
                  w-6 h-6 rounded-full border-2 flex items-center justify-center
                  ${storeSetup === 'one' ? 'border-primary bg-primary' : 'border-gray-300'}
                `}>
                  {storeSetup === 'one' && (
                    <div className="w-2.5 h-2.5 bg-white rounded-full" />
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Multiple Stores Option */}
          <div
            onClick={() => setStoreSetup('multiple')}
            className={`
              relative p-5 rounded-2xl border-2 cursor-pointer transition-all duration-200
              ${storeSetup === 'multiple' 
                ? 'border-primary bg-primary/5 shadow-sm' 
                : 'border-border hover:border-border-dark bg-white'}
            `}
          >
            <div className="flex items-center gap-4">
              <div className={`
                w-14 h-14 rounded-2xl flex items-center justify-center shrink-0
                ${storeSetup === 'multiple' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-500'}
              `}>
                <Building2 className="w-7 h-7" />
              </div>
              
              <div className="flex-1">
                <h3 className={`font-bold text-base mb-1 ${storeSetup === 'multiple' ? 'text-foreground' : 'text-foreground/70'}`}>
                  Multiple Stores
                </h3>
                <p className="text-xs text-foreground/50">
                  I have more than one store
                </p>
              </div>

              <div className="shrink-0">
                <div className={`
                  w-6 h-6 rounded-full border-2 flex items-center justify-center
                  ${storeSetup === 'multiple' ? 'border-primary bg-primary' : 'border-gray-300'}
                `}>
                  {storeSetup === 'multiple' && (
                    <div className="w-2.5 h-2.5 bg-white rounded-full" />
                  )}
                </div>
              </div>
            </div>
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