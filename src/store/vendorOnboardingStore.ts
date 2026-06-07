import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { createEmptyVendorOnboardingDraft, type VendorOnboardingDraft, type VendorStoreDraft } from '../lib/vendorOnboarding';
import type { AccountType, KYCDocument, PayoutMode, OrganizationInfo } from '../../lib/types';

interface VendorOnboardingStore {
  draft: VendorOnboardingDraft;
  attachments: {
    individualDocuments: Record<string, File[]>;
    organizationDocuments: Record<string, File[]>;
    avatar: File | null;
    organizationLogo: File | null;
  };
  setAccountType: (accountType: AccountType) => void;
  setIdentityDetails: (details: Pick<VendorOnboardingDraft, 'fullName' | 'email' | 'phoneNo'>) => void;
  setPassword: (password: string) => void;
  setPayoutMode: (mode: PayoutMode) => void;
  setMpesaDetails: (phoneNo: string) => void;
  setBankDetails: (details: { bank: string; branch: string; accountNumber: string; swiftCode: string; accountName: string }) => void;
  setIndividualDocumentFiles: (documents: Record<string, File[]>) => void;
  setOrganizationInfo: (details: Partial<OrganizationInfo>) => void;
  setAvatarFile: (file: File | null) => void;
  setIndividualDocuments: (documents: KYCDocument[]) => void;
  setOrganizationDocuments: (documents: KYCDocument[]) => void;
  setOrganizationDocumentFiles: (documents: Record<string, File[]>) => void;
  setOrganizationLogoFile: (file: File | null) => void;
  setStores: (stores: VendorStoreDraft[]) => void;
  addStore: (store: VendorStoreDraft) => void;
  updateStore: (id: string, store: VendorStoreDraft) => void;
  removeStore: (id: string) => void;
  setStoreSetup: (setup: 'one' | 'multiple') => void;
  reset: () => void;
}

const resetForAccountType = (accountType: AccountType) => {
  const draft = createEmptyVendorOnboardingDraft();
  draft.accountType = accountType;
  return draft;
};

export const useVendorOnboardingStore = create<VendorOnboardingStore>()(
  persist(
    (set) => ({
      draft: createEmptyVendorOnboardingDraft(),
      attachments: { individualDocuments: {}, organizationDocuments: {}, avatar: null, organizationLogo: null },
      setAccountType: (accountType) => set({ draft: resetForAccountType(accountType), attachments: { individualDocuments: {}, organizationDocuments: {}, avatar: null, organizationLogo: null } }),
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
      setIndividualDocumentFiles: (documents) => set((state) => ({ attachments: { ...state.attachments, individualDocuments: documents } })),
      setOrganizationInfo: (details) =>
        set((state) => ({ draft: { ...state.draft, organizationInfo: { ...state.draft.organizationInfo, ...details } } })),
      setAvatarFile: (file) => set((state) => ({ attachments: { ...state.attachments, avatar: file } })),
      setIndividualDocuments: (documents) => set((state) => ({ draft: { ...state.draft, individualDocuments: documents } })),
      setOrganizationDocuments: (documents) => set((state) => ({ draft: { ...state.draft, organizationDocuments: documents } })),
      setOrganizationDocumentFiles: (documents) => set((state) => ({ attachments: { ...state.attachments, organizationDocuments: documents } })),
      setOrganizationLogoFile: (file) => set((state) => ({ attachments: { ...state.attachments, organizationLogo: file } })),
      setStores: (stores) => set((state) => ({ draft: { ...state.draft, stores } })),
      addStore: (store) => set((state) => ({ draft: { ...state.draft, stores: [...state.draft.stores, store] } })),
      updateStore: (id, store) =>
        set((state) => ({
          draft: {
            ...state.draft,
            stores: state.draft.stores.map((current) => (current.id === id ? { ...store, id } : current)),
          },
        })),
      removeStore: (id) => set((state) => ({ draft: { ...state.draft, stores: state.draft.stores.filter((store) => store.id !== id) } })),
      setStoreSetup: (setup) => set((state) => ({ draft: { ...state.draft, storeSetup: setup } })),
      reset: () => set({ draft: createEmptyVendorOnboardingDraft(), attachments: { individualDocuments: {}, organizationDocuments: {}, avatar: null, organizationLogo: null } }),
    }),
    {
      name: 'vendor-onboarding-draft',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ draft: state.draft }),
    }
  )
);
