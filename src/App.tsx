
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
// Rider Pages
import { RiderLandingPage } from './pages/rider/RiderLandingPage';
import { RiderDashboard } from './pages/rider/RiderDashboard';
import { MarkAsDeliveredPage } from './pages/rider/MarkAsDeliveredPage';
import { MarkAsPickedUpPage } from './pages/rider/MarkAsPickedUpPage';
import { RiderTypeSelection } from './pages/rider/RiderTypeSelection';
import { BasicDetails as RiderBasicDetails } from './pages/rider/BasicDetails';
import { OrganisationDetails } from './pages/rider/OrganisationDetails';
import { KYCDocuments as RiderKYCDocuments } from './pages/rider/KYCDocuments';
import { CompanyKYCDocuments as RiderCompanyKYCDocuments } from './pages/rider/CompanyKYCDocuments';
import { AddRiders } from './pages/rider/AddRiders';
import { AdministratorDetails as RiderAdministratorDetails } from './pages/rider/AdministratorDetails';
import { BankDetails as RiderBankDetails } from './pages/rider/BankDetails';
import { MPesaDetails as RiderMPesaDetails } from './pages/rider/MPesaDetails';
import { PayoutDetails } from './pages/rider/PayoutDetails';
import { CreatePassword as RiderCreatePassword } from './pages/rider/CreatePassword';
import { ReviewAndConfirm, ReviewAndConfirm as RiderReviewAndConfirm } from './pages/rider/ReviewAndConfirm';
import { SuccessPage as RiderSuccessPage, SuccessPage } from './pages/rider/SuccessPage';
import { VehicleInformation } from './pages/rider/VehicleInformation';
import { VehicleInformation3A } from './pages/rider/VehicleInformation3A';


import { useAuth } from './context/AuthContext';
import { ChooseAccountType } from './pages/vendor/AccountType';
import { BasicDetails } from './pages/vendor/BasicDetails';
import { CompanyDetails } from './pages/vendor/CompanyDetails';
import { AdministratorDetails as VendorAdministratorDetails } from './pages/vendor/AdministratorDetails';
import { KYCDocuments } from './pages/vendor/KYCDocuments';
import { CompanyKYCDocuments } from './pages/vendor/CompanyKYCDocuments';
import { AddYourStores } from './pages/vendor/AddYourStores';
import { AddStorePage } from './pages/vendor/AddStorePage';
import { AddStoreDashboardPage } from './pages/vendor/AddStoreDashboardPage';
import { ManageMultipleStores } from './pages/vendor/ManageMultipleStores';
import { StoreDetails } from './pages/vendor/StoreDetails';
import { StoreLocationPicker } from './pages/vendor/StoreLocationPicker';
import { ProductsDashboard } from './pages/vendor/ProductsDashboard';
import { ProductDetailPage } from './pages/vendor/ProductDetailPage';
import { AddProductPage } from './pages/vendor/AddProductPage';
import { PayoutMethod } from './pages/vendor/PayoutMethod';
import { BankDetails } from './pages/vendor/BankDetails';
import { MPesaDetails } from './pages/vendor/MPesaDetails';
import { CreatePassword } from './pages/vendor/CreatePassword';
import { ReviewConfirm } from './pages/vendor/ReviewConfirm';
import { SetupComplete } from './pages/vendor/SetupComplete';
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
          <Route path="/vendor/onboarding" element={<Navigate to="/vendor/choose-account" replace />} />
          <Route path="/vendor/choose-account" element={<ChooseAccountType />} />
          <Route path="/vendor/basic-details" element={<BasicDetails />} />
          <Route path="/vendor/company-details" element={<CompanyDetails />} />
          <Route path="/vendor/administrator-details" element={<VendorAdministratorDetails />} />
          <Route path="/vendor/kyc-documents" element={<KYCDocuments />} />
          <Route path="/vendor/company-kyc-documents" element={<CompanyKYCDocuments />} />
          <Route path="/vendor/add-store" element={<AddStorePage />} />
          <Route path="/vendor/products/add-store" element={<AddStoreDashboardPage />} />
          <Route path="/vendor/location-picker" element={<StoreLocationPicker />} />
          <Route path="/vendor/add-your-stores" element={<AddYourStores />} />
          <Route path='/vendor/manage-multiple-stores' element={<ManageMultipleStores />} />
          <Route path="/vendor/store-details" element={<StoreDetails />} />
          <Route path='/vendor/payment-method' element={<Navigate to="/vendor/payout-method" replace />} />
          <Route path='/vendor/payout-method' element={<PayoutMethod />} />
          <Route path='/vendor/bank-details' element={<BankDetails />} />
          <Route path='/vendor/mpesa-details' element={<MPesaDetails />} />
          <Route path='/vendor/create-password' element={<CreatePassword />} />
          <Route path='/vendor/review-confirmation' element={<ReviewConfirm />} />
          <Route path='/vendor/setup-completed' element={<SetupComplete />} />
          <Route path='/vendor/dashboard' element={<VendorDashboard />} />
          <Route path='/vendor/mark-as-ready-assign-rider' element={<MarkAsReadyAssignRider />} />
          <Route path='/vendor/orders' element={<VendorDashboard />} />
          <Route path='/vendor/products' element={<ProductsDashboard />} />
          <Route path='/vendor/product/:id' element={<ProductDetailPage />} />
          <Route path='/vendor/add-product' element={<AddProductPage />} />
          <Route path='/vendor' element={<Navigate to="/vendor/dashboard" replace />} />
          <Route path='/vendor/' element={<Navigate to="/vendor/dashboard" replace />} />
          <Route path='/vendor/profile' element={<VendorDashboard />} />


          <Route path="/rider-landing" element={<RiderLandingPage />} />
          <Route path="/rider/onboarding" element={<RiderTypeSelection />} />
          <Route path="/rider/dashboard" element={<RiderDashboard />} />
          <Route path="/rider/mark-as-delivered" element={<MarkAsDeliveredPage />} />
          <Route path="/rider/mark-as-picked-up" element={<MarkAsPickedUpPage />} />
          <Route path="/rider/orders" element={<RiderDashboard />} />
          <Route path="/rider/earnings" element={<RiderDashboard />} />
          <Route path="/rider/profile" element={<RiderDashboard />} />
          <Route path="/individual/basic-details" element={<RiderBasicDetails />} />
          <Route path="/individual/vehicle-information" element={<VehicleInformation />} />
          <Route path="/individual/payout-details" element={<PayoutDetails />} />
          <Route path="/individual/bank-details" element={<RiderBankDetails />} />
          <Route path="/individual/mpesa-details" element={<RiderMPesaDetails />} />
          <Route path="/individual/kyc-documents" element={<RiderKYCDocuments />} />
          <Route path="/individual/create-password" element={<RiderCreatePassword />} />
          <Route path="/company/organisation-details" element={<OrganisationDetails />} />
          <Route path="/company/administrator-details" element={<RiderAdministratorDetails />} />
          <Route path="/company/add-riders" element={<AddRiders />} />
          <Route path="/company/vehicle-information" element={<VehicleInformation3A />} />
          <Route path="/company/payout-details" element={<PayoutDetails />} />
          <Route path="/company/bank-details" element={<RiderBankDetails />} />
          <Route path="/company/mpesa-details" element={<RiderMPesaDetails />} />
          <Route path="/company/kyc-documents" element={<RiderCompanyKYCDocuments />} />
          <Route path="/company/create-password" element={<RiderCreatePassword />} />
          <Route path="/rider/review-confirmation" element={<ReviewAndConfirm />} />
          <Route path="/rider/success" element={<SuccessPage />} />

         
         
          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    </ToastProvider>
  );
}
