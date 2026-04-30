
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, Clock, Info, Search, Plus, Minus, ShoppingBag } from 'lucide-react';
import { Button, Card, CardContent, Badge } from '@stackloop/ui';
import { motion } from 'motion/react';

const MENU_ITEMS = [
  { id: '1', name: 'Classic Cheeseburger', description: 'Flame-grilled beef patty, melted cheddar, pickles, and our signature sauce.', price: 'KES 850', image: 'https://picsum.photos/seed/burger-menu/200/200' },
  { id: '2', name: 'Premium Grilled Chicken', description: 'Hand-breaded white meat chicken, seasoned and fried to a golden crisp.', price: 'KES 950', image: 'https://picsum.photos/seed/chicken/200/200' },
  { id: '3', name: 'Double Whopper', description: 'Two quarter-pound flame-grilled beef patties with juicy tomatoes and fresh lettuce.', price: 'KES 1,200', image: 'https://picsum.photos/seed/whopper/200/200' },
  { id: '4', name: 'French Fries (Large)', description: 'Perfectly salted and cut from high-quality potatoes.', price: 'KES 350', image: 'https://picsum.photos/seed/fries/200/200' },
];

export const VendorDetails: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Image */}
      <div className="relative h-64 overflow-hidden">
        <img 
          src="https://picsum.photos/seed/restaurant-hero/800/600" 
          alt="Restaurant" 
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <button 
          onClick={() => navigate(-1)}
          className="absolute top-6 left-6 h-10 w-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/20"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
      </div>

      {/* Info Card Overlay */}
      <div className="px-6 -mt-12 relative z-10 pb-32">
        <Card className="rounded-[2.5rem] border-none shadow-xl bg-white p-2">
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h1 className="text-2xl font-black mb-1">Burger King</h1>
                <p className="text-xs text-foreground/40 font-medium">American • Burgers • Fast Food</p>
              </div>
              <div className="h-12 w-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                <Info className="h-6 w-6" />
              </div>
            </div>

            <div className="flex items-center gap-6 border-t border-border pt-6">
               <div className="flex items-center gap-2">
                 <Star className="h-4 w-4 text-orange-400 fill-orange-400" />
                 <span className="text-sm font-black">4.5</span>
                 <span className="text-[10px] text-foreground/40 font-bold">(500+ reviews)</span>
               </div>
               <div className="h-4 w-px bg-border" />
               <div className="flex items-center gap-2">
                 <Clock className="h-4 w-4 text-primary" />
                 <span className="text-sm font-black">15-25 min</span>
               </div>
            </div>
          </CardContent>
        </Card>

        {/* Search menu */}
        <div className="mt-10 mb-8 relative">
           <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-foreground/20" />
           <input 
            type="text" 
            placeholder="Search in menu..."
            className="w-full h-14 pl-12 bg-secondary rounded-[1.5rem] border-none focus:ring-2 focus:ring-primary/20 text-sm font-medium"
           />
        </div>

        {/* Menu Sections */}
        <div className="flex gap-4 mb-10 overflow-x-auto pb-2 scrollbar-none">
          <Badge variant="primary" className="h-10 px-6 rounded-full text-xs font-bold whitespace-nowrap">Featured</Badge>
          <Badge variant="secondary" className="h-10 px-6 rounded-full text-xs font-bold text-foreground/50 whitespace-nowrap bg-secondary border-none">Burgers</Badge>
          <Badge variant="secondary" className="h-10 px-6 rounded-full text-xs font-bold text-foreground/50 whitespace-nowrap bg-secondary border-none">Sides</Badge>
          <Badge variant="secondary" className="h-10 px-6 rounded-full text-xs font-bold text-foreground/50 whitespace-nowrap bg-secondary border-none">Drinks</Badge>
        </div>

        {/* Menu Items List */}
        <div className="space-y-8">
           {MENU_ITEMS.map((item) => (
             <div key={item.id} className="flex gap-4 items-start border-b border-border pb-8 last:border-none">
                <div className="flex-1">
                   <h4 className="font-bold text-lg mb-1">{item.name}</h4>
                   <p className="text-xs text-foreground/40 leading-relaxed mb-4 line-clamp-2">{item.description}</p>
                   <span className="text-md font-black text-primary">{item.price}</span>
                </div>
                <div className="relative">
                   <img 
                    src={item.image} 
                    alt={item.name} 
                    className="w-24 h-24 object-cover rounded-2xl"
                    referrerPolicy="no-referrer"
                   />
                   <button className="absolute -bottom-2 right-[-8px] h-10 w-10 bg-white shadow-lg rounded-xl flex items-center justify-center border border-border group hover:bg-primary hover:text-white transition-colors">
                     <Plus className="h-5 w-5 transition-transform group-active:scale-90" />
                   </button>
                </div>
             </div>
           ))}
        </div>
      </div>

      {/* Floating Cart Summary (Responsive pattern) */}
      <div className="fixed bottom-6 left-6 right-6 z-50">
        <motion.div 
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate('/customer/cart')}
          className="bg-primary text-white h-16 rounded-[1.5rem] shadow-2xl flex items-center justify-between px-6 cursor-pointer"
        >
          <div className="flex items-center gap-3">
             <div className="h-8 w-8 bg-white/20 rounded-lg flex items-center justify-center relative">
               <ShoppingBag className="h-5 w-5" />
               <div className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full text-[8px] flex items-center justify-center font-bold">2</div>
             </div>
             <span className="text-sm font-bold">View Cart</span>
          </div>
          <span className="text-lg font-black italic">KES 1,700</span>
        </motion.div>
      </div>

      {/* Spacing for mobile nav */}
      <div className="h-24 sm:hidden" />
    </div>
  );
};
