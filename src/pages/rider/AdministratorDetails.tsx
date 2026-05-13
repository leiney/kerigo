import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Input, Select } from '@stackloop/ui';
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
  CheckCircle2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { StepDots } from '../../components/shared/StepDots';

interface Rider {
  id: string;
  name: string;
  phone: string;
}

interface KYCDocument {
  id: string;
  label: string;
  required: boolean;
  description: string;
  file: File | null;
  fileName: string;
}

export const AdministratorDetails: React.FC = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    email: '',
    ridingExperience: ''
  });

  const [kycDocuments, setKycDocuments] = useState<KYCDocument[]>([
    {
      id: 'national-id',
      label: 'National ID / Passport',
      required: true,
      description: 'Front and back',
      file: null,
      fileName: ''
    },
    {
      id: 'driving-license',
      label: 'Driving License',
      required: true,
      description: 'Front and back',
      file: null,
      fileName: ''
    },
    {
      id: 'passport-photo',
      label: 'Passport Photo',
      required: true,
      description: 'Clear photo of face',
      file: null,
      fileName: ''
    }
  ]);

  const [addedRiders, setAddedRiders] = useState<Rider[]>([
    { id: '1', name: 'John Doe', phone: '+254 712 345 678' },
    { id: '2', name: 'Michael Kimani', phone: '+254 723 456 789' }
  ]);

  const handleFileUpload = (docId: string, file: File) => {
    setKycDocuments(docs => 
      docs.map(doc => 
        doc.id === docId 
          ? { ...doc, file, fileName: file.name }
          : doc
      )
    );
  };

  const handleRemoveFile = (docId: string) => {
    setKycDocuments(docs => 
      docs.map(doc => 
        doc.id === docId 
          ? { ...doc, file: null, fileName: '' }
          : doc
      )
    );
  };

  const handleAddAnotherRider = () => {
    // Logic to navigate to add rider form
    console.log('Add another rider');
  };

  const handleEditRider = (riderId: string) => {
    console.log('Edit rider:', riderId);
  };

  const handleDeleteRider = (riderId: string) => {
    setAddedRiders(riders => riders.filter(r => r.id !== riderId));
  };

  const handleContinue = () => {
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

        <StepDots currentStep={2} />

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
            <span className="text-primary mr-1">2A</span>
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
              className="h-14 rounded-2xl"
            />
          </div>

          {/* Phone Number */}
          <div className='pb-4'>
            <Input
              label="Phone Number"
              type="phone"
              placeholder="Enter phone number"
              value={formData.phoneNumber}
              onChange={(value) => setFormData({ ...formData, phoneNumber: String(value) })}
              defaultCountry="KE"
              className="h-14 rounded-2xl"
            />
          </div>

          {/* Email Address (Optional) */}
          <div>
            <Input
              label="Email Address (Optional)"
              type="email"
              placeholder="Enter email address"
              value={formData.email}
              onChange={(value) => setFormData({ ...formData, email: String(value) })}
              className="h-14 rounded-2xl"
            />
          </div>

          {/* Riding Experience (Optional) */}
          <div className='pb-4'>
            <Select
              label="Riding Experience (Optional)"
              placeholder="Select experience"
              options={[
                { value: 'less-than-1-year', label: 'Less than 1 year' },
                { value: '1-3-years', label: '1-3 years' },
                { value: '3-5-years', label: '3-5 years' },
                { value: '5-plus-years', label: '5+ years' }
              ]}
              value={formData.ridingExperience}
              onChange={(value) => setFormData({ ...formData, ridingExperience: String(value) })}
              className="rounded-2xl h-14"
            />
          </div>

          {/* KYC Documents Section */}
          <div className="space-y-3 pt-2">
            <h3 className="text-sm font-semibold text-foreground">
              KYC Documents <span className="text-xs text-primary font-normal">(Required)</span>
            </h3>

            {kycDocuments.map((doc) => (
              <div key={doc.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-foreground">{doc.label}</p>
                    <p className="text-[10px] text-foreground/50">{doc.description}</p>
                  </div>
                  <button
                    onClick={() => {
                      const input = document.createElement('input');
                      input.type = 'file';
                      input.accept = '.png,.jpg,.jpeg,.pdf';
                      input.onchange = (e: any) => {
                        const file = e.target.files?.[0];
                        if (file) handleFileUpload(doc.id, file);
                      };
                      input.click();
                    }}
                    className="px-3 py-1.5 bg-primary/10 text-primary text-xs font-medium rounded-lg hover:bg-primary/20 transition-colors"
                  >
                    Attach
                  </button>
                </div>
                
                <AnimatePresence>
                  {doc.fileName && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="flex items-center gap-2 bg-primary/5 border border-primary/20 rounded-xl p-3"
                    >
                      <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                      <span className="text-xs text-foreground/80 truncate flex-1">
                        {doc.fileName}
                      </span>
                      <button
                        onClick={() => handleRemoveFile(doc.id)}
                        className="p-1 hover:bg-error/10 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5 text-error" />
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>

          {/* Add Another Rider Button */}
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={handleAddAnotherRider}
            className="w-full py-3 border-2 border-dashed border-primary/30 rounded-2xl flex items-center justify-center gap-2 text-primary font-medium text-sm hover:bg-primary/5 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Another Rider
          </motion.button>

          {/* Added Riders Section */}
          {addedRiders.length > 0 && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-3 pt-2"
            >
              <p className="text-xs font-medium text-foreground/60">
                Added Riders ({addedRiders.length})
              </p>
              
              <div className="space-y-2">
                {addedRiders.map((rider, index) => (
                  <div key={rider.id} className="flex items-center gap-3 bg-secondary rounded-xl p-3">
                    <span className="text-xs text-foreground/50 w-4">{index + 1}.</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{rider.name}</p>
                      <p className="text-xs text-foreground/50">{rider.phone}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleEditRider(rider.id)}
                        className="p-2 hover:bg-primary/10 rounded-lg transition-colors"
                      >
                        <Pencil className="w-4 h-4 text-foreground/60" />
                      </button>
                      <button
                        onClick={() => handleDeleteRider(rider.id)}
                        className="p-2 hover:bg-error/10 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4 text-error" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

        </motion.div>

      </div>

      {/* Footer / Action Button */}
      <div className="p-6 pb-8 bg-white border-t border-border/50">
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