import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button, Input } from '@stackloop/ui';
import {
  ArrowRight,
  ShieldCheck,
  Phone,
  Lock,
  Mail,
  Leaf,
  ShoppingBag,
} from 'lucide-react';
import { motion } from 'motion/react';
import { useAuth } from '../../context/AuthContext';
import type { UserProfile, UserRole } from '../../types';
import { authApi } from '../../../lib/api';

export const PhoneLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [formData, setFormData] = useState({
    phone: '',
    password: '',
  });

  const searchParams = new URLSearchParams(location.search);
  const redirectParam = searchParams.get('redirect');
  const from = (location.state as { from?: { pathname?: string } } | null)?.from?.pathname ?? redirectParam ?? undefined;

  const resolveRole = (roleValue: unknown): UserRole => {
    const validRoles: UserRole[] = ['customer', 'vendor', 'rider', 'rider-admin'];

    if (typeof roleValue === 'string' && validRoles.includes(roleValue as UserRole)) {
      return roleValue as UserRole;
    }

    return 'customer';
  };

  const getLandingPath = (role: string) => {
    switch (role) {
      case 'vendor':
        return '/vendor/dashboard';
      case 'rider':
        return '/rider/dashboard';
      case 'rider-admin':
        return '/rider/dashboard';
      case 'vendor-admin':
        return '/vendor/dashboard';
      default:
        return '/customer/';
    }
  };

  const handlePhoneLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsLoading(true);
    setErrorMessage('');

    authApi.phoneLogin(formData.phone, formData.password)
      .then((response) => {
        const userType = resolveRole(response.userType);
        const extraData = (response as any).extraData;
        const lat = extraData?.location?.latitude;

        const user: UserProfile = {
          id: response.id,
          fullName: response.fullName || '',
          email: response.email,
          phoneNo: response.phoneNo || '',
          userType: userType,
          username: response.username || '',
          extraData: extraData,
        };

        login({ token: response?.token || '', user });

        if (!extraData || !lat) {
          navigate('/vendor/location-picker', {
            state: {
              returnTo: from ?? getLandingPath(user.userType),
              fromLogin: true,
              user,
              title: 'Set Your Location',
              subtitle: 'Use GPS to capture your location',
            },
          });
          return;
        }

        const destination = from ?? getLandingPath(user.userType);
        navigate(destination, { replace: true });
      })
      .catch((error) => {
        console.error('Phone login error:', error);
        let errorMsg = 'Login failed. Please try again.';
        if (error && typeof error === 'object') {
          if ('response' in error && error.response && typeof error.response === 'object') {
            const data = (error.response as any).data;
            if (data) {
              errorMsg = data.message || data.error || data.detail || errorMsg;
            }
          } else if (error instanceof Error) {
            errorMsg = error.message;
          }
        }
        setErrorMessage(errorMsg);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <div className="min-h-screen bg-white text-foreground font-sans antialiased px-5 pb-10 relative overflow-hidden">
      

      <div className="pt-8 pb-4 flex justify-between items-center relative z-10">
        <img src="kerigo.png" alt="KeriGo Logo" className="h-12 sm:h-14 object-contain" />
      </div>

      <section className="flex flex-nowrap items-center gap-4 mb-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex-1 min-w-0"
        >
          <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground leading-tight mb-2">
            Welcome!
          </h2>
          <p className="text-xs sm:text-sm text-foreground/60 font-medium leading-relaxed">
            Login with your phone number to continue ordering your favorites.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="shrink-0 w-32 h-32 sm:w-36 sm:h-36"
        >
          <img src="shopping-bag.png" alt="Shopping bag" className="w-full h-full object-contain drop-shadow-lg" />
        </motion.div>
      </section>

      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        onSubmit={handlePhoneLogin}
        className="space-y-4 relative z-10"
      >
        <div className="pb-6">
            <Input
            type="tel"
            label="Phone number"
            placeholder="Enter your phone number"
            value={formData.phone}
            
            onChange={(value) => setFormData({ ...formData, phone: String(value) })}
            leftIcon={<Phone className="w-5 h-5 text-foreground/40" />}
            className="rounded-2xl h-14"
            />
        </div>

        <Input
          type="password"
          label="Password"
          placeholder="Enter password"
          value={formData.password}
          onChange={(value) => setFormData({ ...formData, password: String(value) })}
          leftIcon={<Lock className="w-5 h-5 text-foreground/40" />}
          className="rounded-2xl h-14"
        />

        <div className="flex justify-end py-6">
          <button
            type="button"
            onClick={() => navigate('/forgot-password')}
            className="text-sm text-primary font-bold hover:text-primary/80 transition-colors"
          >
            Forgot password?
          </button>
        </div>
        
        <Button
          type="submit"
          disabled={isLoading}
          className="w-full h-14 rounded-2xl text-lg font-bold flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20 disabled:opacity-60 disabled:cursor-not-allowed"
          icon={isLoading ? (
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            <ArrowRight className="w-5 h-5" />
          )}
        >
          {isLoading ? 'Logging in...' : 'Login'}
        </Button>
      </motion.form>

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center">
          <span className="bg-white px-4 text-xs font-bold text-foreground/40 uppercase tracking-wider">
            OR
          </span>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Button
          type="button"
          variant="outline"
          onClick={() => navigate(`/phone-login${location.search}`, { state: location.state })}
          className="w-full h-14 rounded-2xl flex items-center justify-center gap-3 border-border bg-white hover:bg-secondary"
        >
          <Mail className="h-5 w-5 text-foreground/80" />
          <span className="font-bold text-foreground/80">Login with Email</span>
        </Button>
      </motion.div>

      {/* Continue to Shop Button */}


       <div className="fixed bottom-0 left-0 w-full">
        <div className="flex justify-center">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="text-sm text-primary font-bold hover:text-primary/80 transition-colors"
            >
              Continue to shop
            </button>
          </div>
      

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="py-4 text-center flex items-center justify-center gap-2 text-xs text-foreground/50 font-medium"
        >
          <ShieldCheck className="h-4 w-4 text-primary" />
          Your data is safe and secure with us.
        </motion.div>
       </div>



      <div className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none overflow-hidden">
        <div className="absolute bottom-4 left-8 w-6 h-6 bg-primary/20 rounded-full blur-xl" />
        <div className="absolute bottom-8 right-12 w-8 h-8 bg-primary/15 rounded-full blur-xl" />
        <div className="absolute bottom-2 left-1/3 w-4 h-4 bg-primary/30 rounded-full blur-lg" />
      </div>
    </div>
  );
};
