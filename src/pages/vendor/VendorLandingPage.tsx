import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@stackloop/ui';
import { Users, TrendingUp, Shield, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

export const VendorLandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white text-[15px] sm:text-base">
      {/* Header */}
      <div className="relative overflow-hidden pt-5 px-4 sm:px-6">
        <header className="mb-8 sm:mb-10">
          <img src='logo.png' alt="KeriGo Logo" className="h-20 sm:h-24" />
        </header>

        {/* Hero Section */}
        <div className="flex items-start gap-3 sm:gap-6 mb-8 sm:mb-12">
          <div className="min-w-0 flex-1">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-5 sm:mb-8"
            >
              <h1 className="text-[1.3rem] sm:text-4xl font-extrabold text-foreground mb-2 sm:mb-4 leading-[1.05] sm:leading-[1.1]">
                Deliver more.
                <br />
                <span className="text-primary italic">Grow more.</span>
              </h1>
              <p className="text-[10px] sm:text-sm text-foreground/70 max-w-[22ch] sm:max-w-none leading-4 sm:leading-6">
                Join thousands of vendors and grow your business with KeriGo.
              </p>
            </motion.div>
          </div>

          {/* Store Illustration */}
          <div className="relative w-32 h-32 sm:w-64 sm:h-64 shrink-0 mt-8 sm:mt-0 -mr-2 sm:mr-0 opacity-90 pointer-events-none">
            <img 
              src="https://picsum.photos/seed/vendor-store/400/400" 
              alt="Store illustration" 
              className="w-full h-full object-contain rounded-3xl"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      </div>

      {/* Benefits Cards */}
      <section className="px-4 sm:px-6 py-8 sm:py-12 bg-secondary">
        <div className="space-y-3 sm:space-y-4">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="flex gap-4 items-start p-4 sm:p-6 bg-white rounded-2xl sm:rounded-3xl shadow-sm"
          >
            <div className="w-12 h-12 sm:w-14 sm:h-14 bg-primary/10 rounded-2xl flex items-center justify-center shrink-0">
              <Users className="h-6 w-6 sm:h-7 sm:w-7 text-primary" />
            </div>
            <div className="min-w-0">
              <h3 className="font-extrabold text-base sm:text-lg mb-1 sm:mb-2 text-foreground">Reach More Customers</h3>
              <p className="text-[11px] sm:text-sm text-foreground/60 leading-5 sm:leading-6">
                Get your store in front of more local customers.
              </p>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="flex gap-4 items-start p-4 sm:p-6 bg-white rounded-2xl sm:rounded-3xl shadow-sm"
          >
            <div className="w-12 h-12 sm:w-14 sm:h-14 bg-primary/10 rounded-2xl flex items-center justify-center shrink-0">
              <TrendingUp className="h-6 w-6 sm:h-7 sm:w-7 text-primary" />
            </div>
            <div className="min-w-0">
              <h3 className="font-extrabold text-base sm:text-lg mb-1 sm:mb-2 text-foreground">Grow Your Sales</h3>
              <p className="text-[11px] sm:text-sm text-foreground/60 leading-5 sm:leading-6">
                Receive more orders and increase your revenue.
              </p>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="flex gap-4 items-start p-4 sm:p-6 bg-white rounded-2xl sm:rounded-3xl shadow-sm"
          >
            <div className="w-12 h-12 sm:w-14 sm:h-14 bg-primary/10 rounded-2xl flex items-center justify-center shrink-0">
              <Shield className="h-6 w-6 sm:h-7 sm:w-7 text-primary" />
            </div>
            <div className="min-w-0">
              <h3 className="font-extrabold text-base sm:text-lg mb-1 sm:mb-2 text-foreground">Reliable & Trusted</h3>
              <p className="text-[11px] sm:text-sm text-foreground/60 leading-5 sm:leading-6">
                Count on fast, secure and dependable deliveries every time.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 sm:px-6 py-10 sm:py-12 space-y-3 sm:space-y-4">
        <motion.button
          whileHover={{ scale: 1.02 }}
          onClick={() => navigate('/vendor/onboarding')}
          className="w-full bg-primary hover:bg-primary/90 text-white font-extrabold py-4 sm:py-5 rounded-2xl sm:rounded-3xl transition-all flex items-center justify-center gap-3 text-sm sm:text-base"
        >
          Join as a Vendor
          <ArrowRight className="h-5 w-5 sm:h-6 sm:w-6" />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          onClick={() => navigate('/login')}
          className="w-full bg-white border-2 border-primary text-primary font-extrabold py-4 sm:py-5 rounded-2xl sm:rounded-3xl transition-all text-sm sm:text-base"
        >
          Already have an account? <span className="text-primary font-extrabold">Sign In</span>
        </motion.button>
      </section>

      {/* Footer Message */}
      <section className="px-4 sm:px-6 pb-8 sm:pb-12 text-center space-y-2">
        <div className="flex justify-center mb-3">
          <Shield className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
        </div>
        <h3 className="font-extrabold text-base sm:text-lg text-foreground">We're with you, every step.</h3>
        <p className="text-[11px] sm:text-sm text-foreground/60 max-w-lg mx-auto leading-5 sm:leading-6">
          Tools, support and deliveries to help your business thrive.
        </p>
      </section>
    </div>
  );
};
