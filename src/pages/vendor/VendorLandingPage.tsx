import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@stackloop/ui';
import { 
  Users, 
  TrendingUp, 
  ShieldCheck, 
  ArrowRight 
} from 'lucide-react';
import { motion } from 'motion/react';

export const VendorLandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white text-foreground font-sans antialiased px-5 pb-10">
      
      {/* ── HEADER / LOGO ── */}
      <div className="pt-6 pb-4 flex flex-col items-center justify-center">
        <img 
          src="kerigo.png" 
          alt="KeriGo Logo" 
          className="h-14 sm:h-16 object-contain" 
        />
        <p className="text-xs font-bold text-foreground/60 mt-1 tracking-wide">Fast. Local. Reliable.</p>
      </div>

      {/* ── HERO SECTION ── */}
      <section className="relative flex flex-col mb-8">
        
        {/* Text Content */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="relative z-10 mb-4 max-w-[70%]"
        >
          <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground leading-tight mb-3">
            Deliver more.
            <br />
            <span className="text-primary">Grow more.</span>
          </h2>
          <p className="text-sm sm:text-base text-foreground/60 font-medium leading-relaxed max-w-65">
            Join thousands of vendors and grow your business with <span className="text-primary font-bold">KeriGo</span>.
          </p>
        </motion.div>

        {/* Store Illustration */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="absolute right-0 top-0 w-64 h-64 sm:w-80 sm:h-80 pointer-events-none"
        >
          <img 
            src="/store.png" 
            alt="KeriGo Store" 
            className="w-full h-full object-contain drop-shadow-xl" 
          />
        </motion.div>
      </section>

      {/* ── FEATURES CARD ── */}
      <section className="px-0 py-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-3xl p-5 border border-border/50 shadow-sm"
        >
          <div className="space-y-5">
            
            {/* Feature 1: Reach More Customers */}
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center shrink-0">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-bold text-base text-foreground">Reach More Customers</h3>
                <p className="text-xs text-foreground/50 mt-0.5">Get your store in front of more local customers.</p>
              </div>
            </div>

            {/* Feature 2: Grow Your Sales */}
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center shrink-0">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-bold text-base text-foreground">Grow Your Sales</h3>
                <p className="text-xs text-foreground/50 mt-0.5">Receive more orders and increase your revenue.</p>
              </div>
            </div>

            {/* Feature 3: Reliable & Trusted */}
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center shrink-0">
                <ShieldCheck className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-bold text-base text-foreground">Reliable & Trusted</h3>
                <p className="text-xs text-foreground/50 mt-0.5">Count on fast, secure and dependable deliveries every time.</p>
              </div>
            </div>

          </div>
        </motion.div>
      </section>

      {/* ─ CTA BUTTONS ── */}
      <section className="mt-8 space-y-3">
        
        {/* Join Button */}
        <motion.div whileTap={{ scale: 0.98 }}>
          <Button 
            variant="primary"
            className="w-full h-14 rounded-2xl text-lg font-bold flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
            onClick={() => navigate('/vendor/onboarding')}
            icon={<ArrowRight className="w-5 h-5" />}
          >
            Join as a Vendor
          </Button>
        </motion.div>

        {/* Sign In Button */}
        <motion.div whileTap={{ scale: 0.98 }}>
          <Button 
            variant="outline"
            className="w-full h-14 rounded-2xl text-lg font-bold flex items-center justify-center gap-1 border-border-dark"
            onClick={() => navigate('/login', { state: { source: 'vendor' } })}
          >
            Already have an account? <span className="text-primary">Sign In</span>
          </Button>
        </motion.div>
      </section>

      {/* ─ SAFETY FOOTER ── */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-10 text-center flex flex-col items-center justify-center gap-2"
      >
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-primary" />
          <span className="text-sm font-bold text-foreground">We're with you, every step.</span>
        </div>
        <p className="text-xs text-foreground/50 max-w-62.5">
          Tools, support and deliveries to help your business thrive.
        </p>
      </motion.div>

    </div>
  );
};