import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { createEmptyVendorOnboardingDraft, type VendorOnboardingDraft, type VendorStoreDraft } from '../lib/vendorOnboarding';
import type { AccountType, KYCDocument, PayoutMode, OrganizationInfo } from '../../lib/types';

interface PersistedFile {
  name: string;
  type: string;
  base64: string;
}

const base64ToFile = (persisted: PersistedFile): File => {
  const arr = persisted.base64.split(',');
  const mime = arr[0].match(/:(.*?);/)?.[1] || persisted.type;
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], persisted.name, { type: mime });
};

interface VendorOnboardingStore {
  draft: VendorOnboardingDraft;
  attachments: {
    individualDocuments: Record<string, File[]>;
    organizationDocuments: Record<string, File[]>;
    avatar: File | null;
    organizationLogo: File | null;
  };
  persistedAvatar: PersistedFile | null;
  persistedLogo: PersistedFile | null;
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
  setCustomInstructions: (instructions: string) => void;
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
      persistedAvatar: null,
      persistedLogo: null,
      setAccountType: (accountType) =>
        set({
          draft: resetForAccountType(accountType),
          attachments: { individualDocuments: {}, organizationDocuments: {}, avatar: null, organizationLogo: null },
          persistedAvatar: null,
          persistedLogo: null,
        }),
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
                    : mode === 'custom'
                    ? { customInstructions: state.draft.customInstructions ?? '' }
                    : { bank: '', branch: '', accountNumber: '', accountName: '', swiftCode: '' },
                customInstructions: mode === 'custom' ? (state.draft.customInstructions ?? '') : undefined,
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
      setAvatarFile: (file) => {
        if (!file) {
          set((state) => ({
            attachments: { ...state.attachments, avatar: null },
            persistedAvatar: null,
          }));
          return;
        }
        set((state) => ({
          attachments: { ...state.attachments, avatar: file }
        }));

        const reader = new FileReader();
        reader.onload = (e) => {
          const base64 = e.target?.result as string;
          if (base64) {
            set(() => ({
              persistedAvatar: {
                name: file.name,
                type: file.type,
                base64,
              }
            }));
          }
        };
        reader.readAsDataURL(file);
      },
      setIndividualDocuments: (documents) => set((state) => ({ draft: { ...state.draft, individualDocuments: documents } })),
      setOrganizationDocuments: (documents) => set((state) => ({ draft: { ...state.draft, organizationDocuments: documents } })),
      setOrganizationDocumentFiles: (documents) => set((state) => ({ attachments: { ...state.attachments, organizationDocuments: documents } })),
      setOrganizationLogoFile: (file) => {
        if (!file) {
          set((state) => ({
            attachments: { ...state.attachments, organizationLogo: null },
            persistedLogo: null,
          }));
          return;
        }

        set((state) => ({
          attachments: { ...state.attachments, organizationLogo: file }
        }));

        const reader = new FileReader();
        reader.onload = (e) => {
          const base64 = e.target?.result as string;
          if (base64) {
            set(() => ({
              persistedLogo: {
                name: file.name,
                type: file.type,
                base64,
              }
            }));
          }
        };
        reader.readAsDataURL(file);
      },
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
      setCustomInstructions: (instructions) =>
        set((state) => ({
          draft: {
            ...state.draft,
            customInstructions: instructions,
            payoutInfo: state.draft.payoutInfo?.mode === 'custom'
              ? {
                  ...state.draft.payoutInfo,
                  details: { customInstructions: instructions },
                  customInstructions: instructions,
                }
              : state.draft.payoutInfo,
          },
        })),
      reset: () =>
        set({
          draft: createEmptyVendorOnboardingDraft(),
          attachments: { individualDocuments: {}, organizationDocuments: {}, avatar: null, organizationLogo: null },
          persistedAvatar: null,
          persistedLogo: null,
        }),
    }),
    {
      name: 'vendor-onboarding-draft',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        draft: state.draft,
        persistedAvatar: state.persistedAvatar,
        persistedLogo: state.persistedLogo,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          if (state.persistedAvatar) {
            try {
              state.attachments.avatar = base64ToFile(state.persistedAvatar);
            } catch (e) {
              console.error('Failed to reconstruct avatar from persisted state', e);
            }
          }
          if (state.persistedLogo) {
            try {
              state.attachments.organizationLogo = base64ToFile(state.persistedLogo);
            } catch (e) {
              console.error('Failed to reconstruct logo from persisted state', e);
            }
          }
        }
      },
    }
  )
);
