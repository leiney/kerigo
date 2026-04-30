
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { setupRippleEffects, ToastProvider } from '@stackloop/ui';
import '@stackloop/ui/theme.css';

// Layout components
import { MainLayout } from './components/layout/MainLayout';

// Shared Pages
import { WelcomePage } from './pages/shared/WelcomePage';
import { LoginPage } from './pages/shared/LoginPage';
import { RegisterPage } from './pages/shared/RegisterPage';
import { OTPPage } from './pages/shared/OTPPage';
import { RoleSelectionPage } from './pages/shared/RoleSelectionPage';

import { CustomerHome } from './pages/customer/CustomerHome';
import { VendorDetails } from './pages/customer/VendorDetails';
import { CartPage } from './pages/customer/CartPage';
import { CheckoutPage } from './pages/customer/CheckoutPage';

// Vendor Pages
import { VendorOnboarding } from './pages/vendor/VendorOnboarding';
import { VendorDashboard } from './pages/vendor/VendorDashboard';

// Rider Pages
import { RiderOnboarding } from './pages/rider/RiderOnboarding';
import { RiderDashboard } from './pages/rider/RiderDashboard';

import { useAuthStore } from './store/authStore';

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
  useEffect(() => {
    setupRippleEffects();
  }, []);

  return (
    <ToastProvider position="bottom-center">
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<WelcomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/otp" element={<OTPPage />} />

          {/* Protected Role Selection */}
          <Route path="/role-selection" element={
            <ProtectedRoute>
              <RoleSelectionPage />
            </ProtectedRoute>
          } />

          {/* Customer Routes */}
          <Route path="/customer/*" element={
            <ProtectedRoute allowedRoles={['customer']}>
              <MainLayout>
                <Routes>
                  <Route path="/" element={<CustomerHome />} />
                  <Route path="/vendor/:id" element={<VendorDetails />} />
                  <Route path="/cart" element={<CartPage />} />
                  <Route path="/checkout" element={<CheckoutPage />} />
                </Routes>
              </MainLayout>
            </ProtectedRoute>
          } />

          {/* Vendor Routes */}
          <Route path="/vendor/*" element={
            <ProtectedRoute allowedRoles={['vendor']}>
              <Routes>
                <Route path="/onboarding" element={<VendorOnboarding />} />
                <Route path="/dashboard" element={
                  <MainLayout>
                    <VendorDashboard />
                  </MainLayout>
                } />
              </Routes>
            </ProtectedRoute>
          } />

          {/* Rider Routes */}
          <Route path="/rider/*" element={
            <ProtectedRoute allowedRoles={['rider']}>
              <Routes>
                <Route path="/onboarding" element={<RiderOnboarding />} />
                <Route path="/dashboard" element={
                  <MainLayout>
                    <RiderDashboard />
                  </MainLayout>
                } />
              </Routes>
            </ProtectedRoute>
          } />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </ToastProvider>
  );
}
