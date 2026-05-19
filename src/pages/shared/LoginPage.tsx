import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button, Input } from '@stackloop/ui';
import { 
  Eye, 
  EyeOff, 
  ArrowRight, 
  ShieldCheck, 
  User, 
  Lock,
  Leaf
} from 'lucide-react';
import { motion } from 'motion/react';
import { useAuthStore } from '../../store/authStore';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const setUser = useAuthStore((state) => state.setUser);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    emailOrPhone: '',
    password: ''
  });

  const source = (location.state as { source?: 'vendor' | 'rider' } | null)?.source;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock login
    setUser({
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+254712345678',
      roles: ['customer', 'vendor', 'rider'],
      avatar: 'https://picsum.photos/seed/avatar/200/200'
    });
    navigate('/verify-identity', { state: { source } });
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
      <div className="absolute bottom-20 right-10 w-20 h-20 opacity-20 pointer-events-none">
        <Leaf className="w-full h-full text-primary rotate-45" />
      </div>

      {/* Header / Logo */}
      <div className="pt-8 pb-4 flex justify-start relative z-10">
        <img 
          src="kerigo.png" 
          alt="KeriGo Logo" 
          className="h-12 sm:h-14 object-contain" 
        />
      </div>

      {/* Hero Section */}
      <section className="flex flex-nowrap items-center gap-4 mb-6">
        {/* Text Content */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex-1 min-w-0"
        >
          <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground leading-tight mb-2">
            Welcome!
          </h2>
          <p className="text-xs sm:text-sm text-foreground/60 font-medium leading-relaxed">
            Login to continue ordering your favorites with ease.
          </p>
        </motion.div>

        {/* Shopping Bag Illustration */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="shrink-0 w-32 h-32 sm:w-36 sm:h-36"
        >
          <img 
            src="shopping-bag.png" 
            alt="Shopping bag" 
            className="w-full h-full object-contain drop-shadow-lg" 
          />
        </motion.div>
      </section>

      {/* Login Form */}
      <motion.form 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        onSubmit={handleLogin} 
        className="space-y-4 relative z-10"
      >
        {/* Email or Phone Input */}
        <Input
          label="Email or Phone number"
          placeholder="Enter email or phone number"
          value={formData.emailOrPhone}
          onChange={(value) => setFormData({ ...formData, emailOrPhone: String(value) })}
          leftIcon={<User className="w-5 h-5 text-foreground/40" />}
          className="rounded-2xl h-14"
        />
        
        {/* Password Input */}
        <Input
          type={showPassword ? "text" : "password"}
          label="Password"
          placeholder="Enter password"
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

        {/* Forgot Password Link */}
        <div className="flex justify-end">
          <button 
            type="button" 
            className="text-sm text-primary font-bold hover:text-primary/80 transition-colors"
          >
            Forgot password?
          </button>
        </div>

        {/* Login Button */}
        <Button 
          type="submit" 
          className="w-full h-14 rounded-2xl text-lg font-bold flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20"
          icon={<ArrowRight className="w-5 h-5" />}
        >
          Login
        </Button>
      </motion.form>

      {/* OR Divider */}
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

      {/* Google Sign In Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Button 
          variant="outline" 
          className="w-full h-14 rounded-2xl flex items-center justify-center gap-3 border-border bg-white hover:bg-secondary"
        >
          <img 
            src="https://www.google.com/favicon.ico" 
            className="h-5 w-5" 
            alt="Google" 
          />
          <span className="font-bold text-foreground/80">Continue with Google</span>
        </Button>
      </motion.div>

      {/* Security Message */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-8 text-center flex items-center justify-center gap-2 text-xs text-foreground/50 font-medium"
      >
        <ShieldCheck className="h-4 w-4 text-primary" />
        Your data is safe and secure with us.
      </motion.div>

      {/* Sign Up Link */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mt-8 text-center text-sm"
      >
        <span className="text-foreground/50">Don't have an account? </span>
        <button 
          onClick={() => navigate('/register')} 
          className="text-primary font-bold hover:text-primary/80 transition-colors"
        >
          Sign up
        </button>
      </motion.div>

      {/* Bottom Decorative Leaves */}
      <div className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none overflow-hidden">
        <div className="absolute bottom-4 left-8 w-6 h-6 bg-primary/20 rounded-full blur-xl" />
        <div className="absolute bottom-8 right-12 w-8 h-8 bg-primary/15 rounded-full blur-xl" />
        <div className="absolute bottom-2 left-1/3 w-4 h-4 bg-primary/30 rounded-full blur-lg" />
      </div>

    </div>
  );
};