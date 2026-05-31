import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Badge, Button } from '@stackloop/ui';
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
import { generateDocumentSerial, type VendorDocumentAttachment } from '../../lib/vendorOnboarding';
import { useVendorOnboardingStore } from '../../store/vendorOnboardingStore';
import { readOnboardingAttachmentSnapshot, writeOnboardingAttachmentSnapshot } from '../../lib/onboardingAttachmentStorage';

interface DocumentItem {
  id: string;
  label: string;
  description: string;
  icon: React.ReactNode;
  attachments: VendorDocumentAttachment[];
  acceptedFormats: string;
}

type VendorKycSnapshot = {
  filesBySerial: Record<string, File[]>;
};

const VENDOR_KYC_STORAGE_KEY = 'vendor-kyc-documents';

const createInitialDocuments = (): DocumentItem[] => ([
  {
    id: 'national-id',
    label: 'National ID / Passport',
    description: 'Front and back',
    icon: <FileText className="w-5 h-5 text-primary" />,
    attachments: [],
    acceptedFormats: 'image/*,.pdf'
  },
  {
    id: 'selfie',
    label: 'Selfie',
    description: 'Clear photo of your face',
    icon: <Camera className="w-5 h-5 text-primary" />,
    attachments: [],
    acceptedFormats: 'image/*'
  },
  {
    id: 'proof-of-address',
    label: 'Proof of Address',
    description: 'Utility bill or bank statement',
    icon: <MapPin className="w-5 h-5 text-primary" />,
    attachments: [],
    acceptedFormats: 'image/*,.pdf'
  }
]);

const rebuildDocuments = (
  draftDocuments: Array<{ documentType: string; serialNumber: string }>,
  filesBySerial: Record<string, File[]>
): DocumentItem[] => {
  const documents = createInitialDocuments();

  draftDocuments.forEach((document, index) => {
    const file = filesBySerial[document.serialNumber]?.[0];
    if (!file) {
      return;
    }

    const targetDocument = documents.find((item) => item.label === document.documentType);
    if (!targetDocument) {
      return;
    }

    targetDocument.attachments.push({
      id: document.serialNumber,
      fileName: file.name,
      serialNumber: document.serialNumber,
    });
  });

  return documents;
};

const AttachButton: React.FC<{
  onUpload: (files: File[]) => void;
  accept: string;
}> = ({ onUpload, accept }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

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
        multiple
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
  const setIndividualDocuments = useVendorOnboardingStore((state) => state.setIndividualDocuments);
  const setIndividualDocumentFiles = useVendorOnboardingStore((state) => state.setIndividualDocumentFiles);
  const draft = useVendorOnboardingStore((state) => state.draft);
  const [hasAttemptedContinue, setHasAttemptedContinue] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const [documents, setDocuments] = useState<DocumentItem[]>(createInitialDocuments());

  useEffect(() => {
    let cancelled = false;

    const hydrate = async () => {
      const snapshot = await readOnboardingAttachmentSnapshot<VendorKycSnapshot>(VENDOR_KYC_STORAGE_KEY);
      if (cancelled) {
        return;
      }

      if (snapshot) {
        setDocuments(rebuildDocuments(draft.individualDocuments || [], snapshot.filesBySerial || {}));
        setIndividualDocumentFiles(snapshot.filesBySerial || {});
      }

      setIsHydrated(true);
    };

    hydrate();

    return () => {
      cancelled = true;
    };
  }, [draft.individualDocuments, setIndividualDocumentFiles]);

  const handleFileUpload = (id: string, files: File[]) => {
    const validFiles = files.filter((file) => file.size <= 5 * 1024 * 1024);
    if (validFiles.length !== files.length) {
      alert('File size must be less than 5MB');
      return;
    }

    const newFilesMap: Record<string, File[]> = {};

    setDocuments((prev) =>
      prev.map((doc) => {
        if (doc.id !== id) return doc;

        const added = validFiles.map((file, index) => {
          const serial = generateDocumentSerial(doc.label, doc.attachments.length + index);
          newFilesMap[serial] = [file];
          return {
            id: serial,
            fileName: file.name,
            serialNumber: serial,
          };
        });

        const nextAttachments = [...doc.attachments, ...added];
        return { ...doc, attachments: nextAttachments };
      })
    );

    const currentFiles = useVendorOnboardingStore.getState().attachments.individualDocuments;
    setIndividualDocumentFiles({ ...currentFiles, ...newFilesMap });
  };

  const handleRemoveFile = (id: string, attachmentId: string) => {
    setDocuments((prev) =>
      prev.map((doc) =>
        doc.id === id ? { ...doc, attachments: doc.attachments.filter((attachment) => attachment.id !== attachmentId) } : doc
      )
    );

    const currentFiles = useVendorOnboardingStore.getState().attachments.individualDocuments;
    const nextFiles = Object.fromEntries(Object.entries(currentFiles).filter(([serial]) => serial !== attachmentId));
    setIndividualDocumentFiles(nextFiles);
  };

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    setIndividualDocuments(
      documents.flatMap((doc) =>
        doc.attachments.map((attachment) => ({
          documentType: doc.label,
          serialNumber: attachment.serialNumber,
        }))
      )
    );
    void writeOnboardingAttachmentSnapshot<VendorKycSnapshot>(VENDOR_KYC_STORAGE_KEY, {
      filesBySerial: useVendorOnboardingStore.getState().attachments.individualDocuments,
    });
  }, [documents, isHydrated, setIndividualDocuments]);

  const allDocumentsUploaded = documents.every((doc) => doc.attachments.length > 0);
  const missingDocuments = documents.filter((doc) => doc.attachments.length === 0);

  const handleContinue = () => {
    if (!allDocumentsUploaded) {
      setHasAttemptedContinue(true);
      return;
    }

    navigate('/vendor/add-your-stores');
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
            <span className="text-primary mr-1">
              <Badge className="bg-primary text-white">3</Badge>
            </span>
            KYC Documents
          </h1>
          <p className="text-sm text-foreground/60 leading-relaxed max-w-70 mx-auto">
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
                      {doc.attachments.length > 0 ? (
                        <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                      ) : (
                        <Circle className="w-4 h-4 text-gray-300 shrink-0" />
                      )}
                    </div>
                    
                    <p className="text-xs text-foreground/50 mb-1">
                      {doc.description}
                    </p>

                    <div className="mt-2 space-y-2">
                      {doc.attachments.length > 0 ? (
                        doc.attachments.map((attachment) => (
                          <div key={attachment.id} className="flex items-center gap-2">
                            <div className="flex items-center gap-1.5 bg-primary/5 rounded-lg px-2 py-1.5 flex-1 min-w-0">
                              <File className="w-3.5 h-3.5 text-primary" />
                              <span className="text-xs text-foreground font-medium truncate max-w-37.5">
                                {attachment.fileName}
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleRemoveFile(doc.id, attachment.id)}
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

                    {hasAttemptedContinue && doc.attachments.length === 0 ? (
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

      <div className="p-6 pb-8 bg-white">
        <Button 
          onClick={handleContinue}
          type="button"
          className={`w-full h-14 rounded-2xl text-lg font-bold flex items-center justify-center gap-2 shadow-lg ${
            allDocumentsUploaded 
              ? 'shadow-primary/20' 
              : ''
          }`}
        >
          Continue
          <ArrowRight className="w-5 h-5" />
        </Button>
      </div>

    </div>

  );
};