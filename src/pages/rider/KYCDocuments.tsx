import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@stackloop/ui';
import { 
  Shield, 
  Upload, 
  FileText, 
  ArrowRight, 
  ChevronLeft,
  CheckCircle2,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { StepDots } from '../../components/shared/StepDots';

interface DocumentFile {
  id: string;
  file: File;
  name: string;
  type: string;
  size: number;
}

interface FileUploadAreaProps {
  title: string;
  required: boolean;
  description?: string;
  acceptedFormats: string;
  maxSize: string;
  onFileUpload: (file: File) => void;
  uploadedFile?: DocumentFile | null;
  onRemove?: () => void;
}

const FileUploadArea: React.FC<FileUploadAreaProps> = ({
  title,
  required,
  description,
  acceptedFormats,
  maxSize,
  onFileUpload,
  uploadedFile,
  onRemove
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onFileUpload(file);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-1.5">
        <h3 className="text-sm font-semibold text-foreground">
          {title}
        </h3>
        {required && (
          <span className="text-xs text-primary font-medium">
            (Required)
          </span>
        )}
      </div>
      
      {description && (
        <p className="text-xs text-foreground/60">
          {description}
        </p>
      )}

      <div className="mt-2">
        {!uploadedFile ? (
          <motion.div
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={handleClick}
            className="border-2 border-dashed border-border rounded-2xl p-6 cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-all duration-200"
          >
            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileChange}
              accept={acceptedFormats}
              className="hidden"
            />
            
            <div className="flex flex-col items-center justify-center text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-3">
                <Upload className="w-5 h-5 text-primary" />
              </div>
              
              <p className="text-sm font-medium text-foreground mb-1">
                Click to upload
              </p>
              <p className="text-xs text-foreground/50">
                {acceptedFormats}
              </p>
              <p className="text-xs text-foreground/50 mt-0.5">
                (max {maxSize})
              </p>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="border-2 border-primary/30 bg-primary/5 rounded-2xl p-4 flex items-center gap-3"
          >
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
              <FileText className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">
                {uploadedFile.name}
              </p>
              <p className="text-xs text-foreground/50">
                {formatFileSize(uploadedFile.size)}
              </p>
            </div>
            <button
              onClick={onRemove}
              className="p-2 hover:bg-error/10 rounded-lg transition-colors"
            >
              <X className="w-4 h-4 text-error" />
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export const KYCDocuments: React.FC = () => {
  const navigate = useNavigate();
  const [nationalId, setNationalId] = useState<DocumentFile | null>(null);
  const [drivingLicense, setDrivingLicense] = useState<DocumentFile | null>(null);

  const handleContinue = () => {
    if (!nationalId || !drivingLicense) {
      return;
    }
    navigate('/individual/create-password');
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
            <Shield className="w-7 h-7 text-primary" />
          </div>
          
          <h1 className="text-lg font-bold text-foreground mb-2">
            <span className="text-primary mr-1">5</span>
            KYC Documents
          </h1>
          <p className="text-sm text-foreground/60 leading-relaxed max-w-70 mx-auto">
            Upload required documents to verify your identity.
          </p>
        </motion.div>

        {/* Form Fields */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="w-full max-w-md space-y-6"
        >
          
          {/* National ID */}
          <FileUploadArea
            title="National ID"
            required={true}
            description="Front and back"
            acceptedFormats="PNG, JPG or PDF"
            maxSize="5MB"
            onFileUpload={(file) => setNationalId({
              id: 'national-id',
              file,
              name: file.name,
              type: file.type,
              size: file.size
            })}
            uploadedFile={nationalId}
            onRemove={() => setNationalId(null)}
          />

          {/* Driving License */}
          <FileUploadArea
            title="Driving License"
            required={true}
            description="Front and back"
            acceptedFormats="PNG, JPG or PDF"
            maxSize="5MB"
            onFileUpload={(file) => setDrivingLicense({
              id: 'driving-license',
              file,
              name: file.name,
              type: file.type,
              size: file.size
            })}
            uploadedFile={drivingLicense}
            onRemove={() => setDrivingLicense(null)}
          />

          {/* Security Note */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-primary/5 border border-primary/20 rounded-xl p-3 flex items-start gap-3 mt-4"
          >
            <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
            <p className="text-xs text-foreground/70 leading-tight">
              Your documents are secure and will only be used for verification.
            </p>
          </motion.div>

        </motion.div>

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