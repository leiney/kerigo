
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Input, Checkbox } from '@stackloop/ui';
import { ArrowRight, User, Mail, Phone, Lock, Eye, EyeOff } from 'lucide-react';
import { motion } from 'motion/react';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/otp');
  };

  return (
    <div className="min-h-screen bg-white px-6 pt-12 pb-10">
      <header className="mb-10">
        <button onClick={() => navigate(-1)} className="mb-8 font-bold text-sm text-foreground/40 flex items-center gap-2">
          Cancel
        </button>
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
          <h1 className="text-3xl font-black text-foreground mb-2">Create Account</h1>
          <p className="text-sm text-foreground/50">Join KeriGo and start exploring local favorites.</p>
        </motion.div>
      </header>

      <form onSubmit={handleRegister} className="space-y-6">
        <Input 
          label="Full Name"
          placeholder="Enter your full name"
          leftIcon={<User className="h-4 w-4" />}
          className="rounded-2xl h-14"
        />
        
        <Input 
          label="Email Address"
          placeholder="Enter your email"
          type="email"
          leftIcon={<Mail className="h-4 w-4" />}
          className="rounded-2xl h-14"
        />

        <Input 
          label="Phone Number"
          placeholder="Enter mobile number"
          type="phone"
          className="rounded-2xl h-14"
        />

        <Input 
          type={showPassword ? "text" : "password"}
          label="Password"
          placeholder="Create a strong password"
          leftIcon={<Lock className="h-4 w-4" />}
          className="rounded-2xl h-14"
          rightIcon={
            <button type="button" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <EyeOff className="h-5 w-5 opacity-40" /> : <Eye className="h-5 w-5 opacity-40" />}
            </button>
          }
        />

        <div className="pt-2">
          <Checkbox 
            label="I agree to the Terms & Conditions and Privacy Policy"
            className="items-start"
          />
        </div>

        <Button 
          type="submit" 
          className="w-full h-14 rounded-2xl text-lg font-bold flex justify-between px-8 mt-10"
          icon={<ArrowRight className="h-6 w-6" />}
        >
          Sign Up
        </Button>
      </form>

      <div className="mt-12 text-center text-sm">
        <span className="text-foreground/50">Already have an account? </span>
        <button onClick={() => navigate('/login')} className="text-primary font-bold">Sign in</button>
      </div>
    </div>
  );
};
