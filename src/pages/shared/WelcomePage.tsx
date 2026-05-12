import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card, CardContent } from '@stackloop/ui';
import { 
  Search, 
  ShieldCheck, 
  Clock, 
  CheckCircle2, 
  ArrowRight, 
  Home, 
  ShoppingBag, 
  User, 
  SlidersHorizontal,
  Lock,
  Timer,
  BadgeCheck
} from 'lucide-react';
import { motion } from 'motion/react';

export const WelcomePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white text-foreground font-sans antialiased pb-24">
      
      {/* Header / Hero Section */}
      <div className="relative overflow-hidden px-5 pt-8 pb-2">
        
        {/* Logo Area */}
        <header className="mb-8">
          {/* Replace src with your actual logo path */}
          <img src='/kerigo.png' alt="KeriGo Logo" className="h-12 sm:h-14" />
        </header>

        {/* Hero Content */}
        <div className="flex flex-col">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="relative z-10 mb-6 max-w-[65%]"
          >
            <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground leading-tight mb-3">
              Everything you need, <span className="text-primary">delivered.</span>
            </h1>
            <p className="text-sm sm:text-base text-foreground/60 font-medium leading-relaxed">
              Food, groceries, pharmacy and more from trusted local vendors.
            </p>
          </motion.div>

          {/* Hero Illustration */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="absolute right-0 top-12 w-52 h-52 sm:w-64 sm:h-64 -z-0"
          >
            {/* Replace src with the shopping bag illustration from the image */}
            <img 
              src="/shopping-bag.png" 
              alt="Delivery illustration" 
              className="w-full h-full object-contain drop-shadow-xl"
            />
          </motion.div>
        </div>

        {/* Search Bar with Filter Button */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="relative mt-8"
        >
          <div className="flex items-center gap-3">
            {/* Search Input Container */}
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-foreground/40" />
              </div>
              <input 
                type="text" 
                placeholder="Search for food, groceries, medicine..."
                className="w-full h-14 pl-12 pr-4 bg-white border border-border rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm font-medium"
              />
            </div>
            
            {/* Filter Button */}
            <button className="h-14 w-14 bg-primary rounded-2xl flex items-center justify-center text-white shadow-lg shadow-primary/30 active:scale-95 transition-transform">
              <SlidersHorizontal className="h-5 w-5" />
            </button>
          </div>
        </motion.div>
      </div>

      {/* Why Choose KeriGo? */}
      <section className="px-5 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h3 className="text-xl font-bold text-foreground mb-5">Why Choose KeriGo?</h3>
          <div className="grid grid-cols-3 gap-3 sm:gap-4">
            
            {/* Card 1: Secure Payments */}
            <Card variant="default" className="border border-border/50 bg-white rounded-3xl p-3 sm:p-4 shadow-sm">
              <CardContent className="flex flex-col items-center text-center gap-3 p-0">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                  <ShieldCheck className="h-6 w-6 sm:h-7 sm:w-7 text-primary" />
                </div>
                <div>
                  <h4 className="font-bold text-xs sm:text-sm text-foreground mb-1">Secure Payments</h4>
                  <p className="text-[10px] sm:text-xs text-foreground/50 leading-tight">Your payments are safe with us.</p>
                </div>
              </CardContent>
            </Card>

            {/* Card 2: Fast Delivery */}
            <Card variant="default" className="border border-border/50 bg-white rounded-3xl p-3 sm:p-4 shadow-sm">
              <CardContent className="flex flex-col items-center text-center gap-3 p-0">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                  <Timer className="h-6 w-6 sm:h-7 sm:w-7 text-primary" />
                </div>
                <div>
                  <h4 className="font-bold text-xs sm:text-sm text-foreground mb-1">Fast Delivery</h4>
                  <p className="text-[10px] sm:text-xs text-foreground/50 leading-tight">Get your orders delivered quickly.</p>
                </div>
              </CardContent>
            </Card>

            {/* Card 3: Trusted Vendors */}
            <Card variant="default" className="border border-border/50 bg-white rounded-3xl p-3 sm:p-4 shadow-sm">
              <CardContent className="flex flex-col items-center text-center gap-3 p-0">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                  <BadgeCheck className="h-6 w-6 sm:h-7 sm:w-7 text-primary" />
                </div>
                <div>
                  <h4 className="font-bold text-xs sm:text-sm text-foreground mb-1">Trusted Vendors</h4>
                  <p className="text-[10px] sm:text-xs text-foreground/50 leading-tight">We partner with reliable local stores.</p>
                </div>
              </CardContent>
            </Card>

          </div>
        </motion.div>
      </section>

      {/* Become a Rider / Vendor Banners */}
      <section className="px-5 space-y-4 pb-8">
        
        {/* Become a Rider */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate('/rider-landing')}
          className="relative bg-primary/5 rounded-3xl p-5 overflow-hidden cursor-pointer group border border-primary/10"
        >
          <div className="relative z-10 max-w-[60%]">
            <h3 className="text-lg font-bold text-primary mb-1">Become a Rider</h3>
            <p className="text-xs text-foreground/60 mb-4 leading-tight">Deliver and earn on your own time.</p>
            <div className="h-9 w-9 bg-primary rounded-full flex items-center justify-center text-white transition-transform group-hover:translate-x-1">
              <ArrowRight className="h-4 w-4" />
            </div>
          </div>
          <div className="absolute right-2 bottom-0 w-36 h-36 sm:w-44 sm:h-44 transition-transform group-hover:scale-105">
            {/* Replace with Rider illustration */}
            <img 
              src="/rider.png" 
              alt="Rider" 
              className="w-full h-full object-contain"
            />
          </div>
        </motion.div>

        {/* Become a Vendor */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate('/vendor-landing')}
          className="relative bg-[#FFF7ED] rounded-3xl p-5 overflow-hidden cursor-pointer group border border-[#FED7AA]/30"
        >
          <div className="relative z-10 max-w-[60%]">
            <h3 className="text-lg font-bold text-[#C2410C] mb-1">Become a Vendor</h3>
            <p className="text-xs text-foreground/60 mb-4 leading-tight">Grow your business with KeriGo.</p>
            <div className="h-9 w-9 bg-[#C2410C] rounded-full flex items-center justify-center text-white transition-transform group-hover:translate-x-1">
              <ArrowRight className="h-4 w-4" />
            </div>
          </div>
          <div className="absolute right-2 bottom-0 w-36 h-36 sm:w-44 sm:h-44 transition-transform group-hover:scale-105">
            {/* Replace with Store illustration */}
            <img 
              src="/store.png" 
              alt="Vendor" 
              className="w-full h-full object-contain"
            />
          </div>
        </motion.div>

      </section>

      {/* Bottom Navigation */}
      <div className="fixed bottom-4 left-4 right-4 h-16 bg-white rounded-[2rem] border border-border shadow-lg flex justify-around items-center z-50">
        <div className="flex flex-col items-center gap-1 text-primary cursor-pointer">
          <Home className="h-6 w-6" />
          <span className="text-[10px] font-bold">Home</span>
        </div>
        <div className="flex flex-col items-center gap-1 text-foreground/40 hover:text-foreground/70 cursor-pointer transition-colors">
          <ShoppingBag className="h-6 w-6" />
          <span className="text-[10px] font-bold">Orders</span>
        </div>
        <div className="flex flex-col items-center gap-1 text-foreground/40 hover:text-foreground/70 cursor-pointer transition-colors">
          <User className="h-6 w-6" />
          <span className="text-[10px] font-bold">Account</span>
        </div>
      </div>

    </div>
  );
};