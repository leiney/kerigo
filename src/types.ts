
export type UserRole = 'customer' | 'vendor' | 'rider';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  roles: UserRole[];
  avatar?: string;
}

export interface AppState {
  user: UserProfile | null;
  currentRole: UserRole | null;
  isLoggedIn: boolean;
  isLoading: boolean;
}
