
import { create } from 'zustand';
import { AppState, UserRole, UserProfile } from '../types';

interface AuthStore extends AppState {
  setUser: (user: UserProfile | null) => void;
  setRole: (role: UserRole) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  currentRole: null,
  isLoggedIn: false,
  isLoading: false,
  setUser: (user) => set({ user, isLoggedIn: !!user, currentRole: user?.roles[0] || null }),
  setRole: (role) => set({ currentRole: role }),
  logout: () => set({ user: null, isLoggedIn: false, currentRole: null }),
  setLoading: (loading) => set({ isLoading: loading }),
}));
