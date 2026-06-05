import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { createEmptyRiderOnboardingDraft, type RiderOnboardingDraft } from '../lib/riderOnboarding';
import type { AccountType, KYCDocument, PayoutMode, RiderBusinessType, RiderInfo } from '../../lib/types';

type DocumentFilesMap = Record<string, File[]>;

type RiderAttachmentMap = DocumentFilesMap[];

type RiderOnboardingAttachments = {
  individualDocuments: DocumentFilesMap;
  companyDocuments: DocumentFilesMap;
  riderDocuments: RiderAttachmentMap;
};

interface RiderOnboardingStore {
  draft: RiderOnboardingDraft;
  attachments: RiderOnboardingAttachments;
  setAccountType: (accountType: AccountType) => void;
  setIdentityDetails: (details: Pick<RiderOnboardingDraft, 'fullName' | 'email' | 'phoneNo'>) => void;
  setPassword: (password: string) => void;
  setPayoutMode: (mode: PayoutMode) => void;
  setMpesaDetails: (phoneNo: string) => void;
  setBankDetails: (details: { bank: string; branch: string; accountNumber: string; swiftCode: string; accountName: string }) => void;
  setIndividualVehicleInfo: (details: Partial<RiderOnboardingDraft['individualVehicleInfo']>) => void;
  setIndividualDocuments: (documents: KYCDocument[]) => void;
  setIndividualDocumentFiles: (documents: DocumentFilesMap) => void;
  setOrganizationInfo: (details: { name: string; businessType: RiderBusinessType; registrationNo: string; taxIDNumber: string }) => void;
  setOrganizationVehicles: (vehicles: RiderOnboardingDraft['organizationVehicles']) => void;
  setRiders: (riders: RiderInfo[]) => void;
  setCompanyDocuments: (documents: KYCDocument[]) => void;
  setCompanyDocumentFiles: (documents: DocumentFilesMap) => void;
  setRiderDocumentFiles: (documents: RiderAttachmentMap) => void;
  reset: () => void;
}

const withResetDraft = () => createEmptyRiderOnboardingDraft();

const resetForAccountType = (accountType: AccountType) => {
  const draft = createEmptyRiderOnboardingDraft();
  draft.accountType = accountType;
  return draft;
};

export const useRiderOnboardingStore = create<RiderOnboardingStore>()(
  persist(
    (set) => ({
      draft: createEmptyRiderOnboardingDraft(),
      attachments: {
        individualDocuments: {},
        companyDocuments: {},
        riderDocuments: [],
      },
      setAccountType: (accountType) => set({ draft: resetForAccountType(accountType) }),
      setIdentityDetails: (details) => set((state) => ({ draft: { ...state.draft, ...details } })),
      setPassword: (password) => set((state) => ({ draft: { ...state.draft, password } })),
      setPayoutMode: (mode) =>
        set((state) => {
          if (state.draft.payoutInfo?.mode === mode) return {};
          return {
            draft: {
              ...state.draft,
              payoutInfo: {
                mode,
                details:
                  mode === 'mpesa'
                    ? { phoneNo: '' }
                    : { bank: '', branch: '', accountNumber: '', accountName: '', swiftCode: '' },
              },
            },
          };
        }),
      setMpesaDetails: (phoneNo) =>
        set((state) => ({
          draft: {
            ...state.draft,
            payoutInfo: {
              mode: 'mpesa',
              details: { phoneNo },
            },
          },
        })),
      setBankDetails: (details) =>
        set((state) => ({
          draft: {
            ...state.draft,
            payoutInfo: {
              mode: 'bank',
              details,
            },
          },
        })),
      setIndividualVehicleInfo: (details) =>
        set((state) => ({ draft: { ...state.draft, individualVehicleInfo: { ...state.draft.individualVehicleInfo, ...details } } })),
      setIndividualDocuments: (documents) => set((state) => ({ draft: { ...state.draft, individualDocuments: documents } })),
      setIndividualDocumentFiles: (documents) => set((state) => ({ attachments: { ...state.attachments, individualDocuments: documents } })),
      setOrganizationInfo: (details) =>
        set((state) => ({ draft: { ...state.draft, organizationInfo: { ...state.draft.organizationInfo, ...details } } })),
      setOrganizationVehicles: (vehicles) => set((state) => ({ draft: { ...state.draft, organizationVehicles: vehicles } })),
      setRiders: (riders) => set((state) => ({ draft: { ...state.draft, riders } })),
      setCompanyDocuments: (documents) => set((state) => ({ draft: { ...state.draft, companyDocuments: documents } })),
      setCompanyDocumentFiles: (documents) => set((state) => ({ attachments: { ...state.attachments, companyDocuments: documents } })),
      setRiderDocumentFiles: (documents) => set((state) => ({ attachments: { ...state.attachments, riderDocuments: documents } })),
      reset: () => set({ draft: createEmptyRiderOnboardingDraft(), attachments: { individualDocuments: {}, companyDocuments: {}, riderDocuments: [] } }),
    }),
    {
      name: 'rider-onboarding-draft',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ draft: state.draft }),
    }
  )
);
