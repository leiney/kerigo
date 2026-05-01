
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Input } from '@stackloop/ui';
import { Eye, EyeOff, ArrowRight, ShieldCheck } from 'lucide-react';
import { motion } from 'motion/react';
import { useAuthStore } from '../../store/authStore';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const setUser = useAuthStore((state) => state.setUser);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock login
    setUser({
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+254712345678',
      roles: ['customer', 'vendor', 'rider'], // Mocked for easy switching
      avatar: 'https://picsum.photos/seed/avatar/200/200'
    });
    navigate('/role-selection');
  };

  return (
    <div className="min-h-screen bg-white px-6 pt-12 px-2">     
      <div className="relative flex items-start gap-3 sm:gap-6 mt-6">                
          <div className="min-w-0 mt-6">
            <header className="mb-6 sm:mb-8">
              <img src='kerigo.png' alt="KeriGo Logo" className="h-14 sm:h-28" />
            </header>

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <h2 className="text-3xl font-black text-foreground mb-2">Welcome!</h2>
              <p className="text-sm text-foreground/50">Login to continue ordering <br /> your favorites with ease.</p>
            </motion.div>
          </div>

          {/* Floating Illustration Placeholder */}
          <div className="absolute -right-6 -bottom-8 w-52 h-52 sm:w-64 sm:h-64 shrink-0 opacity-90 pointer-events-none">
              <img 
              src="shopping-bag.png" 
              alt="Delivery illustration" 
              className="w-full h-full object-contain"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>

      <form onSubmit={handleLogin} className="space-y-4 mt-10">
        <Input 
          label="Email or Phone number"
          placeholder="Enter email or phone number"
          className="rounded-2xl h-14"
        />
        
        <Input 
          type={showPassword ? "text" : "password"}
          label="Password"
          placeholder="Enter password"
          className="rounded-2xl h-14"
          rightIcon={
            <button type="button" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <EyeOff className="h-5 w-5 opacity-40" /> : <Eye className="h-5 w-5 opacity-40" />}
            </button>
          }
        />

        <div className="flex justify-end">
          <button type="button" className="text-sm text-primary font-bold">Forgot password?</button>
        </div>

        <Button 
          type="submit" 
          className="w-full h-14 rounded-2xl text-lg font-bold flex gap-2 py-3 px-8"
        >
          Login
        </Button>``
      </form>

      <div className="relative mb-4">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white px-4 text-foreground/40 font-bold">OR</span>
        </div>
      </div>

      <Button 
        variant="outline" 
        className="w-full h-14 rounded-2xl flex items-center justify-center gap-3 border-border"
      >
        <img src="https://www.google.com/favicon.ico" className="h-5 w-5" alt="Google" />
        <span className="font-bold text-foreground/80">Continue with Google</span>
      </Button>

      <div className="mt-8 text-center flex items-center justify-center gap-2 text-[11px] text-foreground/40 font-medium">
        <ShieldCheck className="h-4 w-4 text-primary" />
        Your data is safe and secure with us.
      </div>

      <div className="mt-8 text-center text-sm">
        <span className="text-foreground/50">Don't have an account? </span>
        <button onClick={() => navigate('/register')} className="text-primary font-bold">Sign up</button>
      </div>
    </div>
  );
};
