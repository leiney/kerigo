
import React from 'react';
import { Card, CardContent, CardTitle, Badge, Button } from '@stackloop/ui';
import { TrendingUp, ShoppingBag, DollarSign, Package, ArrowRight, Bell, ChevronRight, ListChecks } from 'lucide-react';
import { motion } from 'motion/react';

const RECENT_ORDERS = [
  { id: 'ORD-001', customer: 'Alice Smith', total: 'KES 2,450', status: 'In Prep', items: 3 },
  { id: 'ORD-002', customer: 'Bob Johnson', total: 'KES 1,200', status: 'Ready', items: 1 },
  { id: 'ORD-003', customer: 'Charlie Davis', total: 'KES 3,800', status: 'Pending', items: 5 },
];

export const VendorDashboard: React.FC = () => {
  return (
    <div className="p-6 pb-24 space-y-8">
      {/* Header */}
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-black">Hello, Burger King</h2>
          <p className="text-sm text-foreground/40">Here is your store performance today.</p>
        </div>
        <div className="relative">
          <button className="h-12 w-12 bg-white border border-border rounded-xl flex items-center justify-center shadow-sm">
            <Bell className="h-6 w-6 text-foreground/60" />
          </button>
          <div className="absolute top-2 right-2 h-2.5 w-2.5 bg-red-500 rounded-full border-2 border-white" />
        </div>
      </header>

      {/* Analytics Brief */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="rounded-[1.5rem] border-none shadow-sm bg-orange-600 text-white">
          <CardContent className="p-5">
            <div className="flex justify-between items-start mb-4">
              <div className="h-10 w-10 bg-white/20 rounded-xl flex items-center justify-center">
                <DollarSign className="h-5 w-5" />
              </div>
              <TrendingUp className="h-4 w-4 text-white/50" />
            </div>
            <p className="text-[10px] uppercase font-black tracking-widest text-white/60 mb-1">Total Sales</p>
            <h3 className="text-2xl font-black">KES 45.2k</h3>
          </CardContent>
        </Card>

        <Card className="rounded-[1.5rem] border-none shadow-sm bg-white">
          <CardContent className="p-5">
            <div className="flex justify-between items-start mb-4">
              <div className="h-10 w-10 bg-orange-100 rounded-xl flex items-center justify-center text-orange-600">
                <ShoppingBag className="h-5 w-5" />
              </div>
              <span className="text-[10px] text-green-500 font-bold">+12%</span>
            </div>
            <p className="text-[10px] uppercase font-black tracking-widest text-foreground/40 mb-1">Orders</p>
            <h3 className="text-2xl font-black">128</h3>
          </CardContent>
        </Card>
      </div>

      {/* Preparation Workflow */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold">Incoming Orders</h3>
          <Badge variant="primary" className="bg-primary/10 text-primary border-none font-bold">3 New</Badge>
        </div>
        
        <div className="space-y-4">
          {RECENT_ORDERS.map((order) => (
            <Card key={order.id} className="rounded-[1.5rem] border-none shadow-sm bg-white hover:ring-2 hover:ring-primary transition-all cursor-pointer">
              <CardContent className="p-5 flex items-center gap-4">
                <div className="h-12 w-12 bg-secondary rounded-xl flex items-center justify-center">
                  <Package className="h-6 w-6 text-foreground/40" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <h4 className="font-bold text-sm">{order.customer}</h4>
                    <span className="text-[10px] font-black text-primary">{order.total}</span>
                  </div>
                  <p className="text-[10px] text-foreground/40 font-medium">{order.id} • {order.items} items</p>
                </div>
                <ChevronRight className="h-4 w-4 text-foreground/20" />
              </CardContent>
            </Card>
          ))}
        </div>
        <Button variant="ghost" className="w-full mt-2 text-primary font-bold">View full queue</Button>
      </section>

      {/* Menu Management Quick Links */}
      <section>
         <h3 className="text-lg font-bold mb-4">Store Management</h3>
         <div className="grid grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-3xl border border-border flex flex-col gap-3">
              <div className="h-10 w-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                <ListChecks className="h-5 w-5" />
              </div>
              <span className="font-bold text-sm">Menu Management</span>
            </div>
            <div className="bg-white p-4 rounded-3xl border border-border flex flex-col gap-3">
              <div className="h-10 w-10 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600">
                <Briefcase className="h-5 w-5" />
              </div>
              <span className="font-bold text-sm">Payout Settings</span>
            </div>
         </div>
      </section>
    </div>
  );
};
