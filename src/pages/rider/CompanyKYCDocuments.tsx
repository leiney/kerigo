import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Badge, Button } from '@stackloop/ui';
import {
  Shield,
  FileText,
  Camera,
  ArrowRight,
  ChevronLeft,
  CheckCircle2,
  Circle,
  File,
  X,
} from 'lucide-react';
import { motion } from 'motion/react';
import { StepDots } from '../../components/shared/StepDots';
import { useRiderOnboardingStore } from '../../store/riderOnboardingStore';
import { readOnboardingAttachmentSnapshot, writeOnboardingAttachmentSnapshot } from '../../lib/onboardingAttachmentStorage';

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
};

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
        className="px-4 py-2 bg-primary/10 text-primary text-sm font-bold rounded-lg hover:bg-primary/20 transition-colors"
      >
        Attach
      </button>
    </>
  );
};

export const CompanyKYCDocuments: React.FC = () => {
  const navigate = useNavigate();
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
      documents.flatMap((doc) =>
        doc.files.map((file) => ({
          documentType: doc.label,
          serialNumber: file.id,
          files: [file.file],
        }))
      )
    );

    setCompanyDocumentFiles(
      documents.reduce<Record<string, File[]>>((accumulator, doc) => {
        doc.files.forEach((item) => {
          accumulator[item.id] = [item.file];
        });

        return accumulator;
      }, {})
    );

    void writeOnboardingAttachmentSnapshot<CompanyKycSnapshot>(COMPANY_KYC_STORAGE_KEY, documents.reduce<CompanyKycSnapshot>((accumulator, doc) => {
      accumulator[doc.id] = doc.files;
      return accumulator;
    }, {}));
  }, [documents, isHydrated, setCompanyDocuments, setCompanyDocumentFiles]);

  const handleFileUpload = (documentId: string, incomingFiles: File[]) => {
    const filesToAdd = incomingFiles.filter((file) => file.size <= 5 * 1024 * 1024);

    if (filesToAdd.length === 0) {
      alert('File size must be less than 5MB');
      return;
    }

    setDocuments((prev) => prev.map((doc) => {
      if (doc.id !== documentId) {
        return doc;
      }

      const nextFiles = [...doc.files];
      const existingNames = new Set(nextFiles.map((item) => item.name));

      filesToAdd.forEach((file) => {
        if (nextFiles.length >= 1 || existingNames.has(file.name)) {
          return;
        }

        nextFiles.push({
          id: createUuid(),
          file,
          name: file.name,
          size: file.size,
        });
        existingNames.add(file.name);
      });

      return { ...doc, files: nextFiles };
    }));
  };

  const handleRemoveFile = (documentId: string, fileId: string) => {
    setDocuments((prev) => prev.map((doc) => {
      if (doc.id !== documentId) {
        return doc;
      }

      return {
        ...doc,
        files: doc.files.filter((item) => item.id !== fileId),
      };
    }));
  };

  const allRequiredUploaded = documents.filter((doc) => doc.required).every((doc) => doc.files.length >= 1);

  const handleContinue = () => {
    if (!allRequiredUploaded) {
      setHasAttemptedContinue(true);
      return;
    }
    navigate('/company/administrator-details');
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
            Verify your business documents.
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
                      {doc.required ? <span className="text-xs text-primary font-medium">Required</span> : null}
                      {doc.files.length > 0 ? (
                        <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                      ) : (
                        <Circle className="w-4 h-4 text-gray-300 shrink-0" />
                      )}
                    </div>

                    <p className="text-xs text-foreground/50 mb-1">{doc.description}</p>

                    <div className="mt-2 space-y-2">
                      {doc.files.length > 0 ? (
                        doc.files.map((file) => (
                          <div key={file.id} className="flex items-center gap-2">
                            <div className="flex items-center gap-1.5 bg-primary/5 rounded-lg px-2 py-1.5 flex-1 min-w-0">
                              <File className="w-3.5 h-3.5 text-primary" />
                              <span className="text-xs text-foreground font-medium truncate max-w-37.5">
                                {file.name}
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleRemoveFile(doc.id, file.id)}
                              className="p-1 hover:bg-secondary rounded transition-colors"
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

                <AttachButton onUpload={(files) => handleFileUpload(doc.id, files)} accept={doc.acceptedFormats} />
              </div>
            ))}
          </div>

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