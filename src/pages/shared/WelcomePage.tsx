import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Info,
  ArrowRight,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import PullToRefresh from '../../components/PullToRefresh';
import BottomNav from '../../components/BottomNav';
import { VendorsApi } from '../../../lib/api';
import type { VendorSummary } from '../../../lib/types';
import { returnImageUrl } from '../../../config';
import { useQuery } from '@tanstack/react-query';
import { App } from '@capacitor/app';

export const WelcomePage: React.FC = () => {
  const navigate = useNavigate();
  const [showAppInfo, setShowAppInfo] = useState(false);
  const [appVersion, setAppVersion] = useState<string>('1.3.4');
  const currentYear = new Date().getFullYear();

  const vendorsQuery = useQuery<VendorSummary[]>({
    queryKey: ['vendors'],
    queryFn: async () => {
      const vendorsData = await VendorsApi.getVendors();
      return (vendorsData || []).map((v: any) => ({
        id: v.id,
        slug: v.id,
        name: v.vendorName || v.name || 'Vendor',
        category: 'Local Vendor',
        time: v.distanceText || v.durationText || '25-30 min',
        logoUrl: returnImageUrl(v.logoURL || v.logoUrl),
      }));
    },
  });

  const isLoading = vendorsQuery.isLoading;
  const vendors = vendorsQuery.data ?? [];

  const handleInfoClick = async () => {
    try {
      const info = await App.getInfo();
      setAppVersion(info.version);
    } catch (error) {
      console.error('Failed to get app info:', error);
    }
    setShowAppInfo(true);
  };

  return (
    <PullToRefresh onRefresh={async () => { await vendorsQuery.refetch(); }}>
      <div className="min-h-screen bg-white text-foreground font-sans antialiased pb-24">
      {/* Header / Hero Section */}
      <div className="px-5 pt-6 pb-8">
        {/* Logo & Info Icon */}
        <header className="flex items-center justify-between mb-8">
          <img src='/kerigo.png' alt="KeriGo Logo" className="h-12 sm:h-14" />
          <button 
            onClick={handleInfoClick}
            className="p-2 rounded-full hover:bg-secondary transition-colors"
          >
            <Info className="w-6 h-6 text-foreground/70" />
          </button>
        </header>

        {/* Hero Content */}
        <section className="flex flex-nowrap items-center gap-4 mb-2">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex-1 min-w-0"
          >
            <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground leading-tight mb-2">
              Everything you need, <span className="text-primary">delivered.</span>
            </h1>
            <p className="text-xs sm:text-sm text-foreground/60 font-medium leading-relaxed">
              Food, groceries, pharmacy and more from trusted local vendors.
            </p>
          </motion.div>

          {/* Hero Illustration */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="shrink-0 w-32 h-32 sm:w-36 sm:h-36"
          >

            <img
              src="/shopping-bag.png"
              alt="Delivery illustration"
              className="w-full h-full object-contain drop-shadow-xl"
            />
          </motion.div>
        </section>
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
            {isLoading ? (
              Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="flex flex-col items-center animate-pulse">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 bg-secondary/50 border border-border rounded-2xl flex items-center justify-center shadow-sm" />
                  <div className="w-12 h-3 bg-secondary/60 rounded-md mt-3 mb-1" />
                  <div className="w-8 h-2.5 bg-secondary/40 rounded-md" />
                </div>
              ))
            ) : vendors.map((vendor, index) => (
              <motion.div
                key={vendor.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 + index * 0.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate(`/customer/vendor/${vendor.slug}`)}
                className="flex flex-col items-center   cursor-pointer group"
              >
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-white border border-border rounded-2xl flex items-center justify-center shadow-sm group-hover:border-primary/50 transition-colors overflow-hidden">
                  <img
                    src={vendor.logoUrl}
                    alt={vendor.name}
                    className="w-full h-full object-fit rounded-sm"
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

      {/* App Info Modal */}
      <AnimatePresence>
        {showAppInfo && (
          <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAppInfo(false)}
              className="absolute inset-0 bg-black/60"
            />

            {/* Modal Container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ type: 'spring', damping: 25, stiffness: 350 }}
              className="relative z-10 bg-white rounded-3xl p-6 shadow-2xl w-full max-w-sm"
            >
              {/* Close Button */}
              <button
                onClick={() => setShowAppInfo(false)}
                className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-secondary text-foreground/40 hover:text-foreground/70 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* Icon */}
              <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Info className="w-8 h-8 text-primary" />
              </div>

              {/* Title & Description */}
              <h3 className="text-lg font-bold text-foreground text-center mb-2">
                About KeriGo
              </h3>
              <p className="text-sm text-foreground/60 text-center leading-relaxed mb-6">
                KeriGo Delivery App is your reliable local delivery partner. We connect you with trusted vendors for food, groceries, pharmacy and more delivered fast, safe and right to your doorstep.
              </p>

              {/* App Details */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between items-center py-2 border-b border-border/50">
                  <span className="text-sm text-foreground/70">App Name</span>
                  <span className="text-sm font-semibold text-foreground">KeriGo Delivery App</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-border/50">
                  <span className="text-sm text-foreground/70">Powered By</span>
                  <span className="text-sm font-semibold text-foreground">Slicksales Ltd</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-border/50">
                  <span className="text-sm text-foreground/70">App Version</span>
                  <span className="text-sm font-semibold text-foreground">{appVersion}</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm text-foreground/70">Copyright</span>
                  <span className="text-sm font-semibold text-foreground">©{currentYear} KeriGo Solutions Limited</span>
                </div>
              </div>

              {/* OK Button */}
              <button
                onClick={() => setShowAppInfo(false)}
                className="w-full bg-primary text-white font-bold py-3 rounded-2xl shadow-lg hover:bg-primary/90 transition-colors"
              >
                OK
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      </div>
    </PullToRefresh>
  );
};
