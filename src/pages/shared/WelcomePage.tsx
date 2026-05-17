import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bell,
  ArrowRight,
  Home,
  ShoppingBag,
  ShoppingCart,
  User,
} from 'lucide-react';
import { motion } from 'motion/react';
import BottomNav from '../../components/BottomNav';

// Vendor data matching the wireframe exactly
const vendors = [
  { name: 'KFC', time: '25-30 min', logo: '/kfc.png' },
  { name: 'Chicken Inn', time: '25-30 min', logo: '/chicken-in.jpg' },
  { name: 'Pizza Inn', time: '30-35 min', logo: '/pizzain.png' },
  { name: 'Java House', time: '20-25 min', logo: '/JavaHouse.webp' },
  { name: 'Carrefour', time: '30-40 min', logo: '/carrefour.webp' },
  { name: 'Naivas', time: '30-40 min', logo: '/naivas.png' },
  { name: 'Goodlife Pharmacy', time: '20-30 min', logo: '/goodlife.png' },
  { name: 'HealthPlus Pharmacy', time: '20-30 min', logo: '/healthplus.png' },
  { name: 'MedPlus Pharmacy', time: '20-30 min', logo: '/medplus.jpeg' },
  { name: 'The Butchery', time: '25-35 min', logo: '/thebutchery.png' },
];

export const WelcomePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white text-foreground font-sans antialiased pb-24">
      {/* Header / Hero Section */}
      <div className="relative overflow-hidden px-5 pt-6 pb-8">
        {/* Logo & Notification Bell */}
        <header className="flex items-center justify-between mb-8">
          <img src='/kerigo.png' alt="KeriGo Logo" className="h-12 sm:h-14" />
          <button className="p-2 rounded-full hover:bg-secondary transition-colors">
            <Bell className="w-6 h-6 text-foreground/70" />
          </button>
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
            <img
              src="/shopping-bag.png"
              alt="Delivery illustration"
              className="w-full h-full object-contain drop-shadow-xl"
            />
          </motion.div>
        </div>
      </div>

      {/* Shop by Vendor Section */}
      <section className="px-5 py-2">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-foreground">Shop by Vendor</h3>
            <button className="text-primary text-sm font-semibold active:opacity-70 transition-opacity">
              See all
            </button>
          </div>

          <div className="grid grid-cols-5 gap-3 sm:gap-4">
            {vendors.map((vendor, index) => (
              <motion.div
                key={vendor.name}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 + index * 0.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate(`/customer/vendor/${vendor.name.toLowerCase().replace(/\s+/g, '-')}`)}
                className="flex flex-col items-center   cursor-pointer group"
              >
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-white border border-border rounded-2xl flex items-center justify-center shadow-sm group-hover:border-primary/50 transition-colors overflow-hidden">
                  <img
                    src={vendor.logo}
                    alt={vendor.name}
                    className="w-10 h-10 sm:w-12 sm:h-12 object-contain rounded-sm"
                    onError={(e) => {
                    
                      (e.target as HTMLImageElement).src = '/default-vendor-logo.png';
                    }}
                  />
                </div>
                <span className="text-[11px] sm:text-xs font-bold text-foreground mt-2 text-center leading-tight line-clamp-2 min-h-8">
                  {vendor.name}
                </span>
                <span className="text-[10px] sm:text-[11px] text-foreground/50 font-medium">
                  {vendor.time}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Become a Rider / Vendor Banners */}
      <section className="px-5 space-y-4 py-6">
        {/* Become a Rider */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.8 }}
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
            <img src="/rider.png" alt="Rider" className="w-full h-full object-contain" />
          </div>
        </motion.div>

        {/* Become a Vendor */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.9 }}
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
            <img src="/store.png" alt="Vendor" className="w-full h-full object-contain" />
          </div>
        </motion.div>
      </section>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
};