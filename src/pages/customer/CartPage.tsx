
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Trash2, Plus, Minus, ShoppingBag, CreditCard, ChevronRight } from 'lucide-react';
import { Button, Card, CardContent } from '@stackloop/ui';
import { motion } from 'motion/react';

const CART_ITEMS = [
  { id: '1', name: 'Classic Cheeseburger', price: 850, quantity: 1, image: 'https://picsum.photos/seed/burger-menu/200/200' },
  { id: '2', name: 'French Fries (Large)', price: 350, quantity: 2, image: 'https://picsum.photos/seed/fries/200/200' },
];

export const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const subtotal = CART_ITEMS.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const deliveryFee = 150;
  const total = subtotal + deliveryFee;

  return (
    <div className="bg-secondary min-h-screen pb-32">
      <header className="bg-white px-6 pt-12 pb-6 flex items-center gap-4 sticky top-0 z-20 border-b border-border">
         <button onClick={() => navigate(-1)} className="h-10 w-10 flex items-center justify-center rounded-full bg-secondary border border-border">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="text-xl font-black">Your Cart</h1>
      </header>

      <div className="p-6 space-y-6">
        {/* Vendor Mini Card */}
        <div className="bg-white rounded-[1.5rem] p-4 flex items-center gap-4 shadow-sm">
           <img src="https://picsum.photos/seed/burger-mini/100/100" className="h-12 w-12 rounded-xl object-cover" />
           <div>
             <h4 className="font-bold text-sm">Burger King</h4>
             <p className="text-[10px] text-foreground/40 font-medium">1.2 km away • Fast Food</p>
           </div>
        </div>

        {/* Cart Items */}
        <div className="space-y-4">
          {CART_ITEMS.map((item) => (
            <motion.div key={item.id} layout>
              <Card className="rounded-[1.5rem] border-none shadow-sm bg-white overflow-hidden">
                <CardContent className="p-4 flex gap-4">
                   <img src={item.image} alt={item.name} className="h-20 w-20 rounded-2xl object-cover" />
                   <div className="flex-1 flex flex-col justify-between">
                      <div className="flex justify-between items-start">
                        <h4 className="font-bold text-sm line-clamp-1">{item.name}</h4>
                        <button className="text-red-500/40 hover:text-red-500">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="flex justify-between items-end">
                        <span className="font-black text-primary italic">KES {item.price}</span>
                        <div className="flex items-center gap-3 bg-secondary rounded-xl p-1 border border-border">
                           <button className="h-7 w-7 flex items-center justify-center bg-white rounded-lg shadow-sm">
                             <Minus className="h-3 w-3" />
                           </button>
                           <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                           <button className="h-7 w-7 flex items-center justify-center bg-primary text-white rounded-lg shadow-sm">
                             <Plus className="h-3 w-3" />
                           </button>
                        </div>
                      </div>
                   </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Summary Card */}
        <Card className="rounded-[2rem] border-none shadow-sm bg-white p-2">
          <CardContent className="p-6 space-y-4">
             <div className="flex justify-between text-sm">
                <span className="text-foreground/40 font-medium">Subtotal</span>
                <span className="font-bold text-foreground/70">KES {subtotal}</span>
             </div>
             <div className="flex justify-between text-sm">
                <span className="text-foreground/40 font-medium">Delivery Fee</span>
                <span className="font-bold text-foreground/70">KES {deliveryFee}</span>
             </div>
             <div className="h-px bg-border w-full" />
             <div className="flex justify-between items-center pt-2">
                <span className="font-black text-lg">Total</span>
                <span className="font-black text-2xl text-primary italic">KES {total}</span>
             </div>
          </CardContent>
        </Card>

        {/* Payment Method Quick Select */}
        <div className="bg-white rounded-[2rem] p-6 flex items-center justify-between shadow-sm border border-white">
           <div className="flex items-center gap-4">
              <div className="h-10 w-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                 <CreditCard className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm">M-Pesa</h4>
                <p className="text-[10px] text-foreground/40">Default Payment Method</p>
              </div>
           </div>
           <ChevronRight className="h-4 w-4 text-foreground/20" />
        </div>
      </div>

      {/* Floating Checkout Button */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-white/80 backdrop-blur-xl border-t border-border flex flex-col gap-4">
        <Button 
          onClick={() => navigate('/customer/checkout')}
          className="w-full h-14 rounded-2xl text-lg font-bold flex justify-between px-8"
          icon={<ChevronRight className="h-6 w-6" />}
        >
          Checkout
        </Button>
      </div>
    </div>
  );
};
