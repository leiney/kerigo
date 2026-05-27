import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Input, Checkbox } from '@stackloop/ui';
import { 
  ArrowRight, 
  User, 
  Mail, 
  Smartphone, 
  Lock, 
  Eye, 
  EyeOff,
  Leaf,
  ShieldCheck
} from 'lucide-react';
import { motion } from 'motion/react';
import { authApi } from '../../../lib/api';
import { useAuthStore } from '../../store/authStore';
import type { UserProfile, UserRole } from '../../types';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const setUser = useAuthStore((state) => state.setUser);
  const setLoading = useAuthStore((state) => state.setLoading);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    password: '',
    agreeToTerms: false
  });

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);
      const response = await authApi.register(formData);
      const user: UserProfile = {
        id: response.user.id,
        name: response.user.fullName,
        email: response.user.email,
        phone: response.user.phoneNumber,
        role: (response.user.role ?? response.user.roles?.[0] ?? 'customer') as UserRole,
        avatar: response.user.avatarUrl,
      };

      setUser(user);
      navigate('/verify-identity');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-foreground font-sans antialiased px-5 pb-10 relative overflow-hidden">
      
      {/* Decorative Leaves Background */}
      <div className="absolute top-20 right-0 w-32 h-32 opacity-20 pointer-events-none">
        <Leaf className="w-full h-full text-primary rotate-12" />
      </div>
      <div className="absolute bottom-40 left-0 w-24 h-24 opacity-20 pointer-events-none">
        <Leaf className="w-full h-full text-primary -rotate-12" />
      </div>

      {/* Header / Logo */}
      <div className="pt-6 pb-4 flex justify-center relative z-10">
        <img 
          src="kerigo.png" 
          alt="KeriGo Logo" 
          className="h-12 sm:h-14 object-contain" 
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10">
        
        {/* Page Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center"
        >
          <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground mb-2">
            Create Account
          </h1>
          <p className="text-sm sm:text-base text-foreground/60 font-medium">
            Join KeriGo and start exploring local favorites.
          </p>
        </motion.div>

        {/* Registration Form */}
        <motion.form 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          onSubmit={handleRegister} 
          className="space-y-4"
        >
          
          {/* Full Name */}
          <Input
            label="Full Name"
            placeholder="Enter your full name"
            value={formData.fullName}
            onChange={(value) => setFormData({ ...formData, fullName: String(value) })}
            leftIcon={<User className="w-5 h-5 text-foreground/40" />}
            className="rounded-2xl h-14"
          />
          
          {/* Email Address */}
          <Input
            type="email"
            label="Email Address"
            placeholder="Enter your email"
            value={formData.email}
            onChange={(value) => setFormData({ ...formData, email: String(value) })}
            leftIcon={<Mail className="w-5 h-5 text-foreground/40" />}
            className="rounded-2xl h-14"
          />

          {/* Phone Number */}
          <Input
            type="phone"
            label="Phone Number"
            placeholder="Enter mobile number"
            value={formData.phoneNumber}
            onChange={(value) => setFormData({ ...formData, phoneNumber: String(value) })}
            leftIcon={<Smartphone className="w-5 h-5 text-foreground/40" />}
            className="rounded-2xl h-14"
            defaultCountry="KE"
          />

          {/* Password */}
          <Input
            type={showPassword ? "text" : "password"}
            label="Password"
            placeholder="Create a strong password"
            value={formData.password}
            onChange={(value) => setFormData({ ...formData, password: String(value) })}
            leftIcon={<Lock className="w-5 h-5 text-foreground/40" />}
            rightIcon={
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)}
                className="focus:outline-none"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5 text-foreground/40" />
                ) : (
                  <Eye className="h-5 w-5 text-foreground/40" />
                )}
              </button>
            }
            className="rounded-2xl h-14"
          />

          {/* Terms Checkbox */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="pt-2"
          >
            <Checkbox
              label="I agree to the Terms & Conditions and Privacy Policy"
              className="text-sm"
            />
          </motion.div>

          {/* Sign Up Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="pt-4"
          >
            <Button 
              type="submit" 
              className="w-full h-14 rounded-2xl text-lg font-bold flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20"
              icon={<ArrowRight className="w-5 h-5" />}
            >
              Sign Up
            </Button>
          </motion.div>

        </motion.form>

        {/* Sign In Link */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-8 text-center text-sm"
        >
          <span className="text-foreground/50">Already have an account? </span>
          <button 
            onClick={() => navigate('/login')} 
            className="text-primary font-bold hover:text-primary/80 transition-colors"
          >
            Sign in
          </button>
        </motion.div>

        {/* Security Badge */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 text-center flex items-center justify-center gap-2 text-xs text-foreground/50 font-medium"
        >
          <ShieldCheck className="h-4 w-4 text-primary" />
          Your data is safe and secure with us.
        </motion.div>

      </div>

      {/* Bottom Decorative Leaves */}
      <div className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none overflow-hidden">
        <div className="absolute bottom-4 left-8 w-6 h-6 bg-primary/20 rounded-full blur-xl" />
        <div className="absolute bottom-8 right-12 w-8 h-8 bg-primary/15 rounded-full blur-xl" />
        <div className="absolute bottom-2 left-1/3 w-4 h-4 bg-primary/30 rounded-full blur-lg" />
      </div>

    </div>
  );
};