import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Badge, Button } from '@stackloop/ui';
import { 
  Shield, 
  Upload, 
  FileText, 
  Plus, 
  ArrowRight, 
  ChevronLeft,
  CheckCircle2,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { StepDots } from '../../components/shared/StepDots';
import { useRiderOnboardingStore } from '../../store/riderOnboardingStore';
import { generateDocumentSerial } from '../../lib/riderOnboarding';

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
                Upload {title}
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

export const CompanyKYCDocuments: React.FC = () => {
  const navigate = useNavigate();
  const setCompanyDocuments = useRiderOnboardingStore((state) => state.setCompanyDocuments);
  const [hasAttemptedContinue, setHasAttemptedContinue] = useState(false);
  
  // Company documents
  const [businessCert, setBusinessCert] = useState<DocumentFile | null>(null);
  const [kraPin, setKraPin] = useState<DocumentFile | null>(null);
  const [otherDocuments, setOtherDocuments] = useState<DocumentFile[]>([]);

  useEffect(() => {
    const documents = [businessCert, kraPin, ...otherDocuments]
      .filter((document): document is DocumentFile => Boolean(document && document.name))
      .map((document, index) => ({
        documentType: document.name,
        serialNumber: document.name || generateDocumentSerial(document.name, index),
      }));

    setCompanyDocuments(documents);
  }, [businessCert, kraPin, otherDocuments, setCompanyDocuments]);

  const handleContinue = () => {
    if (!businessCert || !kraPin) {
      setHasAttemptedContinue(true);
      return;
    }
    navigate('/company/create-password');
  };

  const handleAddAnotherDocument = () => {
    const newDoc: DocumentFile = {
      id: Date.now().toString(),
      file: new File([], ''),
      name: '',
      type: '',
      size: 0
    };
    setOtherDocuments([...otherDocuments, newDoc]);
  };

  const handleOtherDocumentUpload = (id: string, file: File) => {
    setOtherDocuments(docs => 
      docs.map(doc => 
        doc.id === id 
          ? { 
              ...doc, 
              file, 
              name: file.name, 
              type: file.type,
              size: file.size 
            }
          : doc
      )
    );
  };

  const handleRemoveOtherDocument = (id: string) => {
    setOtherDocuments(docs => docs.filter(doc => doc.id !== id));
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
            <span className="text-primary mr-1">
              <Badge className="bg-primary text-white">5</Badge>
            </span>
            Company KYC Documents
          </h1>
          <p className="text-sm text-foreground/60 leading-relaxed max-w-70 mx-auto">
            Upload required documents to verify your organisation.
          </p>
        </motion.div>

        {/* Form Fields */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="w-full max-w-md space-y-6"
        >
          
          {/* Business Registration Certificate */}
          <FileUploadArea
            title="Business Registration Certificate"
            required={true}
            acceptedFormats="PNG, JPG or PDF"
            maxSize="5MB"
            onFileUpload={(file) => setBusinessCert({
              id: 'business-cert',
              file,
              name: file.name,
              type: file.type,
              size: file.size
            })}
            uploadedFile={businessCert}
            onRemove={() => setBusinessCert(null)}
          />
          {hasAttemptedContinue && !businessCert ? <p className="text-xs text-error">Upload this document to continue.</p> : null}

          {/* KRA PIN */}
          <FileUploadArea
            title="KRA PIN"
            required={true}
            acceptedFormats="PNG, JPG or PDF"
            maxSize="5MB"
            onFileUpload={(file) => setKraPin({
              id: 'kra-pin',
              file,
              name: file.name,
              type: file.type,
              size: file.size
            })}
            uploadedFile={kraPin}
            onRemove={() => setKraPin(null)}
          />
          {hasAttemptedContinue && !kraPin ? <p className="text-xs text-error">Upload this document to continue.</p> : null}

          {/* Other Documents */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <h3 className="text-sm font-semibold text-foreground">
                  Other Documents
                </h3>
                <span className="text-xs text-foreground/50">
                  (Optional)
                </span>
              </div>
              <button
                onClick={handleAddAnotherDocument}
                type="button"
                disabled={!businessCert || !kraPin}
                className="text-xs text-primary font-medium flex items-center gap-1 hover:opacity-80 transition-opacity"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Another Document
              </button>
            </div>

            <AnimatePresence>
              {otherDocuments.map((doc, index) => (
                <motion.div
                  key={doc.id}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="border-2 border-dashed border-border rounded-2xl p-4"
                >
                  <FileUploadArea
                    title={`Document ${index + 1}`}
                    required={false}
                    acceptedFormats="PNG, JPG or PDF"
                    maxSize="5MB"
                    onFileUpload={(file) => handleOtherDocumentUpload(doc.id, file)}
                    uploadedFile={doc.size > 0 ? doc : null}
                    onRemove={() => handleRemoveOtherDocument(doc.id)}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

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