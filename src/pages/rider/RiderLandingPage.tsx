import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Wallet, Clock, Shield, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

export const RiderLandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white text-[15px] sm:text-base px-2">

      {/* ── HEADER ── */}
      <div className="relative overflow-hidden bg-white px-4 sm:px-6 pt-5">
        <header className="mb-12 mt-5 sm:mb-8 flex justify-center">
          <img src="kerigo.png" alt="KeriGo Logo" className="h-20 sm:h-24" />
        </header>

        {/* ── HERO ROW ── */}
        <div className="relative flex items-start gap-3 sm:gap-6 mb-16 sm:mb-12">

          {/* Left: headline + subtext (sizes aligned with WelcomePage) */}
          <div className="min-w-0 flex-1 pt-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h2 className="text-[1.1rem] sm:text-3xl font-extrabold text-foreground mb-2 sm:mb-4 leading-[1.02] sm:leading-[1.1]">
                Deliver more.
                <br />
                <span className="text-primary">Earn more.</span>
              </h2>
              <p className="text-[10px] sm:text-sm text-foreground/70 leading-4 sm:leading-6 max-w-[28ch] sm:max-w-none">
                Join thousands of riders earning on their own terms with
                <strong className="text-primary font-extrabold"> KeriGo</strong>.
              </p>
            </motion.div>
          </div>

          {/* Right: Rider image placed per wireframe (large, bleeding lower-right) */}
          <div className="absolute right-0 -bottom-3/4 w-56 h-56 sm:w-72 sm:h-72 pointer-events-none transition-transform">
            <img
              src="/rider.png"
              alt="KeriGo Rider on scooter"
              className="w-full h-full object-contain"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>

        
      </div>

      {/* ── FEATURES — one shared card, rows divided by borders ── */}
      <section className="px-4 sm:px-6 py-2 sm:py-8">
        <div className="bg-[#f7f9f7] rounded-lg sm:rounded-3xl overflow-hidden border border-border/50">
          <div className="bg-white rounded-lg sm:rounded-3xl p-4 sm:p-6">
            {/* Row 1 */}
            <div className="flex items-center gap-4 py-2">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-primary/10 rounded-2xl flex items-center justify-center shrink-0">
                <Wallet className="h-6 w-6 sm:h-7 sm:w-7 text-primary" />
              </div>
              <div>
                <h3 className="font-extrabold text-base sm:text-lg text-foreground mb-0.5">Flexible Earnings</h3>
                <p className="text-[11px] sm:text-sm text-foreground/60 leading-5">Earn on your own schedule</p>
              </div>
            </div>

            {/* Row 2 */}
            <div className="flex items-center gap-4 py-2">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-primary/10 rounded-2xl flex items-center justify-center shrink-0">
                <Clock className="h-6 w-6 sm:h-7 sm:w-7 text-primary" />
              </div>
              <div>
                <h3 className="font-extrabold text-base sm:text-lg text-foreground mb-0.5">Quick Payouts</h3>
                <p className="text-[11px] sm:text-sm text-foreground/60 leading-5">Get paid daily and on time</p>
              </div>
            </div>

            {/* Row 3 */}
            <div className="flex items-center gap-4 py-2">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-primary/10 rounded-2xl flex items-center justify-center shrink-0">
                <Shield className="h-6 w-6 sm:h-7 sm:w-7 text-primary" />
              </div>
              <div>
                <h3 className="font-extrabold text-base sm:text-lg text-foreground mb-0.5">Safe &amp; Supported</h3>
                <p className="text-[11px] sm:text-sm text-foreground/60 leading-5">We've got your back, every mile</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA BUTTONS ── */}
      <section className="px-4 sm:px-6 pb-6 sm:pb-8 space-y-3 sm:space-y-4">
        <motion.button
          whileHover={{ scale: 1.02 }}
          onClick={() => navigate('/rider/onboarding')}
          className="w-full bg-primary hover:bg-primary/90 text-white font-extrabold py-3 sm:py-5 rounded-2xl sm:rounded-3xl transition-all flex items-center justify-center gap-3 text-sm sm:text-base shadow-lg shadow-primary/25"
        >
          Join as a Rider
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          onClick={() => navigate('/login')}
          className="w-full bg-white border border-primary font-extrabold py-3 sm:py-5 rounded-2xl sm:rounded-3xl transition-all text-sm sm:text-base text-foreground"
        >
          Already have an account?{' '}
          <span className="text-primary font-extrabold">Sign In</span>
        </motion.button>
      </section>

      {/* ── SAFETY FOOTER ── */}
      {/* <section className="px-4 sm:px-6 pb-10 sm:pb-14 flex items-center justify-center gap-3">
        <Shield className="h-6 w-6 sm:h-8 sm:w-8 text-primary shrink-0" />
        <div>
          <h3 className="font-extrabold text-sm sm:text-base text-foreground">
            Your safety is our priority.
          </h3>
          <p className="text-[11px] sm:text-sm text-foreground/60 leading-5">
            We're committed to a safe and trusted platform.
          </p>
        </div>
      </section> */}

    </div>
  );
};
