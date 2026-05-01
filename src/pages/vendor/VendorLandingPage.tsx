import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@stackloop/ui';
import { Users, TrendingUp, Shield, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

export const VendorLandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white text-[15px] sm:text-base px-2">
      {/* Header */}
      <div className="relative overflow-hidden pt-5 px-4 sm:px-6">
        <header className="mb-12 mt-5 sm:mb-10 flex justify-center">
          <img src='kerigo.png' alt="KeriGo Logo" className="h-20 sm:h-24" />
        </header>

        {/* Hero Section */}
        <div className="relative flex items-start gap-3 sm:gap-6 mb-8 sm:mb-12">
          <div className="min-w-0 flex-1">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-5 sm:mb-8"
            >
              <h2 className="text-[1.1rem] sm:text-3xl font-extrabold text-foreground mb-2 sm:mb-4 leading-[1.02] sm:leading-[1.1]">
                Deliver more.
                <br />
                <span className="text-primary">Grow more.</span>
              </h2>
              <p className="text-[10px] sm:text-sm text-foreground/70 max-w-[28ch] sm:max-w-none leading-4 sm:leading-6">
                Join thousands of vendors and grow your business with
                <strong className="text-primary font-extrabold"> KeriGo</strong>.
              </p>
            </motion.div>
          </div>

          {/* Store Illustration placed per wireframe (large, bleeding lower-right) */}
          <div className="absolute right-0 -bottom-3/4 w-50 h-50 sm:w-72 sm:h-72 pointer-events-none transition-transform">
            <img 
              src="/store.png" 
              alt="Store illustration" 
              className="w-full h-full object-contain rounded-3xl"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      </div>

      {/* Benefits Cards */}
      <section className="px-4 sm:px-6 py-2 sm:py-12 bg-secondary">
        <div className="bg-[#f7f9f7] rounded-2xl sm:rounded-3xl overflow-hidden border border-border/50">
          <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6">
            <div className="flex items-center gap-4 py-2">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-primary/10 rounded-2xl flex items-center justify-center shrink-0">
                <Users className="h-6 w-6 sm:h-7 sm:w-7 text-primary" />
              </div>
              <div className="min-w-0">
                <h3 className="font-extrabold text-base sm:text-lg mb-0.5 text-foreground">Reach More Customers</h3>
                <p className="text-[11px] sm:text-sm text-foreground/60 leading-5 sm:leading-6">Get your store in front of more local customers.</p>
              </div>
            </div>

            <div className="flex items-center gap-4 py-2">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-primary/10 rounded-2xl flex items-center justify-center shrink-0">
                <TrendingUp className="h-6 w-6 sm:h-7 sm:w-7 text-primary" />
              </div>
              <div className="min-w-0">
                <h3 className="font-extrabold text-base sm:text-lg mb-0.5 text-foreground">Grow Your Sales</h3>
                <p className="text-[11px] sm:text-sm text-foreground/60 leading-5 sm:leading-6">Receive more orders and increase your revenue.</p>
              </div>
            </div>

            <div className="flex items-center gap-4 py-2">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-primary/10 rounded-2xl flex items-center justify-center shrink-0">
                <Shield className="h-6 w-6 sm:h-7 sm:w-7 text-primary" />
              </div>
              <div className="min-w-0">
                <h3 className="font-extrabold text-base sm:text-lg mb-0.5 text-foreground">Reliable & Trusted</h3>
                <p className="text-[11px] sm:text-sm text-foreground/60 leading-5 sm:leading-6">Count on fast, secure and dependable deliveries every time.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 sm:px-6 py-2 sm:py-12 space-y-3 sm:space-y-4">
        <motion.button
          whileHover={{ scale: 1.02 }}
          onClick={() => navigate('/vendor/onboarding')}
          className="w-full bg-primary hover:bg-primary/90 text-white font-extrabold py-3 sm:py-5 rounded-2xl sm:rounded-3xl transition-all flex items-center justify-center gap-3 text-sm sm:text-base"
        >
          Join as a Vendor
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          onClick={() => navigate('/login')}
          className="w-full bg-white border border-primary text-foreground font-extrabold py-3 sm:py-5 rounded-2xl sm:rounded-3xl transition-all text-sm sm:text-base"
        >
          Already have an account? <span className="text-primary font-extrabold">Sign In</span>
        </motion.button>
      </section>

      {/* Footer Message */}
      {/* <section className="px-4 sm:px-6 pb-10 pt-5 sm:pb-14 flex items-center justify-center gap-3">
          <Shield className="h-6 w-6 sm:h-8 sm:w-8 text-primary shrink-0" />
          <div>
            <h3 className="font-extrabold text-sm sm:text-base text-foreground">
              We're with you, every step.
            </h3>
            <p className="text-[11px] sm:text-sm text-foreground/60 leading-5">
              Tools, support and deliveries to help your business thrive.
            </p>
          </div>
      </section> */}
    </div>
  );
};
