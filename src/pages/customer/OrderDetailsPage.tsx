import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  ArrowLeft, 
  Headphones, 
  MapPin, 
  Phone, 
  MessageSquare, 
  ChevronRight, 
  Clock, 
  Store,
  Check,
  Wallet
} from 'lucide-react';
import { Button, Badge } from '@stackloop/ui';
import { motion } from 'framer-motion';
import { customerApi } from '../../../lib/api';
import type { OrderDetailData } from '../../../lib/types';

const OrderDetailsPage: React.FC = () => {
  const navigate = useNavigate();
  const { orderId } = useParams();
  const [orderDetails, setOrderDetails] = useState<OrderDetailData | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadOrderDetails = async () => {
      const data = await customerApi.getOrderDetails(orderId ?? 'KR1024');

      if (isMounted) {
        setOrderDetails(data);
      }
    };

    loadOrderDetails();

    return () => {
      isMounted = false;
    };
  }, [orderId]);

  if (!orderDetails) {
    return (
      <div className="min-h-screen bg-background text-foreground pb-24 font-sans flex items-center justify-center">
        <p className="text-sm text-foreground/60">Loading order details...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground pb-24 font-sans">
      {/* --- Header --- */}
      <header className="px-4 pt-5 pb-3 flex items-center justify-between sticky top-0 bg-background z-40 border-b border-transparent">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-1.5 -ml-1.5 rounded-full hover:bg-secondary">
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <div>
            <h1 className="text-lg font-bold leading-tight">Order Details</h1>
            <p className="text-[11px] text-foreground/50 mt-0.5">Order #{orderDetails.reference}</p>
          </div>
        </div>
        <button className="flex items-center gap-1 text-primary text-xs font-semibold">
          <Headphones className="w-4 h-4" />
          Help
        </button>
      </header>

      <div className="px-4 space-y-3 mt-2">
        
        {/* --- Store Status Card --- */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-3 border border-border/50 shadow-sm flex items-center justify-between"
        >
          <div className="flex items-start gap-2.5">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center overflow-hidden">
              <img src="/store.png" alt={orderDetails.storeName} className="w-full h-full object-cover" />
            </div>
            <div>
              <h3 className="font-bold text-sm leading-tight">{orderDetails.storeName}</h3>
              <p className="text-[11px] text-foreground/50 mt-0.5">{orderDetails.storeCategory}</p>
              <button className="text-primary text-[11px] font-semibold mt-0.5 flex items-center gap-1">
                View Store <ChevronRight className="w-2.5 h-2.5" />
              </button>
            </div>
          </div>
          <div className="text-right">
            <Badge className="bg-primary/10 text-primary text-[10px] px-2 py-0.5 rounded-full mb-1">
              <span className="w-1.5 h-1.5 bg-primary rounded-full mr-1.5 inline-block"></span>
              {orderDetails.status}
            </Badge>
            <div className="mt-1">
              <p className="text-[11px] text-foreground/50">Estimated delivery</p>
              <p className="text-base font-bold text-primary leading-none">{orderDetails.estimatedDelivery} <span className="text-[11px] font-medium text-foreground/40">{orderDetails.deliveryTime}</span></p>
            </div>
          </div>
        </motion.div>

        {/* --- Address Card --- */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl p-3 border border-border/50 shadow-sm"
        >
          <div className="flex items-center gap-2.5 mb-2">
            <div className="w-5 h-5 bg-primary/10 rounded-full flex items-center justify-center">
              <MapPin className="w-3.5 h-3.5 text-primary" />
            </div>
            <span className="text-xs font-bold">Delivering to</span>
            <Badge className="bg-primary/5 text-primary text-[10px] px-1.5 py-0">Home</Badge>
          </div>
          <div className="ml-7 flex justify-between items-start gap-3">
            <div>
              <p className="text-xs font-medium">{orderDetails.address}</p>
              <p className="text-[11px] text-foreground/50 mt-0.5">{orderDetails.addressNote}</p>
            </div>
            <button className="text-primary text-[11px] font-semibold shrink-0">Change</button>
          </div>
        </motion.div>

        {/* --- Rider Card --- */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl p-3 border border-border/50 shadow-sm flex items-center justify-between"
        >
          <div className="flex items-center gap-2.5">
            <img src={orderDetails.rider.avatarUrl} alt="Rider" className="w-10 h-10 rounded-full border border-white shadow-sm bg-gray-100 object-cover" />
            <div>
              <p className="font-bold text-sm">{orderDetails.rider.name}</p>
              <p className="text-[11px] text-foreground/50">{orderDetails.rider.role}</p>
              <div className="flex items-center gap-1 mt-0.5">
                <span className="text-yellow-500 text-[10px]">★</span>
                <span className="text-[11px] font-bold">{orderDetails.rider.rating}</span>
                <span className="text-[10px] text-foreground/40">({orderDetails.rider.reviews} reviews)</span>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Button variant="outline" className="border-primary/30 text-primary h-8 px-3 rounded-lg gap-1.5 text-[11px] font-semibold">
              <Phone className="w-3.5 h-3.5" /> Call
            </Button>
            <Button variant="outline" className="border-primary/30 text-primary h-8 px-3 rounded-lg gap-1.5 text-[11px] font-semibold">
              <MessageSquare className="w-3.5 h-3.5" /> Message
            </Button>
          </div>
        </motion.div>

        {/* --- Order Items --- */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl border border-border/50 shadow-sm overflow-hidden"
        >
          <div className="p-3 border-b border-border/50 flex justify-between items-center">
            <h3 className="font-bold text-sm">Order Items</h3>
            <span className="text-[11px] text-foreground/50">{orderDetails.items.length} items</span>
          </div>

          <div className="divide-y divide-border/50">
            {orderDetails.items.map((item) => (
              <div key={item.id} className="p-3 flex items-center gap-3">
                <div className="w-10 h-10 bg-secondary rounded-lg overflow-hidden shrink-0">
                  <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span className="bg-primary/10 text-primary text-[9px] font-bold px-1.5 py-0.5 rounded">{item.quantity}x</span>
                    <p className="text-xs font-bold">{item.name}</p>
                  </div>
                  <p className="text-[11px] text-foreground/50">{item.description}</p>
                </div>
                <p className="text-xs font-bold">KES {item.price.toLocaleString()}</p>
              </div>
            ))}
          </div>

          {/* Price Breakdown */}
          <div className="p-3 space-y-1.5 bg-secondary/30">
            <div className="flex justify-between text-xs">
              <span className="text-foreground/60">Subtotal</span>
              <span className="font-medium">KES {orderDetails.summary.subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-foreground/60">Delivery Fee</span>
              <span className="font-medium">KES {orderDetails.summary.deliveryFee.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-foreground/60">Platform Fee</span>
              <span className="font-medium">KES {orderDetails.summary.platformFee.toLocaleString()}</span>
            </div>
            <div className="h-px bg-border/50 my-1.5" />
            <div className="flex justify-between text-sm font-bold">
              <span>Total</span>
              <span className="text-primary">KES {orderDetails.summary.total.toLocaleString()}</span>
            </div>
          </div>
        </motion.div>

        {/* --- Payment Method --- */}
        <div className="bg-white rounded-2xl p-3 border border-border/50 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-green-50 rounded-full flex items-center justify-center text-primary">
              <Wallet className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold">Payment Method</p>
              <p className="text-[11px] text-foreground/50 mt-0.5">{orderDetails.paymentMethod}</p>
            </div>
          </div>
          <span className="text-xs font-bold">KES {orderDetails.summary.total.toLocaleString()}</span>
        </div>

        {/* --- Support --- */}
        <button className="w-full bg-white rounded-2xl p-3 border border-border/50 shadow-sm flex items-center justify-between group">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 bg-primary/10 rounded-full flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
              <Check className="w-3.5 h-3.5" />
            </div>
            <div className="text-left">
              <p className="text-xs font-bold">Need help with this order?</p>
              <p className="text-[11px] text-foreground/50">Get support or report an issue</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-foreground/30" />
        </button>

        <p className="text-center text-[11px] text-foreground/40 pb-4">
          Order placed on {orderDetails.placedAt}
        </p>
      </div>
    </div>
  );
};

export default OrderDetailsPage;