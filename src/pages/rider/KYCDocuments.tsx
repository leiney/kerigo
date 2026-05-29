import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Badge, Button } from '@stackloop/ui';
import { 
  Shield, 
  FileText, 
  ArrowRight, 
  ChevronLeft,
  CheckCircle2,
  X,
  Camera,
  File,
  Circle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { StepDots } from '../../components/shared/StepDots';
import { useRiderOnboardingStore } from '../../store/riderOnboardingStore';
import { generateDocumentSerial } from '../../lib/riderOnboarding';

interface UploadedFileItem {
  id: string;
  file: File;
  name: string;
  size: number;
}

const AttachButton: React.FC<{
  onUpload: (files: File[]) => void;
  accept: string;
  multiple?: boolean;
}> = ({ onUpload, accept, multiple = false }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => fileInputRef.current?.click();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (files.length > 0) {
      onUpload(files);
      e.target.value = '';
    }
  };

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        multiple={multiple}
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
  const setIndividualDocuments = useRiderOnboardingStore((state) => state.setIndividualDocuments);
  const setIndividualDocumentFiles = useRiderOnboardingStore((state) => state.setIndividualDocumentFiles);
  const [hasAttemptedContinue, setHasAttemptedContinue] = useState(false);

  interface DocumentItem {
    id: string;
    label: string;
    description: string;
    icon: React.ReactNode;
    files: UploadedFileItem[];
    acceptedFormats: string;
    allowMultiple: boolean;
  }

  const [documents, setDocuments] = useState<DocumentItem[]>([
    {
      id: 'national-id',
      label: 'National ID / Passport',
      description: 'Front and back',
      icon: <FileText className="w-5 h-5 text-primary" />,
      files: [],
      acceptedFormats: 'image/*,.pdf',
      allowMultiple: true
    },
    {
      id: 'passport-photo',
      label: 'Passport Photo',
      description: 'Portrait photo for verification',
      icon: <Camera className="w-5 h-5 text-primary" />,
      files: [],
      acceptedFormats: 'image/*'
      ,
      allowMultiple: false
    },
    {
      id: 'driving-license',
      label: 'Driving License',
      description: 'Front and back',
      icon: <FileText className="w-5 h-5 text-primary" />,
      files: [],
      acceptedFormats: 'image/*,.pdf',
      allowMultiple: true
    }
  ]);

  useEffect(() => {
    setIndividualDocuments(
      documents.flatMap((doc) =>
        doc.files.map((item, index) => ({
          documentType: doc.label,
          serialNumber: item.name || generateDocumentSerial(doc.label, index),
        }))
      )
    );

    setIndividualDocumentFiles(
      documents.reduce<Record<string, File[]>>((accumulator, doc) => {
        if (doc.files.length > 0) {
          accumulator[doc.id] = doc.files.map((item) => item.file);
        }

        return accumulator;
      }, {})
    );
  }, [documents, setIndividualDocuments, setIndividualDocumentFiles]);

  const handleFileUpload = (id: string, incomingFiles: File[]) => {
    const filesToAdd = incomingFiles.filter(file => file.size <= 5 * 1024 * 1024);

    if (filesToAdd.length === 0) {
      alert('File size must be less than 5MB');
      return;
    }

    setDocuments(prev => prev.map(doc => {
      if (doc.id !== id) {
        return doc;
      }

      const existingNames = new Set(doc.files.map(item => item.name));
      const nextFiles = [...doc.files];

      filesToAdd.forEach(file => {
        const duplicate = existingNames.has(file.name);
        if (!duplicate) {
          nextFiles.push({
            id: `${id}-${file.name}-${file.size}-${Date.now()}`,
            file,
            name: file.name,
            size: file.size
          });
          existingNames.add(file.name);
        }
      });

      return { ...doc, files: nextFiles };
    }));
  };

  const handleRemoveFile = (documentId: string, fileId: string) => {
    setDocuments(prev => prev.map(doc => {
      if (doc.id !== documentId) {
        return doc;
      }

      return {
        ...doc,
        files: doc.files.filter(item => item.id !== fileId)
      };
    }));
  };

  const allRequiredUploaded = documents.every(doc => {
    //if (doc.id === 'passport-photo') {
    //  return doc.files.length === 1;
    //}

    return doc.files.length >= 1;
  });

  const handleContinue = () => {
    if (!allRequiredUploaded) {
      setHasAttemptedContinue(true);
      return;
    }

    navigate('/individual/vehicle-information');
  };

  return (
    <div className="min-h-screen bg-white text-foreground font-sans antialiased flex flex-col relative overflow-hidden">
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

      <div className="flex-1 px-6 pt-6 flex flex-col items-center">
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
              <Badge className="bg-primary text-white">3</Badge>
            </span>
            KYC Documents
          </h1>
          <p className="text-sm text-foreground/60 leading-relaxed max-w-70 mx-auto">
            Verify your identity to continue.
          </p>
        </motion.div>

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
                  <div className="mt-0.5">{doc.icon}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-sm text-foreground">{doc.label}</h3>
                      {doc.id === 'passport-photo' ? (
                        doc.files.length > 0 ? (
                          <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                        ) : (
                          <Circle className="w-4 h-4 text-gray-300 shrink-0" />
                        )
                      ) : doc.files.length >= 2 ? (
                        <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                      ) : (
                        <Circle className="w-4 h-4 text-gray-300 shrink-0" />
                      )}
                    </div>

                    <p className="text-xs text-foreground/50 mb-1">{doc.description}</p>

                    {doc.files.length > 0 ? (
                      <div className="mt-2 space-y-2">
                        {doc.files.map(item => (
                          <div key={item.id} className="flex items-center gap-2">
                            <div className="flex items-center gap-1.5 bg-primary/5 rounded-lg px-2 py-1.5 min-w-0">
                              <File className="w-3.5 h-3.5 text-primary shrink-0" />
                              <span className="text-xs text-foreground font-medium truncate max-w-37.5">{item.name}</span>
                            </div>
                            <button type="button" onClick={() => handleRemoveFile(doc.id, item.id)} className="p-1 hover:bg-secondary rounded transition-colors shrink-0">
                              <X className="w-3.5 h-3.5 text-foreground/40" />
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-foreground/40">No file attached</p>
                    )}

                    {hasAttemptedContinue && !doc.files.length ? (
                      <p className="mt-2 text-xs text-error">Upload this document to continue.</p>
                    ) : null}
                  </div>
                </div>

                <AttachButton
                  onUpload={(files) => handleFileUpload(doc.id, files)}
                  accept={doc.acceptedFormats}
                  multiple={doc.allowMultiple}
                />
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="mt-6 text-center">
          <p className="text-xs text-foreground/50 mb-1">Accepted formats: JPG, PNG or PDF</p>
          <p className="text-xs text-foreground/50">Max file size: 5MB per file</p>
        </motion.div>
      </div>

      <div className="p-6 pb-8 bg-white">
        <Button onClick={handleContinue} type="button" className={`w-full h-14 rounded-2xl text-lg font-bold flex items-center justify-center gap-2 shadow-lg ${allRequiredUploaded ? 'shadow-primary/20' : ''}`}>
          Continue
          <ArrowRight className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
};