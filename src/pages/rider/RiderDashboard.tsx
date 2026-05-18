import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Menu,
  CircleDot,
  ChevronDown,
  Bell,
  Phone,
  MessageSquare,
  MapPin,
  Clock,
  Route,
  DollarSign,
  CheckCircle,
  Shield,
  ArrowRight,
  Timer,
  Star,
  ChevronRight,
} from 'lucide-react';
import { Button, Badge, BottomSheet } from '@stackloop/ui';
import { motion } from 'motion/react';
import BottomNav from '../../components/BottomNav';

// --- Mock Data ---
const activeOrders = [
  {
    id: 'KR1024',
    status: 'On the way to customer',
    statusColor: 'bg-primary/10 text-primary',
    time: '10:30 AM',
    pickup: {
      store: 'Naivas Westlands',
      address: 'Ring Road, Westlands',
    },
    dropoff: {
      area: 'Kilimani, Nairobi',
      address: 'Argwings Kodhek Road',
    },
    earnings: 180,
    distance: '3.2 km',
    estTime: '15 mins',
    action: { label: 'Mark as Delivered', icon: CheckCircle },
  },
  {
    id: 'KR1025',
    status: 'Picking up',
    statusColor: 'bg-primary/10 text-primary',
    time: '11:15 AM',
    pickup: {
      store: 'Quickmart Junction',
      address: 'Ngong Road, Junction',
    },
    dropoff: {
      area: 'Karen',
      address: 'Karen Road',
    },
    earnings: 220,
    distance: '4.6 km',
    estTime: '22 mins',
    action: { label: 'Mark as Picked Up', icon: CheckCircle },
  },
];

const progressStats = [
  { label: 'Completed orders', value: '4', icon: CheckCircle, color: 'text-primary', bg: 'bg-primary/10' },
  { label: 'Online time', value: '2h 15m', icon: Clock, color: 'text-info', bg: 'bg-info/10' },
  { label: 'Earnings', value: 'KES 2,340', icon: DollarSign, color: 'text-warning', bg: 'bg-warning/10' },
  { label: 'Rating', value: '4.8', icon: Star, color: 'text-primary', bg: 'bg-primary/10' },
];

export const RiderDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'active' | 'completed' | 'cancelled'>('active');
  const [isOnline, setIsOnline] = useState(true);

  return (
    <div className="min-h-screen bg-secondary text-foreground font-sans antialiased pb-24">
      {/* --- Header --- */}
      <header className="px-4 pt-5 pb-3 flex items-start justify-between bg-background sticky top-0 z-40 border-b border-border/50">
        <div className="flex items-center gap-3">
          <button className="p-2 -ml-2 rounded-full hover:bg-secondary transition-colors">
            <Menu className="w-5 h-5 text-foreground/70" />
          </button>
          <button
            onClick={() => setIsOnline(!isOnline)}
            className="flex items-center gap-1.5 bg-primary/10 text-primary text-xs font-bold px-3 py-1.5 rounded-full"
          >
            <CircleDot className={`w-3 h-3 ${isOnline ? 'fill-current' : ''}`} />
            {isOnline ? 'Online' : 'Offline'} <ChevronDown className="w-3 h-3" />
          </button>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-[10px] text-foreground/50 font-medium">Today's earnings</p>
            <p className="text-lg font-extrabold text-foreground leading-none">KES 2,340</p>
          </div>
          <button className="relative p-2">
            <Bell className="w-5 h-5 text-foreground/70" />
            <span className="absolute top-1 right-1 w-4 h-4 bg-primary text-white text-[9px] font-bold rounded-full flex items-center justify-center border border-background">
              3
            </span>
          </button>
        </div>
      </header>

      <div className="px-4 py-4 space-y-5">
        {/* --- My Orders Section --- */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold text-foreground">My Orders</h2>
            <button className="flex items-center gap-1 text-xs font-semibold text-foreground/60">
              Sort by: Nearest <ChevronDown className="w-3 h-3" />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex p-1 bg-white border border-border/50 rounded-xl mb-4">
            {['active', 'completed', 'cancelled'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all capitalize ${
                  activeTab === tab
                    ? 'bg-primary text-white shadow-sm'
                    : 'text-foreground/50 hover:bg-secondary'
                }`}
              >
                {tab} {tab === 'active' && '(2)'}
                {tab === 'completed' && '(12)'}
                {tab === 'cancelled' && '(1)'}
              </button>
            ))}
          </div>

          {/* Order Cards */}
          <div className="space-y-4">
            {activeOrders.map((order, idx) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + idx * 0.1 }}
                className="bg-white rounded-2xl p-4 shadow-xs border border-border/50"
              >
                {/* Card Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-foreground">Order #{order.id}</span>
                    <Badge
                      variant="default"
                      className={`${order.statusColor} text-[10px] font-semibold px-2 py-0.5 rounded-full`}
                    >
                      {order.status}
                    </Badge>
                  </div>
                  <span className="text-xs font-medium text-foreground/50">{order.time}</span>
                </div>

                {/* Route & Stats Layout */}
                <div className="flex items-start gap-4 mb-5">
                  {/* Route Timeline */}
                  <div className="flex flex-col items-center pt-1 relative">
                    <div className="w-2.5 h-2.5 bg-primary rounded-full ring-4 ring-primary/10 z-10" />
                    <div className="w-0.5 h-12 bg-border-dashed border-l-2 border-dashed border-primary/30 my-1" />
                    <div className="w-2.5 h-2.5 bg-warning rounded-full ring-4 ring-warning/10 z-10" />
                  </div>

                  <div className="flex-1 space-y-4">
                    {/* Pickup */}
                    <div>
                      <p className="text-[10px] text-foreground/50 font-bold uppercase tracking-wider mb-0.5">
                        Pickup
                      </p>
                      <p className="text-sm font-bold text-foreground">{order.pickup.store}</p>
                      <p className="text-xs text-foreground/50 mt-0.5">{order.pickup.address}</p>
                    </div>

                    {/* Drop-off */}
                    <div>
                      <p className="text-[10px] text-foreground/50 font-bold uppercase tracking-wider mb-0.5">
                        Drop-off
                      </p>
                      <p className="text-sm font-bold text-foreground">{order.dropoff.area}</p>
                      <p className="text-xs text-foreground/50 mt-0.5">{order.dropoff.address}</p>
                    </div>
                  </div>

                  {/* Right Side Stats */}
                  <div className="flex flex-col items-end gap-3 shrink-0">
                    <div className="bg-primary/5 rounded-xl p-3 text-center min-w-22.5">
                      <p className="text-lg font-extrabold text-primary">
                        KES {order.earnings}
                      </p>
                      <p className="text-[10px] text-foreground/50 font-medium">Earnings</p>
                    </div>
                    <div className="space-y-1 text-right">
                      <div className="flex items-center gap-1.5 justify-end text-foreground/60">
                        <Route className="w-3.5 h-3.5" />
                        <span className="text-xs font-bold">{order.distance}</span>
                      </div>
                      <p className="text-[10px] text-foreground/40">Total distance</p>
                      <div className="flex items-center gap-1.5 justify-end text-foreground/60 mt-1">
                        <Clock className="w-3.5 h-3.5" />
                        <span className="text-xs font-bold">{order.estTime}</span>
                      </div>
                      <p className="text-[10px] text-foreground/40">Est. time</p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 mb-3">
                  <Button
                    variant="outline"
                    className="flex-1 border-border hover:bg-secondary text-foreground/70 h-9 text-xs font-semibold gap-2"
                  >
                    <Phone className="w-4 h-4" /> Call customer
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 border-border hover:bg-secondary text-foreground/70 h-9 text-xs font-semibold gap-2"
                  >
                    <MessageSquare className="w-4 h-4" /> Chat
                  </Button>
                </div>
                <Button
                  onClick={() => navigate(order.action.label === 'Mark as Delivered' ? '/rider/mark-as-delivered' : '/rider/mark-as-picked-up')}
                  className="w-full bg-primary hover:bg-primary/90 text-white font-bold h-11 text-sm gap-2"
                >
                  <order.action.icon className="w-5 h-5" /> {order.action.label}
                </Button>
              </motion.div>
            ))}
          </div>
        </section>

        {/* --- Safety Banner --- */}
        <section>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-primary/5 border border-primary/10 rounded-xl p-3 flex items-center justify-between cursor-pointer hover:bg-primary/10 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shrink-0 shadow-sm">
                <Shield className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="text-xs font-bold text-foreground">
                  Safety first! Contact support if you face any issues.
                </p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-foreground/40" />
          </motion.div>
        </section>

        {/* --- Today's Progress --- */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-bold text-foreground">Today's Progress</h2>
            <button className="text-primary text-xs font-semibold flex items-center gap-1">
              View all stats <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="grid grid-cols-4 gap-3">
            {progressStats.map((stat, idx) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + idx * 0.05 }}
                className="bg-white rounded-xl p-3 border border-border/50 shadow-sm flex flex-col items-center text-center"
              >
                <div className={`w-8 h-8 ${stat.bg} rounded-full flex items-center justify-center mb-2`}>
                  <stat.icon className={`w-4 h-4 ${stat.color}`} />
                </div>
                <p className="text-base font-extrabold text-foreground mb-0.5">{stat.value}</p>
                <p className="text-[9px] text-foreground/50 font-medium leading-tight">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </div>
        </section>
      </div>

      {/* --- Bottom Navigation --- */}
      <BottomNav />
    </div>
  );
};