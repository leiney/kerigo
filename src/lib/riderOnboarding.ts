import type {
  AccountType,
  BankPayoutDetails,
  IndividualOtherInfo,
  IndividualVehicleInfo,
  KYCDocument,
  OrganisationOtherInfo,
  OrganisationVehicleInfo,
  OrganizationInfo,
  PayoutInfo,
  RegisterRiderPayload,
  RiderBusinessType,
  RiderInfo,
} from '../../lib/types';

export type RiderOnboardingDraft = {
  accountType: AccountType | null;
  fullName: string;
  email: string;
  phoneNo: string;
  password: string;
  payoutInfo: PayoutInfo | null;
  individualVehicleInfo: IndividualVehicleInfo;
  individualDocuments: KYCDocument[];
  organizationInfo: OrganizationInfo;
  organizationVehicles: OrganisationVehicleInfo[];
  riders: RiderInfo[];
  companyDocuments: KYCDocument[];
};

export const createEmptyRiderOnboardingDraft = (): RiderOnboardingDraft => ({
  accountType: 'individual',
  fullName: '',
  email: '',
  phoneNo: '',
  password: '',
  payoutInfo: null,
  individualVehicleInfo: {
    vehicleType: '',
    registrationNo: '',
    make: '',
    model: '',
    regYear: new Date().getFullYear(),
    color: '',
  },
  individualDocuments: [],
  organizationInfo: {
    name: '',
    businessType: 'other',
    registrationNo: '',
    taxIDNumber: '',
  },
  organizationVehicles: [],
  riders: [],
  companyDocuments: [],
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

export const buildRiderSignupPayload = (draft: RiderOnboardingDraft): RegisterRiderPayload => {
  if (!draft.accountType) {
    throw new Error('Select an account type before submitting.');
  }

  if (!draft.payoutInfo) {
    throw new Error('Add payout information before submitting.');
  }

  if (draft.accountType === 'individual') {
    const vehicleInfo: IndividualVehicleInfo = draft.individualVehicleInfo;

    const otherInfo: IndividualOtherInfo = {
      vehicleInfo,
      documents: draft.individualDocuments.map((document, index) =>
        normalizeDocument(document.documentType, document.serialNumber || generateDocumentSerial(document.documentType, index))
      ),
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

  const otherInfo: OrganisationOtherInfo = {
    organizationInfo: draft.organizationInfo,
    vehicleInfo: draft.organizationVehicles,
    riders: draft.riders.map((rider) => ({
      ...rider,
      documents: rider.documents.map((document, index) =>
        normalizeDocument(document.documentType, document.serialNumber || generateDocumentSerial(document.documentType, index))
      ),
    })),
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

export const createBankPayoutDetails = (draft: {
  bank: string;
  branch: string;
  accountNumber: string;
  swiftCode: string;
  accountName: string;
}): BankPayoutDetails => ({
  bank: draft.bank.trim(),
  branch: draft.branch.trim(),
  accountNumber: draft.accountNumber.trim(),
  swiftCode: draft.swiftCode.trim() || undefined,
  accountName: draft.accountName.trim(),
});
