import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@stackloop/ui';
import { 
  FileText, 
  Camera, 
  MapPin, 
  CheckCircle2, 
  Circle,
  ArrowRight, 
  ChevronLeft,
  File,
  X
} from 'lucide-react';
import { motion } from 'motion/react';
import { StepDots } from '@/src/components/shared/StepDots';

interface DocumentItem {
  id: string;
  label: string;
  description: string;
  icon: React.ReactNode;
  file: File | null;
  acceptedFormats: string;
}

// Custom File Upload Button
const AttachButton: React.FC<{
  onUpload: (file: File) => void;
  accept: string;
}> = ({ onUpload, accept }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onUpload(file);
      e.target.value = '';
    }
  };

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleChange}
        className="hidden"
      />
      <button
        type="button"
        onClick={handleClick}
        className="px-4 py-2 bg-primary/10 text-primary text-sm font-bold rounded-lg hover:bg-primary/20 transition-colors"
      >
        Attach
      </button>
    </>
  );
};

export const KYCDocuments: React.FC = () => {
  const navigate = useNavigate();
  const [documents, setDocuments] = useState<DocumentItem[]>([
    {
      id: 'national-id',
      label: 'National ID / Passport',
      description: 'Front and back',
      icon: <FileText className="w-5 h-5 text-primary" />,
      file: null,
      acceptedFormats: 'image/*,.pdf'
    },
    {
      id: 'selfie',
      label: 'Selfie',
      description: 'Clear photo of your face',
      icon: <Camera className="w-5 h-5 text-primary" />,
      file: null,
      acceptedFormats: 'image/*'
    },
    {
      id: 'proof-of-address',
      label: 'Proof of Address',
      description: 'Utility bill or bank statement',
      icon: <MapPin className="w-5 h-5 text-primary" />,
      file: null,
      acceptedFormats: 'image/*,.pdf'
    }
  ]);

  const handleFileUpload = (id: string, file: File) => {
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB');
      return;
    }
    
    setDocuments(prev => prev.map(doc => 
      doc.id === id ? { ...doc, file } : doc
    ));
  };

  const handleRemoveFile = (id: string) => {
    setDocuments(prev => prev.map(doc => 
      doc.id === id ? { ...doc, file: null } : doc
    ));
  };

  const allDocumentsUploaded = documents.every(doc => doc.file !== null);

  const handleContinue = () => {
    navigate('/vendor/add-your-stores');
    if (allDocumentsUploaded) {
    }
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
            <FileText className="w-7 h-7 text-primary" />
          </div>
          
          <h1 className="text-lg font-bold text-foreground mb-2">
            <span className="text-primary mr-1">3</span>
            KYC Documents
          </h1>
          <p className="text-sm text-foreground/60 leading-relaxed max-w-[280px] mx-auto">
            Verify your identity or business.
          </p>
        </motion.div>

        {/* Required Documents Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="w-full max-w-md"
        >
          <h2 className="text-sm font-bold text-foreground mb-4">Required Documents</h2>
          
          <div className="space-y-4">
            {documents.map((doc) => (
              <div 
                key={doc.id}
                className="flex items-start justify-between gap-4 py-3 border-b border-border last:border-0"
              >
                <div className="flex items-start gap-3 flex-1">
                  <div className="mt-0.5">
                    {doc.icon}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-sm text-foreground">
                        {doc.label}
                      </h3>
                      {doc.file ? (
                        <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                      ) : (
                        <Circle className="w-4 h-4 text-gray-300 shrink-0" />
                      )}
                    </div>
                    
                    <p className="text-xs text-foreground/50 mb-1">
                      {doc.description}
                    </p>

                    {doc.file ? (
                      <div className="flex items-center gap-2 mt-2">
                        <div className="flex items-center gap-1.5 bg-primary/5 rounded-lg px-2 py-1.5">
                          <File className="w-3.5 h-3.5 text-primary" />
                          <span className="text-xs text-foreground font-medium truncate max-w-[150px]">
                            {doc.file.name}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveFile(doc.id)}
                          className="p-1 hover:bg-secondary rounded transition-colors"
                        >
                          <X className="w-3.5 h-3.5 text-foreground/40" />
                        </button>
                      </div>
                    ) : (
                      <p className="text-xs text-foreground/40">No file attached</p>
                    )}
                  </div>
                </div>

                {!doc.file && (
                  <AttachButton
                    onUpload={(file) => handleFileUpload(doc.id, file)}
                    accept={doc.acceptedFormats}
                  />
                )}
              </div>
            ))}
          </div>
        </motion.div>

        {/* File Requirements */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mt-6 text-center"
        >
          <p className="text-xs text-foreground/50 mb-1">
            Accepted formats: JPG, PNG or PDF
          </p>
          <p className="text-xs text-foreground/50">
            Max file size: 5MB per file
          </p>
        </motion.div>

      </div>

      {/* Footer / Action Button */}
      <div className="p-6 pb-8 bg-white">
        <Button 
          onClick={handleContinue}
          /* disabled={!allDocumentsUploaded} */
          className={`w-full h-14 rounded-2xl text-lg font-bold flex items-center justify-center gap-2 shadow-lg ${
            allDocumentsUploaded 
              ? 'shadow-primary/20' 
              : 'opacity-50 cursor-not-allowed shadow-none'
          }`}
        >
          Continue
          <ArrowRight className="w-5 h-5" />
        </Button>
      </div>

    </div>
  );
};