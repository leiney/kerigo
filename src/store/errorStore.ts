import { create } from 'zustand';

interface ErrorStore {
  isOpen: boolean;
  type: 'error' | 'success' | 'info';
  title: string;
  message: string;
  showError: (message: string, title?: string, type?: 'error' | 'success' | 'info') => void;
  hideError: () => void;
}

export const useErrorStore = create<ErrorStore>((set) => ({
  isOpen: false,
  type: 'error',
  title: 'Error',
  message: '',
  showError: (message, title = 'Error', type = 'error') =>
    set({
      isOpen: true,
      type,
      title,
      message,
    }),
  hideError: () => set({ isOpen: false }),
}));
