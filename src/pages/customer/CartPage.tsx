import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@stackloop/ui';
import {
  ArrowLeft, Trash2, Minus, Plus, ShoppingBag, Truck, Percent, MapPin, ChevronRight, Home, User
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import BottomNav from '../../components/BottomNav';
import { selectCartCount, selectCartTotal, useCartStore } from '../../store/cartStore';

export const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const cartItems = useCartStore((state) => state.items);
  const increaseItem = useCartStore((state) => state.increaseItem);
  const decreaseItem = useCartStore((state) => state.decreaseItem);
  const removeItem = useCartStore((state) => state.removeItem);
  const clearCart = useCartStore((state) => state.clearCart);
  const [orderNotes, setOrderNotes] = useState('');

  const deliveryFee = 150;
  const serviceFee = 50;
  const freeDeliveryThreshold = 500;
  const subtotal = selectCartTotal(cartItems);
  const total = subtotal + deliveryFee + serviceFee;
  const amountToFreeDelivery = Math.max(0, freeDeliveryThreshold - subtotal);
  const deliveryProgress = Math.min(100, (subtotal / freeDeliveryThreshold) * 100);

  const cartCount = selectCartCount(cartItems);

  if (cartItems.length === 0) {
    return (
      <div className="h-dvh overflow-hidden flex flex-col bg-white text-foreground font-sans antialiased">
        <div className="shrink-0 px-5 pt-6 pb-4">
          <div className="flex items-start justify-between mb-2">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => navigate(-1)}
              className="p-2 -ml-2 rounded-full hover:bg-secondary transition-colors"
            >
              <ArrowLeft className="w-6 h-6 text-foreground" />
            </motion.button>
          </div>
          <h1 className="text-2xl font-bold text-foreground">Your Cart</h1>
          <p className="text-sm text-foreground/60 mt-1">Your selected items will appear here.</p>
        </div>

        <div className="flex-1 min-h-0 overflow-y-auto px-5 pb-24 flex items-center justify-center">
          <div className="w-full max-w-sm bg-white border border-border rounded-3xl p-6 text-center shadow-sm">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <h2 className="text-lg font-bold text-foreground">Your cart is empty</h2>
            <p className="text-sm text-foreground/60 mt-2">Go back to a store and add items to continue.</p>
            <Button className="mt-5 w-full h-12 rounded-2xl font-bold" onClick={() => navigate('/vendor-store')}>
              Continue Shopping
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-dvh overflow-hidden flex flex-col bg-white text-foreground font-sans antialiased">
      <div className="shrink-0 px-5 pt-6 pb-4">
        {/* Row 1: Back Arrow & Clear Button */}
        <div className="flex items-start justify-between mb-2">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => navigate(-1)}
            className="p-2 -ml-2 rounded-full hover:bg-secondary transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-foreground" />
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={clearCart}
            className="flex flex-col items-center gap-1 text-error/70 hover:text-error transition-colors"
          >
            <Trash2 className="w-5 h-5" />
            <span className="text-xs font-medium">Clear</span>
          </motion.button>
        </div>

        {/* Row 2 & 3: Title & Subtitle */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl font-bold text-foreground">Your Cart</h1>
          <p className="text-sm text-foreground/60 mt-1">Review your items and proceed to checkout</p>
        </motion.div>
      </div>

      <main className="flex-1 min-h-0 overflow-y-auto px-5 pb-36">
        <div className="space-y-4">
          <div className="space-y-4">
            <AnimatePresence>
              {cartItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: index * 0.05 }}
                  className="relative bg-white border border-border rounded-2xl p-4 flex gap-4 items-start"
                >
                  <div className="w-24 h-28 rounded-lg border border-border overflow-hidden shrink-0 bg-secondary flex items-center justify-center">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1 min-w-0 flex flex-col gap-2">
                    <h3 className="font-bold text-base text-foreground leading-tight">{item.name}</h3>
                    <div className="flex items-center gap-1">
                      <ShoppingBag className="w-3.5 h-3.5 text-primary" />
                      <span className="text-xs text-foreground/60">{item.store}</span>
                    </div>
                    <p className="text-sm text-primary font-semibold">KES {item.price} each</p>

                    <div className="flex items-center justify-between mt-1">
                      <div className="flex items-center gap-2 bg-primary/5 rounded-xl">
                        <motion.button
                          whileTap={{ scale: 0.9 }}
                          onClick={() => decreaseItem(item.id)}
                          className="w-8 h-8 flex items-center justify-center text-primary hover:bg-primary/10 rounded-lg transition-colors"
                        >
                          <Minus className="w-4 h-4" />
                        </motion.button>
                        <span className="w-8 text-center font-bold text-foreground text-sm">{item.quantity}</span>
                        <motion.button
                          whileTap={{ scale: 0.9 }}
                          onClick={() => increaseItem(item.id)}
                          className="w-8 h-8 flex items-center justify-center text-primary hover:bg-primary/10 rounded-lg transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                        </motion.button>
                      </div>
                      <span className="font-bold text-foreground text-sm">KES {(item.price * item.quantity).toLocaleString()}</span>
                    </div>
                  </div>

                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => removeItem(item.id)}
                    className="absolute top-4 right-4 p-2 text-foreground/40 hover:text-error hover:bg-error/5 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </motion.button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {amountToFreeDelivery > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-primary/5 border border-primary/10 rounded-2xl p-4"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center shrink-0">
                  <ShoppingBag className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-foreground">
                    Add KES {amountToFreeDelivery.toLocaleString()} more
                  </p>
                  <p className="text-xs text-foreground/60 mt-0.5">to get free delivery!</p>
                </div>
                <span className="text-xs font-semibold text-primary">
                  KES {amountToFreeDelivery.toLocaleString()} to go
                </span>
              </div>
              <div className="mt-3 h-2 bg-white rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${deliveryProgress}%` }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                  className="h-full bg-primary rounded-full"
                />
              </div>
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white border border-border rounded-2xl p-4"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-primary/5 rounded-lg flex items-center justify-center">
                    <ShoppingBag className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-sm text-foreground/70">Subtotal</span>
                </div>
                <span className="font-semibold text-foreground">KES {subtotal.toLocaleString()}</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-primary/5 rounded-lg flex items-center justify-center">
                    <Truck className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-sm text-foreground/70">Delivery Fee</span>
                </div>
                <span className="font-semibold text-foreground">KES {deliveryFee.toLocaleString()}</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-primary/5 rounded-lg flex items-center justify-center">
                    <Percent className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-sm text-foreground/70">Service Fee</span>
                </div>
                <span className="font-semibold text-foreground">KES {serviceFee.toLocaleString()}</span>
              </div>

              <div className="border-t border-border pt-3 mt-3">
                <div className="flex items-center justify-between">
                  <span className="text-base font-bold text-foreground">Total</span>
                  <span className="text-lg font-bold text-primary">KES {total.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white border border-border rounded-2xl p-4"
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-primary/5 rounded-full flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-primary font-semibold mb-0.5">Deliver to</p>
                <h4 className="text-sm font-bold text-foreground">Westlands, Nairobi</h4>
                <p className="text-xs text-foreground/60 mt-1">
                  Estimated delivery time <span className="text-primary font-medium">~25 mins</span>
                </p>
              </div>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => navigate('/vendor/location-picker', { state: { returnTo: '/cart' } })}
                className="p-2 text-foreground/40 hover:text-foreground transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </motion.button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
            className="bg-white border border-border rounded-2xl p-4"
          >
            <label htmlFor="order-notes" className="block text-sm font-semibold text-foreground mb-2">
              Order notes
            </label>
            <textarea
              id="order-notes"
              value={orderNotes}
              onChange={(event) => setOrderNotes(event.target.value)}
              placeholder="Add delivery instructions, substitutions, or any special requests..."
              rows={4}
              className="w-full resize-none rounded-2xl border border-border bg-white px-4 py-3 text-sm text-foreground placeholder:text-foreground/40 outline-none transition-colors focus:border-primary"
            />
            <p className="mt-2 text-xs text-foreground/50">
              Optional. Helpful for delivery or item preferences.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="pt-1"
          >
            <Button
              onClick={() => navigate('/customer/', { state: { orderNotes } })}
              className="w-full h-14 bg-primary hover:bg-primary/90 text-white rounded-2xl text-lg font-bold shadow-lg shadow-primary/30 flex items-center justify-center gap-2"
            >
              Checkout • KES {total.toLocaleString()}
            </Button>
          </motion.div>
        </div>
      </main>

      {/* --- Bottom Navigation --- */}
      <BottomNav cartCount={cartCount} />

    </div>
  );
};