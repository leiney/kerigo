
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card, CardContent } from '@stackloop/ui';
import { Search, MapPin, ShieldCheck, Clock, CheckCircle2, ArrowRight, Home, ShoppingBag, User } from 'lucide-react';
import { motion } from 'motion/react';

export const WelcomePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      {/* Header / Hero */}
      <div className="relative overflow-hidden pt-6 px-6">
        <header className="flex justify-between items-center mb-10">
          <div className="flex flex-col">
            <h1 className="text-3xl font-extrabold text-primary italic leading-tight">
              KeriGo <span className="inline-block" style={{ transform: 'skewX(-10deg)' }}>🛵</span>
            </h1>
            <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-foreground opacity-60">Fast. Local. Reliable.</p>
          </div>
        </header>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h2 className="text-4xl font-black text-foreground mb-4 leading-[1.1]">
            Everything you <br />
            need, <span className="text-primary italic">delivered.</span>
          </h2>
          <p className="text-sm text-foreground/70 max-w-[280px]">
            Food, groceries, pharmacy and more from trusted local vendors.
          </p>
        </motion.div>

        {/* Floating Illustration Placeholder */}
        <div className="absolute -right-16 top-10 w-64 h-64 -z-10 rotate-12 opacity-90">
           <img 
            src="https://picsum.photos/seed/grocery-bag/600/600" 
            alt="Delivery illustration" 
            className="w-full h-full object-contain rounded-3xl"
            referrerPolicy="no-referrer"
          />
        </div>

        {/* Search Bar Placeholder */}
        <div className="relative mt-8 group">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-foreground/40" />
          </div>
          <input 
            type="text" 
            placeholder="Search for food, groceries, medicine..."
            className="w-full h-14 pl-12 pr-12 bg-white border border-border rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm"
          />
          <div className="absolute inset-y-0 right-4 flex items-center">
            <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center cursor-pointer">
              <div className="h-4 w-4 border-2 border-white/40 border-t-white rounded-full rotate-45" />
            </div>
          </div>
        </div>
      </div>

      {/* Why Choose KeriGo? */}
      <section className="px-6 py-12 bg-[#fafafa]">
        <h3 className="text-xl font-bold mb-6">Why Choose KeriGo?</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card variant="default" className="border-none shadow-sm bg-white rounded-3xl p-2">
            <CardContent className="flex flex-col items-center text-center p-6">
              <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-4">
                <ShieldCheck className="h-7 w-7 text-primary" />
              </div>
              <h4 className="font-bold text-sm mb-1">Secure Payments</h4>
              <p className="text-[11px] text-foreground/50">Your payments are safe with us.</p>
            </CardContent>
          </Card>

          <Card variant="default" className="border-none shadow-sm bg-white rounded-3xl p-2">
            <CardContent className="flex flex-col items-center text-center p-6">
              <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-4">
                <Clock className="h-7 w-7 text-primary" />
              </div>
              <h4 className="font-bold text-sm mb-1">Fast Delivery</h4>
              <p className="text-[11px] text-foreground/50">Get your orders delivered quickly.</p>
            </CardContent>
          </Card>

          <Card variant="default" className="border-none shadow-sm bg-white rounded-3xl p-2">
            <CardContent className="flex flex-col items-center text-center p-6">
              <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-4">
                <CheckCircle2 className="h-7 w-7 text-primary" />
              </div>
              <h4 className="font-bold text-sm mb-1">Trusted Vendors</h4>
              <p className="text-[11px] text-foreground/50">We partner with reliable local stores.</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Become a Rider / Vendor Banners */}
      <section className="px-6 py-12 space-y-6">
        <motion.div 
          whileHover={{ scale: 1.02 }}
          onClick={() => navigate('/login')}
          className="relative bg-primary/5 rounded-[2.5rem] p-8 overflow-hidden cursor-pointer group"
        >
          <div className="relative z-10 max-w-[60%]">
            <h3 className="text-2xl font-bold text-primary mb-2">Become a Rider</h3>
            <p className="text-sm text-foreground/70 mb-6">Deliver and earn on your own time.</p>
            <div className="h-10 w-10 bg-primary rounded-full flex items-center justify-center text-white transition-transform group-hover:translate-x-2">
              <ArrowRight className="h-5 w-5" />
            </div>
          </div>
          <div className="absolute right-[-20px] bottom-[-20px] w-48 h-48 opacity-20 sm:opacity-100 transition-transform group-hover:scale-110">
            <img 
              src="https://picsum.photos/seed/rider-moto/400/400" 
              alt="Rider" 
              className="w-full h-full object-cover rounded-3xl"
              referrerPolicy="no-referrer"
            />
          </div>
        </motion.div>

        <motion.div 
          whileHover={{ scale: 1.02 }}
          onClick={() => navigate('/login')}
          className="relative bg-[#FFF7ED] rounded-[2.5rem] p-8 overflow-hidden cursor-pointer group border border-[#FED7AA]/30"
        >
          <div className="relative z-10 max-w-[60%]">
            <h3 className="text-2xl font-bold text-[#C2410C] mb-2">Become a Vendor</h3>
            <p className="text-sm text-foreground/70 mb-6">Grow your business with KeriGo.</p>
            <div className="h-10 w-10 bg-[#C2410C] rounded-full flex items-center justify-center text-white transition-transform group-hover:translate-x-2">
              <ArrowRight className="h-5 w-5" />
            </div>
          </div>
          <div className="absolute right-[-20px] bottom-[-20px] w-48 h-48 opacity-20 sm:opacity-100 transition-transform group-hover:scale-110">
            <img 
              src="https://picsum.photos/seed/vendor-store/400/400" 
              alt="Vendor" 
              className="w-full h-full object-cover rounded-3xl"
              referrerPolicy="no-referrer"
            />
          </div>
        </motion.div>
      </section>

      {/* Footer Nav Simulation (as per wireframe) */}
      <div className="h-20" />
      <div className="fixed bottom-0 left-0 right-0 h-20 bg-white border-t border-border px-8 flex justify-around items-center">
        <div className="flex flex-col items-center gap-1 text-primary">
          <Home className="h-6 w-6" />
          <span className="text-[10px] font-bold uppercase tracking-widest">Home</span>
        </div>
        <div className="flex flex-col items-center gap-1 text-foreground/40" onClick={() => navigate('/login')}>
          <ShoppingBag className="h-6 w-6" />
          <span className="text-[10px] font-bold uppercase tracking-widest">Orders</span>
        </div>
        <div className="flex flex-col items-center gap-1 text-foreground/40" onClick={() => navigate('/login')}>
          <User className="h-6 w-6" />
          <span className="text-[10px] font-bold uppercase tracking-widest">Account</span>
        </div>
      </div>
    </div>
  );
};
