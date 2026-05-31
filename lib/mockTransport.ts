import { mockData } from './mockData';
import type {
  AccountSectionItem,
  AddressItem,
  AuthUser,
  LoginResponse,
  OtpMetadataResponse,
  PaymentMethodItem,
  RequestMethod,
  RegisterVendorPayload,
  RegisterRiderPayload,
  SupportOption,
  VendorMenuItem,
} from './types';

type RequestConfig = {
  method: RequestMethod;
  url: string;
  data?: unknown;
  params?: Record<string, unknown>;
};

const clone = <T>(value: T): T => JSON.parse(JSON.stringify(value)) as T;

const normalizeUrl = (url: string) => url.replace(/\/+$/, '');

const getIdFromUrl = (url: string) => {
  const parts = normalizeUrl(url).split('/').filter(Boolean);
  return parts[parts.length - 1] ?? '';
};

const buildAuthResponse = (message = 'Authentication successful'): LoginResponse => ({
  message,
  accessToken: 'mock-access-token',
  refreshToken: 'mock-refresh-token',
  user: {
    id: mockData.auth.user.id,
    fullName: mockData.auth.user.fullName,
    email: mockData.auth.user.email,
    phoneNumber: mockData.auth.user.phoneNumber,
    role: mockData.auth.user.roles[0] ?? 'customer',
    userType: mockData.auth.user.userType ?? 'customer',
    avatarUrl: mockData.auth.user.avatarUrl,
  },
});

export const handleMockRequest = async <T>(config: RequestConfig): Promise<T> => {
  const { method } = config;
  const url = normalizeUrl(config.url);

  if (method === 'GET' && url === '/auth/register') {
    return clone({ roles: mockData.auth.registrationRoles }) as T;
  }

  if (method === 'POST' && url === '/auth/register') {
    return clone({
      message: 'Registration started',
      user: mockData.auth.user,
      verificationRequired: true,
    }) as T;
  }

  if (method === 'POST' && url === '/auth/login') {
    return clone(buildAuthResponse('Login successful')) as T;
  }

  if (method === 'POST' && url === '/signup-rider') {
    const payload = config.data as RegisterRiderPayload;
    return clone({
      id: `rider_${Date.now()}`,
      username: `${payload.fullName}`.toLowerCase().replace(/\s+/g, ''),
      email: payload.email,
      accountType: payload.accountType,
      fullName: payload.fullName,
      phoneNo: payload.phoneNo,
      payoutInfo: payload.payoutInfo,
      otherInfo: payload.otherInfo,
      userType: 'rider',
      passwordVerified: 'N',
      dateCreated: new Date().toISOString(),
      token: 'mock-rider-token',
    }) as T;
  }

  if (method === 'POST' && url === '/signup-vendor') {
    const payload = config.data as RegisterVendorPayload;
    return clone({
      message: 'Vendor signup successful',
      vendorId: `vendor_${Date.now()}`,
      token: 'mock-vendor-token',
      accountType: payload.accountType,
    }) as T;
  }

  if (method === 'POST' && url === '/auth/login/verify') {
    return clone(buildAuthResponse('Login verified')) as T;
  }

  if (method === 'POST' && url === '/auth/login/resend-code') {
    return clone({ message: 'Verification code sent' }) as T;
  }

  if (method === 'POST' && url === '/auth/token/refresh') {
    return clone({ accessToken: 'mock-refreshed-access-token' }) as T;
  }

  if (method === 'POST' && url === '/auth/logout') {
    return clone({ message: 'Logged out successfully' }) as T;
  }

  if (method === 'GET' && url === '/users/me') {
    return clone(mockData.auth.user) as T;
  }

  if (method === 'PATCH' && url === '/users/me') {
    const payload = config.data as Partial<AuthUser>;
    mockData.auth.user = {
      ...mockData.auth.user,
      ...payload,
    };
    return clone(mockData.auth.user) as T;
  }

  if (method === 'GET' && url === '/shared/welcome') {
    return clone(mockData.shared.welcome) as T;
  }

  if (method === 'GET' && url === '/shared/verification-methods') {
    return clone({ methods: mockData.shared.verificationMethods }) as T;
  }

  if (method === 'GET' && url === '/shared/otp') {
    const response: OtpMetadataResponse = {
      method: (config.params?.method as OtpMetadataResponse['method']) || 'sms',
      expiresInSeconds: 300,
      resendInSeconds: 53,
      message: 'Verification code sent',
    };
    return clone(response) as T;
  }

  if (method === 'GET' && url === '/customer/home') {
    return clone(mockData.customer.home) as T;
  }

  if (method === 'GET' && url === '/customer/vendors') {
    return clone(mockData.shared.welcome.vendors) as T;
  }

  if (method === 'GET' && url.startsWith('/customer/vendors/')) {
    return clone(mockData.customer.vendorStore) as T;
  }

  if (method === 'GET' && url === '/customer/addresses') {
    return clone({ results: mockData.customer.addresses, count: mockData.customer.addresses.length }) as T;
  }

  if (method === 'POST' && url === '/customer/addresses') {
    const payload = config.data as Partial<AddressItem>;
    const nextAddress: AddressItem = {
      id: `address_${mockData.customer.addresses.length + 1}`,
      label: payload.label || 'New Address',
      isDefault: Boolean(payload.isDefault),
      street: payload.street || '',
      area: payload.area || '',
      county: payload.county || '',
      country: payload.country || 'Kenya',
      phoneNumber: payload.phoneNumber || mockData.auth.user.phoneNumber,
    };
    mockData.customer.addresses = [...mockData.customer.addresses, nextAddress];
    return clone(nextAddress) as T;
  }

  if (method === 'PATCH' && url.startsWith('/customer/addresses/')) {
    const addressId = getIdFromUrl(url);
    const payload = config.data as Partial<AddressItem>;
    mockData.customer.addresses = mockData.customer.addresses.map((address) =>
      address.id === addressId ? { ...address, ...payload } : address
    );
    return clone(mockData.customer.addresses.find((address) => address.id === addressId)) as T;
  }

  if (method === 'DELETE' && url.startsWith('/customer/addresses/')) {
    const addressId = getIdFromUrl(url);
    mockData.customer.addresses = mockData.customer.addresses.filter((address) => address.id !== addressId);
    return clone({ message: 'Address deleted' }) as T;
  }

  if (method === 'GET' && url === '/customer/payments/wallet') {
    return clone(mockData.customer.wallet) as T;
  }

  if (method === 'GET' && url === '/customer/payments/methods') {
    return clone(mockData.customer.paymentMethods) as T;
  }

  if (method === 'PATCH' && url.startsWith('/customer/payments/methods/')) {
    const methodId = getIdFromUrl(url);
    const payload = config.data as Partial<PaymentMethodItem>;
    mockData.customer.paymentMethods = mockData.customer.paymentMethods.map((paymentMethod) =>
      paymentMethod.id === methodId ? { ...paymentMethod, ...payload } : paymentMethod
    );
    return clone(mockData.customer.paymentMethods.find((paymentMethod) => paymentMethod.id === methodId)) as T;
  }

  if (method === 'GET' && url === '/customer/orders') {
    return clone({ results: mockData.customer.home.pastOrders, count: mockData.customer.home.pastOrders.length }) as T;
  }

  if (method === 'GET' && url === '/customer/orders/latest') {
    return clone(mockData.customer.home.latestOrder) as T;
  }

  if (method === 'GET' && url === '/customer/login-activity') {
    return clone(mockData.customer.loginSessions) as T;
  }

  if (method === 'GET' && url === '/customer/notifications') {
    return clone({ results: mockData.customer.notifications, count: mockData.customer.notifications.length }) as T;
  }

  if (method === 'PATCH' && url.startsWith('/customer/notifications/')) {
    const notificationId = getIdFromUrl(url);
    mockData.customer.notifications = mockData.customer.notifications.map((notification) =>
      notification.id === notificationId ? { ...notification, isRead: true } : notification
    );
    return clone(mockData.customer.notifications.find((notification) => notification.id === notificationId)) as T;
  }

  if (method === 'POST' && url === '/customer/notifications/read-all') {
    mockData.customer.notifications = mockData.customer.notifications.map((notification) => ({
      ...notification,
      isRead: true,
    }));
    return clone({ message: 'All notifications marked as read' }) as T;
  }

  if (method === 'GET' && url === '/customer/notification-preferences') {
    return clone(mockData.customer.notificationPreferences) as T;
  }

  if (method === 'PATCH' && url === '/customer/notification-preferences') {
    mockData.customer.notificationPreferences = {
      ...mockData.customer.notificationPreferences,
      ...(config.data as Partial<typeof mockData.customer.notificationPreferences>),
    };
    return clone(mockData.customer.notificationPreferences) as T;
  }

  if (method === 'GET' && url === '/customer/app-preferences') {
    return clone(mockData.customer.appPreferences) as T;
  }

  if (method === 'PATCH' && url === '/customer/app-preferences') {
    mockData.customer.appPreferences = {
      ...mockData.customer.appPreferences,
      ...(config.data as Partial<typeof mockData.customer.appPreferences>),
    };
    return clone(mockData.customer.appPreferences) as T;
  }

  if (method === 'GET' && url === '/customer/privacy-security') {
    return clone(mockData.customer.privacySecurity) as T;
  }

  if (method === 'GET' && url === '/customer/account-settings') {
    return clone(mockData.customer.accountSettings) as T;
  }

  if (method === 'GET' && url === '/customer/personal-information') {
    return clone(mockData.customer.personalInformation) as T;
  }

  if (method === 'PATCH' && url === '/customer/personal-information') {
    mockData.customer.personalInformation = {
      ...mockData.customer.personalInformation,
      ...(config.data as Partial<typeof mockData.customer.personalInformation>),
    };
    return clone(mockData.customer.personalInformation) as T;
  }

  if (method === 'GET' && url === '/customer/help/topics') {
    return clone(mockData.customer.supportTopics) as T;
  }

  if (method === 'GET' && url === '/customer/help/options') {
    return clone(mockData.customer.supportOptions) as T;
  }

  if (method === 'POST' && url === '/customer/help/tickets') {
    return clone({
      message: 'Support ticket submitted',
      ticketId: `ticket_${Date.now()}`,
    }) as T;
  }

  if (method === 'GET' && url === '/customer/store') {
    return clone(mockData.customer.vendorStore) as T;
  }

  if (method === 'GET' && url === '/customer/store/items') {
    return clone(mockData.customer.vendorStore.menuItems) as T;
  }

  // Get or set the customer's selected location
  if (method === 'GET' && url === '/customer/location') {
    return clone(mockData.customer.selectedLocation) as T;
  }

  if (method === 'POST' && url === '/customer/location') {
    const payload = config.data as Record<string, unknown> | null;
    if (payload) {
      mockData.customer.selectedLocation = {
        ...mockData.customer.selectedLocation,
        ...(payload as any),
      };
      return clone(mockData.customer.selectedLocation) as T;
    }
    return clone(mockData.customer.selectedLocation) as T;
  }

  if (method === 'POST' && url === '/customer/cart/add') {
    return clone({ message: 'Item added to cart' }) as T;
  }

  if (method === 'PATCH' && url === '/customer/cart') {
    return clone({ message: 'Cart updated' }) as T;
  }

  if (method === 'DELETE' && url === '/customer/cart') {
    return clone({ message: 'Cart cleared' }) as T;
  }

  if (method === 'POST' && url === '/products') {
    return clone({
      message: 'Product created successfully',
      productID: `product_${Date.now()}`,
    }) as T;
  }

  throw new Error(`No mock handler registered for ${method} ${config.url}`);
};

export const mockApiHelpers = {
  buildSections: (): AccountSectionItem[] => mockData.customer.accountSettings.sections.flatMap((section) => section.items),
  listSupportOptions: (): SupportOption[] => clone(mockData.customer.supportOptions),
  listMenuItems: (): VendorMenuItem[] => clone(mockData.customer.vendorStore.menuItems),
};
