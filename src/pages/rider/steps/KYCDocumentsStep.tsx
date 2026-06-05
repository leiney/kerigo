import React, { useEffect, useState, useRef } from 'react';
import { FileText, Camera, CheckCircle2, Circle, File, X } from 'lucide-react';
import { OnboardingLayout } from '../../../components/onboarding/OnboardingLayout';
import { useRiderOnboardingStore } from '../../../store/riderOnboardingStore';
import { readOnboardingAttachmentSnapshot, writeOnboardingAttachmentSnapshot } from '../../../lib/onboardingAttachmentStorage';

type KYCDocumentsStepProps = {
  onNext: () => void;
  onBack: () => void;
};

interface UploadedFileItem {
  id: string;
  file: File;
  name: string;
  size: number;
}

type KycAttachmentSnapshot = Record<string, UploadedFileItem[]>;

interface DocumentItem {
  id: string;
  label: string;
  description: string;
  icon: React.ReactNode;
  files: UploadedFileItem[];
  acceptedFormats: string;
  maxFiles: number;
}

const KYC_ATTACHMENT_STORAGE_KEY = 'rider-individual-kyc-documents';

const createInitialDocuments = (): DocumentItem[] => ([
  {
    id: 'national-id',
    label: 'National ID / Passport',
    description: 'Front and back',
    icon: <FileText className="w-5 h-5 text-primary" />,
    files: [],
    acceptedFormats: 'image/*,.pdf',
    maxFiles: 2
  },
  {
    id: 'passport-photo',
    label: 'Passport Photo',
    description: 'Portrait photo for verification',
    icon: <Camera className="w-5 h-5 text-primary" />,
    files: [],
    acceptedFormats: 'image/*',
    maxFiles: 1
  },
  {
    id: 'driving-license',
    label: 'Driving License',
    description: 'Front and back',
    icon: <FileText className="w-5 h-5 text-primary" />,
    files: [],
    acceptedFormats: 'image/*,.pdf',
    maxFiles: 2
  }
]);

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
        className="px-4 py-2 bg-primary/10 text-primary text-sm font-bold rounded-lg hover:bg-primary/20 transition-colors shrink-0"
      >
        Attach
      </button>
    </>
  );
};

export const KYCDocumentsStep: React.FC<KYCDocumentsStepProps> = ({ onNext, onBack }) => {
  const setIndividualDocuments = useRiderOnboardingStore((state) => state.setIndividualDocuments);
  const setIndividualDocumentFiles = useRiderOnboardingStore((state) => state.setIndividualDocumentFiles);
  const [hasAttemptedContinue, setHasAttemptedContinue] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const [documents, setDocuments] = useState<DocumentItem[]>(createInitialDocuments());

  useEffect(() => {
    let cancelled = false;

    const hydrate = async () => {
      const snapshot = await readOnboardingAttachmentSnapshot<KycAttachmentSnapshot>(KYC_ATTACHMENT_STORAGE_KEY);
      if (cancelled || !snapshot) {
        setIsHydrated(true);
        return;
      }

      setDocuments((current) => current.map((doc) => ({ ...doc, files: snapshot[doc.id] ?? [] })));
      setIsHydrated(true);
    };

    hydrate();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    setIndividualDocuments(
      documents.flatMap((doc) =>
        doc.files.map((item) => ({
          documentType: doc.label,
          serialNumber: doc.id,
          files: [item.file],
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

    void writeOnboardingAttachmentSnapshot<KycAttachmentSnapshot>(
      KYC_ATTACHMENT_STORAGE_KEY,
      documents.reduce<KycAttachmentSnapshot>((accumulator, doc) => {
        accumulator[doc.id] = doc.files;
        return accumulator;
      }, {})
    );
  }, [documents, isHydrated, setIndividualDocuments, setIndividualDocumentFiles]);

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
        if (!duplicate && nextFiles.length < doc.maxFiles) {
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

  const allRequiredUploaded = documents.every(doc => doc.files.length >= 1);

  const handleContinue = () => {
    if (!allRequiredUploaded) {
      setHasAttemptedContinue(true);
      return;
    }
    onNext();
  };

  return (
    <OnboardingLayout
      currentStep={3}
      stepNumber={3}
      title="KYC Documents"
      subtitle="Verify your identity or business."
      icon={<FileText className="w-7 h-7 text-primary" />}
      onBack={onBack}
      onContinue={handleContinue}
    >
      <div className="w-full">
        <h2 className="text-sm font-bold text-foreground mb-4">Required Documents</h2>
        
        <div className="space-y-4">
          {documents.map((doc) => (
            <div 
              key={doc.id}
              className="flex items-start justify-between gap-4 py-3 border-b border-border last:border-0"
            >
              <div className="flex items-start gap-3 flex-1 min-w-0">
                <div className="mt-0.5 shrink-0">
                  {doc.icon}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-sm text-foreground truncate">
                      {doc.label}
                    </h3>
                    {doc.files.length > 0 ? (
                      <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                    ) : (
                      <Circle className="w-4 h-4 text-gray-300 shrink-0" />
                    )}
                  </div>
                  
                  <p className="text-xs text-foreground/50 mb-1">
                    {doc.description}
                  </p>

                  <div className="mt-2 space-y-2">
                    {doc.files.length > 0 ? (
                      doc.files.map((item) => (
                        <div key={item.id} className="flex items-center gap-2">
                          <div className="flex items-center gap-1.5 bg-primary/5 rounded-lg px-2 py-1.5 flex-1 min-w-0">
                            <File className="w-3.5 h-3.5 text-primary shrink-0" />
                            <span className="text-xs text-foreground font-medium truncate">
                              {item.name}
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveFile(doc.id, item.id)}
                            className="p-1 hover:bg-secondary rounded transition-colors shrink-0"
                          >
                            <X className="w-3.5 h-3.5 text-foreground/40" />
                          </button>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-foreground/40">No file attached</p>
                    )}
                  </div>

                  {hasAttemptedContinue && doc.files.length === 0 ? (
                    <p className="mt-2 text-xs text-error">Upload this document to continue.</p>
                  ) : null}
                </div>
              </div>

              <AttachButton
                onUpload={(files) => handleFileUpload(doc.id, files)}
                accept={doc.acceptedFormats}
                multiple={doc.maxFiles > 1}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 text-center shrink-0">
        <p className="text-xs text-foreground/50 mb-1">
          Accepted formats: JPG, PNG or PDF
        </p>
        <p className="text-xs text-foreground/50">
          Max file size: 5MB per file
        </p>
      </div>
    </OnboardingLayout>
  );
};
