import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bell,
  ShoppingBag,
  MapPin,
  Clock,
  Wallet,
  ChevronRight,
  RotateCw,
  ShoppingCart,
  Check
} from 'lucide-react';
import { Button, Badge } from '@stackloop/ui';
import { motion } from 'motion/react';
import BottomNav from '../../components/BottomNav';
import { selectCartCount, useCartStore } from '../../store/cartStore';

// --- Mock Data ---
const latestOrder = {
  id: 'KR1024',
  date: 'Today, 10:30 AM',
  itemCount: 2,
  total: 1240,
  status: 'On the way',
  payment: 'M-Pesa',
  address: 'Westlands, Nairobi',
  addressNote: 'Near Sarit Centre',
  eta: '~20 mins',
  steps: [
    { label: 'Confirmed', time: '10:30 AM', completed: true, active: false },
    { label: 'Preparing', time: '10:35 AM', completed: true, active: false },
    { label: 'On the way', time: '10:40 AM', completed: false, active: true },
    { label: 'Delivered', time: '', completed: false, active: false }
  ]
};

const pastOrders = [
  { id: '#KR1010', items: 'Bananas', date: 'Yesterday', price: 980, status: 'Delivered', img: '/banana.jpeg' },
  { id: '#KR0985', items: 'Milk 500ml', date: 'Last Week', price: 1450, status: 'Delivered', img: '/milk.jpeg' },
  { id: '#KR0954', items: 'Tomatoes', date: '2 Weeks Ago', price: 670, status: 'Cancelled', img: '/tomatoes.jpeg' }
];

const recommendations = [
  { id: 1, name: 'Avocado', price: 250, unit: '/ kg', img: '/avocado.jpeg' },
  { id: 2, name: 'Tomatoes', price: 160, unit: '/ kg', img: '/tomatoes.jpeg' },
  { id: 3, name: 'Milk 500ml', price: 120, unit: '', img: '/milk.jpeg' }
];

export const CustomerHomePage: React.FC = () => {
  const navigate = useNavigate();
  const cartItems = useCartStore((state) => state.items);
  const cartCount = selectCartCount(cartItems);

  return (
    <div className="min-h-screen bg-background text-foreground font-sans antialiased pb-24">
      {/* --- Header --- */}
      <header className="px-4 pt-5 pb-3 flex items-start justify-between sticky top-0 bg-background z-40">
        <div>
          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xl font-bold text-foreground"
          >
            Hello, Leiney <span className="inline-block">👋</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-xs text-foreground/60 mt-1"
          >
            What would you like to get today?
          </motion.p>
        </div>

        <motion.button
          whileTap={{ scale: 0.9 }}
          className="relative p-2 rounded-full bg-white border border-border shadow-sm"
        >
          <Bell className="w-4 h-4 text-foreground" />
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary text-white text-[9px] font-bold rounded-full flex items-center justify-center border border-white">
            2
          </span>
        </motion.button>
      </header>

      {/* --- Main Content --- */}
      <div className="px-3 space-y-3.5">
        
        {/* --- Latest Order Card --- */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl p-4 shadow-xs border border-border/50"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <h2 className="font-bold text-base text-foreground">Latest Order</h2>
              <span className="bg-primary/10 text-primary text-[10px] font-semibold px-2 py-0.5 rounded-full">
                {latestOrder.status}
              </span>
            </div>
            <button
              onClick={() => navigate('/customer/orders')}
              className="text-primary text-xs font-semibold flex items-center gap-1 hover:underline"
            >
              View all orders <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Order Info & Illustration */}
          <div className="flex items-start justify-between gap-3 mb-4">
            <div className="flex-1 min-w-0">
              <p className="text-xs text-foreground/70 font-medium">Order #{latestOrder.id}</p>
              <p className="text-[11px] text-foreground/50 mt-0.5">{latestOrder.date} • {latestOrder.itemCount} items</p>
              <h3 className="text-xl font-bold text-foreground mt-1.5">KES {latestOrder.total.toLocaleString()}</h3>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[11px] text-foreground/50">Paid via {latestOrder.payment}</span>
                <Badge variant="success" className="bg-gray-100 text-gray-600 hover:bg-gray-200 border-0 text-[9px] py-0 px-1.5">
                  M-PESA
                </Badge>
              </div>
              <button className="text-primary text-xs font-semibold mt-2.5 flex items-center gap-1">
                View order details <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
            
            <div className="w-24 h-24 shrink-0 relative">
              <img
                src="/shopping-bag.png"
                alt="Groceries"
                className="w-full h-full object-contain drop-shadow-sm"
              />
            </div>
          </div>

                  {/* Stepper */}
        <div className="relative flex items-start justify-between mb-4 px-1 pt-1">

          {/* Background line */}
          <div className="absolute top-5 left-[10%] right-[10%] h-0.5 bg-border rounded-full" />

          {/* Active progress */}
          <div className="absolute top-5 left-[10%] w-[50%] h-0.5 bg-primary rounded-full" />

          {latestOrder.steps.map((step, index) => (
            <div
              key={index}
              className="relative z-10 flex flex-1 flex-col items-center"
            >
              <div
                className={`flex items-center justify-center rounded-full border-2 ${
                  step.completed
                    ? 'w-8 h-8 bg-primary border-primary text-white'
                    : step.active
                      ? 'w-8 h-8 bg-white border-primary text-primary'
                      : 'w-8 h-8 bg-white border-gray-200 text-gray-300'
                }`}
              >
                {step.completed ? (
                  <Check className="w-3.5 h-3.5" />
                ) : (
                  <ShoppingBag className="w-3.5 h-3.5" />
                )}
              </div>

              <span
                className={`text-[10px] font-medium mt-1.5 ${
                  step.active || step.completed
                    ? 'text-primary'
                    : 'text-gray-400'
                }`}
              >
                {step.label}
              </span>

              {step.time && (
                <span className="text-[9px] text-gray-400 mt-0.5">
                  {step.time}
                </span>
              )}
            </div>
          ))}
        </div>

          {/* Footer Details */}
          <div className="pt-3 border-t border-border/50 grid grid-cols-3 gap-1.5">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-primary/5 rounded-full flex items-center justify-center shrink-0">
                <MapPin className="w-3.5 h-3.5 text-primary" />
              </div>
              <div>
                <p className="text-[9px] text-foreground/50 font-medium">Deliver to</p>
                <p className="text-xs font-bold text-foreground leading-tight">{latestOrder.address}</p>
                <p className="text-[9px] text-foreground/40">{latestOrder.addressNote}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 border-x border-border px-2">
              <div className="w-7 h-7 bg-primary/5 rounded-full flex items-center justify-center shrink-0">
                <Clock className="w-3.5 h-3.5 text-primary" />
              </div>
              <div>
                <p className="text-[9px] text-foreground/50 font-medium">Est. delivery</p>
                <p className="text-xs font-bold text-primary">{latestOrder.eta}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-primary/5 rounded-full flex items-center justify-center shrink-0">
                <Wallet className="w-3.5 h-3.5 text-primary" />
              </div>
              <div>
                <p className="text-[9px] text-foreground/50 font-medium">Payment</p>
                <p className="text-xs font-bold text-foreground">{latestOrder.payment}</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* --- Past Orders --- */}
        <section className='bg-white rounded-2xl shadow-sm border border-border/50 p-3.5'>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-base text-foreground">Past Orders</h3>
            <button className="text-primary text-xs font-semibold flex items-center gap-1">
              See all <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="bg-white rounded-lg border border-border/50 overflow-hidden divide-y divide-border/50">
            {pastOrders.map((order, idx) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + idx * 0.1 }}
                className="p-3.5 flex items-center gap-3"
              >
                {/* Image */}
                <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0 bg-gray-100">
                  <img src={order.img} alt={order.items} className="w-full h-full object-cover" />
                </div>

                {/* Details */}
                <div className="min-w-0">
                  <p className="font-bold text-xs text-foreground">{order.id}</p>
                  <p className="text-[11px] text-foreground/60 truncate">{order.items}</p>
                  <p className="text-[10px] text-foreground/40 mt-0.5">{order.date}</p>
                </div>

                {/* Price & Status */}
                <div className="text-right flex-1 ">
                  <p className="font-bold text-xs text-foreground">KES {order.price.toLocaleString()}</p>
                  <span className={`inline-block text-[9px] font-bold px-2 py-0.5 rounded-full mt-1 ${
                    order.status === 'Delivered' ? 'bg-primary/10 text-primary' : 'bg-red-100 text-red-600'
                  }`}>
                    {order.status}
                  </span>
                </div>

                {/* Reorder Button */}
                <Button
                  variant="outline"
                  size="sm"
                  className="text-primary text-[10px] font-semibold h-7 px-2.5 border-primary/20 hover:bg-primary/5 gap-1 shrink-0"
                >
                  <RotateCw className="w-3 h-3" /> Reorder
                </Button>
                <ChevronRight className="w-3 h-3" />
              </motion.div>
            ))}
          </div>
        </section>

        {/* --- Recommendations --- */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-foreground">You may also be interested in</h3>
            <button className="text-primary text-xs font-semibold flex items-center gap-1">
              See all <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide -mx-3 px-3">
            {recommendations.map((item, idx) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 + idx * 0.1 }}
                whileTap={{ scale: 0.98 }}
                className="min-w-36 bg-white rounded-2xl p-2 border border-border/50 shadow-sm flex flex-col items-start text-start"
              >
                <div className="w-full h-20 rounded-lg overflow-hidden mb-2.5 bg-gray-100">
                  <img src={item.img} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <h4 className="font-bold text-xs text-foreground">{item.name}</h4>
                <p className="text-[11px] text-foreground/50 mt-0.5">
                  KES {item.price.toLocaleString()} {item.unit}
                </p>
                <Button
                  variant="ghost"
                  className="mt-2.5 w-full bg-primary/5 text-primary hover:bg-primary/10 rounded-lg h-7 text-[10px] font-bold px-2"
                >
                  <ShoppingCart className="w-3.5 h-3.5 mr-1" /> Buy
                </Button>
              </motion.div>
            ))}
          </div>
        </section>
      </div>

      {/* --- Bottom Navigation --- */}
      <BottomNav cartCount={cartCount} />
    </div>
  );
};