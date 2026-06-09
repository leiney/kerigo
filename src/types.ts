import { LocationDetails } from "@/lib/types";

export type UserRole = 'customer' | 'vendor' | 'rider' | 'rider-admin';

export interface UserProfile {
  id: string;
  email: string;
  userType: UserRole;
  avatar?: string;
  fullName?: string;
  avatarUrl?: string;
  token?: string;
  phoneNo?: string;
  username?: string;
  otherData?:{
    location?: LocationDetails;
  }
  [key: string]: unknown;
}

export interface AppState {
  user: UserProfile | null;
  currentRole: UserRole | null;
  isLoggedIn: boolean;
  isLoading: boolean;
}
