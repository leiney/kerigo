import type {
  AccountSettingsData,
  AppPreferenceValues,
  AuthUser,
  CustomerHomeData,
  CustomerOrdersPageData,
  OrderDetailData,
  NotificationPreferences,
  NotificationItem,
  OrderHistoryItem,
  OrderSummary,
  PaymentMethodItem,
  SharedWelcomeData,
  SupportOption,
  SupportTopic,
  VendorStoreData,
  VerificationMethod,
} from './types';


export const sharedMockData = {
  welcome: {
    vendors: [
      { id: 'vendor-kfc', slug: 'kfc', name: 'KFC', category: 'Fast Food', time: '25-30 min', logoUrl: '/kfc.png' },
      { id: 'vendor-chicken-inn', slug: 'chicken-inn', name: 'Chicken Inn', category: 'Fast Food', time: '25-30 min', logoUrl: '/chicken-in.jpg' },
      { id: 'vendor-pizza-inn', slug: 'pizza-inn', name: 'Pizza Inn', category: 'Pizza', time: '30-35 min', logoUrl: '/pizzain.png' },
      { id: 'vendor-java-house', slug: 'java-house', name: 'Java House', category: 'Cafe', time: '20-25 min', logoUrl: '/JavaHouse.webp' },
      { id: 'vendor-carrefour', slug: 'carrefour', name: 'Carrefour', category: 'Groceries', time: '30-40 min', logoUrl: '/carrefour.webp' },
      { id: 'vendor-naivas', slug: 'naivas', name: 'Naivas', category: 'Groceries', time: '30-40 min', logoUrl: '/naivas.png' },
      { id: 'vendor-goodlife-pharmacy', slug: 'goodlife-pharmacy', name: 'Goodlife Pharmacy', category: 'Pharmacy', time: '20-30 min', logoUrl: '/goodlife.png' },
      { id: 'vendor-healthplus-pharmacy', slug: 'healthplus-pharmacy', name: 'HealthPlus Pharmacy', category: 'Pharmacy', time: '20-30 min', logoUrl: '/healthplus.png' },
      { id: 'vendor-medplus-pharmacy', slug: 'medplus-pharmacy', name: 'MedPlus Pharmacy', category: 'Pharmacy', time: '20-30 min', logoUrl: '/medplus.jpeg' },
      { id: 'vendor-the-butchery', slug: 'the-butchery', name: 'The Butchery', category: 'Butchery', time: '25-35 min', logoUrl: '/thebutchery.png' },
    ],
  } satisfies SharedWelcomeData,

  verificationMethods: [
    { id: 'sms', title: 'SMS', description: 'Receive a code on your phone', highlighted: true },
    { id: 'email', title: 'Email', description: 'Receive a code via email', highlighted: false },
    { id: 'authenticator', title: 'Authenticator App', description: 'Scan the QR code or enter the key manually', highlighted: false },
  ] satisfies VerificationMethod[],
};

const baseUser: AuthUser = {
  id: 'user_1',
  fullName: 'Sarah Wanjiku',
  email: 'sarah.wanjiku@email.com',
  phoneNumber: '+254 700 123 456',
  roles: ['customer'],
  avatarUrl: '/placeholder-avatar.webp',
  isVerified: true,
};

const latestOrder: OrderSummary = {
  id: 'KR1024',
  reference: 'KR1024',
  date: 'Today, 10:30 AM',
  itemCount: 2,
  total: 1240,
  status: 'On the way',
  paymentMethod: 'M-Pesa',
  address: 'Westlands, Nairobi',
  addressNote: 'Near Sarit Centre',
  eta: '~20 mins',
  estimatedDelivery: '20 min',
  deliveryTime: '(7:50 PM)',
  statusDescription: 'Your order is on the way',
  items: 'Burger Combo, Coke 500ml',
  store: {
    name: 'FreshMart Grocery',
    description: 'Preparing your order',
    lat: -1.2669,
    lng: 36.8069,
  },
  rider: {
    name: 'John Mwangi',
    role: 'Your Rider',
    rating: '4.8',
    reviews: '230',
    lat: -1.2725,
    lng: 36.8152,
    avatarUrl: '/rider.png',
  },
  deliveryLocation: {
    label: 'Home',
    description: 'Kenyatta Avenue, Nairobi, Kenya',
    lat: -1.2920656,
    lng: 36.8219467,
  },
  steps: [
    { label: 'Confirmed', time: '10:30 AM', completed: true, active: false },
    { label: 'Preparing', time: '10:35 AM', completed: true, active: false },
    { label: 'On the way', time: '10:40 AM', completed: false, active: true },
    { label: 'Delivered', time: '', completed: false, active: false },
  ],
};

const pastOrders: OrderHistoryItem[] = [
  { id: '#KR1010', items: 'Bananas', date: 'Yesterday', price: 980, status: 'Delivered', imageUrl: '/banana.jpeg', avatarUrl: '/placeholder-avatar.webp' },
  { id: '#KR0985', items: 'Milk 500ml', date: 'Last Week', price: 1450, status: 'Delivered', imageUrl: '/milk.jpeg', avatarUrl: '/placeholder-avatar.webp' },
  { id: '#KR0954', items: 'Tomatoes', date: '2 Weeks Ago', price: 670, status: 'Cancelled', imageUrl: '/tomatoes.jpeg', avatarUrl: '/placeholder-avatar.webp' },
];

const orderDetailsById: Record<string, OrderDetailData> = {
  KR1024: {
    id: 'KR1024',
    reference: 'KR1024',
    storeName: 'FreshMart Grocery',
    storeCategory: 'Groceries',
    status: 'Preparing',
    estimatedDelivery: '20 min',
    deliveryTime: '(7:50 PM)',
    address: 'Westlands, Nairobi, Kenya',
    addressNote: 'Near Westgate Mall, House No. 12',
    rider: {
      name: 'John Mwangi',
      role: 'Your Rider',
      rating: '4.8',
      reviews: '230',
      avatarUrl: '/rider.png',
    },
    items: [
      { id: 'item_1', name: 'Burger Combo', description: 'Burger, Fries, Coke 500ml', quantity: 1, price: 450, imageUrl: '/burgers.jpeg' },
      { id: 'item_2', name: 'Coke 500ml', description: 'Chilled soft drink', quantity: 1, price: 70, imageUrl: '/drinks.jpeg' },
      { id: 'item_3', name: 'Snack Pack', description: 'Crispy snack sides', quantity: 1, price: 150, imageUrl: '/snacks.jpeg' },
    ],
    summary: {
      subtotal: 670,
      deliveryFee: 100,
      platformFee: 30,
      total: 800,
    },
    paymentMethod: 'M-PESA •••• 1234',
    placedAt: 'May 24, 2024 at 7:20 PM',
  },
  '#KR1010': {
    id: '#KR1010',
    reference: '#KR1010',
    storeName: 'FreshMart Grocery',
    storeCategory: 'Groceries',
    status: 'Delivered',
    estimatedDelivery: 'Delivered',
    deliveryTime: '(Yesterday)',
    address: 'Westlands, Nairobi, Kenya',
    addressNote: 'Near Westgate Mall, House No. 12',
    rider: {
      name: 'John Mwangi',
      role: 'Your Rider',
      rating: '4.8',
      reviews: '230',
      avatarUrl: '/rider.png',
    },
    items: [
      { id: 'item_1', name: 'Bananas', description: 'Fresh bananas', quantity: 1, price: 980, imageUrl: '/banana.jpeg' },
    ],
    summary: {
      subtotal: 880,
      deliveryFee: 70,
      platformFee: 30,
      total: 980,
    },
    paymentMethod: 'M-PESA •••• 1234',
    placedAt: 'Yesterday at 3:15 PM',
  },
  '#KR0985': {
    id: '#KR0985',
    reference: '#KR0985',
    storeName: 'FreshMart Grocery',
    storeCategory: 'Groceries',
    status: 'Delivered',
    estimatedDelivery: 'Delivered',
    deliveryTime: '(Last Week)',
    address: 'Westlands, Nairobi, Kenya',
    addressNote: 'Near Westgate Mall, House No. 12',
    rider: {
      name: 'John Mwangi',
      role: 'Your Rider',
      rating: '4.8',
      reviews: '230',
      avatarUrl: '/rider.png',
    },
    items: [
      { id: 'item_1', name: 'Milk 500ml', description: 'Fresh milk bottle', quantity: 1, price: 1450, imageUrl: '/milk.jpeg' },
    ],
    summary: {
      subtotal: 1350,
      deliveryFee: 70,
      platformFee: 30,
      total: 1450,
    },
    paymentMethod: 'M-PESA •••• 1234',
    placedAt: 'Last Week at 11:40 AM',
  },
  '#KR0954': {
    id: '#KR0954',
    reference: '#KR0954',
    storeName: 'FreshMart Grocery',
    storeCategory: 'Groceries',
    status: 'Cancelled',
    estimatedDelivery: 'Cancelled',
    deliveryTime: '(2 Weeks Ago)',
    address: 'Westlands, Nairobi, Kenya',
    addressNote: 'Near Westgate Mall, House No. 12',
    rider: {
      name: 'John Mwangi',
      role: 'Your Rider',
      rating: '4.8',
      reviews: '230',
      avatarUrl: '/rider.png',
    },
    items: [
      { id: 'item_1', name: 'Tomatoes', description: 'Fresh tomatoes', quantity: 1, price: 670, imageUrl: '/tomatoes.jpeg' },
    ],
    summary: {
      subtotal: 600,
      deliveryFee: 40,
      platformFee: 30,
      total: 670,
    },
    paymentMethod: 'M-PESA •••• 1234',
    placedAt: '2 Weeks Ago at 9:10 AM',
  },
};

const ordersPage: CustomerOrdersPageData = {
  tabs: {
    current: 2,
    completed: 8,
    cancelled: 2,
  },
  banner: {
    title: 'You have 2 active orders',
    subtitle: 'Track and manage your ongoing deliveries',
  },
  currentOrders: [
    {
      id: 'FM123456',
      reference: '#FM123456',
      storeName: 'FreshMart Grocery',
      storeImageUrl: '/store.png',
      itemCount: 3,
      total: 800,
      status: 'On the way',
      statusTone: 'success',
      eta: '20 min',
      riderName: 'John Mwangi',
      riderRole: 'Your Rider',
      riderAvatarUrl: '/rider.png',
    },
    {
      id: 'FM123457',
      reference: '#FM123457',
      storeName: 'QuickMart Supermarket',
      storeImageUrl: '/store.png',
      itemCount: 5,
      total: 1250,
      status: 'Preparing',
      statusTone: 'warning',
      eta: '35 min',
      riderName: 'John Mwangi',
      riderRole: 'Your Rider',
      riderAvatarUrl: '/rider.png',
    },
  ],
  completedOrders: [
    {
      id: '#KR1010',
      reference: '#KR1010',
      storeName: 'FreshMart Grocery',
      storeImageUrl: '/banana.jpeg',
      itemCount: 1,
      total: 980,
      status: 'Delivered',
      statusTone: 'neutral',
      eta: 'Delivered',
      riderName: 'John Mwangi',
      riderRole: 'Your Rider',
      riderAvatarUrl: '/rider.png',
    },
  ],
  cancelledOrders: [
    {
      id: '#KR0954',
      reference: '#KR0954',
      storeName: 'FreshMart Grocery',
      storeImageUrl: '/tomatoes.jpeg',
      itemCount: 1,
      total: 670,
      status: 'Cancelled',
      statusTone: 'error',
      eta: 'Cancelled',
      riderName: 'John Mwangi',
      riderRole: 'Your Rider',
      riderAvatarUrl: '/rider.png',
    },
  ],
};

const recommendations = [
  { id: 1, name: 'Avocado', price: 250, unit: '/ kg', imageUrl: '/avocado.jpeg' },
  { id: 2, name: 'Tomatoes', price: 160, unit: '/ kg', imageUrl: '/tomatoes.jpeg' },
  { id: 3, name: 'Milk 500ml', price: 120, unit: '', imageUrl: '/milk.jpeg' },
];

const vendorStore: VendorStoreData = {
  vendor: {
    id: 'vendor-kfc',
    name: 'KFC',
    category: 'Fast Food',
    time: '25-30 min',
    isOpen: true,
    rating: 4.6,
    reviews: '1.2K+',
    logoUrl: '/kfc.png',
  },
  categories: [
    { name: 'Buckets', imageUrl: '/buckets.jpeg' },
    { name: 'Burgers', imageUrl: '/burgers.jpeg' },
    { name: 'Box Meals', imageUrl: '/box-meals.jpeg' },
    { name: 'Snacks', imageUrl: '/snacks.jpeg' },
    { name: 'Drinks', imageUrl: '/drinks.jpeg' },
  ],
  menuItems: [
    { id: 1, name: 'Streetwise 2', description: '2 pcs of chicken, regular chips and a dinner roll.', price: 550, imageUrl: '/Streetwise 2.jpeg', category: 'Buckets' },
    { id: 2, name: 'Zinger Burger', description: 'Spicy Zinger fillet with lettuce and mayo.', price: 450, imageUrl: '/Zinger Burger.jpeg', category: 'Burgers' },
    { id: 3, name: 'Streetwise 3', description: '3 pcs of chicken, large chips and a roll.', price: 750, imageUrl: '/Streetwise 3.jpeg', category: 'Buckets' },
    { id: 4, name: 'Family Feast', description: '8 pcs of chicken, 2 large chips, 4 rolls and 1.5L drink.', price: 2150, imageUrl: '/familty-feast.jpeg', category: 'Buckets' },
  ],
};

const addresses = [
  {
    id: 'address_1',
    label: 'Home',
    isDefault: true,
    street: '123 Riverside Drive',
    area: 'Westlands, Nairobi',
    county: 'Nairobi County, 00100',
    country: 'Kenya',
    phoneNumber: '+254 700 123 456',
  },
  {
    id: 'address_2',
    label: 'Work',
    isDefault: false,
    street: 'Green Towers, 5th Floor',
    area: 'Chiromo Road',
    county: 'Westlands, Nairobi',
    country: 'Kenya',
    phoneNumber: '+254 700 123 456',
  },
  {
    id: 'address_3',
    label: 'Parents Home',
    isDefault: false,
    street: '456 Karen Road',
    area: 'Karen',
    county: 'Nairobi County, 00502',
    country: 'Kenya',
    phoneNumber: '+254 700 123 456',
  },
];

const wallet = {
  name: 'KeriGo Wallet',
  balance: 1250,
};

const paymentMethods: PaymentMethodItem[] = [
  { id: 'method_1', type: 'visa', label: 'Visa', lastFour: '4242', expiry: '12/26', isDefault: true },
  { id: 'method_2', type: 'mastercard', label: 'Mastercard', lastFour: '5555', expiry: '08/27', isDefault: false },
  { id: 'method_3', type: 'mpesa', label: 'M-Pesa', lastFour: '456', expiry: '', isDefault: false, phoneNumber: '+254 700 123' },
];

const loginSessions = [
  { id: 'session_1', location: 'Nairobi, Kenya', device: 'iPhone 14 Pro • iOS 17.4', timestamp: 'Current Session', isActive: true },
  { id: 'session_2', location: 'Nairobi, Kenya', device: 'Chrome on Windows', timestamp: 'May 12, 2024 at 10:30 AM', isActive: false },
  { id: 'session_3', location: 'Mombasa, Kenya', device: 'Android Phone', timestamp: 'May 10, 2024 at 08:15 PM', isActive: false },
  { id: 'session_4', location: 'Nakuru, Kenya', device: 'Safari on Mac', timestamp: 'May 8, 2024 at 06:40 PM', isActive: false },
  { id: 'session_5', location: 'Nairobi, Kenya', device: 'Android Phone', timestamp: 'May 6, 2024 at 09:20 AM', isActive: false },
];

const notificationPreferences: NotificationPreferences = {
  orderConfirmations: true,
  orderShipped: true,
  orderDelivered: true,
  orderCancellations: true,
  dealsDiscounts: true,
  newArrivals: false,
  newsletter: false,
  appUpdates: true,
  reminders: false,
};

const appPreferences: AppPreferenceValues = {
  saveData: true,
  locationServices: true,
  language: 'English',
  currency: 'KES (Kenyan Shilling)',
  theme: 'System Default',
};

const privacySecurity = {
  
  dataPrivacy: 'Standard privacy controls are enabled',
  twoFactorEnabled: false,
};

const supportTopics: SupportTopic[] = [
  { id: 'help_center', title: 'Help Center', subtitle: 'Find answers to common questions' },
  { id: 'contact_support', title: 'Contact Support', subtitle: 'Chat or email us' },
  { id: 'report_issue', title: 'Report an Issue', subtitle: 'Let us know what is not working' },
  { id: 'rate_app', title: 'Rate Our App', subtitle: 'Share your feedback' },
];

const supportOptions: SupportOption[] = [
  { id: 'chat', title: 'Chat with Support', subtitle: 'Fastest response' },
  { id: 'email', title: 'Email Support', subtitle: 'support@kerigo.app' },
  { id: 'phone', title: 'Call Support', subtitle: '+254 700 000 000' },
];

const notifications: NotificationItem[] = [
  { id: 'notification_1', title: 'Order confirmed', message: 'Your order KR1024 has been confirmed and is being prepared.', timestamp: '5 mins ago', isRead: false, type: 'order' },
  { id: 'notification_2', title: 'Wallet topped up', message: 'KES 1,000 was added to your KeriGo Wallet.', timestamp: '2 hours ago', isRead: true, type: 'payment' },
  { id: 'notification_3', title: 'New offer available', message: 'Enjoy free delivery on selected vendors this weekend.', timestamp: 'Yesterday', isRead: false, type: 'promo' },
];

export const mockData = {
  auth: {
    user: baseUser,
    registrationRoles: [
      { code: 'customer', name: 'Customer' },
      { code: 'vendor', name: 'Vendor' },
      { code: 'rider', name: 'Rider' },
    ],
    loginCode: '123456',
    verificationId: 'verification_001',
  },
  shared: sharedMockData,
  customer: {
    home: {
      greetingName: 'Leiney',
      unreadNotifications: 2,
      latestOrder,
      pastOrders,
      recommendations,
    } satisfies CustomerHomeData,
    ordersPage,
    selectedLocation: {
      lat: -1.2920656,
      lng: 36.8219467,
      accuracy: 8,
      address: 'Kenyatta Avenue, Nairobi, Kenya',
      city: 'Nairobi',
      country: 'Kenya',
      postalCode: '00100',
    },
    vendorStore,
    addresses,
    wallet,
    paymentMethods,
    loginSessions,
    notificationPreferences,
    notifications,
    appPreferences,
    privacySecurity,
    supportTopics,
    supportOptions,
    orderDetailsById,
    personalInformation: {
      fullName: 'Sarah Wanjiku',
      phoneNumber: '+254 700 123 456',
      email: 'sarah.wanjiku@email.com',
      dateOfBirth: '1990-03-12',
      gender: 'Female',
    },
    accountSettings: {
      profile: {
        fullName: 'Sarah Wanjiku',
        phoneNumber: '+254 700 123 456',
        avatarUrl: '/placeholder-avatar.webp',
        verified: true,
      },
      sections: [
        {
          id: 'account',
          title: 'Account',
          items: [
            { id: 'personal_information', title: 'Personal Information', subtitle: 'View and edit your personal details', route: '/settings/personal' },
            { id: 'addresses', title: 'Addresses', subtitle: 'Manage your saved addresses', route: '/settings/addresses' },
            { id: 'payments', title: 'Payments & Wallet', subtitle: 'Manage payment methods and wallet', route: '/settings/payments' },
            { id: 'orders', title: 'Orders & Activity', subtitle: 'View your order history and activity', route: '/settings/orders' },
          ],
        },
        {
          id: 'preferences',
          title: 'Preferences',
          items: [
            { id: 'notifications', title: 'Notifications', subtitle: 'Manage your notification preferences', route: '/settings/notifications' },
            { id: 'app_preferences', title: 'App Preferences', subtitle: 'Customize your app experience', route: '/settings/preferences' },
            { id: 'privacy_security', title: 'Privacy & Security', subtitle: 'Manage privacy and security settings', route: '/settings/privacy' },
          ],
        },
        {
          id: 'support',
          title: 'Support',
          items: [
            { id: 'help_support', title: 'Help & Support', subtitle: 'Get help and support', route: '/settings/help' },
            { id: 'about', title: 'About', subtitle: 'App version and legal information', route: '/settings/about' },
          ],
        },
      ],
    } satisfies AccountSettingsData,
  },
};

export type MockData = typeof mockData;
