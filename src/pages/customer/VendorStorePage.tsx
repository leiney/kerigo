import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@stackloop/ui';
import {
  ArrowLeft, Heart, MoreHorizontal, Search, SlidersHorizontal,
  Plus, ShoppingCart, Home, ShoppingBag, User, ChevronRight
} from 'lucide-react';
import { motion } from 'motion/react';
import BottomNav from '../../components/BottomNav';

// --- Mock Data ---
const vendor = {
  name: 'KFC',
  category: 'Fast Food',
  time: '25-30 min',
  isOpen: true,
  rating: 4.6,
  reviews: '1.2K+',
  logo: '/kfc.png'
};

const categories = [
  { name: 'Buckets', img: '/buckets.jpeg' },
  { name: 'Burgers', img: '/burgers.jpeg' },
  { name: 'Box Meals', img: '/box-meals.jpeg' },
  { name: 'Snacks', img: '/snacks.jpeg' },
  { name: 'Drinks', img: '/drinks.jpeg' }
];

const menuItems = [
  { id: 1, name: 'Streetwise 2', desc: '2 pcs of chicken, regular chips and a dinner roll.', price: 550, img: '/Streetwise 2.jpeg' },
  { id: 2, name: 'Zinger Burger', desc: 'Spicy Zinger fillet with lettuce and mayo.', price: 450, img: '/Zinger Burger.jpeg' },
  { id: 3, name: 'Streetwise 3', desc: '3 pcs of chicken, large chips and a roll.', price: 750, img: '/Streetwise 3.jpeg' },
  { id: 4, name: 'Family Feast', desc: '8 pcs of chicken, 2 large chips, 4 rolls and 1.5L drink.', price: 2150, img: '/familty-feast.jpeg' }
];

export const VendorStorePage: React.FC = () => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('Buckets');
  const cartCount = 2;
  const cartTotal = 1000;

  return (
    <div className="min-h-screen bg-white text-foreground font-sans antialiased pb-32">
      
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
            src={vendor.logo} 
            alt={vendor.name} 
            className="w-14 h-14 rounded-full object-cover border border-border shadow-sm bg-white" 
          />
          <div>
            <h2 className="text-xl font-bold text-foreground leading-tight">{vendor.name}</h2>
            <p className="text-xs text-foreground/50 font-medium mt-0.5">{vendor.category} • {vendor.time}</p>
          </div>
        </div>

        {/* Row 3: Status & Rating */}
        <div className="flex items-center gap-3">
          <Badge variant={vendor.isOpen ? 'success' : 'danger'} size="sm" className="font-bold px-2 py-0.5 rounded-full">
            {vendor.isOpen ? 'Open' : 'Closed'}
          </Badge>
          <div className="flex items-center gap-1 text-xs font-semibold text-foreground/70">
            <span className="text-foreground">{vendor.rating}</span>
            <span className="text-primary">★</span>
            <span className="text-foreground/40">({vendor.reviews})</span>
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
            placeholder={`Search for ${vendor.category.toLowerCase()} items...`}
            className="w-full h-12 pl-12 pr-12 bg-white border border-border rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm font-medium placeholder:text-foreground/30"
          />
          <button className="absolute inset-y-0 right-2 flex items-center justify-center p-2 text-foreground/50 hover:text-foreground transition-colors">
            <SlidersHorizontal className="h-5 w-5" />
          </button>
        </motion.div>
      </div>

      {/* --- Category Tabs --- */}
      <div className="px-5 pb-4">
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map((cat) => (
            <motion.button
              key={cat.name}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveCategory(cat.name)}
              className={`flex flex-col items-center gap-1 min-w-[64px] transition-all ${
                activeCategory === cat.name ? 'text-primary' : 'text-foreground/50'
              }`}
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center overflow-hidden ${
                activeCategory === cat.name ? 'bg-primary/10' : 'bg-secondary'
              }`}>
                <img src={cat.img} alt={cat.name} className="w-full h-full object-cover" />
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
      <section className="px-5 py-2">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h3 className="text-lg font-bold text-foreground mb-4">Popular</h3>
          
          <div className="space-y-5">
            {menuItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.08 }}
                className="flex gap-4 items-center "
              >
                {/* Item Image */}
                <div className="w-22 h-22 rounded-2xl  overflow-hidden shrink-0 bg-secondary">
                  <img src={item.img} alt={item.name} className="w-full h-full object-cover" />
                </div>

                {/* Item Details */}
                <div className="flex-1 min-w-0 pt-1 border-b-2 border-border/60 pb-2">
                  <h4 className="font-bold text-base text-foreground leading-tight truncate">{item.name}</h4>
                  <p className="text-xs text-foreground/50 mt-1 line-clamp-2 leading-relaxed min-h-10">{item.desc}</p>
                  <div className="flex items-center justify-between relative">
                    <span className="font-bold text-sm text-foreground">KSh {item.price.toLocaleString()}</span>
                    <motion.button 
                      whileTap={{ scale: 0.9 }}
                      className="h-8 w-8 absolute right-2 bottom-2 bg-primary text-white rounded-full flex items-center justify-center shadow-md shadow-primary/20 active:bg-primary/90 transition-colors"
                    >
                      <Plus className="h-5 w-5" />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* --- Floating Cart Summary Bar --- */}
      <motion.div 
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="fixed bottom-20 left-4 right-4 z-40"
      >
        <div className="bg-primary/20 border border-primary/20 rounded-2xl p-3 flex items-center justify-between backdrop-blur-sm">
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
      </motion.div>

      {/* --- Bottom Navigation --- */}
      <BottomNav cartCount={cartCount} />

    </div>
  );
};