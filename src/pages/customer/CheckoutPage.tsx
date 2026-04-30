
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, CreditCard, ChevronRight, CheckCircle2, Clock } from 'lucide-react';
import { Button, Card, CardContent, Input, Badge } from '@stackloop/ui';
import { motion } from 'motion/react';

export const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const [isOrdered, setIsOrdered] = React.useState(false);

  if (isOrdered) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-8 text-center">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
          <div className="w-40 h-40 bg-primary/10 rounded-full flex items-center justify-center mb-8 mx-auto">
             <CheckCircle2 className="h-20 w-20 text-primary" />
          </div>
          <h2 className="text-4xl font-black mb-4 italic">Ordered!</h2>
          <p className="text-foreground/40 mb-10 max-w-xs font-medium">
            Your order has been placed and is being prepared. Realtime tracking will start shortly.
          </p>
          
          <Card className="rounded-[2rem] border-none shadow-sm bg-secondary p-6 mb-10 border border-border/50">
             <div className="flex items-center gap-4 text-left">
                <div className="h-10 w-10 bg-white rounded-xl flex items-center justify-center">
                  <Clock className="h-5 w-5 text-primary" />
                </div>
                <div>
                   <p className="text-[10px] uppercase font-bold text-foreground/40">Estimated Arrival</p>
                   <h4 className="font-bold text-lg">25 - 35 mins</h4>
                </div>
             </div>
          </Card>

          <Button className="w-full h-14 rounded-2xl font-bold text-lg" onClick={() => navigate('/customer/')}>
            Track Order
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="bg-secondary min-h-screen pb-32">
      <header className="bg-white px-6 pt-12 pb-6 flex items-center gap-4 sticky top-0 z-20 border-b border-border">
         <button onClick={() => navigate(-1)} className="h-10 w-10 flex items-center justify-center rounded-full bg-secondary border border-border">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="text-xl font-black">Checkout</h1>
      </header>

      <div className="p-6 space-y-6">
        {/* Delivery Address */}
        <section>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-black uppercase tracking-widest text-foreground/40">Delivery Address</h3>
            <button className="text-xs font-bold text-primary">Edit</button>
          </div>
          <Card className="rounded-[1.5rem] border-none shadow-sm bg-white overflow-hidden">
             <CardContent className="p-6 flex items-center gap-4">
                <div className="h-12 w-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                  <MapPin className="h-6 w-6" />
                </div>
                <div className="flex-1">
                   <h4 className="font-bold text-sm">Home</h4>
                   <p className="text-xs text-foreground/40 font-medium">123 KeriGo Street, Nairobi, KE</p>
                </div>
             </CardContent>
          </Card>
        </section>

        {/* Payment Method */}
        <section>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-black uppercase tracking-widest text-foreground/40">Payment Method</h3>
            <button className="text-xs font-bold text-primary">Change</button>
          </div>
          <Card className="rounded-[1.5rem] border-none shadow-sm bg-white overflow-hidden">
             <CardContent className="p-6 flex items-center gap-4">
                <div className="h-12 w-12 bg-green-50 rounded-2xl flex items-center justify-center text-green-600">
                  <span className="font-black italic text-xl">M</span>
                </div>
                <div className="flex-1">
                   <h4 className="font-bold text-sm">M-Pesa Express</h4>
                   <p className="text-xs text-foreground/40 font-medium">+254 712 *** 678</p>
                </div>
                <Badge variant="primary" className="bg-primary/10 text-primary border-none text-[8px] font-black uppercase tracking-widest">Active</Badge>
             </CardContent>
          </Card>
        </section>

        {/* Order Summary Brief */}
        <section>
          <h3 className="text-sm font-black uppercase tracking-widest text-foreground/40 mb-4">Order Summary</h3>
          <Card className="rounded-[2rem] border-none shadow-sm bg-white p-2">
            <CardContent className="p-6 space-y-4">
               <div className="flex justify-between items-center text-sm">
                  <span className="text-foreground/70 font-medium">Burger King (3 items)</span>
                  <span className="font-bold">KES 1,700</span>
               </div>
               <div className="h-px bg-border w-full" />
               <div className="flex justify-between items-center pt-2">
                  <span className="font-bold text-lg">Total Amount</span>
                  <span className="font-black text-2xl text-primary italic">KES 1,700</span>
               </div>
            </CardContent>
          </Card>
        </section>

        {/* Promo Code Input */}
        <div className="flex gap-2">
           <Input placeholder="Enter Promo Code" className="rounded-xl h-12 flex-1" />
           <Button variant="outline" className="h-12 rounded-xl px-6 font-bold border-border shadow-sm">Apply</Button>
        </div>
      </div>

      {/* Floating Checkout Button */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-white/80 backdrop-blur-xl border-t border-border">
        <Button 
          onClick={() => setIsOrdered(true)}
          className="w-full h-14 rounded-2xl text-lg font-bold flex justify-between px-8"
          icon={<ChevronRight className="h-6 w-6" />}
        >
          Pay & Place Order
        </Button>
      </div>
    </div>
  );
};
