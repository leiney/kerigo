
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { setupRippleEffects, ToastProvider } from '@stackloop/ui';
import '@stackloop/ui/theme.css';



// Shared Pages
import { WelcomePage } from './pages/shared/WelcomePage';
import { LoginPage } from './pages/shared/LoginPage';
import { RegisterPage } from './pages/shared/RegisterPage';
import { OTPPage } from './pages/shared/OTPPage';


// Vendor Pages
import { VendorLandingPage } from './pages/vendor/VendorLandingPage';


// Rider Pages
import { RiderLandingPage } from './pages/rider/RiderLandingPage';


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
          <Route path="/" element={<WelcomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/otp" element={<OTPPage />} />
          <Route path="/vendor-landing" element={<VendorLandingPage />} />
          <Route path="/rider-landing" element={<RiderLandingPage />} />
         
          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </ToastProvider>
  );
}
