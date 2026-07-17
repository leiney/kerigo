import React, { useEffect, useState } from 'react';
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
import { startDeliveryTracking, stopDeliveryTracking, isTracking } from '../../lib/backgroundGeolocation';
import { Geolocation } from '@capacitor/geolocation';
import { Browser } from '@capacitor/browser';
import { Radio, MapPinned } from 'lucide-react';
import { RiderDashboardStats } from '@/lib/types';

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
  const [activeTab, setActiveTab] = useState<'pending' | 'active' | 'completed' | 'cancelled'>('pending');
  const [isOnline, setIsOnline] = useState(true);
  const [trackingOrderId, setTrackingOrderId] = useState<string | null>(null);
  const [showLocationSheet, setShowLocationSheet] = useState(false);
  const [pendingAcceptOrderId, setPendingAcceptOrderId] = useState<string | null>(null);

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

  const {data: stats} = useQuery<RiderDashboardStats>({
    queryKey: ['riderstats'],
    queryFn: async () =>{
      const response = await productApi.fetchRiderDashboardStats()
      return response || {}
    }
  })

  console.log(stats, "this is the stats for rider")

  // Format online time from minutes to readable format
  const formatOnlineTime = (minutes: number) => {
    if (!minutes || minutes === 0) return '0 mins';
    
    if (minutes < 60) {
      return `${minutes} min${minutes !== 1 ? 's' : ''}`;
    }
    
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    
    if (hours < 24) {
      if (remainingMinutes === 0) {
        return `${hours} hr${hours !== 1 ? 's' : ''}`;
      }
      return `${hours} hr${hours !== 1 ? 's' : ''} ${remainingMinutes} min${remainingMinutes !== 1 ? 's' : ''}`;
    }
    
    const days = Math.floor(hours / 24);
    const remainingHours = hours % 24;
    
    if (remainingHours === 0) {
      return `${days} day${days !== 1 ? 's' : ''}`;
    }
    return `${days} day${days !== 1 ? 's' : ''} ${remainingHours} hr${remainingHours !== 1 ? 's' : ''}`;
  };

  const handleRefresh = async () => {
    await queryClient.invalidateQueries({ queryKey: ['riderOrders'] });
  };

  const handleConfirmLocationAccess = async () => {
    setShowLocationSheet(false);
    if (pendingAcceptOrderId) {
      await handleAcceptOrder(pendingAcceptOrderId);
      setPendingAcceptOrderId(null);
    }
  };

  const handleCancelLocationAccess = () => {
    setShowLocationSheet(false);
    setPendingAcceptOrderId(null);
  };

  const handleAcceptOrder = async (orderId: string) => {
    try {
      // Start tracking first so permission requests are triggered before backend updates
      await startDeliveryTracking(orderId);
      setTrackingOrderId(orderId);
      
      await productApi.updateOrderStatus(orderId, 'on_the_way', 'Order picked up by rider', undefined, true);
      await queryClient.invalidateQueries({ queryKey: ['riderOrders'] });
    } catch (error) {
      console.error('Failed to accept order:', error);
      alert('Location tracking could not start. Please make sure to grant "Allow all the time" location access in your system settings.');
    }
  };

  useEffect(() => {
    return () => {
      if (trackingOrderId) {
        stopDeliveryTracking();
      }
    };
  }, [trackingOrderId]);

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

  const pendingOrders = ordersList.filter((o: any) => {
    return o.orderStatus === 'on_the_way' && !o.extraData?.pickedUp;
  });

  const activeOrders = ordersList.filter((o: any) => {
    return o.orderStatus === 'on_the_way' && o.extraData?.pickedUp;
  });
  const completedOrders = ordersList.filter((o: any) => o.orderStatus === 'completed' || o.orderStatus === 'delivered');
  const cancelledOrders = ordersList.filter((o: any) => o.orderStatus === 'cancelled');

  const currentTabOrders = activeTab === 'pending'
    ? pendingOrders
    : activeTab === 'active' 
      ? activeOrders 
      : activeTab === 'completed' 
        ? completedOrders 
        : cancelledOrders;

  const todayMidnight = new Date();
  todayMidnight.setHours(0, 0, 0, 0);

  const todayDeliveredOrders = ordersList.filter((o: any) => {
    const orderDate = new Date(o.orderDate);
    return o.orderStatus === 'delivered' && orderDate >= todayMidnight;
  });

  const totalEarnings = ordersList.reduce((sum: number, o: any) => sum + (o.shippingCharges || 0), 0);

  const progressStats = [
    { 
      label: 'Completed orders', 
      value: stats?.completedOrders !== undefined ? stats.completedOrders.toString() : (todayDeliveredOrders.length > 0 ? todayDeliveredOrders.length.toString() : '0'), 
      icon: CheckCircle, 
      color: 'text-primary', 
      bg: 'bg-primary/10' 
    },
    { 
      label: 'Online time', 
      value: formatOnlineTime(stats?.onlineTime || 0), 
      icon: Clock, 
      color: 'text-info', 
      bg: 'bg-info/10' 
    },
    { 
      label: 'Earnings', 
      value: stats?.earnings ? `KES ${stats.earnings.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : (totalEarnings > 0 ? `KES ${totalEarnings.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : 'KES 0.00'), 
      icon: DollarSign, 
      color: 'text-warning', 
      bg: 'bg-warning/10' 
    },
    { 
      label: 'Rating', 
      value: stats?.avgRating ? stats.avgRating.toFixed(1) : '--', 
      icon: Star, 
      color: 'text-primary', 
      bg: 'bg-primary/10' 
    },
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
            <p className="text-lg font-extrabold text-foreground leading-none">KES {stats?.earnings ? stats.earnings.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : totalEarnings.toLocaleString()}</p>
          </div>
          <button className="relative p-2">
            <Bell className="w-5 h-5 text-foreground/70" />
            <span className="absolute top-1 right-1 w-4 h-4 bg-primary text-white text-[9px] font-bold rounded-full flex items-center justify-center border border-background">
              3
            </span>
          </button>
        </div>
      </header>

      {/* Tracking Status Banner */}
      {trackingOrderId && (
        <div className="mx-4 mt-3 bg-green-50 border border-green-200 rounded-xl p-3 flex items-center gap-3">
          <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shrink-0 animate-pulse">
            <Radio className="w-4 h-4 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-green-700">Live Tracking Active</p>
            <p className="text-[10px] text-green-600 mt-0.5">
              Customer can now track your location in real-time
            </p>
          </div>
          <MapPinned className="w-5 h-5 text-green-600 shrink-0" />
        </div>
      )}

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
            {['pending', 'active', 'completed', 'cancelled'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all capitalize ${activeTab === tab
                    ? 'bg-primary text-white shadow-sm'
                    : 'text-foreground/50 hover:bg-secondary'
                  }`}
              >
                <div className="flex flex-col justify-center items-center">
                  {tab} {tab === 'pending' && <small>{pendingOrders.length}</small> }
                  {tab === 'active' &&   <small>{activeOrders.length}</small>}
                  {tab === 'completed' &&  <small>{completedOrders.length}</small> }
                  {tab === 'cancelled' &&  <small>{cancelledOrders.length}</small> }

                </div>
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
                        <span className="font-bold text-sm text-foreground shrink-0">Order #{(order.orderNo?.toString() || order.orderID)?.slice(-6).toUpperCase()}</span>
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

                    {activeTab === 'pending' && (
                      <>
                        {/* Action Buttons for Pending Orders */}
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
                            <MapPin className="w-3.5 h-3.5 text-primary" /> Navigate
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
                          onClick={() => {
                            setPendingAcceptOrderId(order.orderID);
                            setShowLocationSheet(true);
                          }}
                          className="w-full bg-primary hover:bg-primary/90 text-white font-bold h-11 text-sm gap-2"
                        >
                          <CheckCircle className="w-5 h-5" /> Mark as Picked Up
                        </Button>
                      </>
                    )}

                    {activeTab === 'active' && (
                      <>
                        {/* Action Buttons for Active Orders */}
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

      {/* Background Location Disclosure Bottom Sheet */}
      <BottomSheet
        isOpen={showLocationSheet}
        onClose={handleCancelLocationAccess}
        className="max-h-[90vh] z-100"
        animate={false}
      >
        <div className="pb-8 text-foreground px-4 ">
          <div className="flex flex-col items-center text-center mt-4 mb-6">
            <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <MapPin className="w-7 h-7 text-primary animate-bounce" />
            </div>
            <h3 className="text-lg font-bold text-foreground">
              Background Location Permission
            </h3>
            <p className="text-xs text-foreground/50 mt-1">
              Active Delivery Tracking Required
            </p>
          </div>

          <div className="bg-secondary/40 rounded-2xl p-4 mb-6 border border-border/40">
            <p className="text-sm text-foreground/75 leading-relaxed text-center">
              Kerigo collects your location in the background while you are actively delivering orders. This allows customers and vendors to track delivery progress in real time, even if the app is minimized or the screen is off. Location tracking stops when your delivery ends.
            </p>
          </div>

          <div className="space-y-3">
            <Button
              className="w-full bg-primary hover:bg-primary/95 text-white font-bold py-3.5 text-sm rounded-xl flex items-center justify-center gap-2"
              onClick={handleConfirmLocationAccess}
            >
              Allow Location Access
            </Button>
            <Button
              variant="ghost"
              className="w-full border-border text-foreground/60 hover:bg-secondary font-bold py-3.5 text-sm rounded-xl"
              onClick={handleCancelLocationAccess}
            >
              Not Now
            </Button>
          </div>
        </div>
      </BottomSheet>

      {/* --- Bottom Navigation --- */}
      <BottomNav />
      </div>
    </PullToRefresh>
  );
};