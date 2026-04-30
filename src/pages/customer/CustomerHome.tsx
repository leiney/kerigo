
import React from 'react';
import { Card, CardContent, Badge, Input } from '@stackloop/ui';
import { Search, SlidersHorizontal, MapPin, Star, Clock } from 'lucide-react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';

const CATEGORIES = [
  { id: '1', name: 'Food', icon: '🍔', color: 'bg-orange-100' },
  { id: '2', name: 'Grocery', icon: '🥦', color: 'bg-green-100' },
  { id: '3', name: 'Pharmacy', icon: '💊', color: 'bg-blue-100' },
  { id: '4', name: 'Parcel', icon: '📦', color: 'bg-purple-100' },
];

const VENDORS = [
  {
    id: '1',
    name: "Burger King",
    image: "https://picsum.photos/seed/burger/600/400",
    rating: 4.5,
    deliveryTime: "15-25 min",
    category: "American • Burgers",
    discount: "20% OFF",
  },
  {
    id: '2',
    name: "Green Grocers",
    image: "https://picsum.photos/seed/market/600/400",
    rating: 4.8,
    deliveryTime: "30-45 min",
    category: "Grocery • Fresh",
    discount: "Free Delivery",
  },
  {
    id: '3',
    name: "Sushi Zen",
    image: "https://picsum.photos/seed/sushi/600/400",
    rating: 4.7,
    deliveryTime: "20-35 min",
    category: "Japanese • Sushi",
  },
];

export const CustomerHome: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="p-6 pb-24">
      {/* Location Header */}
      <div className="flex items-center gap-2 mb-6">
        <MapPin className="h-5 w-5 text-primary" />
        <div>
          <p className="text-[10px] uppercase font-bold text-foreground opacity-40">Deliver to</p>
          <div className="flex items-center gap-1">
            <span className="text-sm font-bold">Home (123 Keri St)</span>
            <div className="h-1.5 w-1.5 bg-primary rounded-full" />
          </div>
        </div>
      </div>

      {/* Global Search */}
      <div className="flex gap-2 mb-8">
        <div className="relative flex-1 group">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-foreground/40" />
          </div>
          <input 
            type="text" 
            placeholder="Search food, groceries..."
            className="w-full h-12 pl-12 pr-4 bg-white border border-border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm"
          />
        </div>
        <button className="h-12 w-12 flex items-center justify-center bg-white border border-border rounded-xl shadow-sm text-foreground/60">
          <SlidersHorizontal className="h-5 w-5" />
        </button>
      </div>

      {/* Categories */}
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold">Categories</h3>
        <button className="text-primary text-xs font-bold uppercase tracking-widest">See All</button>
      </div>
      
      <div className="grid grid-cols-4 gap-4 mb-10 text-center">
        {CATEGORIES.map((cat) => (
          <motion.div key={cat.id} whileTap={{ scale: 0.95 }} className="flex flex-col items-center gap-2">
            <div className={`h-16 w-16 ${cat.color} rounded-2xl flex items-center justify-center text-2xl shadow-sm border border-white`}>
              {cat.icon}
            </div>
            <span className="text-xs font-bold text-foreground/70">{cat.name}</span>
          </motion.div>
        ))}
      </div>

      {/* Featured Banner */}
      <div className="relative h-44 rounded-3xl overflow-hidden mb-10">
        <img 
          src="https://picsum.photos/seed/promo/800/400" 
          alt="Promotion" 
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent flex flex-col justify-center p-8 text-white">
          <span className="text-[10px] font-bold uppercase tracking-widest mb-2 text-primary">Special Offer</span>
          <h3 className="text-2xl font-black mb-1">20% OFF</h3>
          <p className="text-sm opacity-80 mb-4 font-medium">On your first grocery order.</p>
          <button className="w-fit px-4 py-2 bg-primary text-white text-xs font-bold rounded-lg">Order Now</button>
        </div>
      </div>

      {/* Popular Vendors */}
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold">Popular Vendors</h3>
        <button className="text-primary text-xs font-bold uppercase tracking-widest">See All</button>
      </div>

      <div className="space-y-6">
        {VENDORS.map((vendor) => (
          <motion.div 
            key={vendor.id} 
            whileHover={{ scale: 1.01 }}
            onClick={() => navigate(`/customer/vendor/${vendor.id}`)}
          >
            <Card className="rounded-[2rem] border-none shadow-sm overflow-hidden bg-white">
              <div className="relative h-44">
                <img 
                  src={vendor.image} 
                  alt={vendor.name} 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                {vendor.discount && (
                  <div className="absolute top-4 left-4 bg-primary text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">
                    {vendor.discount}
                  </div>
                )}
                <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-1 shadow-sm">
                  <Star className="h-3 w-3 text-orange-400 fill-orange-400" />
                  <span className="text-[10px] font-black">{vendor.rating}</span>
                </div>
              </div>
              <CardContent className="p-5 flex justify-between items-start">
                <div>
                  <h4 className="text-lg font-bold mb-1">{vendor.name}</h4>
                  <p className="text-xs text-foreground/40 font-medium">{vendor.category}</p>
                </div>
                <div className="flex items-center gap-1 text-foreground/40">
                  <Clock className="h-3.5 w-3.5" />
                  <span className="text-[10px] font-bold">{vendor.deliveryTime}</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
