import { UserProfile } from '@/src/types';
import { axiosInstance, request } from './axios';
import { buildProductFormData } from './products';
import { buildFlattenedFormData } from '../src/lib/multipart';
import type {
  AccountSettingsData,
  AddressItem,
  AppPreferenceValues,
  AuthUser,
  CategoryCreatePayload,
  CategoryCreateResponse,
  CategoryItem,
  CustomerHomeData,
  CustomerSettingsData,
  LoginResponse,
  ProductCreateResponse,
  ProductPayload,
  NotificationItem,
  NotificationPreferences,
  OtpMetadataResponse,
  OrderHistoryItem,
  PaginatedResponse,
  PaymentMethodItem,
  PrivacySecurityValues,
  SharedWelcomeData,
  RegisterVendorPayload,
  RegisterVendorResponse,
  RegisterRiderPayload,
  RegisterRiderResponse,
  SupportOption,
  SupportTopic,
  UserRoleOption,
  VendorMenuItem,
  VendorStoreData,
  VerificationMethod,
  WalletSummary,
  Store,
  LocationDetails,
} from './types';

type PasswordPayload = {
  currentPassword?: string;
  oldPassword?: string;
  newPassword: string;
  confirmPassword: string;
};

const apiGet = <T>(url: string, params?: Record<string, unknown>) => request<T>({ method: 'GET', url, params });
const apiPost = <T>(url: string, data?: unknown, params?: Record<string, unknown>) => request<T>({ method: 'POST', url, data, params });
const apiPatch = <T>(url: string, data?: unknown, params?: Record<string, unknown>) => request<T>({ method: 'PATCH', url, data, params });
const apiDelete = <T>(url: string, data?: unknown, params?: Record<string, unknown>) => request<T>({ method: 'DELETE', url, data, params });

export const sharedApi = {
  getWelcomeData: async (): Promise<SharedWelcomeData> => apiGet('/shared/welcome/'),
  getVerificationMethods: async (): Promise<{ methods: VerificationMethod[] }> => apiGet('/shared/verification-methods/'),
  getOtpMetadata: async (method: 'sms' | 'email' | 'authenticator'): Promise<OtpMetadataResponse> => apiGet('/shared/otp/', { method }),
};

export const authApi = {
  getRegistrationMetadata: async (): Promise<{ roles: UserRoleOption[] }> => apiGet('/auth/register/'),
  
  register: async (data: Record<string, unknown>): Promise<{ message: string; verificationRequired: boolean; user: AuthUser }> => apiPost('/auth/register/', data),
  
  signupVendor: async (payload: RegisterVendorPayload | FormData): Promise<RegisterVendorResponse> => {
    const response = await axiosInstance.post<RegisterVendorResponse>('/signup-vendor/', payload as any);
    return response.data;
  },
  signupRider: async (payload: FormData): Promise<RegisterRiderResponse> => {
    const response = await axiosInstance.post<RegisterRiderResponse>('/signup-rider/', payload);
    return response.data;
  },
  
  login: async (identifier: string, password: string): Promise<UserProfile> => {
    const isEmail = identifier.includes('@');
    const payload = isEmail ? { email: identifier, password } : { username: identifier, password };
    const response = await axiosInstance.post<UserProfile>('/login/', payload);
    return response.data;
  },

  phoneLogin: async (phone: string, password: string): Promise<UserProfile> => {
    const response = await axiosInstance.post<UserProfile>('/phone-login/', { phoneNo: phone, password });
    return response.data;
  },

  getProfile: async () : Promise<UserProfile> => {
    const response = await axiosInstance.get<UserProfile>('/me/');
    return response.data;
  },
  
  
  verifyLogin: async (identifier: string, code: string): Promise<LoginResponse> => apiPost('/auth/login/verify/', { identifier, code }),
  resendCode: async (identifier: string): Promise<{ message: string }> => apiPost('/auth/login/resend-code/', { identifier }),
  refreshToken: async (): Promise<{ accessToken: string }> => apiPost('/auth/token/refresh/', {}),
  logout: async (): Promise<{ message: string }> => apiPost('/auth/logout/', {}),
  
  resetCode: async (payload: { data: { phoneNo?: string; email?: string }; channel: 'sms' | 'email' }): Promise<{ message: string }> => {
    const response = await axiosInstance.post('/reset-code/', { ...payload.data, channel: payload.channel });
    return response.data;
  },

  changeForgottenPassword: async (payload: { data: { phoneNo?: string; email?: string; resetCode: string; password?: string }; channel: 'sms' | 'email' }): Promise<{ message: string }> => {
    const response = await axiosInstance.post('/change-forgotten-password/', { ...payload.data, channel: payload.channel });
    return response.data;
  },

  getCurrentUser: async (): Promise<AuthUser> => apiGet('/users/me/'),
  updateCurrentUser: async (payload: Partial<AuthUser>): Promise<AuthUser> => apiPatch('/users/me/', payload),
  setPassword: async (payload: PasswordPayload): Promise<{ message: string }> => apiPost('/auth/security/set-password/', payload),
  setupTwoFactor: async (): Promise<{ otpauthUri: string; qrCodeDataUri: string; manualKey: string; expiresInSeconds: number }> => apiPost('/auth/2fa/setup/', {}),
  enableTwoFactor: async (otpCode: string): Promise<{ message: string; backupCodes: string[] }> => apiPost('/auth/2fa/enable/', { otpCode }),
  disableTwoFactor: async (payload: { otpCode?: string; recoveryCode?: string }): Promise<{ message: string }> => apiPost('/auth/2fa/disable/', payload),
  regenerateRecoveryCodes: async (otpCode: string): Promise<{ backupCodes: string[] }> => apiPost('/auth/2fa/recovery-codes/regenerate/', { otpCode }),
  
  updateProfile: async (payload: Partial<UserProfile>) : Promise<UserProfile> => {
    const response = await axiosInstance.patch<UserProfile>('/me/', payload);
    return response.data;
  },
  changeLoggedInPassword: async (payload: PasswordPayload): Promise<{ message: string }> => {
    const response = await axiosInstance.post('/change-logged-in-password', payload as any);
    return response.data;
  },
  updateLocation: async (location: LocationDetails): Promise<{ message: string }> => {
    const response = await axiosInstance.patch('/update-location', location);
    return response.data;
  },
};


export const customerApi = {
  getHomeData: async (): Promise<CustomerHomeData> => apiGet('/customer/home/'),
  getStoreData: async (): Promise<VendorStoreData> => apiGet('/customer/store/'),
  getStoreItems: async (): Promise<VendorMenuItem[]> => apiGet('/customer/store/items/'),
  getVendorList: async (): Promise<SharedWelcomeData['vendors']> => apiGet('/customer/vendors/'),
  getAddresses: async (): Promise<PaginatedResponse<AddressItem>> => apiGet('/customer/addresses/'),
  createAddress: async (payload: Partial<AddressItem>): Promise<AddressItem> => apiPost('/customer/addresses/', payload),
  updateAddress: async (id: string, payload: Partial<AddressItem>): Promise<AddressItem> => apiPatch(`/customer/addresses/${id}/`, payload),
  deleteAddress: async (id: string): Promise<{ message: string }> => apiDelete(`/customer/addresses/${id}/`),
  getWallet: async (): Promise<WalletSummary> => apiGet('/customer/payments/wallet/'),
  getPaymentMethods: async (): Promise<PaymentMethodItem[]> => apiGet('/customer/payments/methods/'),
  updatePaymentMethod: async (id: string, payload: Partial<PaymentMethodItem>): Promise<PaymentMethodItem> => apiPatch(`/customer/payments/methods/${id}/`, payload),
  getNotifications: async (): Promise<PaginatedResponse<NotificationItem>> => apiGet('/customer/notifications/'),
  markNotificationAsRead: async (id: string): Promise<NotificationItem> => apiPatch(`/customer/notifications/${id}/`, { isRead: true }),
  markAllNotificationsAsRead: async (): Promise<{ message: string }> => apiPost('/customer/notifications/read-all/', {}),
  getNotificationPreferences: async (): Promise<NotificationPreferences> => apiGet('/customer/notification-preferences/'),
  updateNotificationPreferences: async (payload: Partial<NotificationPreferences>): Promise<NotificationPreferences> => apiPatch('/customer/notification-preferences/', payload),
  getAppPreferences: async (): Promise<AppPreferenceValues> => apiGet('/customer/app-preferences/'),
  updateAppPreferences: async (payload: Partial<AppPreferenceValues>): Promise<AppPreferenceValues> => apiPatch('/customer/app-preferences/', payload),
  getPrivacySecurity: async (): Promise<PrivacySecurityValues> => apiGet('/customer/privacy-security/'),
  getLoginActivity: async (): Promise<CustomerSettingsData['loginSessions']> => apiGet('/customer/login-activity/'),
  getPersonalInformation: async (): Promise<CustomerSettingsData['personalInformation']> => apiGet('/customer/personal-information/'),
  updatePersonalInformation: async (payload: Partial<CustomerSettingsData['personalInformation']>): Promise<CustomerSettingsData['personalInformation']> => apiPatch('/customer/personal-information/', payload),
  getAccountSettings: async (): Promise<AccountSettingsData> => apiGet('/customer/account-settings/'),
  
  
  getLocation: async (): Promise<Record<string, any>> => apiGet('/customer/location/'),
  saveLocation: async (payload: Record<string, unknown>): Promise<Record<string, any>> => apiPost('/customer/location/', payload),
  
  calculateShippingRate: async (payload: {
    pickupLocation: { latitude: number; longitude: number };
    dropoffLocation: { latitude: number; longitude: number };
    vehicleType: 'motorbike';
  }): Promise<{ vehicleType: string; distanceKm: number; estimatedTime: string; deliveryFee: number; serviceCharge: number; charges: number }> => {
    const response = await axiosInstance.post<{
      vehicleType: string;
      distanceKm: number;
      estimatedTime: string;
      deliveryFee: number;
      serviceCharge: number;
      charges: number;
    }>('/shipping-rates/calculate', payload);
    return response.data;
  },
  
  
  getHelpTopics: async (): Promise<SupportTopic[]> => apiGet('/customer/help/topics/'),
  getHelpOptions: async (): Promise<SupportOption[]> => apiGet('/customer/help/options/'),
  createSupportTicket: async (payload: Record<string, unknown>): Promise<{ message: string; ticketId: string }> => apiPost('/customer/help/tickets/', payload),
  addToCart: async (payload: Record<string, unknown>): Promise<{ message: string }> => apiPost('/customer/cart/add/', payload),
  updateCart: async (payload: Record<string, unknown>): Promise<{ message: string }> => apiPatch('/customer/cart/', payload),
  clearCart: async (): Promise<{ message: string }> => apiDelete('/customer/cart/', {}),
};

export const notificationApi = {
  getAll: customerApi.getNotifications,
  markAsRead: customerApi.markNotificationAsRead,
  markAllAsRead: customerApi.markAllNotificationsAsRead,
};

export const paymentApi = {
  getWallet: customerApi.getWallet,
  getMethods: customerApi.getPaymentMethods,
  updateMethod: customerApi.updatePaymentMethod,
};

export const profileApi = {
  getPersonalInformation: customerApi.getPersonalInformation,
  updatePersonalInformation: customerApi.updatePersonalInformation,
};

export const settingsApi = {
  getAccountSettings: customerApi.getAccountSettings,
  getAppPreferences: customerApi.getAppPreferences,
  updateAppPreferences: customerApi.updateAppPreferences,
  getNotificationPreferences: customerApi.getNotificationPreferences,
  updateNotificationPreferences: customerApi.updateNotificationPreferences,
  getPrivacySecurity: customerApi.getPrivacySecurity,
  getLoginActivity: customerApi.getLoginActivity,
};

export const supportApi = {
  getTopics: customerApi.getHelpTopics,
  getOptions: customerApi.getHelpOptions,
  createTicket: customerApi.createSupportTicket,
};

export const productApi = {
  createProduct: async (payload: ProductPayload | FormData): Promise<ProductCreateResponse> => {
    const formData = payload instanceof FormData ? payload : buildProductFormData(payload);
    const response = await axiosInstance.post<ProductCreateResponse>('/products/extended/', formData);
    return response.data;
  },
  
  getProducts: async (params?: Record<string, unknown>): Promise<ProductPayload[]> => {
    const response = await axiosInstance.get<ProductPayload[]>('/products/vendor', { params });
    return response.data;
  },

  getStores: async (): Promise<Store[]> => {
    const response = await axiosInstance.get<Store[]>('/product-stores/vendor');
    return response.data;
  },
  getProduct: async (id: string): Promise<ProductPayload> => {
    const response = await axiosInstance.get<ProductPayload>(`/products/${id}`);
    return response.data;
  },
  getProductById: async (id: string): Promise<any> => {
    const response = await axiosInstance.get(`/products/${id}`);
    return response.data;
  },

  submitSignupOrder: async (payload: FormData | Record<string, unknown>) =>{
    const response = await axiosInstance.post('/signup-on-order', payload);
    return response.data;
  }, 

  deleteProduct: async (id: string) => {
    const response = await axiosInstance.delete(`/products/${id}`);
    return response.data;
  },

  getLatestOrder: async () =>{
    const response = await axiosInstance.get('/orders/latest');
    return response.data;
  },
  getPastOrder: async () =>{
    const response = await axiosInstance.get('/orders/past');
    return response.data;
  },
  getOrderDetails: async (orderID: string) => {
    const response = await axiosInstance.get(`/orders/${orderID}`);
    return response.data;
  },

  getAllOrders: async () => {
    const response = await axiosInstance.get('/orders/');
    return response.data;
  },

  getVendorOrders: async (params? : any) =>{
    const response = await axiosInstance.get('/orders/vendor', { params } );

    return response.data;
  },

  getVendorOrderDetails: async (orderID: string) => {
    const response = await axiosInstance.get(`/orders/${orderID}`);
    return response.data;
  },

  getRelatedProducts: async (OrderID? : string) =>{
    const response = await axiosInstance.get('/products/related')
    return response.data

  },

  updateOrderStatus: async (orderID: string, status: string, message?: string, vendorNotes?: string, rider?: { id: string; fullName: string; estimatedPickupTime?: number; phoneNo?: string; riderAccepted?: boolean } | Record<string, unknown>, customFields?: Record<string, unknown>) => {
    const payload: Record<string, unknown> = {
      status,
      message,
      vendorNotes,
      rider,
    };
    
    // Merge custom fields at root level of extraData
    if (customFields) {
      Object.assign(payload, customFields);
    }
    
    const response = await axiosInstance.patch(`/orders/${orderID}/tracking`, payload);
    return response.data;
  },


  getRiderOrders: async (params : any) =>{
    const response = await axiosInstance.get('/orders/rider', { params } );
    return response.data;
  },

 

  getAllRiders : async (latitude : number, longitude : number, vehicleType? : string, limit? : number) =>{
    const response = await axiosInstance.get('/riders/nearby', { params : {
      latitude : latitude,
      longitude : longitude,
      vehicleType : 'motorbike',
      limit : limit,//number of riders to display 
    } } );
    return response.data;
  },

  updateOrderRoute: async (orderID: string, latitude: number, longitude: number) => {
    const response = await axiosInstance.patch(`/orders/${orderID}/route`, {
      latitude,
      longitude,
    });
    return response.data;
  },

  uploadOrderResource: async (orderID: string, uploadKey: string, file: Blob | File) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('uploadKey', uploadKey);
    const response = await axiosInstance.post(`/orders/upload-resource/${orderID}`, formData);
    return response.data;
  },
};
export const categoryApi = {
  getCategories: async (): Promise<CategoryItem[]> => {
    const response = await axiosInstance.get<CategoryItem[]>('/categories/vendor');
    return response.data;
  },

  deleteCategory : async (categoryID :string) => {
    const response = await axiosInstance.delete(`/categories/${categoryID}`)
    return response.data
  },

  createCategory: async (payload: CategoryCreatePayload | FormData): Promise<CategoryCreateResponse> => {
    const formData = payload instanceof FormData ? payload : buildFlattenedFormData(payload as unknown as Record<string, unknown>);
    const response = await axiosInstance.post<CategoryCreateResponse>('/categories/extended/', formData);
    return response.data;
  },
};

export const VendorsApi = {
  getVendors : async () =>{
    const response = await axiosInstance.get('/vendors/nearby');
    return response.data;
  },

  getVendorsDetails : async (vendorID: string) =>{
    const response = await axiosInstance.get(`/vendors/${vendorID}`);
    return response.data;
  }
}

export const storeApi = {
  createStore: async (payload: Store): Promise<Store> => {
    
    const response = await axiosInstance.post<Store>('/product-stores/', payload);
    return response.data;
  },
};
