import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Wallet, Clock, Shield, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

export const RiderLandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white text-[15px] sm:text-base">

      {/* ── HEADER ── */}
      <div className="relative overflow-hidden bg-white px-4 sm:px-6 pt-5">
        <header className="mb-6 sm:mb-8 flex justify-center">
          <img src="logo.png" alt="KeriGo Logo" className="h-20 sm:h-24" />
        </header>

        {/* ── HERO ROW ── */}
        <div className="flex items-start gap-2 sm:gap-4 mb-0">

          {/* Left: headline + subtext */}
          <div className="min-w-0 flex-1 pt-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h1 className="text-[1.65rem] sm:text-4xl font-extrabold text-foreground leading-[1.05] sm:leading-[1.1] mb-3 sm:mb-4">
                Deliver more.
                <br />
                <span className="text-primary italic">Earn more.</span>
              </h1>
              <p className="text-[11px] sm:text-sm text-foreground/70 leading-5 sm:leading-6 max-w-[20ch] sm:max-w-none">
                Join thousands of riders earning on their own terms with{' '}
                <strong className="text-primary font-extrabold">KeriGo</strong>.
              </p>
            </motion.div>
          </div>

          {/* Right: Rider illustration — large, bleeds to edge */}
          <div className="shrink-0 w-[185px] sm:w-[260px] -mr-4 sm:-mr-6 self-end pointer-events-none">
            <img
              src="rider-illustration.png"
              alt="KeriGo Rider on scooter"
              className="w-full object-contain object-bottom"
            />
          </div>
        </div>

        {/* Map route decoration */}
        <div className="relative h-12 -mx-4 sm:-mx-6 pointer-events-none overflow-hidden">
          <svg
            viewBox="0 0 375 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full"
            preserveAspectRatio="none"
          >
            <circle cx="28" cy="26" r="10" fill="#2a9d2a" />
            <circle cx="28" cy="26" r="5" fill="white" />
            <path
              d="M38 30 Q187 12 336 30"
              stroke="#2a9d2a"
              strokeWidth="2.5"
              strokeDasharray="8 6"
              opacity="0.5"
            />
            <circle cx="347" cy="26" r="10" fill="#e53935" />
            <circle cx="347" cy="26" r="5" fill="white" />
          </svg>
        </div>
      </div>

      {/* ── FEATURES — one shared card, rows divided by borders ── */}
      <section className="px-4 sm:px-6 py-6 sm:py-8">
        <div className="bg-[#f7f9f7] border border-[#e2ebe2] rounded-2xl sm:rounded-3xl overflow-hidden">

          {/* Row 1 */}
          <div className="flex items-center gap-4 px-5 py-5">
            <div className="w-12 h-12 sm:w-14 sm:h-14 bg-primary/10 rounded-2xl flex items-center justify-center shrink-0">
              <Wallet className="h-6 w-6 sm:h-7 sm:w-7 text-primary" />
            </div>
            <div>
              <h3 className="font-extrabold text-base sm:text-lg text-foreground mb-0.5">
                Flexible Earnings
              </h3>
              <p className="text-[11px] sm:text-sm text-foreground/60 leading-5">
                Earn on your own schedule
              </p>
            </div>
          </div>

          <div className="h-px bg-[#e2ebe2] mx-5" />

          {/* Row 2 */}
          <div className="flex items-center gap-4 px-5 py-5">
            <div className="w-12 h-12 sm:w-14 sm:h-14 bg-primary/10 rounded-2xl flex items-center justify-center shrink-0">
              <Clock className="h-6 w-6 sm:h-7 sm:w-7 text-primary" />
            </div>
            <div>
              <h3 className="font-extrabold text-base sm:text-lg text-foreground mb-0.5">
                Quick Payouts
              </h3>
              <p className="text-[11px] sm:text-sm text-foreground/60 leading-5">
                Get paid daily and on time
              </p>
            </div>
          </div>

          <div className="h-px bg-[#e2ebe2] mx-5" />

          {/* Row 3 */}
          <div className="flex items-center gap-4 px-5 py-5">
            <div className="w-12 h-12 sm:w-14 sm:h-14 bg-primary/10 rounded-2xl flex items-center justify-center shrink-0">
              <Shield className="h-6 w-6 sm:h-7 sm:w-7 text-primary" />
            </div>
            <div>
              <h3 className="font-extrabold text-base sm:text-lg text-foreground mb-0.5">
                Safe &amp; Supported
              </h3>
              <p className="text-[11px] sm:text-sm text-foreground/60 leading-5">
                We've got your back, every mile
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* ── CTA BUTTONS ── */}
      <section className="px-4 sm:px-6 pb-6 sm:pb-8 space-y-3 sm:space-y-4">
        <motion.button
          whileHover={{ scale: 1.02 }}
          onClick={() => navigate('/rider/onboarding')}
          className="w-full bg-primary hover:bg-primary/90 text-white font-extrabold py-4 sm:py-5 rounded-2xl sm:rounded-3xl transition-all flex items-center justify-center gap-3 text-sm sm:text-base shadow-lg shadow-primary/25"
        >
          Join as a Rider
          <ArrowRight className="h-5 w-5 sm:h-6 sm:w-6" />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          onClick={() => navigate('/login')}
          className="w-full bg-white border-2 border-primary font-extrabold py-4 sm:py-5 rounded-2xl sm:rounded-3xl transition-all text-sm sm:text-base text-foreground"
        >
          Already have an account?{' '}
          <span className="text-primary font-extrabold">Sign In</span>
        </motion.button>
      </section>

      {/* ── SAFETY FOOTER ── */}
      <section className="px-4 sm:px-6 pb-10 sm:pb-14 flex items-center justify-center gap-3">
        <Shield className="h-7 w-7 sm:h-8 sm:w-8 text-primary shrink-0" />
        <div>
          <h3 className="font-extrabold text-sm sm:text-base text-foreground">
            Your safety is our priority.
          </h3>
          <p className="text-[11px] sm:text-sm text-foreground/60 leading-5">
            We're committed to a safe and trusted platform.
          </p>
        </div>
      </section>

    </div>
  );
};
