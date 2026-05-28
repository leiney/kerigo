import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Badge, Button, Input, Select } from '@stackloop/ui';
import { 
  Landmark, 
  Lock, 
  User, 
  ArrowRight, 
  ChevronLeft,
  CheckCircle2
} from 'lucide-react';
import { motion } from 'motion/react';
import { StepDots } from '../../components/shared/StepDots';
import { useVendorOnboardingStore } from '../../store/vendorOnboardingStore';

export const BankDetails: React.FC = () => {
  const navigate = useNavigate();
  const draft = useVendorOnboardingStore((state) => state.draft);
  const setBankDetails = useVendorOnboardingStore((state) => state.setBankDetails);
  const [formData, setFormData] = useState({
    bank: '',
    accountNumber: '',
    branchCode: '',
    accountName: draft.fullName,
    swiftCode: '',
  });

  useEffect(() => {
    setBankDetails({
      bank: formData.bank,
      branch: formData.branchCode,
      accountNumber: formData.accountNumber,
      swiftCode: formData.swiftCode,
      accountName: formData.accountName,
    });
  }, [formData, setBankDetails]);

  const bankOptions = [
    { value: 'equity', label: 'Equity Bank' },
    { value: 'kcb', label: 'KCB Bank' },
    { value: 'ncba', label: 'NCBA Bank' },
    { value: 'coop', label: 'Co-operative Bank' },
    { value: 'absa', label: 'Absa Bank' },
    { value: 'other', label: 'Other' }
  ];

  const handleContinue = () => {
    navigate('/vendor/create-password');
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

        <StepDots currentStep={8} />

        <div className="w-8" />
      </div>

      <div className="flex-1 px-6 pt-6 flex flex-col items-center">
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Landmark className="w-7 h-7 text-primary" />
          </div>
          
          <h1 className="text-lg font-bold text-foreground mb-2">
            <span className="text-primary mr-1">
              <Badge className="bg-primary text-white">7</Badge>
            </span>
            Bank Details
          </h1>
          <p className="text-sm text-foreground/60 leading-relaxed max-w-70 mx-auto">
            Select or add your bank account.
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="w-full max-w-md space-y-4"
        >
          
          <div className='pb-4'>

            <Select
              label="Select your bank"
              placeholder="Choose your bank"
              options={bankOptions}
              value={formData.bank}
              onChange={(value) => setFormData({ ...formData, bank: String(value) })}
              className="rounded-2xl h-14"
            />
          </div>


          <Input
            label="Branch Code (Optional)"
            placeholder="Enter branch code"
            value={formData.branchCode}
            onChange={(value) => setFormData({ ...formData, branchCode: String(value) })}
            leftIcon={<Lock className="w-5 h-5 text-foreground/40" />}
            className="rounded-2xl h-14"
          />

          <Input
            label="SWIFT Code (Optional)"
            placeholder="Enter SWIFT code"
            value={formData.swiftCode}
            onChange={(value) => setFormData({ ...formData, swiftCode: String(value) })}
            leftIcon={<Lock className="w-5 h-5 text-foreground/40" />}
            className="rounded-2xl h-14"
          />

          {/* Account Number */}
          <Input
            label="Account Number"
            placeholder="Enter account number"
            value={formData.accountNumber}
            onChange={(value) => setFormData({ ...formData, accountNumber: String(value) })}
            leftIcon={<Lock className="w-5 h-5 text-foreground/40" />}
            className="rounded-2xl h-14"
          />

          {/* Account Name */}
          <Input
            label="Account Name"
            placeholder="Enter account name"
            value={formData.accountName}
            onChange={(value) => setFormData({ ...formData, accountName: String(value) })}
            leftIcon={<User className="w-5 h-5 text-foreground/40" />}
            className="rounded-2xl h-14"
          />

          <div className="bg-primary/5 border border-primary/20 rounded-xl p-3 flex items-start gap-3 mt-2">
            <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
            <p className="text-xs text-foreground/70 leading-tight">
              Ensure your account name matches your business or personal name.
            </p>
          </div>

        </motion.div>

      </div>

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