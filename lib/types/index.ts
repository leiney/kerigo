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
  userType: 'customer' | 'vendor' | 'rider' | 'rider-admin';
  avatarUrl?: string;
  isVerified?: boolean;
}

export interface LoginUser {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  role: string;
  userType: 'customer' | 'vendor' | 'rider' | 'rider-admin';
  avatarUrl?: string;
  token?: string;
  phoneNo?: string;

}

export interface LoginResponse {
  message: string;
  accessToken: string;
  refreshToken: string;
  user: LoginUser;
}

export interface RegisterRiderResponse {
  id: string;
  username: string;
  email: string;
  accountType: 'individual' | 'organisation';
  fullName: string;
  phoneNo: string;
  payoutInfo: {
    mode: 'bank' | 'mpesa';
    details: Record<string, unknown>;
  };
  otherInfo: Record<string, unknown>;
  userType: 'rider';
  passwordVerified: 'Y' | 'N';
  dateCreated: string;
  token: string;
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
  image?: string;
}

export type CategoryStatus = 'active' | 'inactive';

export interface CategoryItem {
  categoryID: string;
  imageUrl: string;
  image?:string;
  name: string;
  description: string;
  status: CategoryStatus;
  displayOrder: number;
}

export interface CategoryCreatePayload {
  image?: File | Blob | string | null;
  name: string;
  description: string;
  status: CategoryStatus;
  displayOrder: number;
}

export interface CategoryCreateResponse {
  message: string;
  category: CategoryItem;
}

export interface VendorMenuItem {
  id: string | number;
  productID?: string | number;
  variantID?: string | number;
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
  estimatedDelivery?: string;
  deliveryTime?: string;
  statusDescription?: string;
  items?: string;
  steps: OrderStep[];
  store?: {
    name: string;
    description: string;
    lat: number;
    lng: number;
  };
  rider?: {
    name: string;
    role: string;
    rating: string;
    reviews?: string;
    lat: number;
    lng: number;
  };
  deliveryLocation?: {
    label: string;
    description: string;
    lat: number;
    lng: number;
  };
}

export interface OrderDetailItem {
  productID: string;
  variantID: string;
  quantity: number;
  taxes: any[];
  itemTax: number;
}

export interface OrderDetailData {
  orderID: string;
  orderNo: string;
  customer: string;
  orderDate: string;
  tax: number;
  subTotal: number;
  total: number;
  shippingCharges: number;
  orderItems: OrderDetailItem[];
  paymentStatus: string;
  paymentMethod: string;
  deliveryDurationType: string;
  deliveryDurationLength: number;
  orderStatus: string;
  extraData: {
    orderNotes: string;
    paymentInfo: {
      phoneNo: string;
      receiptNo: string;
      accountReference: string;
    };
    ownerID: string | null;
    tracking: Array<{
      status: string;
      message: string;
      timestamp: string;
    }>;
  };
  isArchived: string;
}

export interface OrderHistoryItem {
  id: string;
  items: string;
  date: string;
  price: number;
  status: string;
  imageUrl: string;
}

export interface CustomerOrderCard {
  id: string;
  reference: string;
  storeName: string;
  storeImageUrl: string;
  itemCount: number;
  total: number;
  status: string;
  statusTone: 'success' | 'warning' | 'neutral' | 'error';
  eta: string;
  riderName?: string | null;
  riderRole?: string;
  riderAvatarUrl?: string;
}

export interface CustomerOrdersPageData {
  tabs: {
    current: number;
    completed: number;
    cancelled: number;
  };
  banner: {
    title: string;
    subtitle: string;
  };
  currentOrders: CustomerOrderCard[];
  completedOrders: CustomerOrderCard[];
  cancelledOrders: CustomerOrderCard[];
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

export interface ProductCategoryPayload {
  categoryID?: string;
  name: string;
  image?: string;
}

export interface ProductReturnPolicyPayload {
  isReturnable: boolean;
  message: string;
}

export interface ProductInfoPayload {
  ingredients: string[];
}

export interface ProductVariantAttributePayload {
  name: string;
  value: string;
}

export interface ProductStorePayload {
  storeID?: string;
  price: number;
  oldPrice: number;
  stock: number;
  stockUsed?: number;
}

export interface ProductVariantPayload {
  variantID?: string;
  sku: string;
  barcode?: string;
  unit?: string;
  price: number;
  oldPrice: number;
  stock: number;
  stockUsed?: number;
  rating?: number;
  reviewCount?: number;
  isNew: boolean;
  active: boolean;
  images: Array<File | Blob | string>;
  attributes: ProductVariantAttributePayload[];
  createdAt?: string;
  updatedAt?: string;
  stores?: ProductStorePayload[];
}

export interface ProductPayload {
  productID?: string;
  name: string;
  description: string;
  category: ProductCategoryPayload[];
  tags: string[];
  returnPolicy: ProductReturnPolicyPayload;
  rating?: number;
  reviewCount?: number;
  active: boolean;
  taxCodes: string[];
  info: ProductInfoPayload;
  createdAt?: string;
  updatedAt?: string;
  variants: ProductVariantPayload[];
}

export interface ProductCreateResponse {
  message: string;
  productID?: string;
  product?: ProductPayload;
}

export type AccountType = 'individual' | 'organisation';
export type PayoutMode = 'bank' | 'mpesa' | 'custom';

export enum BusinessType {
  Pharmacy = "pharmacy",
  Food = "food",
  Grocery = "grocery",
  Other = "other"
}

export type RiderBusinessType =
  | 'delivery'
  | 'courier'
  | 'logistics'
  | 'transport'
  | 'motorbike_taxi'
  | 'ecommerce_delivery'
  | 'food_delivery'
  | 'parcel_delivery'
  | 'fleet_management'
  | 'other';

export interface MpesaPayoutDetails {
  phoneNo: string;
}

export interface BankPayoutDetails {
  bank: string;
  branch: string;
  accountNumber: string;
  swiftCode?: string;
  accountName: string;
}

export interface PayoutInfo {
  mode: PayoutMode;
  details: MpesaPayoutDetails | BankPayoutDetails | { customInstructions: string };
  customInstructions?: string;
}

export interface KYCDocument {
  documentType: string;
  serialNumber: string;
  files: File[];
}

export interface LocationDetails {
  longitude: number;
  latitude: number;
  address: string;
  city: string;
  country: string;
  postalCode?: string;
}



export interface Store {
  storeName: string;
  businessType: BusinessType;
  cityTown: string;
  locationDetails: LocationDetails;
}

export interface IndividualVehicleInfo {
  vehicleType: string;
  registrationNo: string;
  make: string;
  model: string;
  regYear: number;
  color: string;
}

export interface IndividualOtherInfo {
  vehicleInfo: IndividualVehicleInfo;
  documents: KYCDocument[];
}

export interface VehicleRider {
  idNumber: string;
  fullName: string;
}

export interface OrganisationVehicleInfo {
  vehicleType: string;
  registrationNo: string;
  make: string;
  model: string;
  regYear: number;
  color: string;
  rider: VehicleRider;
}

export interface OrganizationInfo {
  name: string;
  businessType: RiderBusinessType | BusinessType;
  registrationNo: string;
  taxIDNumber: string;
}

export interface RiderInfo {
  idNumber: string;
  fullName: string;
  phoneNo: string;
  email: string;
  experience: string;
  documents: KYCDocument[];
}

export interface OrganisationOtherInfo {
  vehicleInfo: OrganisationVehicleInfo[];
  organizationInfo: OrganizationInfo;
  riders: RiderInfo[];
}

export interface IndividualVendorOtherInfo {
  documents: KYCDocument[];
  stores: Store[];
}

export interface OrganisationVendorOtherInfo {
  organizationInfo: OrganizationInfo;
  stores: Store[];
  documents: KYCDocument[];
}

export interface RegisterVendorPayload {
  accountType: AccountType;
  fullName: string;
  email: string;
  phoneNo: string;
  password: string;
  payoutInfo: PayoutInfo;
  otherInfo: IndividualVendorOtherInfo | OrganisationVendorOtherInfo;
  customInstructions?: string;
}

export interface RegisterVendorResponse {
  message: string;
  vendorId?: string;
  token?: string;
}

export interface RegisterRiderPayload {
  accountType: AccountType;
  fullName: string;
  email: string;
  phoneNo: string;
  password: string;
  payoutInfo: PayoutInfo;
  otherInfo: IndividualOtherInfo | OrganisationOtherInfo;
}

export interface RegisterRiderResponse {
  message: string;
  riderId?: string;
}

export enum OrderTrackingStatus {
  RECEIVED = 'new',
  PREPARING = 'preparing',
  ON_THE_WAY = 'on_the_way',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
}

