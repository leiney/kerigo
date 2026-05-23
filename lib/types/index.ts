export type RequestMethod = 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface UserRoleOption {
  code: string;
  name: string;
}

export interface AuthUser {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  roles: string[];
  avatarUrl?: string;
  isVerified?: boolean;
}

export interface LoginResponse {
  message: string;
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
}

export interface VerificationMethod {
  id: 'sms' | 'email' | 'authenticator';
  title: string;
  description: string;
  highlighted: boolean;
}

export interface OtpMetadataResponse {
  method: 'sms' | 'email' | 'authenticator';
  expiresInSeconds: number;
  resendInSeconds: number;
  message: string;
}

export interface VendorSummary {
  id: string;
  slug: string;
  name: string;
  category: string;
  time: string;
  logoUrl: string;
}

export interface VendorCategory {
  name: string;
  imageUrl: string;
}

export interface VendorMenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
}

export interface OrderStep {
  label: string;
  time: string;
  completed: boolean;
  active: boolean;
}

export interface OrderSummary {
  id: string;
  reference: string;
  date: string;
  itemCount: number;
  total: number;
  status: string;
  paymentMethod: string;
  address: string;
  addressNote: string;
  eta: string;
  steps: OrderStep[];
}

export interface OrderHistoryItem {
  id: string;
  items: string;
  date: string;
  price: number;
  status: string;
  imageUrl: string;
}

export interface RecommendationItem {
  id: number;
  name: string;
  price: number;
  unit: string;
  imageUrl: string;
}

export interface AddressItem {
  id: string;
  label: string;
  isDefault: boolean;
  street: string;
  area: string;
  county: string;
  country: string;
  phoneNumber: string;
}

export interface WalletSummary {
  name: string;
  balance: number;
}

export interface PaymentMethodItem {
  id: string;
  type: 'visa' | 'mastercard' | 'mpesa';
  label: string;
  lastFour: string;
  expiry: string;
  isDefault: boolean;
  phoneNumber?: string;
}

export interface LoginSession {
  id: string;
  location: string;
  device: string;
  timestamp: string;
  isActive: boolean;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  type: 'order' | 'payment' | 'promo' | 'system';
}

export interface NotificationPreferences {
  orderConfirmations: boolean;
  orderShipped: boolean;
  orderDelivered: boolean;
  orderCancellations: boolean;
  dealsDiscounts: boolean;
  newArrivals: boolean;
  newsletter: boolean;
  appUpdates: boolean;
  reminders: boolean;
}

export interface AppPreferenceValues {
  saveData: boolean;
  locationServices: boolean;
  language: string;
  currency: string;
  theme: string;
  defaultMapApp: string;
  chatPreferences: string;
}

export interface PrivacySecurityValues {
  profileVisibility: string;
  blockedUsers: number;
  dataPrivacy: string;
  twoFactorEnabled: boolean;
}

export interface SupportTopic {
  id: string;
  title: string;
  subtitle: string;
}

export interface SupportOption {
  id: string;
  title: string;
  subtitle: string;
}

export interface CustomerHomeData {
  greetingName: string;
  unreadNotifications: number;
  latestOrder: OrderSummary;
  pastOrders: OrderHistoryItem[];
  recommendations: RecommendationItem[];
}

export interface VendorStoreData {
  vendor: {
    id: string;
    name: string;
    category: string;
    time: string;
    isOpen: boolean;
    rating: number;
    reviews: string;
    logoUrl: string;
  };
  categories: VendorCategory[];
  menuItems: VendorMenuItem[];
}

export interface CustomerSettingsData {
  profile: AuthUser;
  personalInformation: {
    fullName: string;
    phoneNumber: string;
    email: string;
    dateOfBirth: string;
    gender: string;
  };
  addresses: AddressItem[];
  wallet: WalletSummary;
  paymentMethods: PaymentMethodItem[];
  loginSessions: LoginSession[];
  notificationPreferences: NotificationPreferences;
  appPreferences: AppPreferenceValues;
  privacySecurity: PrivacySecurityValues;
  supportTopics: SupportTopic[];
  supportOptions: SupportOption[];
}

export interface AccountSectionItem {
  id: string;
  title: string;
  subtitle: string;
  route: string;
  isDestructive?: boolean;
}

export interface AccountSettingsData {
  profile: {
    fullName: string;
    phoneNumber: string;
    avatarUrl: string;
    verified: boolean;
  };
  sections: Array<{
    id: string;
    title: string;
    items: AccountSectionItem[];
  }>;
}

export interface SharedWelcomeData {
  vendors: VendorSummary[];
}
