
import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { setupRippleEffects, ToastProvider } from '@stackloop/ui';
import '@stackloop/ui/theme.css';



// Shared Pages
import { WelcomePage } from './pages/shared/WelcomePage';

// Vendor Pages
import { VendorLandingPage } from './pages/vendor/VendorLandingPage';
import { VendorDashboard } from './pages/vendor/VendorDashboard';
import { VendorOrders } from './pages/vendor/VendorOrders';
import { MarkAsReadyAssignRider } from './pages/vendor/MarkAsReadyAssignRider';
import { VendorOnboarding } from './pages/vendor/VendorOnboarding';
import { AddStoreDashboardPage } from './pages/vendor/AddStoreDashboardPage';
import { StoreLocationPicker } from './pages/vendor/StoreLocationPicker';
import { ProductsDashboard } from './pages/vendor/ProductsDashboard';
import { ProductDetailPage } from './pages/vendor/ProductDetailPage';
import { AddProductPage } from './pages/vendor/AddProductPage';
import { ManageCategoriesPage } from './pages/vendor/ManageCategoriesPage';
import { AddCategoryPage } from './pages/vendor/AddCategoryPage';
import { VendorAccountSettings } from './pages/vendor/settings/VendorAccountSettings';
import { VendorPersonalInformation } from './pages/vendor/settings/VendorPersonalInformation';
import { VendorOrganizationDetails } from './pages/vendor/settings/VendorOrganizationDetails';
import { VendorKYCDocuments } from './pages/vendor/settings/VendorKYCDocuments';
import { VendorPayoutDetails } from './pages/vendor/settings/VendorPayoutDetails';

// Rider Pages
import { RiderLandingPage } from './pages/rider/RiderLandingPage';
import { RiderDashboard } from './pages/rider/RiderDashboard';
import { MarkAsDeliveredPage } from './pages/rider/MarkAsDeliveredPage';
import { MarkAsPickedUpPage } from './pages/rider/MarkAsPickedUpPage';
import { RiderOnboarding } from './pages/rider/RiderOnboarding';
import { RiderAccountSettings } from './pages/rider/settings/RiderAccountSettings';
import { RiderPersonalInformation } from './pages/rider/settings/RiderPersonalInformation';
import { RiderVehicleDetails } from './pages/rider/settings/RiderVehicleDetails';
import { RiderKYCDocuments } from './pages/rider/settings/RiderKYCDocuments';
import { RiderPayoutDetails } from './pages/rider/settings/RiderPayoutDetails';

import { useAuth } from './context/AuthContext';
import { LoginPage } from './pages/shared/LoginPage';
import { PhoneLoginPage } from './pages/shared/PhoneLoginPage';
import { VerifyIdentityPage } from './pages/shared/VerifyIdentityPage';
import { OTPPage } from './pages/shared/OTPPage';
import { RegisterPage } from './pages/customer/RegisterPage';
import { CustomerHomePage } from './pages/customer/CustomerOrderPage';
import { CartPage } from './pages/customer/CartPage';
import { VendorStorePage } from './pages/customer/VendorStorePage';
import { AccountSettings } from './pages/customer/AccountSettings';
import { PersonalInformation } from './pages/customer/PersonalInformation';
import { Addresses } from './pages/customer/Addresses';
import { PaymentsWallet } from './pages/customer/PaymentsWallet';
import { OrdersPage } from './pages/customer/OrdersPage';
import { OrdersActivity } from './pages/customer/OrdersActivity';
import { Notifications } from './pages/customer/Notifications';
import { AppPreferences } from './pages/customer/AppPreferences';
import { PrivacySecurity } from './pages/customer/PrivacySecurity';
import { ChangePassword } from './pages/customer/ChangePassword';
import { LoginActivity } from './pages/customer/LoginActivity';
import { TwoFactorAuth } from './pages/customer/TwoFactorAuth';
import OrderDetailsPage from './pages/customer/OrderDetailsPage';
import { TrackOrder } from './pages/customer/TrackOrder';
import { Capacitor } from '@capacitor/core';
import { StatusBar, Style } from '@capacitor/status-bar';
import { StatusModal } from './components/shared/StatusModal';
import { useErrorStore } from './store/errorStore';

const ProtectedRoute = ({ children, allowedRoles }: { children: React.ReactNode, allowedRoles?: string[] }) => {
  const { isAuthenticated, isInitialized, user } = useAuth();
  const location = useLocation();

  if (!isInitialized) {
    return null;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.userType)) {
    return <Navigate to="/unauthorized" replace />;
  }

  const userAny = user as any;
  const needsLocation = !!user;
  const hasLocation = userAny?.extraData?.location?.latitude || userAny?.location?.latitude || userAny?.locationDetails?.latitude || userAny?.otherInfo?.location?.latitude;

  if (needsLocation && !hasLocation) {
    return <Navigate to="/vendor/location-picker" state={{ returnTo: location.pathname }} replace />;
  }

  return <>{children}</>;
};

const CustomerOnlyRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isInitialized, user } = useAuth();

  if (!isInitialized) {
    return null;
  }

  if (isAuthenticated && user) {
    const userAny = user as any;
    const hasLocation = userAny?.extraData?.location?.latitude || userAny?.location?.latitude || userAny?.locationDetails?.latitude || userAny?.otherInfo?.location?.latitude;
    
    if (!hasLocation) {
      if (user.userType === 'vendor' || user.userType === 'rider' || user.userType === 'rider-admin') {
        return <Navigate to="/vendor/location-picker" replace />;
      }
    } else {
      if (user.userType === 'vendor') {
        return <Navigate to="/vendor/dashboard" replace />;
      }
      if (user.userType === 'rider' || user.userType === 'rider-admin') {
        return <Navigate to="/rider/dashboard" replace />;
      }
    }
  }

  return <>{children}</>;
};

const UnauthorizedPage = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-6 text-center">
      <h1 className="text-2xl font-bold text-error mb-2">Access Denied</h1>
      <p className="text-sm text-foreground/60 mb-6">You do not have permission to view this page.</p>
      <button
        onClick={() => navigate('/')}
        className="bg-primary hover:bg-primary/95 text-white font-bold py-2.5 px-6 rounded-full text-sm shadow-md"
      >
        Go to Home
      </button>
    </div>
  );
};

export default function App() {
  const errorModal = useErrorStore();
  const location = useLocation();
  const protect = (children: React.ReactNode) => <ProtectedRoute allowedRoles={['customer']}>{children}</ProtectedRoute>;
  const protectVendor = (children: React.ReactNode) => <ProtectedRoute allowedRoles={['vendor']}>{children}</ProtectedRoute>;
  const protectRider = (children: React.ReactNode) => <ProtectedRoute allowedRoles={['rider', 'rider-admin']}>{children}</ProtectedRoute>;


   useEffect(() => {
    if (Capacitor.isNativePlatform()) {
      StatusBar.setStyle({ style: Style.Light })
      StatusBar.setBackgroundColor({ color: '#ffffff' })
      StatusBar.setOverlaysWebView({ overlay: false })
    }
  }, [location.pathname])
  
  useEffect(() => {
    setupRippleEffects();
  }, []);

  return (
    <ToastProvider position="bottom-center">
      <Routes>
          <Route path="/" element={<CustomerOnlyRoute><WelcomePage /></CustomerOnlyRoute>} />

          <Route path="/login" element={<CustomerOnlyRoute><LoginPage /></CustomerOnlyRoute>} />
          <Route path="/phone-login" element={<CustomerOnlyRoute><PhoneLoginPage /></CustomerOnlyRoute>} />
          <Route path="/verify-identity" element={<CustomerOnlyRoute><VerifyIdentityPage /></CustomerOnlyRoute>} />
          <Route path="/register" element={<CustomerOnlyRoute><RegisterPage /></CustomerOnlyRoute>} />
          <Route path="/otp" element={<CustomerOnlyRoute><OTPPage /></CustomerOnlyRoute>} />
          <Route path="/customer/" element={protect(<CustomerHomePage />)} />
          <Route path="/customer/orders" element={protect(<OrdersPage />)} />
          <Route path="/customer/orders/:orderId" element={protect(<OrderDetailsPage />)} />
          <Route path="/order/:orderId" element={protect(<OrderDetailsPage />)} />
          <Route path="/customer/track-order" element={protect(<TrackOrder />)} />
          <Route path="/customer/profile" element={protect(<AccountSettings />)} />
          <Route path="/cart" element={<CustomerOnlyRoute><CartPage /></CustomerOnlyRoute>} />
          <Route path="/vendor-store" element={<CustomerOnlyRoute><VendorStorePage /></CustomerOnlyRoute>} />
          <Route path="/customer/vendor/:name" element={<CustomerOnlyRoute><VendorStorePage /></CustomerOnlyRoute>} />

          <Route path="/settings" element={protect(<Navigate to="/customer/profile" replace />)} />
          <Route path="/settings/personal" element={protect(<PersonalInformation />)} />
          <Route path="/settings/addresses" element={protect(<Addresses />)} />
          <Route path="/settings/addresses/add" element={protect(<Addresses />)} />
          <Route path="/settings/payments" element={protect(<PaymentsWallet />)} />
          <Route path="/settings/payments/topup" element={protect(<PaymentsWallet />)} />
          <Route path="/settings/payments/add" element={protect(<PaymentsWallet />)} />
          <Route path="/settings/payments/default" element={protect(<PaymentsWallet />)} />
          <Route path="/settings/payments/autopay" element={protect(<PaymentsWallet />)} />
          <Route path="/settings/orders" element={protect(<OrdersActivity />)} />
          <Route path="/settings/orders/history" element={protect(<OrdersActivity />)} />
          <Route path="/settings/orders/wishlist" element={protect(<OrdersActivity />)} />
          <Route path="/settings/orders/reviews" element={protect(<OrdersActivity />)} />
          <Route path="/settings/orders/coupons" element={protect(<OrdersActivity />)} />
          <Route path="/settings/orders/returns" element={protect(<OrdersActivity />)} />
          <Route path="/settings/orders/recently-viewed" element={protect(<OrdersActivity />)} />
          <Route path="/settings/notifications" element={protect(<Notifications />)} />
          <Route path="/settings/preferences" element={protect(<AppPreferences />)} />
          <Route path="/settings/privacy" element={protect(<PrivacySecurity />)} />
          <Route path="/settings/privacy/change-password" element={protect(<ChangePassword />)} />
          <Route path="/settings/privacy/two-factor" element={protect(<TwoFactorAuth />)} />
          <Route path="/settings/privacy/login-activity" element={protect(<LoginActivity />)} />
          <Route path="/settings/privacy/profile-visibility" element={protect(<PrivacySecurity />)} />
          <Route path="/settings/privacy/blocked-users" element={protect(<PrivacySecurity />)} />
          <Route path="/settings/privacy/data" element={protect(<PrivacySecurity />)} />
          <Route path="/settings/help" element={protect(<AccountSettings />)} />
          <Route path="/settings/about" element={protect(<AccountSettings />)} />


          <Route path="/unauthorized" element={<UnauthorizedPage />} />

          <Route path="/vendor-landing" element={<CustomerOnlyRoute><VendorLandingPage /></CustomerOnlyRoute>} />
          <Route path="/vendor/onboarding" element={<VendorOnboarding />} />
          <Route path="/vendor/products/add-store" element={protectVendor(<AddStoreDashboardPage />)} />

          <Route path="/vendor/location-picker" element={<StoreLocationPicker />} />
          
          <Route path='/vendor/dashboard' element={protectVendor(<VendorDashboard />)} />
          <Route path='/vendor/mark-as-ready-assign-rider' element={protectVendor(<MarkAsReadyAssignRider />)} />
          <Route path='/vendor/orders' element={protectVendor(<VendorOrders />)} />
          <Route path='/vendor/products' element={protectVendor(<ProductsDashboard />)} />
          <Route path='/vendor/categories' element={protectVendor(<ManageCategoriesPage />)} />
          <Route path='/vendor/add-category' element={protectVendor(<AddCategoryPage />)} />
          <Route path='/vendor/product/:id' element={protectVendor(<ProductDetailPage />)} />
          <Route path='/vendor/add-product' element={protectVendor(<AddProductPage />)} />
          <Route path='/vendor' element={<Navigate to="/vendor/dashboard" replace />} />
          <Route path='/vendor/' element={<Navigate to="/vendor/dashboard" replace />} />
          <Route path='/vendor/profile' element={protectVendor(<VendorAccountSettings />)} />
          <Route path='/vendor/settings/personal' element={protectVendor(<VendorPersonalInformation />)} />
          <Route path='/vendor/settings/organization' element={protectVendor(<VendorOrganizationDetails />)} />
          <Route path='/vendor/settings/documents' element={protectVendor(<VendorKYCDocuments />)} />
          <Route path='/vendor/settings/payout' element={protectVendor(<VendorPayoutDetails />)} />


          <Route path="/rider-landing" element={<CustomerOnlyRoute><RiderLandingPage /></CustomerOnlyRoute>} />
          <Route path="/rider/onboarding" element={<RiderOnboarding />} />
          <Route path="/rider/dashboard" element={protectRider(<RiderDashboard />)} />
          <Route path="/rider/mark-as-delivered" element={protectRider(<MarkAsDeliveredPage />)} />
          <Route path="/rider/mark-as-picked-up" element={protectRider(<MarkAsPickedUpPage />)} />
          <Route path="/rider/orders" element={protectRider(<RiderDashboard />)} /> 
          <Route path="/rider/earnings" element={protectRider(<RiderDashboard />)} />
          <Route path="/rider/profile" element={protectRider(<RiderAccountSettings />)} />
          <Route path='/rider/settings/personal' element={protectRider(<RiderPersonalInformation />)} />
          <Route path='/rider/settings/vehicle' element={protectRider(<RiderVehicleDetails />)} />
          <Route path='/rider/settings/documents' element={protectRider(<RiderKYCDocuments />)} />
          <Route path='/rider/settings/payout' element={protectRider(<RiderPayoutDetails />)} />

         
         
          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <StatusModal
          isOpen={errorModal.isOpen}
          onClose={errorModal.hideError}
          type={errorModal.type}
          title={errorModal.title}
          message={errorModal.message}
        />
    </ToastProvider>
  );
}
