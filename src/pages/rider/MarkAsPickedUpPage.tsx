import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  X,
  ShieldCheck,
  MapPin,
  Clock,
  Route,
  Phone,
  MessageCircle,
  Check,
  CheckCircle2,
  Lock,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { Button, Badge } from '@stackloop/ui';
import { motion, AnimatePresence } from 'motion/react';

// --- Mock Order Items ---
const orderItems = [
  { qty: '1x', name: 'Milk 500ml', img: '/milk.jpeg' },
  { qty: '2x', name: 'Bread', img: '/bread.jpeg' },
  { qty: '6x', name: 'Eggs', img: '/eggs.jpeg' },
];

export const MarkAsPickedUpPage: React.FC = () => {
  const navigate = useNavigate();
  const [note, setNote] = useState('');
  const [itemsExpanded, setItemsExpanded] = useState(true);

  return (
    <div className="min-h-screen bg-background text-foreground font-sans antialiased pb-8">
      {/* --- Header --- */}
      <header className="px-4 pt-5 pb-3 flex items-center justify-between sticky top-0 bg-background z-40">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 -ml-2 rounded-full hover:bg-secondary transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <div>
            <h1 className="text-base font-bold text-foreground leading-tight">
              Mark as Picked Up
            </h1>
            <p className="text-[11px] text-foreground/60 mt-0.5">
              Confirm that you have picked up the order from the store.
            </p>
          </div>
        </div>
        <button
          onClick={() => navigate(-1)}
          className="p-2 -mr-2 rounded-full hover:bg-secondary transition-colors"
        >
          <X className="w-5 h-5 text-foreground/50" />
        </button>
      </header>

      <div className="px-4 space-y-4">
        {/* --- Safety First Banner --- */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-primary/10 rounded-2xl p-4 flex items-start gap-3 border border-primary/20"
        >
          <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shrink-0 shadow-sm">
            <ShieldCheck className="w-4 h-4 text-primary" />
          </div>
          <div>
            <p className="text-sm font-bold text-foreground">Safety first!</p>
            <p className="text-xs text-foreground/60 mt-0.5">
              Make sure the order is complete and secured before continuing.
            </p>
          </div>
        </motion.div>

        {/* --- Order Summary Card --- */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-4 shadow-sm border border-border/50"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-foreground">Order #KR1024</span>
              <Badge
                variant="success"
                className="bg-primary/10 text-primary text-[10px] font-semibold px-2 py-0.5 rounded-full"
              >
                On the way to customer
              </Badge>
            </div>
            <span className="text-xs font-medium text-foreground/50">10:30 AM</span>
          </div>

          <div className="flex gap-4">
            {/* Left: Route */}
            <div className="flex-1">
              <div className="flex items-start gap-3 mb-5">
                  <div className="flex flex-col items-center pt-1">
                  <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center">
                    <MapPin className="w-3.5 h-3.5 text-primary" />
                  </div>
                  <div className="w-0.5 h-10 border-l-2 border-dashed border-primary/30 my-1" />
                  <div className="w-6 h-6 bg-warning/10 rounded-full flex items-center justify-center">
                    <MapPin className="w-3.5 h-3.5 text-warning" />
                  </div>
                </div>
                <div className="flex-1 space-y-6">
                  <div>
                    <p className="text-[10px] text-foreground/50 font-bold uppercase tracking-wider">
                      Pickup
                    </p>
                    <p className="text-sm font-bold text-foreground mt-0.5">Naivas Westlands</p>
                    <p className="text-xs text-foreground/50 mt-0.5">Ring Road, Westlands</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-foreground/50 font-bold uppercase tracking-wider">
                      Drop-off
                    </p>
                    <p className="text-sm font-bold text-foreground mt-0.5">Kilimani, Nairobi</p>
                    <p className="text-xs text-foreground/50 mt-0.5">Argwings Kodhek Road</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1 border-border hover:bg-secondary text-foreground/70 h-9 text-xs font-semibold gap-2"
                >
                  <Phone className="w-3.5 h-3.5" /> Call store
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 border-border hover:bg-secondary text-foreground/70 h-9 text-xs font-semibold gap-2"
                >
                  <MessageCircle className="w-3.5 h-3.5" /> Chat
                </Button>
              </div>
            </div>

            {/* Right: Stats */}
            <div className="flex flex-col gap-3 shrink-0 w-24">
              <div className="bg-primary/5 rounded-xl p-2 text-center">
                <p className="text-base font-extrabold text-primary">KES 180</p>
                <p className="text-[9px] text-foreground/50 font-medium">Earnings</p>
              </div>
              <div className="space-y-2 text-right">
                <div>
                  <div className="flex items-center gap-1 justify-end text-foreground/70">
                    <Route className="w-3 h-3" />
                    <span className="text-xs font-bold">3.2 km</span>
                  </div>
                  <p className="text-[9px] text-foreground/40">Total distance</p>
                </div>
                <div>
                  <div className="flex items-center gap-1 justify-end text-foreground/70">
                    <Clock className="w-3 h-3" />
                    <span className="text-xs font-bold">15 mins</span>
                  </div>
                  <p className="text-[9px] text-foreground/40">Est. time</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* --- Order Items Accordion --- */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl border border-border/50 shadow-sm overflow-hidden"
        >
          <button
            onClick={() => setItemsExpanded(!itemsExpanded)}
            className="w-full p-4 flex items-center justify-between hover:bg-secondary/30 transition-colors"
          >
            <span className="text-sm font-bold text-foreground">Order items (3)</span>
            {itemsExpanded ? (
              <ChevronUp className="w-4 h-4 text-foreground/40" />
            ) : (
              <ChevronDown className="w-4 h-4 text-foreground/40" />
            )}
          </button>

          <AnimatePresence>
            {itemsExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="px-4 pb-4 space-y-3">
                  {orderItems.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between py-1">
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-bold text-foreground/60 w-6">{item.qty}</span>
                        <span className="text-sm text-foreground font-medium">{item.name}</span>
                      </div>
                      <div className="w-8 h-8 rounded-lg bg-gray-100 overflow-hidden shrink-0">
                        <img
                          src={item.img}
                          alt={item.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                            (e.target as HTMLImageElement).parentElement!.classList.add('flex', 'items-center', 'justify-center', 'text-gray-300');
                            (e.target as HTMLImageElement).parentElement!.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-image"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>';
                          }}
                        />
                      </div>
                    </div>
                  ))}
                  <p className="text-xs text-primary font-semibold pt-1">+ 2 more items</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* --- Confirm Pickup Checklist --- */}
        <div className="bg-primary/5 border border-primary/10 rounded-2xl p-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-sm font-bold text-foreground">Confirm pickup</p>
              <p className="text-[11px] text-foreground/60 mt-0.5">
                Please review and confirm the following:
              </p>
            </div>
          </div>

          <div className="space-y-3 pl-9">
            <div className="flex items-start gap-2">
              <Check className="w-4 h-4 text-primary mt-0.5 shrink-0" />
              <p className="text-xs text-foreground/80 leading-tight">
                I have arrived at the store and collected the order
              </p>
            </div>
            <div className="flex items-start gap-2">
              <Check className="w-4 h-4 text-primary mt-0.5 shrink-0" />
              <p className="text-xs text-foreground/80 leading-tight">
                I have verified the items and quantities
              </p>
            </div>
            <div className="flex items-start gap-2">
              <Check className="w-4 h-4 text-primary mt-0.5 shrink-0" />
              <p className="text-xs text-foreground/80 leading-tight">
                The order is complete and securely packed
              </p>
            </div>
          </div>
        </div>

        {/* --- Note (Optional) --- */}
        <div>
          <label className="block text-xs font-bold text-foreground/60 mb-2">
            Note <span className="text-foreground/40 font-normal">(optional)</span>
          </label>
          <div className="relative">
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Add any note for the store (e.g. item not available, substitute)"
              maxLength={120}
              className="w-full bg-white border border-border rounded-xl p-3.5 text-sm text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none h-20"
            />
            <p className="text-[10px] text-foreground/40 absolute bottom-3 right-3">
              {note.length}/120
            </p>
          </div>
        </div>

        {/* --- Action Buttons --- */}
        <div className="space-y-3 pt-2">
          <Button className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-3.5 gap-2 text-sm">
            <CheckCircle2 className="w-5 h-5" /> Mark as Picked Up
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate(-1)}
            className="w-full border-primary/20 text-primary hover:bg-primary/5 font-bold py-3.5 text-sm"
          >
            Go Back
          </Button>
          <p className="text-center text-[10px] text-foreground/40 flex items-center justify-center gap-1">
            <Lock className="w-3 h-3" /> This action cannot be undone.
          </p>
        </div>
      </div>
    </div>
  );
};