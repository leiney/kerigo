import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Badge } from '@stackloop/ui';
import {
  ArrowLeft, Heart, MoreHorizontal, Search, SlidersHorizontal,
  Plus, ShoppingCart, Home, ShoppingBag, User, ChevronRight, AlertCircle
} from 'lucide-react';
import { motion } from 'motion/react';
import BottomNav from '../../components/BottomNav';
import { selectCartCount, selectCartTotal, useCartStore } from '../../store/cartStore';
import { VendorsApi } from '../../../lib/api';
import type { VendorStoreData, VendorMenuItem, LocationDetails } from '../../../lib/types';
import { returnImageUrl } from '../../../config';

export const VendorStorePage: React.FC = () => {
  const navigate = useNavigate();
  const { name: vendorId } = useParams<{ name: string }>();
  const [activeCategory, setActiveCategory] = useState('Buckets');
  const [searchQuery, setSearchQuery] = useState('');
  const [vendorLocation, setVendorLocation] = useState<Pick<LocationDetails, 'latitude' | 'longitude' | 'address' | 'city' | 'country' | 'postalCode'> | null>(null);
  const cartItems = useCartStore((state) => state.items);
  const addItem = useCartStore((state) => state.addItem);
  const cartCount = selectCartCount(cartItems);
  const cartTotal = selectCartTotal(cartItems);

  const vendorsQuery = useQuery<any[]>({
    queryKey: ['vendors'],
    queryFn: VendorsApi.getVendors,
  });

  const activeVendorId = useMemo(() => {
    if (vendorId) return vendorId;
    return vendorsQuery.data?.[0]?.vendorID ?? vendorsQuery.data?.[0]?.id;
  }, [vendorId, vendorsQuery.data]);

  const vendorDetailsQuery = useQuery<any>({
    queryKey: ['vendorDetails', activeVendorId],
    queryFn: async () => {
      if (!activeVendorId) {
        throw new Error('No vendor ID provided');
      }
      return VendorsApi.getVendorsDetails(activeVendorId);
    },
    enabled: !!activeVendorId,
  });

  const isLoading = vendorsQuery.isLoading || vendorDetailsQuery.isLoading;
  const error = vendorDetailsQuery.error || vendorsQuery.error;
  const errorMessage = error ? (error instanceof Error ? error.message : String(error)) : null;

  const storeData = useMemo<VendorStoreData | null>(() => {
    const details = vendorDetailsQuery.data;
    if (!details) return null;

    const detailsVendorID = details?.vendorID ?? details?.id ?? (details as any)?.vendorId ?? activeVendorId;
    return {
      vendor: {
        id: detailsVendorID,
        name: details.vendorName || 'Vendor',
        category: details.categories?.[0]?.name || 'Local Store',
        time: details.durationText && details.durationText !== '-' ? details.durationText : (details.distanceText && details.distanceText !== '0.0 km' ? details.distanceText : '25-30 min'),
        isOpen: details.available !== undefined ? details.available : (details.online || false),
        rating: details.rating || 4.5,
        reviews: details.reviewCount ? `${details.reviewCount}` : '10+',
        logoUrl: returnImageUrl(details.logoURL || details.logoUrl),
      },
      categories: (details.categories || []).map((cat: any) => ({
        name: cat.name,
        imageUrl: returnImageUrl(cat.imageURL || cat.image || cat.logoURL),
      })),
      menuItems: (details.products || []).map((p: any) => {
        const firstVariant = p.variants?.[0] || {};
        const imageId = firstVariant.images?.[0];
        return {
          id: p.productID || p.id,
          productID: p.productID || p.id,
          variantID: firstVariant.variantID ?? firstVariant.sku ?? undefined,
          name: p.name,
          description: p.description || '',
          price: firstVariant.price || 0,
          imageUrl: returnImageUrl(imageId),
          category: p.category?.[0]?.name || p.tags?.[0] || 'Uncategorized',
        };
      }),
    };
  }, [vendorDetailsQuery.data, activeVendorId]);

  useEffect(() => {
    if (!storeData) return;
    if (storeData.categories.length > 0 && activeCategory === 'Buckets') {
      setActiveCategory(storeData.categories[0].name);
    }
    if (storeData.vendor && vendorDetailsQuery.data?.location) {
      const location = vendorDetailsQuery.data.location;
      setVendorLocation({
        latitude: location.latitude,
        longitude: location.longitude,
        address: location.address || '',
        city: location.city || '',
        country: location.country || '',
        postalCode: location.postalCode || location.postcode || '',
      });
    }
  }, [storeData, activeCategory, vendorDetailsQuery.data]);

  const vendor = storeData?.vendor;
  const categories = storeData?.categories ?? [];
  const menuItems = storeData?.menuItems ?? [];

  const normalizedQuery = searchQuery.trim().toLowerCase();
  const filteredMenuItems = menuItems.filter((item) => {
    if (normalizedQuery) {
      return [item.name, item.description, vendor?.category ?? ''].some((value) =>
        value.toLowerCase().includes(normalizedQuery)
      );
    }
    return !activeCategory || item.category === activeCategory;
  });

  const recommendedItems = normalizedQuery
    ? (filteredMenuItems.length > 0 ? filteredMenuItems : menuItems).slice(0, 3)
    : [];

  if (isLoading) {
    return (
      <div className="h-dvh overflow-hidden flex flex-col bg-white text-foreground font-sans antialiased">
        <div className="px-5 pt-6 pb-4 animate-pulse space-y-4">
          <div className="flex items-center justify-between">
            <div className="h-10 w-28 rounded-full bg-secondary" />
            <div className="h-10 w-10 rounded-full bg-secondary" />
          </div>
          <div className="space-y-3">
            <div className="h-7 w-3/4 rounded-full bg-secondary" />
            <div className="h-4 w-1/2 rounded-full bg-secondary/80" />
          </div>
          <div className="h-32 rounded-[2rem] bg-secondary/70" />
        </div>

        <main className="flex-1 overflow-y-auto px-5 pb-24 space-y-5 animate-pulse">
          <div className="h-12 rounded-2xl bg-secondary" />
          <div className="flex gap-2 overflow-x-auto pb-2">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="h-10 min-w-[5rem] rounded-full bg-secondary" />
            ))}
          </div>
          <div className="grid gap-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="rounded-3xl border border-border/70 bg-secondary/70 p-4 space-y-4">
                <div className="h-40 rounded-[1.5rem] bg-secondary" />
                <div className="h-4 w-1/2 rounded-full bg-secondary/80" />
                <div className="flex items-center justify-between gap-3">
                  <div className="space-y-2 flex-1">
                    <div className="h-3 w-3/4 rounded-full bg-secondary/80" />
                    <div className="h-3 w-1/2 rounded-full bg-secondary/80" />
                  </div>
                  <div className="h-8 w-20 rounded-full bg-secondary/80" />
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    );
  }

  if (error || !storeData) {
    return (
      <div className="h-dvh flex flex-col items-center justify-center bg-white text-foreground px-6 text-center">
        <div className="flex flex-col items-center max-w-sm">
          <div className="w-16 h-16 bg-error/10 text-error rounded-full flex items-center justify-center mb-4">
            <AlertCircle className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-foreground mb-2">Store Unavailable</h2>
          <p className="text-sm text-foreground/60 mb-6">{errorMessage || 'Unable to retrieve store details. Please check your connection or try again later.'}</p>
          <button
            onClick={() => navigate(-1)}
            className="w-full h-12 rounded-2xl bg-primary hover:bg-primary/95 text-white font-bold text-sm shadow-md"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-dvh overflow-hidden flex flex-col bg-white text-foreground font-sans antialiased">
      
      {/* --- FIXED: Sticky Vendor Header --- */}
      <div className="sticky top-0 z-40 bg-white border-b border-border px-5 pt-4 pb-3">
        {/* Row 1: Back Arrow & Action Icons */}
        <div className="flex items-center justify-between mb-2">
          <motion.button 
            whileTap={{ scale: 0.9 }}
            onClick={() => navigate(-1)} 
            className="p-2 -ml-2 rounded-full hover:bg-secondary transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-foreground" />
          </motion.button>

          <div className="flex items-center gap-2">
            <button className="p-2 rounded-full hover:bg-secondary transition-colors">
              <Heart className="w-5 h-5 text-foreground/60" />
            </button>
            <button className="p-2 rounded-full hover:bg-secondary transition-colors">
              <MoreHorizontal className="w-5 h-5 text-foreground/60" />
            </button>
          </div>
        </div>

        {/* Row 2: Vendor Logo & Name */}
        <div className="flex items-center gap-3 mb-1.5">
          <img 
            src={vendor?.logoUrl ?? '/kfc.png'} 
            alt={vendor?.name ?? 'Vendor'} 
            className="w-14 h-14 rounded-full object-cover border border-border shadow-sm bg-white" 
          />
          <div>
            <h2 className="text-xl font-bold text-foreground leading-tight">{vendor?.name ?? 'Vendor'}</h2>
            <p className="text-xs text-foreground/50 font-medium mt-0.5">{vendor?.category ?? 'Fast Food'} • {vendor?.time ?? '25-30 min'}</p>
          </div>
        </div>

        {/* Row 3: Status & Rating */}
        <div className="flex items-center gap-3">
          <Badge variant={vendor?.isOpen ? 'success' : 'danger'} size="sm" className="font-bold px-2 py-0.5 rounded-full">
            {vendor?.isOpen ? 'Open' : 'Closed'}
          </Badge>
          <div className="flex items-center gap-1 text-xs font-semibold text-foreground/70">
            <span className="text-foreground">{vendor?.rating ?? 4.6}</span>
            <span className="text-primary">★</span>
            <span className="text-foreground/40">({vendor?.reviews ?? '1.2K+'})</span>
          </div>
        </div>
      </div>

      {/* --- Vendor Search Bar --- */}
      <div className="px-5 py-4">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative"
        >
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-foreground/40" />
          </div>
          <input 
            type="text" 
            placeholder={`Search for ${(vendor?.category ?? 'food').toLowerCase()} items...`}
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            className="w-full h-12 pl-12 pr-12 bg-white border border-border rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm font-medium placeholder:text-foreground/30"
          />
          <button className="absolute inset-y-0 right-2 flex items-center justify-center p-2 text-foreground/50 hover:text-foreground transition-colors">
            <SlidersHorizontal className="h-5 w-5" />
          </button>
        </motion.div>

        {normalizedQuery && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-3 rounded-2xl border border-border bg-white shadow-sm p-3"
          >
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-bold uppercase tracking-widest text-foreground/40">Recommended</p>
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="text-xs font-semibold text-primary"
              >
                Clear
              </button>
            </div>

            <div className="space-y-2">
              {recommendedItems.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    addItem({
                      id: String(item.id),
                      name: item.name,
                      store: vendor?.name ?? 'Vendor',
                      price: item.price,
                      image: item.imageUrl,
                      productID: String(item.productID ?? item.id),
                      variantID: item.variantID ? String(item.variantID) : undefined,
                      vendorId: vendor?.id,
                      vendorName: vendor?.name,
                      pickupLocation: vendorLocation ?? undefined,
                    });
                    setSearchQuery(item.name);
                  }}
                  className="w-full flex items-center gap-3 rounded-xl border border-border/60 px-3 py-2 text-left hover:bg-primary/5 transition-colors"
                >
                  <div className="h-12 w-12 rounded-lg overflow-hidden bg-secondary shrink-0">
                    <img src={item.imageUrl} alt={item.name} className="h-full w-full object-cover" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-sm text-foreground truncate">{item.name}</p>
                    <p className="text-xs text-foreground/50 truncate">{item.description}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-bold text-primary">KSh {item.price.toLocaleString()}</p>
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-foreground/40">Tap to add</p>
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* --- Category Tabs --- */}
      <div className="px-5">
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map((cat) => (
            <motion.button
              key={cat.name}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveCategory(cat.name)}
              className={`flex flex-col items-center gap-1 min-w-16 transition-all ${
                activeCategory === cat.name ? 'text-primary' : 'text-foreground/50'
              }`}
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center overflow-hidden ${
                activeCategory === cat.name ? 'bg-primary/10' : 'bg-secondary'
              }`}>
                <img src={cat.imageUrl} alt={cat.name} className="w-full h-full object-cover" />
              </div>
              <span className={`text-[11px] font-bold ${activeCategory === cat.name ? 'text-primary' : ''}`}>
                {cat.name}
              </span>
              {activeCategory === cat.name && (
                <motion.div 
                  layoutId="activeTab" 
                  className="h-0.5 w-6 bg-primary rounded-full mt-0.5" 
                />
              )}
            </motion.button>
          ))}
        </div>
      </div>

      {/* --- Menu Items List --- */}
      <section className="flex-1 min-h-0 px-5 py-2 pb-36 flex flex-col">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="shrink-0"
        >
          <h3 className="text-lg font-bold text-foreground mb-4">Popular</h3>
        </motion.div>

        <div className="flex-1 min-h-0 overflow-y-auto scrollbar-hide">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="space-y-5">
              {filteredMenuItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.08 }}
                  className="flex gap-4 items-center"
                >
                  {/* Item Image */}
                  <div className="w-22 h-22 rounded-2xl border border-border overflow-hidden shrink-0 bg-secondary">
                    <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                  </div>

                  {/* Item Details */}
                  <div className="flex-1 min-w-0 pt-1 border-b-2 border-border/40 pb-2">
                    <div className="flex items-center gap-3">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-base text-foreground leading-tight truncate">{item.name}</h4>
                        <p className="text-xs text-foreground/50 mt-1 line-clamp-2 leading-relaxed min-h-10">{item.description}</p>
                      </div>

                      <motion.button 
                        whileTap={{ scale: 0.9 }}
                        onClick={() => addItem({
                        id: String(item.id),
                        name: item.name,
                        store: vendor?.name ?? 'Vendor',
                        price: item.price,
                        image: item.imageUrl,
                        productID: String(item.productID ?? item.id),
                        variantID: item.variantID ? String(item.variantID) : undefined,
                        vendorId: vendor?.id,
                        vendorName: vendor?.name,
                        pickupLocation: vendorLocation ?? undefined,
                      })}
                        className="h-8 w-8 shrink-0 self-center bg-primary text-white rounded-full flex items-center justify-center shadow-md shadow-primary/20 active:bg-primary/90 transition-colors"
                      >
                        <Plus className="h-5 w-5" />
                      </motion.button>
                    </div>

                    <div className="mt-2 flex items-center justify-between">
                      <span className="font-bold text-sm text-foreground">KSh {item.price.toLocaleString()}</span>
                    </div>
                  </div>
                </motion.div>
              ))}

              {normalizedQuery && filteredMenuItems.length === 0 && (
                <div className="rounded-2xl border border-dashed border-border bg-secondary/40 p-5 text-center">
                  <p className="font-bold text-foreground">No exact matches found</p>
                  <p className="text-sm text-foreground/60 mt-1">Try one of the recommended items above.</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* --- Floating Cart Summary Bar --- */}
      {cartCount > 0 && (
        <motion.button 
          type="button"
          onClick={() => navigate('/cart')}
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="fixed bottom-20 left-4 right-4 z-40"
        >
          <div className="bg-primary/20 border border-primary/20 rounded-2xl p-3 flex items-center justify-between backdrop-blur-sm w-full">
          <div className="flex items-center gap-3">
            <div className="relative">
              <ShoppingCart className="h-5 w-5 text-primary" />
              <span className="absolute -top-1.5 -right-1.5 h-4 w-4 bg-primary text-white text-[9px] font-bold rounded-full flex items-center justify-center border border-white">
                {cartCount}
              </span>
            </div>
            <span className="text-sm font-bold text-primary">View Cart</span>
          </div>
          <div className="flex items-center gap-2 text-primary">
            <span className="text-sm font-bold">KSh {cartTotal.toLocaleString()}</span>
            <ChevronRight className="h-4 w-4" />
          </div>
          </div>
        </motion.button>
      )}

      {/* --- Bottom Navigation --- */}
      <BottomNav cartCount={cartCount} />

    </div>
  );
};