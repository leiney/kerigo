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
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { productApi } from '@/lib/api';
import BottomNav from '../../components/BottomNav';
import PullToRefresh from '../../components/PullToRefresh';
import { Geolocation } from '@capacitor/geolocation';
import { Browser } from '@capacitor/browser';

interface Coordinates {
  lat: number;
  lng: number;
}

async function startRiderNavigation(customerCoords: Coordinates): Promise<void> {
  try {
    const permissionStatus = await Geolocation.checkPermissions();
    if (permissionStatus.location !== 'granted') {
      const requestStatus = await Geolocation.requestPermissions();
      if (requestStatus.location !== 'granted') {
        throw new Error('Location permission denied by the rider.');
      }
    }

    const riderPosition = await Geolocation.getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 10000
    });

    const originLat = riderPosition.coords.latitude;
    const originLng = riderPosition.coords.longitude;

    const mapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${originLat},${originLng}&destination=${customerCoords.lat},${customerCoords.lng}&travelmode=driving`;

    await Browser.open({ url: mapsUrl });
  } catch (error) {
    console.error('Navigation could not start:', error);
    alert(`Could not start navigation: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// --- Mock Data ---
const progressStatsPlaceholder = [];

export const RiderDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'active' | 'completed' | 'cancelled'>('active');
  const [isOnline, setIsOnline] = useState(true);

  const queryClient = useQueryClient();

  // Fetch Rider Orders and log response
  const { data: fetchedRiderOrders, isLoading } = useQuery({
    queryKey: ['riderOrders'],
    queryFn: async () => {
      const response = await productApi.getRiderOrders({});
      
      console.log('Rider Orders Response:', response);
      return response || [];
    },
  });

  const handleRefresh = async () => {
    await queryClient.invalidateQueries({ queryKey: ['riderOrders'] });
  };

  const formatStatus = (status: string) => {
    if (!status) return '';
    const mapped: Record<string, string> = {
      'new': 'Received',
      'preparing': 'Preparing',
      'on_the_way': 'On the Way',
      'delivered': 'Delivered',
      'cancelled': 'Cancelled'
    };
    return mapped[status] || status.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  };

  const formatDuration = (minutes: number) => {
    if (!minutes) return 'N/A';
    if (minutes < 60) {
      return `${minutes} mins`;
    }
    const hours = minutes / 60;
    if (hours < 24) {
      const roundedHours = Math.round(hours * 10) / 10;
      return `${roundedHours} hrs`;
    }
    const days = hours / 24;
    const roundedDays = Math.round(days * 10) / 10;
    return `${roundedDays} days`;
  };

  const formatOrderDate = (dateStr: string) => {
    if (!dateStr) return '';
    try {
      const date = new Date(dateStr);
      const now = new Date();
      
      const dateMidnight = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      const nowMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      
      const diffTime = nowMidnight.getTime() - dateMidnight.getTime();
      const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
      
      const timeOptions: Intl.DateTimeFormatOptions = { hour: '2-digit', minute: '2-digit', hour12: true };
      const timeString = date.toLocaleTimeString([], timeOptions);
      
      if (diffDays === 0) {
        return timeString;
      } else if (diffDays === 1) {
        return `Yesterday, ${timeString}`;
      } else {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const month = months[date.getMonth()];
        const day = date.getDate();
        return `${month}, ${day}, ${timeString.toLowerCase()}`;
      }
    } catch (e) {
      return dateStr;
    }
  };

  const ordersList = Array.isArray(fetchedRiderOrders) ? fetchedRiderOrders : [];

  const activeOrders = ordersList.filter((o: any) => o.orderStatus !== 'completed' && o.orderStatus !== 'delivered' && o.orderStatus !== 'cancelled');
  const completedOrders = ordersList.filter((o: any) => o.orderStatus === 'completed' || o.orderStatus === 'delivered');
  const cancelledOrders = ordersList.filter((o: any) => o.orderStatus === 'cancelled');

  const currentTabOrders = activeTab === 'active' 
    ? activeOrders 
    : activeTab === 'completed' 
      ? completedOrders 
      : cancelledOrders;

  const todayMidnight = new Date();
  todayMidnight.setHours(0, 0, 0, 0);

  const todayCompletedOrders = completedOrders.filter((o: any) => {
    const orderDate = new Date(o.orderDate);
    return orderDate >= todayMidnight;
  });

  const todayEarningsSum = todayCompletedOrders.reduce((sum: number, o: any) => sum + (o.shippingCharges || 0), 0);

  const progressStats = [
    { label: 'Completed orders', value: todayCompletedOrders.length.toString(), icon: CheckCircle, color: 'text-primary', bg: 'bg-primary/10' },
    { label: 'Online time', value: '2h 15m', icon: Clock, color: 'text-info', bg: 'bg-info/10' },
    { label: 'Earnings', value: `KES ${todayEarningsSum.toLocaleString()}`, icon: DollarSign, color: 'text-warning', bg: 'bg-warning/10' },
    { label: 'Rating', value: '4.8', icon: Star, color: 'text-primary', bg: 'bg-primary/10' },
  ];

  return (
    <PullToRefresh onRefresh={handleRefresh}>
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
            <p className="text-lg font-extrabold text-foreground leading-none">KES {todayEarningsSum.toLocaleString()}</p>
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
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all capitalize ${activeTab === tab
                    ? 'bg-primary text-white shadow-sm'
                    : 'text-foreground/50 hover:bg-secondary'
                  }`}
              >
                {tab} {tab === 'active' && `(${activeOrders.length})`}
                {tab === 'completed' && `(${completedOrders.length})`}
                {tab === 'cancelled' && `(${cancelledOrders.length})`}
              </button>
            ))}
          </div>

          {/* Order Cards */}
          <div className="space-y-4">
            {isLoading ? (
              [1, 2].map((i) => (
                <div key={i} className="bg-white rounded-2xl p-4 border border-border/50 shadow-sm animate-pulse space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="h-4 w-28 bg-secondary rounded-lg" />
                    <div className="h-5 w-20 bg-secondary rounded-full" />
                  </div>
                  <div className="flex gap-3">
                    <div className="flex flex-col items-center shrink-0">
                      <div className="w-5 h-5 rounded-full bg-secondary" />
                      <div className="w-0.5 h-8 border-l border-dashed border-secondary my-1" />
                      <div className="w-5 h-5 rounded-full bg-secondary" />
                    </div>
                    <div className="flex-1 space-y-4">
                      <div>
                        <div className="h-3 w-16 bg-secondary rounded-lg mb-1" />
                        <div className="h-4 w-32 bg-secondary rounded-lg" />
                      </div>
                      <div>
                        <div className="h-3 w-16 bg-secondary rounded-lg mb-1" />
                        <div className="h-4 w-48 bg-secondary rounded-lg" />
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-border/40">
                    <div className="flex gap-4">
                      <div>
                        <div className="h-4 w-12 bg-secondary rounded-lg mb-1" />
                        <div className="h-3 w-10 bg-secondary rounded-lg" />
                      </div>
                      <div>
                        <div className="h-4 w-14 bg-secondary rounded-lg mb-1" />
                        <div className="h-3 w-10 bg-secondary rounded-lg" />
                      </div>
                    </div>
                    <div>
                      <div className="h-4 w-16 bg-secondary rounded-lg mb-1" />
                      <div className="h-3 w-12 bg-secondary rounded-lg" />
                    </div>
                  </div>
                </div>
              ))
            ) : currentTabOrders.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 px-4 bg-white rounded-2xl border border-border/50 shadow-sm text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-3">
                  <CheckCircle className="w-6 h-6 text-primary" />
                </div>
                <p className="text-sm font-semibold text-foreground/80">No orders here</p>
                <p className="text-xs text-foreground/45 mt-1">Orders in this category will appear here.</p>
              </div>
            ) : (
              currentTabOrders.map((order: any, idx: number) => {
                const statusColor = 'bg-primary/10 text-primary';
                const actionLabel = 'Mark as Delivered';

                const storeName = order.extraData?.vendor?.name || 'Vendor';
                const storeAddress = order.extraData?.vendor?.location?.address || 'Pickup Address';
                const dropoffArea = order.extraData?.location?.city || order.extraData?.location?.address || 'Customer Location';
                const dropoffAddress = order.extraData?.location?.address || 'Dropoff Address';

                const earnings = order.shippingCharges || 0;
                const distance = order.extraData?.distanceKm ? `${order.extraData.distanceKm.toFixed(1)} km` : 'N/A';
                const estTime = formatDuration(order.extraData?.durationMinutes);

                return (
                  <motion.div
                    key={order.orderID}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + idx * 0.1 }}
                    className="bg-white rounded-2xl p-4 shadow-xs border border-border/50"
                  >
                    {/* Card Header */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <span className="font-bold text-sm text-foreground shrink-0">Order #{(order.orderNo || order.orderID).slice(-6).toUpperCase()}</span>
                        <Badge
                          variant="default"
                          className={`${statusColor} text-[10px] font-semibold px-2 py-0.5 rounded-full truncate`}
                        >
                          {formatStatus(order.orderStatus)}
                        </Badge>
                      </div>
                      <span className="text-xs font-medium text-foreground/50 shrink-0 text-right ml-2">{formatOrderDate(order.orderDate)}</span>
                    </div>

                    {/* Route & Stats Layout */}
                    <div className="flex items-start gap-4 mb-5">
                      {/* Route Timeline */}
                      <div className="flex flex-col items-center pt-1 relative shrink-0">
                        <div className="w-2.5 h-2.5 bg-primary rounded-full ring-4 ring-primary/10 z-10" />
                        <div className="w-0.5 h-12 bg-border-dashed border-l-2 border-dashed border-primary/30 my-1" />
                        <div className="w-2.5 h-2.5 bg-warning rounded-full ring-4 ring-warning/10 z-10" />
                      </div>

                      <div className="flex-1 space-y-4 min-w-0">
                        {/* Pickup */}
                        <div className="min-w-0">
                          <p className="text-[10px] text-foreground/50 font-bold uppercase tracking-wider mb-0.5">
                            Pickup
                          </p>
                          <p className="text-sm font-bold text-foreground truncate">{storeName}</p>
                          <p className="text-xs text-foreground/50 mt-0.5 truncate">{storeAddress}</p>
                        </div>

                        {/* Drop-off */}
                        <div className="min-w-0">
                          <p className="text-[10px] text-foreground/50 font-bold uppercase tracking-wider mb-0.5">
                            Drop-off
                          </p>
                          <p className="text-sm font-bold text-foreground truncate">{dropoffArea}</p>
                          <p className="text-xs text-foreground/50 mt-0.5 truncate">{dropoffAddress}</p>
                        </div>
                      </div>

                      {/* Right Side Stats */}
                      <div className="flex flex-col items-end gap-3 shrink-0">
                        <div className="bg-primary/5 rounded-xl p-2 text-center min-w-[75px] shrink-0">
                          <p className="text-sm font-extrabold text-primary">
                            KES {earnings.toLocaleString()}
                          </p>
                          <p className="text-[9px] text-foreground/50 font-medium">Earnings</p>
                        </div>
                        <div className="space-y-1 text-right">
                          <div className="flex items-center gap-1.5 justify-end text-foreground/60">
                            <Route className="w-3.5 h-3.5" />
                            <span className="text-xs font-bold">{distance}</span>
                          </div>
                          <p className="text-[10px] text-foreground/40">Total distance</p>
                          <div className="flex items-center gap-1.5 justify-end text-foreground/60 mt-1">
                            <Clock className="w-3.5 h-3.5" />
                            <span className="text-xs font-bold">{estTime}</span>
                          </div>
                          <p className="text-[10px] text-foreground/40">Est. time</p>
                        </div>
                      </div>
                    </div>

                    {activeTab === 'active' && (
                      <>
                        {/* Action Buttons */}
                        <div className="flex gap-2 mb-3">
                          <Button
                            variant="outline"
                            className="flex-1 border-border hover:bg-secondary text-foreground/70 h-9 text-xs font-semibold gap-1.5"
                            onClick={(e) => {
                              e.stopPropagation();
                              const loc = order.extraData?.location;
                              const dest = (loc?.latitude !== undefined && loc?.longitude !== undefined)
                                ? { lat: loc.latitude, lng: loc.longitude }
                                : dropoffAddress;
                              startRiderNavigation(dest);
                            }}
                          >
                            <MapPin className="w-3.5 h-3.5 text-primary" /> Find Customer
                          </Button>
                          <Button
                            variant="outline"
                            className="flex-1 border-border hover:bg-secondary text-foreground/70 h-9 text-xs font-semibold gap-1.5"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (order.extraData?.customer?.phoneNo) {
                                window.location.href = `tel:${order.extraData.customer.phoneNo}`;
                              }
                            }}
                          >
                            <Phone className="w-3.5 h-3.5" /> Call
                          </Button>
                        </div>
                        <Button
                          onClick={() => navigate(
                            '/rider/mark-as-delivered',
                            { state: { order } }
                          )}
                          className="w-full bg-primary hover:bg-primary/90 text-white font-bold h-11 text-sm gap-2"
                        >
                          <CheckCircle className="w-5 h-5" /> {actionLabel}
                        </Button>
                      </>
                    )}
                  </motion.div>
                );
              })
            )}
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
    </PullToRefresh>
  );
};