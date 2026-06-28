import { BusinessType } from '../../lib/types';
import type {
  AccountType,
  KYCDocument,
  LocationDetails,
  OrganisationVendorOtherInfo,
  OrganizationInfo,
  IndividualVendorOtherInfo,
  PayoutInfo,
  RegisterVendorPayload,
  Store,
} from '../../lib/types';
import { buildFlattenedFormData } from './multipart';

export type VendorStoreDraft = Store & {
  id: string;
};

export type VendorDocumentAttachment = {
  id: string;
  fileName: string;
  serialNumber: string;
};

export type VendorOnboardingDraft = {
  accountType: AccountType | null;
  fullName: string;
  email: string;
  phoneNo: string;
  password: string;
  payoutInfo: PayoutInfo | null;
  individualDocuments: KYCDocument[];
  organizationInfo: OrganizationInfo;
  organizationDocuments: KYCDocument[];
  stores: VendorStoreDraft[];
  storeSetup?: 'one' | 'multiple';
  customInstructions?: string;
  businessType: BusinessType;
};

export const createEmptyVendorOnboardingDraft = (): VendorOnboardingDraft => ({
  accountType: 'individual',
  fullName: '',
  email: '',
  phoneNo: '',
  password: '',
  payoutInfo: null,
  individualDocuments: [],
  organizationInfo: {
    name: '',
    businessType: BusinessType.Other,
    registrationNo: '',
    taxIDNumber: '',
  },
  organizationDocuments: [],
  stores: [],
  storeSetup: 'one',
  customInstructions: '',
  businessType: BusinessType.Other,
});

const sanitizeSerialPart = (value: string) =>
  value
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 12) || 'DOC';

const createUniqueSerialSuffix = () => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID().split('-')[0];
  }

  return Math.random().toString(36).slice(2, 8);
};

export const generateDocumentSerial = (documentType: string, index: number) => {
  const prefix = sanitizeSerialPart(documentType);
  return `${prefix}-${index + 1}-${Date.now()}-${createUniqueSerialSuffix()}`;
};

export const normalizeDocument = (documentType: string, serialNumber: string, files: File[]): KYCDocument => ({
  documentType: documentType.trim(),
  serialNumber: serialNumber?.trim() || generateDocumentSerial(documentType, 0),
  files: files
});

export const normalizeLocationDetails = (locationDetails: Partial<LocationDetails>): LocationDetails => ({
  longitude: Number(locationDetails.longitude ?? 0),
  latitude: Number(locationDetails.latitude ?? 0),
  address: locationDetails.address?.trim() || '',
  city: locationDetails.city?.trim() || '',
  country: locationDetails.country?.trim() || 'Kenya',
  postalCode: locationDetails.postalCode?.trim() || undefined,
});

export const buildVendorSignupPayload = (draft: VendorOnboardingDraft): RegisterVendorPayload => {
  if (!draft.accountType) {
    throw new Error('Select an account type before submitting.');
  }

  if (!draft.payoutInfo) {
    throw new Error('Add payout information before submitting.');
  }

  if (draft.accountType === 'individual') {
    const otherInfo: IndividualVendorOtherInfo = {
      documents: draft.individualDocuments.map((document, index) =>
        normalizeDocument(document.documentType, document.serialNumber || generateDocumentSerial(document.documentType, index), document.files)
      ),
      stores: draft.stores.map((store) => ({
        storeName: store.storeName.trim(),
        businessType: draft.businessType,
        cityTown: store.cityTown.trim(),
        locationDetails: normalizeLocationDetails(store.locationDetails),
      })),
    };

    return {
      accountType: 'individual',
      fullName: draft.fullName.trim(),
      email: draft.email.trim(),
      phoneNo: draft.phoneNo.trim(),
      password: draft.password,
      payoutInfo: draft.payoutInfo,
      otherInfo,
      customInstructions: draft.customInstructions || undefined,
    };
  }

  const otherInfo: OrganisationVendorOtherInfo = {
    organizationInfo: {
      name: draft.organizationInfo.name.trim(),
      businessType: draft.businessType,
      registrationNo: draft.organizationInfo.registrationNo.trim(),
      taxIDNumber: draft.organizationInfo.taxIDNumber.trim(),
    },
    stores: draft.stores.map((store) => ({
      storeName: store.storeName.trim(),
      businessType: draft.businessType,
      cityTown: store.cityTown.trim(),
      locationDetails: normalizeLocationDetails(store.locationDetails),
    })),
    documents: draft.organizationDocuments.map((document, index) =>
      normalizeDocument(document.documentType, document.serialNumber || generateDocumentSerial(document.documentType, index), document.files)
    ),
  };

  return {
    accountType: 'organisation',
    fullName: draft.fullName.trim(),
    email: draft.email.trim(),
    phoneNo: draft.phoneNo.trim(),
    password: draft.password,
    payoutInfo: draft.payoutInfo,
    otherInfo,
    customInstructions: draft.customInstructions || undefined,
  };
};

export const businessTypeOptions: Array<{ value: BusinessType; label: string }> = [
  { value: BusinessType.Pharmacy, label: 'Pharmacy' },
  { value: BusinessType.Food, label: 'Food' },
  { value: BusinessType.Grocery, label: 'Grocery' },
  { value: BusinessType.Other, label: 'Other' },
];

export type VendorMultipartAttachments = {
  individualDocuments: Record<string, File[]>;
  organizationDocuments: Record<string, File[]>;
  avatar: File | null;
  organizationLogo: File | null;
};

const attachFilesToVendorPayload = (payloadWithFiles: any, draft: VendorOnboardingDraft, attachments: VendorMultipartAttachments) => {
  payloadWithFiles.avatar = attachments.avatar ?? null;

  if (payloadWithFiles.accountType === 'individual') {
    const docs = payloadWithFiles.otherInfo?.documents || [];
    docs.forEach((doc: any) => {
      const serial = String(doc.serialNumber || '');
      doc.files = attachments.individualDocuments[serial] || [];
    });
  } else {
    const organizationLogo = attachments.organizationLogo ?? null;
    payloadWithFiles.organizationLogo = organizationLogo;
    payloadWithFiles.logo = organizationLogo;
    (payloadWithFiles.otherInfo?.documents || []).forEach((doc: any) => {
      const serial = String(doc.serialNumber || '');
      doc.files = attachments.organizationDocuments[serial] || [];
    });
  }
};

export const buildVendorSignupPayloadWithFiles = (draft: VendorOnboardingDraft, attachments: VendorMultipartAttachments) => {
  const payload = buildVendorSignupPayload(draft);
  const payloadWithFiles: any = JSON.parse(JSON.stringify(payload));
  attachFilesToVendorPayload(payloadWithFiles, draft, attachments);
  return payloadWithFiles;
};

export const buildVendorSignupFormData = (draft: VendorOnboardingDraft, attachments: VendorMultipartAttachments): FormData => {
  const payloadWithFiles = buildVendorSignupPayloadWithFiles(draft, attachments);
  return buildFlattenedFormData(payloadWithFiles);
};
