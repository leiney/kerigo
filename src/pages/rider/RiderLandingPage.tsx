import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@stackloop/ui';
import { 
  Wallet, 
  Clock, 
  ShieldCheck, 
  ArrowRight 
} from 'lucide-react';
import { motion } from 'motion/react';

export const RiderLandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white text-foreground font-sans antialiased px-5 pb-10">
      
      {/* ── HEADER / LOGO ── */}
      <div className="pt-6 pb-4 flex justify-center">
        <img 
          src="kerigo.png" 
          alt="KeriGo Logo" 
          className="h-12 sm:h-16 object-contain" 
        />
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
            <span className="text-primary">Earn more.</span>
          </h2>
          <p className="text-sm sm:text-base text-foreground/60 font-medium leading-relaxed max-w-65">
            Join thousands of riders earning on their own terms with <span className="text-primary font-bold">KeriGo</span>.
          </p>
        </motion.div>

        {/* Rider Illustration */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="absolute -right-4 top-0 w-50 h-50 sm:w-80 sm:h-80 pointer-events-none"
        >
          <img 
            src="/rider.png" 
            alt="KeriGo Rider" 
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
            
            {/* Feature 1: Flexible Earnings */}
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center shrink-0">
                <Wallet className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-bold text-base text-foreground">Flexible Earnings</h3>
                <p className="text-xs text-foreground/50 mt-0.5">Earn on your own schedule</p>
              </div>
            </div>

            {/* Feature 2: Quick Payouts */}
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center shrink-0">
                <Clock className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-bold text-base text-foreground">Quick Payouts</h3>
                <p className="text-xs text-foreground/50 mt-0.5">Get paid daily and on time</p>
              </div>
            </div>

            {/* Feature 3: Safe & Supported */}
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center shrink-0">
                <ShieldCheck className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-bold text-base text-foreground">Safe & Supported</h3>
                <p className="text-xs text-foreground/50 mt-0.5">We've got your back, every mile</p>
              </div>
            </div>

          </div>
        </motion.div>
      </section>

      {/* ── CTA BUTTONS ── */}
      <section className="mt-8 space-y-3">
        
        {/* Join Button */}
        <motion.div whileTap={{ scale: 0.98 }}>
          <Button 
            variant="primary"
            className="w-full h-14 rounded-2xl text-lg font-bold flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
            onClick={() => navigate('/rider/onboarding')}
            icon={<ArrowRight className="w-5 h-5" />}
          >
            Join as a Rider
          </Button>
        </motion.div>

        {/* Sign In Button */}
        <motion.div whileTap={{ scale: 0.98 }}>
          <Button 
            variant="outline"
            className="w-full h-14 rounded-2xl text-lg font-bold flex items-center justify-center gap-1 border-border-dark"
            onClick={() => navigate('/login', { state: { source: 'rider' } })}
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
          <span className="text-sm font-bold text-foreground">Your safety is our priority.</span>
        </div>
        <p className="text-xs text-foreground/50 max-w-62.5">
          We're committed to a safe and trusted platform.
        </p>
      </motion.div>

    </div>
  );
};