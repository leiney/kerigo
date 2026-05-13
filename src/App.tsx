
import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { setupRippleEffects, ToastProvider } from '@stackloop/ui';
import '@stackloop/ui/theme.css';



// Shared Pages
import { WelcomePage } from './pages/shared/WelcomePage';


// Vendor Pages
import { VendorLandingPage } from './pages/vendor/VendorLandingPage';
// Rider Pages
import { RiderLandingPage } from './pages/rider/RiderLandingPage';
import { RiderTypeSelection } from './pages/rider/RiderTypeSelection';
import { BasicDetails as RiderBasicDetails } from './pages/rider/BasicDetails';
import { OrganisationDetails } from './pages/rider/OrganisationDetails';
import { KYCDocuments as RiderKYCDocuments } from './pages/rider/KYCDocuments';
import { CompanyKYCDocuments as RiderCompanyKYCDocuments } from './pages/rider/CompanyKYCDocuments';
import { AddRiders } from './pages/rider/AddRiders';
import { AdministratorDetails } from './pages/rider/AdministratorDetails';
import { BankDetails as RiderBankDetails } from './pages/rider/BankDetails';
import { MPesaDetails as RiderMPesaDetails } from './pages/rider/MPesaDetails';
import { PayoutDetails } from './pages/rider/PayoutDetails';
import { CreatePassword as RiderCreatePassword } from './pages/rider/CreatePassword';
import { ReviewAndConfirm, ReviewAndConfirm as RiderReviewAndConfirm } from './pages/rider/ReviewAndConfirm';
import { SuccessPage as RiderSuccessPage, SuccessPage } from './pages/rider/SuccessPage';
import { VehicleInformation } from './pages/rider/VehicleInformation';
import { VehicleInformation3A } from './pages/rider/VehicleInformation3A';



import { useAuthStore } from './store/authStore';
import { ChooseAccountType } from './pages/vendor/AccountType';
import { BasicDetails } from './pages/vendor/BasicDetails';
import { CompanyDetails } from './pages/vendor/CompanyDetails';
import { KYCDocuments } from './pages/vendor/KYCDocuments';
import { CompanyKYCDocuments } from './pages/vendor/CompanyKYCDocuments';
import { AddYourStores } from './pages/vendor/AddYourStores';
import { ManageMultipleStores } from './pages/vendor/ManageMultipleStores';
import { StoreDetails } from './pages/vendor/StoreDetails';
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
import { Capacitor } from '@capacitor/core';
import { StatusBar, Style } from '@capacitor/status-bar';

const ProtectedRoute = ({ children, allowedRoles }: { children: React.ReactNode, allowedRoles?: string[] }) => {
  const { isLoggedIn, currentRole } = useAuthStore();
  const location = useLocation();

  if (!isLoggedIn) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && currentRole && !allowedRoles.includes(currentRole)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};

export default function App() {
    const location = useLocation();


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

          <Route path="/vendor-landing" element={<VendorLandingPage />} />
          <Route path="/vendor/onboarding" element={<Navigate to="/vendor/choose-account" replace />} />
          <Route path="/vendor/choose-account" element={<ChooseAccountType />} />
          <Route path="/vendor/basic-details" element={<BasicDetails />} />
          <Route path="/vendor/company-details" element={<CompanyDetails />} />
          <Route path="/vendor/kyc-documents" element={<KYCDocuments />} />
          <Route path="/vendor/company-kyc-documents" element={<CompanyKYCDocuments />} />
          <Route path="/vendor/add-store" element={<Navigate to="/vendor/add-your-stores" replace />} />
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
          <Route path='/vendor/dashboard' element={<Navigate to="/vendor-landing" replace />} />



          <Route path="/rider-landing" element={<RiderLandingPage />} />
          <Route path="/rider/onboarding" element={<RiderTypeSelection />} />
          <Route path="/rider/dashboard" element={<Navigate to="/rider-landing" replace />} />
          <Route path="/individual/basic-details" element={<RiderBasicDetails />} />
          <Route path="/individual/vehicle-information" element={<VehicleInformation />} />
          <Route path="/individual/payout-details" element={<PayoutDetails />} />
          <Route path="/individual/bank-details" element={<RiderBankDetails />} />
          <Route path="/individual/mpesa-details" element={<RiderMPesaDetails />} />
          <Route path="/individual/kyc-documents" element={<RiderKYCDocuments />} />
          <Route path="/individual/create-password" element={<RiderCreatePassword />} />
          <Route path="/company/organisation-details" element={<OrganisationDetails />} />
          <Route path="/company/administrator-details" element={<AdministratorDetails />} />
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
