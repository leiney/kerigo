
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card, CardContent } from '@stackloop/ui';
import { User, Briefcase, Bike, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import { useAuthStore } from '../../store/authStore';
import { UserRole } from '../../types';

export const RoleSelectionPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, setRole } = useAuthStore();

  const handleRoleSelect = (role: UserRole) => {
    setRole(role);
    if (role === 'customer') {
      navigate('/customer/');
    } else if (role === 'vendor') {
      // In a real app check if they finished onboarding
      navigate('/vendor/dashboard');
    } else {
      navigate('/rider/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-secondary px-6 pt-16">
      <header className="mb-12">
        <h1 className="text-3xl font-black text-foreground mb-2">Switch Role</h1>
        <p className="text-sm text-foreground/50">How would you like to use KeriGo today?</p>
      </header>

      <div className="space-y-4">
        <motion.div whileTap={{ scale: 0.98 }} onClick={() => handleRoleSelect('customer')}>
          <Card className="rounded-[2rem] border-none shadow-sm hover:ring-2 hover:ring-primary transition-all cursor-pointer">
            <CardContent className="flex items-center gap-6 p-6">
              <div className="h-16 w-16 bg-primary/10 rounded-2xl flex items-center justify-center">
                <User className="h-8 w-8 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold">Customer</h3>
                <p className="text-xs text-foreground/40">Order food, groceries, and more.</p>
              </div>
              <ArrowRight className="h-6 w-6 text-foreground/20" />
            </CardContent>
          </Card>
        </motion.div>

        <motion.div whileTap={{ scale: 0.98 }} onClick={() => handleRoleSelect('vendor')}>
          <Card className="rounded-[2rem] border-none shadow-sm hover:ring-2 hover:ring-primary transition-all cursor-pointer">
            <CardContent className="flex items-center gap-6 p-6">
              <div className="h-16 w-16 bg-orange-100 rounded-2xl flex items-center justify-center">
                <Briefcase className="h-8 w-8 text-orange-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold">Vendor</h3>
                <p className="text-xs text-foreground/40">Manage your store and sales.</p>
              </div>
              <ArrowRight className="h-6 w-6 text-foreground/20" />
            </CardContent>
          </Card>
        </motion.div>

        <motion.div whileTap={{ scale: 0.98 }} onClick={() => handleRoleSelect('rider')}>
          <Card className="rounded-[2rem] border-none shadow-sm hover:ring-2 hover:ring-primary transition-all cursor-pointer">
            <CardContent className="flex items-center gap-6 p-6">
              <div className="h-16 w-16 bg-blue-100 rounded-2xl flex items-center justify-center">
                <Bike className="h-8 w-8 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold">Rider</h3>
                <p className="text-xs text-foreground/40">Deliver orders and earn money.</p>
              </div>
              <ArrowRight className="h-6 w-6 text-foreground/20" />
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="mt-12 text-center p-6 bg-white/50 rounded-3xl border border-white">
        <p className="text-[11px] text-foreground/40 font-medium">
          Logged in as <span className="font-bold text-foreground/60">{user?.email}</span>
        </p>
        <button 
          onClick={() => { useAuthStore.getState().logout(); navigate('/'); }}
          className="mt-2 text-sm text-red-500 font-bold"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
};
