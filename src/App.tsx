
import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { setupRippleEffects, ToastProvider } from '@stackloop/ui';
import '@stackloop/ui/theme.css';



// Shared Pages
import { WelcomePage } from './pages/shared/WelcomePage';

// Vendor Pages
import { VendorLandingPage } from './pages/vendor/VendorLandingPage';
import { VendorDashboard } from './pages/vendor/VendorDashboard';
import { MarkAsReadyAssignRider } from './pages/vendor/MarkAsReadyAssignRider';
import { VendorOnboarding } from './pages/vendor/VendorOnboarding';
import { AddStoreDashboardPage } from './pages/vendor/AddStoreDashboardPage';
import { StoreLocationPicker } from './pages/vendor/StoreLocationPicker';
import { ProductsDashboard } from './pages/vendor/ProductsDashboard';
import { ProductDetailPage } from './pages/vendor/ProductDetailPage';
import { AddProductPage } from './pages/vendor/AddProductPage';
import { ManageCategoriesPage } from './pages/vendor/ManageCategoriesPage';
import { AddCategoryPage } from './pages/vendor/AddCategoryPage';

// Rider Pages
import { RiderLandingPage } from './pages/rider/RiderLandingPage';
import { RiderDashboard } from './pages/rider/RiderDashboard';
import { MarkAsDeliveredPage } from './pages/rider/MarkAsDeliveredPage';
import { MarkAsPickedUpPage } from './pages/rider/MarkAsPickedUpPage';
import { RiderOnboarding } from './pages/rider/RiderOnboarding';

import { useAuth } from './context/AuthContext';
import { LoginPage } from './pages/shared/LoginPage';
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
import { MyLocation } from './pages/customer/MyLocation';
import OrderDetailsPage from './pages/customer/OrderDetailsPage';
import { TrackOrder } from './pages/customer/TrackOrder';
import { Capacitor } from '@capacitor/core';
import { StatusBar, Style } from '@capacitor/status-bar';

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

  return <>{children}</>;
};

export default function App() {
    const location = useLocation();
  const protect = (children: React.ReactNode) => <ProtectedRoute>{children}</ProtectedRoute>;


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
          <Route path="/" element={<WelcomePage />} />

          <Route path="/login" element={<LoginPage />} />
          <Route path="/verify-identity" element={<VerifyIdentityPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/otp" element={<OTPPage />} />
          <Route path="/customer/" element={protect(<CustomerHomePage />)} />
          <Route path="/customer/orders" element={protect(<OrdersPage />)} />
          <Route path="/customer/orders/:orderId" element={protect(<OrderDetailsPage />)} />
          <Route path="/order/:orderId" element={protect(<OrderDetailsPage />)} />
          <Route path="/customer/track-order" element={protect(<TrackOrder />)} />
          <Route path="/customer/my-location" element={protect(<MyLocation />)} />
          <Route path="/customer/location" element={<MyLocation />} />
          <Route path="/customer/profile" element={protect(<AccountSettings />)} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/vendor-store" element={<VendorStorePage />} />
          <Route path="/customer/vendor/:name" element={<VendorStorePage />} />

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


          <Route path="/vendor-landing" element={<VendorLandingPage />} />
          <Route path="/vendor/onboarding" element={<VendorOnboarding />} />
          <Route path="/vendor/products/add-store" element={<AddStoreDashboardPage />} />
          <Route path="/vendor/location-picker" element={<StoreLocationPicker />} />
          <Route path='/vendor/dashboard' element={<VendorDashboard />} />
          <Route path='/vendor/mark-as-ready-assign-rider' element={<MarkAsReadyAssignRider />} />
          <Route path='/vendor/orders' element={<VendorDashboard />} />
          <Route path='/vendor/products' element={<ProductsDashboard />} />
          <Route path='/vendor/categories' element={<ManageCategoriesPage />} />
          <Route path='/vendor/add-category' element={<AddCategoryPage />} />
          <Route path='/vendor/product/:id' element={<ProductDetailPage />} />
          <Route path='/vendor/add-product' element={<AddProductPage />} />
          <Route path='/vendor' element={<Navigate to="/vendor/dashboard" replace />} />
          <Route path='/vendor/' element={<Navigate to="/vendor/dashboard" replace />} />
          <Route path='/vendor/profile' element={<VendorDashboard />} />


          <Route path="/rider-landing" element={<RiderLandingPage />} />
          <Route path="/rider/onboarding" element={<RiderOnboarding />} />
          <Route path="/rider/dashboard" element={<RiderDashboard />} />
          <Route path="/rider/mark-as-delivered" element={<MarkAsDeliveredPage />} />
          <Route path="/rider/mark-as-picked-up" element={<MarkAsPickedUpPage />} />
          <Route path="/rider/orders" element={<RiderDashboard />} />
          <Route path="/rider/earnings" element={<RiderDashboard />} />
          <Route path="/rider/profile" element={<RiderDashboard />} />

         
         
          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    </ToastProvider>
  );
}
