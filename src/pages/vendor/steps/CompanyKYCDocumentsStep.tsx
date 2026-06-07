import React, { useEffect, useState, useRef } from 'react';
import { Badge } from '@stackloop/ui';
import { FileText, CheckCircle2, Circle, File, X } from 'lucide-react';
import { OnboardingLayout } from '../../../components/onboarding/OnboardingLayout';
import { type VendorDocumentAttachment } from '../../../lib/vendorOnboarding';
import { useVendorOnboardingStore } from '../../../store/vendorOnboardingStore';
import { readOnboardingAttachmentSnapshot, writeOnboardingAttachmentSnapshot } from '../../../lib/onboardingAttachmentStorage';

type CompanyKYCDocumentsStepProps = {
  onNext: () => void;
  onBack: () => void;
};

interface DocumentItem {
  id: string;
  label: string;
  description: string;
  icon: React.ReactNode;
  serialNumber: string;
  attachments: Array<VendorDocumentAttachment & { file: File }>;
  acceptedFormats: string;
}

type VendorCompanyKycSnapshot = {
  filesBySerial: Record<string, File[]>;
};

const COMPANY_KYC_STORAGE_KEY = 'vendor-company-kyc-documents';

const createUuid = () => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
};

const createInitialDocuments = (): DocumentItem[] => ([
  {
    id: 'business-registration',
    label: 'Business Registration Certificate',
    description: 'Certificate of incorporation or registration',
    icon: <FileText className="w-5 h-5 text-primary" />,
    serialNumber: createUuid(),
    attachments: [],
    acceptedFormats: 'image/*,.pdf',
  },
  {
    id: 'kra-pin',
    label: 'KRA PIN',
    description: 'Tax registration certificate',
    icon: <FileText className="w-5 h-5 text-primary" />,
    serialNumber: createUuid(),
    attachments: [],
    acceptedFormats: 'image/*,.pdf',
  },
  {
    id: 'director-id',
    label: 'Company Director ID',
    description: 'National ID of authorized director',
    icon: <FileText className="w-5 h-5 text-primary" />,
    serialNumber: createUuid(),
    attachments: [],
    acceptedFormats: 'image/*,.pdf',
  },
]);

const rebuildDocuments = (
  draftDocuments: Array<{ documentType: string; serialNumber: string }>,
  filesBySerial: Record<string, File[]>
): DocumentItem[] => {
  const documents = createInitialDocuments();

  documents.forEach((item) => {
    const draftDoc = draftDocuments.find((d) => d.documentType === item.label);
    if (draftDoc) {
      item.serialNumber = draftDoc.serialNumber;
      const files = filesBySerial[draftDoc.serialNumber] || [];
      item.attachments = files.map((file, idx) => ({
        id: `${draftDoc.serialNumber}-${idx}`,
        fileName: file.name,
        serialNumber: draftDoc.serialNumber,
        file,
      }));
    }
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
        multiple
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
  const setOrganizationDocuments = useVendorOnboardingStore((state) => state.setOrganizationDocuments);
  const setOrganizationDocumentFiles = useVendorOnboardingStore((state) => state.setOrganizationDocumentFiles);
  const draft = useVendorOnboardingStore((state) => state.draft);
  const [hasAttemptedContinue, setHasAttemptedContinue] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const [documents, setDocuments] = useState<DocumentItem[]>(createInitialDocuments());
  const [filesBySerial, setFilesBySerial] = useState<Record<string, File[]>>({});

  useEffect(() => {
    let cancelled = false;

    const hydrate = async () => {
      const snapshot = await readOnboardingAttachmentSnapshot<VendorCompanyKycSnapshot>(COMPANY_KYC_STORAGE_KEY);
      if (cancelled) {
        return;
      }

      if (snapshot) {
        setDocuments(rebuildDocuments(draft.organizationDocuments || [], snapshot.filesBySerial || {}));
        setFilesBySerial(snapshot.filesBySerial || {});
        setOrganizationDocumentFiles(snapshot.filesBySerial || {});
      }

      setIsHydrated(true);
    };

    hydrate();

    return () => {
      cancelled = true;
    };
  }, []);

  const handleFileUpload = (id: string, files: File[]) => {
    const validFiles = files.filter((file) => file.size <= 5 * 1024 * 1024);
    if (validFiles.length !== files.length) {
      alert('File size must be less than 5MB');
      return;
    }

    setDocuments((prev) =>
      prev.map((doc) => {
        if (doc.id !== id) return doc;

        const nextAttachments = [...doc.attachments];
        const newFiles = [...(filesBySerial[doc.serialNumber] || [])];

        validFiles.forEach((file) => {
          if (!nextAttachments.some((att) => att.fileName === file.name)) {
            const attachmentId = `${doc.serialNumber}-${nextAttachments.length}`;
            nextAttachments.push({
              id: attachmentId,
              fileName: file.name,
              serialNumber: doc.serialNumber,
              file,
            });
            newFiles.push(file);
          }
        });

        setFilesBySerial((current) => {
          const next = { ...current };
          next[doc.serialNumber] = newFiles;
          setOrganizationDocumentFiles(next);
          return next;
        });

        return { ...doc, attachments: nextAttachments };
      })
    );
  };

  const handleRemoveFile = (id: string, attachmentId: string) => {
    setDocuments((prev) =>
      prev.map((doc) => {
        if (doc.id !== id) return doc;

        const attToRemove = doc.attachments.find((att) => att.id === attachmentId);
        if (!attToRemove) return doc;

        const nextAttachments = doc.attachments.filter((att) => att.id !== attachmentId);

        setFilesBySerial((current) => {
          const next = { ...current };
          const files = current[doc.serialNumber] || [];
          next[doc.serialNumber] = files.filter((f) => f.name !== attToRemove.fileName);
          setOrganizationDocumentFiles(next);
          return next;
        });

        return { ...doc, attachments: nextAttachments };
      })
    );
  };

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    setOrganizationDocuments(
      documents
        .filter((doc) => doc.attachments.length > 0)
        .map((doc) => ({
          documentType: doc.label,
          serialNumber: doc.serialNumber,
          files: [],
        }))
    );
    setOrganizationDocumentFiles(filesBySerial);
    void writeOnboardingAttachmentSnapshot<VendorCompanyKycSnapshot>(COMPANY_KYC_STORAGE_KEY, {
      filesBySerial,
    });
  }, [documents, filesBySerial, isHydrated, setOrganizationDocuments, setOrganizationDocumentFiles]);

  const allDocumentsUploaded = documents.every((doc) => doc.attachments.length > 0);

  const handleContinue = () => {
    if (!allDocumentsUploaded) {
      setHasAttemptedContinue(true);
      return;
    }
    onNext();
  };

  return (
    <OnboardingLayout
      currentStep={4}
      stepNumber={4}
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
                            <File className="w-3.5 h-3.5 text-primary shrink-0" />
                            <span className="text-xs text-foreground font-medium truncate">
                              {attachment.fileName}
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveFile(doc.id, attachment.id)}
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
