import type {
  AccountType,
  BusinessType,
  KYCDocument,
  LocationDetails,
  OrganisationVendorOtherInfo,
  OrganizationInfo,
  IndividualVendorOtherInfo,
  PayoutInfo,
  RegisterVendorPayload,
  Store,
} from '../../lib/types';

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
    businessType: 'other',
    registrationNo: '',
    taxIDNumber: '',
  },
  organizationDocuments: [],
  stores: [],
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

export const normalizeDocument = (documentType: string, serialNumber?: string): KYCDocument => ({
  documentType: documentType.trim(),
  serialNumber: serialNumber?.trim() || generateDocumentSerial(documentType, 0),
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
        normalizeDocument(document.documentType, document.serialNumber || generateDocumentSerial(document.documentType, index))
      ),
      stores: draft.stores.map((store) => ({
        storeName: store.storeName.trim(),
        businessType: store.businessType,
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
    };
  }

  const otherInfo: OrganisationVendorOtherInfo = {
    organizationInfo: {
      name: draft.organizationInfo.name.trim(),
      businessType: draft.organizationInfo.businessType,
      registrationNo: draft.organizationInfo.registrationNo.trim(),
      taxIDNumber: draft.organizationInfo.taxIDNumber.trim(),
    },
    stores: draft.stores.map((store) => ({
      storeName: store.storeName.trim(),
      businessType: store.businessType,
      cityTown: store.cityTown.trim(),
      locationDetails: normalizeLocationDetails(store.locationDetails),
    })),
    documents: draft.organizationDocuments.map((document, index) =>
      normalizeDocument(document.documentType, document.serialNumber || generateDocumentSerial(document.documentType, index))
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
  };
};

export const businessTypeOptions: Array<{ value: BusinessType; label: string }> = [
  { value: 'restaurant', label: 'Restaurant' },
  { value: 'fast_food', label: 'Fast Food' },
  { value: 'cafe', label: 'Cafe' },
  { value: 'bakery', label: 'Bakery' },
  { value: 'cloud_kitchen', label: 'Cloud Kitchen' },
  { value: 'supermarket', label: 'Supermarket' },
  { value: 'grocery', label: 'Grocery' },
  { value: 'butchery', label: 'Butchery' },
  { value: 'fruit_vegetable', label: 'Fruit & Vegetable' },
  { value: 'seafood', label: 'Seafood' },
  { value: 'pharmacy', label: 'Pharmacy' },
  { value: 'clinic', label: 'Clinic' },
  { value: 'hospital', label: 'Hospital' },
  { value: 'medical_store', label: 'Medical Store' },
  { value: 'beauty_cosmetics', label: 'Beauty & Cosmetics' },
  { value: 'convenience_store', label: 'Convenience Store' },
  { value: 'wholesale', label: 'Wholesale' },
  { value: 'other', label: 'Other' },
];

export type VendorMultipartAttachments = {
  individualDocuments: Record<string, File[]>;
  organizationDocuments: Record<string, File[]>;
};

const attachFilesToVendorPayload = (payloadWithFiles: any, draft: VendorOnboardingDraft, attachments: VendorMultipartAttachments) => {
  if (payloadWithFiles.accountType === 'individual') {
    const docs = payloadWithFiles.otherInfo?.documents || [];
    docs.forEach((doc: any) => {
      const serial = String(doc.serialNumber || '');
      doc.files = attachments.individualDocuments[serial] || [];
    });
  } else {
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
  // imported at call site — keep shape consistent with rider
  // buildFlattenedFormData is in src/lib/multipart
  // lazy import to avoid cycles
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { buildFlattenedFormData } = require('./multipart');
  return buildFlattenedFormData(payloadWithFiles);
};
