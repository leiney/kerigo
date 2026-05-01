
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card, CardContent } from '@stackloop/ui';
import { Search, MapPin, ShieldCheck, Clock, CheckCircle2, ArrowRight, Home, ShoppingBag, User, SlidersHorizontal } from 'lucide-react';
import { motion } from 'motion/react';

export const WelcomePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white text-[15px] sm:text-base px-2">
      {/* Header / Hero */}
      <div className="relative overflow-hidden pt-5 px-4 sm:px-6">
        <div className="relative flex items-start gap-3 sm:gap-6 mt-6">
          
          <div className="min-w-0 mt-6">
            <header className="mb-9 sm:mb-8">
              <img src='kerigo.png' alt="KeriGo Logo" className="h-14 sm:h-28" />
            </header>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-5 sm:mb-8 "
            >
              <h2 className="text-[1.1rem] sm:text-3xl font-extrabold text-foreground mb-3 sm:mb-4 leading-[1.02] sm:leading-[1.1]">
                Everything you 
                <br />
                need, 
                <span className="text-primary">delivered.</span>
              </h2>
              <p className="text-[10px] sm:text-sm text-foreground/70 leading-4 sm:leading-6">
                Food, groceries, pharmacy and more 
                <br />
                from trusted local vendors.
              </p>
            </motion.div>
          </div>

          {/* Floating Illustration Placeholder */}
          <div className="absolute -right-6 -bottom-8 w-56 h-56 sm:w-64 sm:h-64 shrink-0 opacity-90 pointer-events-none">
             <img 
              src="shopping-bag.png" 
              alt="Delivery illustration" 
              className="w-full h-full object-contain"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>

        {/* Search Bar Placeholder */}
        <div className="relative mt-12 mb-6 sm:mt-8 ">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <Search className="h-4 w-4 sm:h-5 sm:w-5 text-foreground/40" />
          </div>
          <input 
            type="text" 
            placeholder="Search for food, groceries, medicine..."
            className="w-full h-12 sm:h-14 pl-11 sm:pl-12 pr-12 bg-white border border-border rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-[11px] sm:text-sm"
          />
          <div className="absolute inset-y-0 right-4 flex items-center">
            <SlidersHorizontal className="h-5 w-5 sm:h-5 sm:w-5 text-primary" />
          </div>
        </div>
      </div>

      {/* Why Choose KeriGo? */}
      <section className="px-4 sm:px-6 py-8 sm:py-12 bg-background">
        <h3 className="text-base sm:text-lg font-extrabold mb-4 sm:mb-6">Why Choose KeriGo?</h3>
        <div className="grid grid-cols-3 gap-2 sm:gap-4">
          <Card variant="default" className="border border-border/70   bg-white rounded-[1.25rem] p-1.5 sm:rounded-[1.75rem] sm:p-2 min-w-0">
            <CardContent className="flex flex-col items-center text-center gap-2 p-2 sm:p-6">
              <div className="w-9 h-9 sm:w-14 sm:h-14 bg-primary/10 rounded-2xl flex items-center justify-center shrink-0">
                <ShieldCheck className="h-5 w-5 sm:h-7 sm:w-7 text-primary" />
              </div>
              <div className="min-w-0">
                <h4 className="font-extrabold text-[10px] sm:text-base mb-0.5 sm:mb-1 leading-tight">Secure Payments</h4>
                <p className="text-[8px] sm:text-[11px] text-foreground/90 leading-3 sm:leading-5">Your payments are safe with us.</p>
              </div>
            </CardContent>
          </Card>

          <Card variant="default" className="border border-border/70   bg-white rounded-[1.25rem] p-1.5 sm:rounded-[1.75rem] sm:p-2 min-w-0">
            <CardContent className="flex flex-col items-center text-center gap-2 p-2 sm:p-6">
              <div className="w-9 h-9 sm:w-14 sm:h-14 bg-primary/10 rounded-2xl flex items-center justify-center shrink-0">
                <Clock className="h-5 w-5 sm:h-7 sm:w-7 text-primary" />
              </div>
              <div className="min-w-0">
                <h4 className="font-extrabold text-[10px] sm:text-base mb-0.5 sm:mb-1 leading-tight">Fast Delivery</h4>
                <p className="text-[8px] sm:text-[11px] text-foreground/90 leading-3 sm:leading-5">Get your orders delivered quickly.</p>
              </div>
            </CardContent>
          </Card>

          <Card variant="default" className="border border-border/70   bg-white rounded-[1.25rem] p-1.5 sm:rounded-[1.75rem] sm:p-2 min-w-0">
            <CardContent className="flex flex-col items-center text-center gap-2 p-2 sm:p-6">
              <div className="w-9 h-9 sm:w-14 sm:h-14 bg-primary/10 rounded-2xl flex items-center justify-center shrink-0">
                <CheckCircle2 className="h-5 w-5 sm:h-7 sm:w-7 text-primary" />
              </div>
              <div className="min-w-0">
                <h4 className="font-extrabold text-[10px] sm:text-base mb-0.5 sm:mb-1 leading-tight">Trusted Vendors</h4>
                <p className="text-[8px] sm:text-[11px] text-foreground/90 leading-3 sm:leading-5">We partner with reliable local stores.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Become a Rider / Vendor Banners */}
      <section className="px-4 sm:px-6 py-10 sm:py-12 space-y-2 sm:space-y-6">
        <motion.div 
          whileHover={{ scale: 1.02 }}
          onClick={() => navigate('/rider-landing')}
          className="relative bg-primary/5 rounded-lg sm:rounded-[2.5rem] px-5 py-3 sm:p-8 overflow-hidden cursor-pointer group"
        >
          <div className="relative z-0 max-w-[55%] sm:max-w-[60%]">
            <h3 className="text-base sm:text-lg font-extrabold text-primary mb-1 sm:mb-2">Become a Rider</h3>
            <p className="text-xs sm:text-sm text-foreground/70 mb-4 sm:mb-6 leading-5 sm:leading-6">Deliver and earn on your own time.</p>
            <div className="h-9 w-9 sm:h-10 sm:w-10 bg-primary rounded-full flex items-center justify-center text-white transition-transform group-hover:translate-x-2">
              <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
            </div>
          </div>
          <div className="absolute right-2 bottom-1/2 translate-y-1/2 w-32 h-32 sm:w-48 sm:h-48  transition-transform group-hover:scale-110">
            <img 
              src="/rider.png" 
              alt="Rider" 
              className="w-full h-full object-contain "
              referrerPolicy="no-referrer"
            />
          </div>
        </motion.div>

        <motion.div 
          whileHover={{ scale: 1.02 }}
          onClick={() => navigate('/vendor-landing')}
          className="relative bg-[#FFF7ED] rounded-lg sm:rounded-[2.5rem] px-5 py-3 sm:p-8 overflow-hidden cursor-pointer group border border-[#FED7AA]/30"
        >
          <div className="relative z-0 max-w-[55%] sm:max-w-[60%]">
            <h3 className="text-base sm:text-lg font-extrabold text-[#C2410C] mb-1 sm:mb-2">Become a Vendor</h3>
            <p className="text-xs sm:text-sm text-foreground/70 mb-4 sm:mb-6 leading-5 sm:leading-6">Grow your business with KeriGo.</p>
            <div className="h-9 w-9 sm:h-10 sm:w-10 bg-[#C2410C] rounded-full flex items-center justify-center text-white transition-transform group-hover:translate-x-2">
              <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
            </div>
          </div>
          <div className="absolute right-2 bottom-1/2 translate-y-1/2 w-32 h-32 sm:w-48 sm:h-48  transition-transform group-hover:scale-110">
            <img 
              src="/store.png" 
              alt="Vendor" 
              className="w-full h-full object-contain "
              referrerPolicy="no-referrer"
            />
          </div>
        </motion.div>
      </section>

      {/* Footer Nav Simulation */}
      <div className="h-20" />
      <div className="fixed bottom-0 left-0 right-0 h-20 bg-white border-t border-border px-4 sm:px-8 flex justify-around items-center">
        <div className="flex flex-col items-center gap-1 text-primary">
          <Home className="h-5 w-5 sm:h-6 sm:w-6" />
          <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest">Home</span>
        </div>
        <div className="flex flex-col items-center gap-1 text-foreground/40" /* onClick={() => navigate('/login')} */>
          <ShoppingBag className="h-5 w-5 sm:h-6 sm:w-6" />
          <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest">Orders</span>
        </div>
        <div className="flex flex-col items-center gap-1 text-foreground/40" /* onClick={() => navigate('/login')} */>
          <User className="h-5 w-5 sm:h-6 sm:w-6" />
          <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest">Account</span>
        </div>
      </div>
    </div>
  );
};
