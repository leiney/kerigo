
import React from 'react';
import { Card, CardContent, Badge, Button, Toggle } from '@stackloop/ui';
import { Bike, MapPin, Navigation, Package, DollarSign, Clock, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';

const ACTIVE_TASKS = [
  { id: 'TASK-102', vendor: 'Burger King', location: '1.2 km away', payout: 'KES 250', items: 2 },
  { id: 'TASK-105', vendor: 'Sushi Zen', location: '3.5 km away', payout: 'KES 420', items: 4 },
];

export const RiderDashboard: React.FC = () => {
  return (
    <div className="p-6 pb-24 space-y-8">
      {/* Rider Status */}
      <Card className="rounded-[2.5rem] border-none shadow-sm bg-primary text-white overflow-hidden relative">
        <CardContent className="p-8 relative z-10">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-black mb-1">Good Morning, Alex</h2>
              <p className="text-xs text-white/70">Ready to deliver today?</p>
            </div>
            <div className="bg-white/20 p-2 rounded-xl backdrop-blur-md">
              <Bike className="h-6 w-6" />
            </div>
          </div>
          
          <div className="flex items-center justify-between bg-white/10 rounded-2xl p-4 border border-white/10">
             <div className="flex items-center gap-3">
               <div className="h-3 w-3 bg-white rounded-full animate-pulse" />
               <span className="font-bold">Online</span>
             </div>
             <Toggle defaultChecked className="scale-125" />
          </div>
        </CardContent>
        {/* Abstract shapes in background */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 -mr-16 -mt-16 rounded-full blur-3xl" />
      </Card>

      {/* Stats row */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-6 rounded-3xl border border-border text-center shadow-sm">
           <p className="text-[10px] uppercase font-black text-foreground/40 mb-1">Today's Earnings</p>
           <h3 className="text-xl font-black text-primary">KES 1,450</h3>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-border text-center shadow-sm">
           <p className="text-[10px] uppercase font-black text-foreground/40 mb-1">Orders</p>
           <h3 className="text-xl font-black">6</h3>
        </div>
      </div>

      {/* Active Tasks Feed */}
      <section>
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold">New Delivery Tasks</h3>
          <Badge variant="primary" className="bg-blue-100 text-blue-600 border-none font-black text-[10px] uppercase px-3">Realtime</Badge>
        </div>

        <div className="space-y-4">
          {ACTIVE_TASKS.map((task) => (
             <motion.div key={task.id} whileHover={{ scale: 1.01 }}>
               <Card className="rounded-[2rem] border-none shadow-sm bg-white overflow-hidden">
                 <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-6">
                      <div className="flex gap-4 items-center">
                        <div className="h-12 w-12 bg-secondary rounded-2xl flex items-center justify-center">
                          <Package className="h-6 w-6 text-foreground/40" />
                        </div>
                        <div>
                          <h4 className="font-bold">{task.vendor}</h4>
                          <div className="flex items-center gap-1 text-[10px] text-foreground/40 font-medium">
                            <MapPin className="h-3 w-3" />
                            {task.location}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-lg font-black text-primary">{task.payout}</span>
                        <p className="text-[10px] text-foreground/40">Payout</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <Button variant="outline" className="rounded-xl h-11 text-xs font-bold border-border">Decline</Button>
                      <Button className="rounded-xl h-11 text-xs font-bold">Accept Task</Button>
                    </div>
                 </CardContent>
               </Card>
             </motion.div>
          ))}
          {ACTIVE_TASKS.length === 0 && (
            <div className="py-12 text-center bg-white rounded-3xl border border-dashed border-border">
              <div className="h-16 w-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                <Bike className="h-8 w-8 text-foreground/20" />
              </div>
              <p className="text-sm font-bold text-foreground/40">No active tasks nearby</p>
              <p className="text-[10px] text-foreground/30">New tasks will appear here in realtime.</p>
            </div>
          )}
        </div>
      </section>

      {/* Wallet section */}
      <section className="bg-secondary/50 p-6 rounded-[2.5rem] border border-border/50">
        <div className="flex items-center justify-between mb-4">
           <h3 className="font-bold">Wallet</h3>
           <button className="text-xs font-bold text-primary">Details</button>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex gap-4 items-center">
            <div className="h-10 w-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
              <DollarSign className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-foreground/40">Current Balance</p>
              <h4 className="text-xl font-black">KES 8,240.00</h4>
            </div>
          </div>
          <Button size="sm" variant="outline" className="rounded-lg h-10 px-4 bg-white border-border text-xs font-bold">Withdraw</Button>
        </div>
      </section>
    </div>
  );
};
