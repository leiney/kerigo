import React, { useEffect, useState, useRef } from 'react';
import { FileText, Camera, CheckCircle2, Circle, File, X } from 'lucide-react';
import { OnboardingLayout } from '../../../components/onboarding/OnboardingLayout';
import { useRiderOnboardingStore } from '../../../store/riderOnboardingStore';
import { readOnboardingAttachmentSnapshot, writeOnboardingAttachmentSnapshot } from '../../../lib/onboardingAttachmentStorage';
import { useErrorStore } from '../../../store/errorStore';

type CompanyKYCDocumentsStepProps = {
  onNext: () => void;
  onBack: () => void;
};

interface UploadedFileItem {
  id: string;
  file: File;
  name: string;
  size: number;
}

type CompanyKycSnapshot = Record<string, UploadedFileItem[]>;

interface DocumentItem {
  id: string;
  label: string;
  description: string;
  icon: React.ReactNode;
  files: UploadedFileItem[];
  acceptedFormats: string;
  required: boolean;
}

const COMPANY_KYC_STORAGE_KEY = 'rider-company-kyc-documents';

const createUuid = () => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
};

const createInitialDocuments = (): DocumentItem[] => ([
  {
    id: 'business-cert',
    label: 'Business Registration Certificate',
    description: 'Certificate of incorporation or registration',
    icon: <FileText className="w-5 h-5 text-primary" />,
    files: [],
    acceptedFormats: 'image/*,.pdf',
    required: true,
  },
  {
    id: 'kra-pin',
    label: 'KRA PIN',
    description: 'Tax registration certificate',
    icon: <FileText className="w-5 h-5 text-primary" />,
    files: [],
    acceptedFormats: 'image/*,.pdf',
    required: true,
  },
  {
    id: 'director-id',
    label: 'Company Director ID',
    description: 'National ID of authorised director',
    icon: <Camera className="w-5 h-5 text-primary" />,
    files: [],
    acceptedFormats: 'image/*,.pdf',
    required: false,
  },
]);

const AttachButton: React.FC<{
  onUpload: (files: File[]) => void;
  accept: string;
}> = ({ onUpload, accept }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    if (files.length > 0) {
      onUpload(files);
      event.target.value = '';
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
        className="px-4 py-2 bg-primary/10 text-primary text-sm font-bold rounded-lg hover:bg-primary/20 transition-colors shrink-0"
      >
        Attach
      </button>
    </>
  );
};

export const CompanyKYCDocumentsStep: React.FC<CompanyKYCDocumentsStepProps> = ({ onNext, onBack }) => {
  const setCompanyDocuments = useRiderOnboardingStore((state) => state.setCompanyDocuments);
  const setCompanyDocumentFiles = useRiderOnboardingStore((state) => state.setCompanyDocumentFiles);
  const [documents, setDocuments] = useState<DocumentItem[]>(createInitialDocuments());
  const [hasAttemptedContinue, setHasAttemptedContinue] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const hydrate = async () => {
      const snapshot = await readOnboardingAttachmentSnapshot<CompanyKycSnapshot>(COMPANY_KYC_STORAGE_KEY);
      if (!cancelled && snapshot) {
        setDocuments((current) => current.map((doc) => ({ ...doc, files: snapshot[doc.id] ?? [] })));
      }
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

    setCompanyDocuments(
      documents
        .filter((doc) => doc.files.length > 0)
        .map((doc) => ({
          documentType: doc.label,
          serialNumber: doc.id,
          files: [],
        }))
    );

    setCompanyDocumentFiles(
      documents.reduce<Record<string, File[]>>((accumulator, doc) => {
        if (doc.files.length > 0) {
          accumulator[doc.id] = doc.files.map((item) => item.file);
        }
        return accumulator;
      }, {})
    );

    void writeOnboardingAttachmentSnapshot<CompanyKycSnapshot>(
      COMPANY_KYC_STORAGE_KEY,
      documents.reduce<CompanyKycSnapshot>((accumulator, doc) => {
        accumulator[doc.id] = doc.files;
        return accumulator;
      }, {})
    );
  }, [documents, isHydrated, setCompanyDocuments, setCompanyDocumentFiles]);

  const handleFileUpload = (id: string, incomingFiles: File[]) => {
    const filesToAdd = incomingFiles.filter((file) => file.size <= 5 * 1024 * 1024);

    if (filesToAdd.length === 0) {
      useErrorStore.getState().showError('File size must be less than 5MB', 'Upload Error');
      return;
    }

    setDocuments((prev) =>
      prev.map((doc) => {
        if (doc.id !== id) return doc;

        const nextFiles = [...doc.files];
        filesToAdd.forEach((file) => {
          nextFiles.push({
            id: createUuid(),
            file,
            name: file.name,
            size: file.size,
          });
        });

        return { ...doc, files: nextFiles };
      })
    );
  };

  const handleRemoveFile = (documentId: string, fileId: string) => {
    setDocuments((prev) =>
      prev.map((doc) => {
        if (doc.id !== documentId) return doc;
        return {
          ...doc,
          files: doc.files.filter((item) => item.id !== fileId),
        };
      })
    );
  };

  const allRequiredUploaded = documents.every((doc) => !doc.required || doc.files.length >= 1);

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
      title="Company KYC Documents"
      subtitle="Verify your organisation's identity."
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
                      {doc.label} {doc.required && <span className="text-error font-normal">*</span>}
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

                  {hasAttemptedContinue && doc.required && doc.files.length === 0 ? (
                    <p className="mt-2 text-xs text-error">Upload this document to continue.</p>
                  ) : null}
                </div>
              </div>

              <AttachButton
                onUpload={(files) => handleFileUpload(doc.id, files)}
                accept={doc.acceptedFormats}
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
