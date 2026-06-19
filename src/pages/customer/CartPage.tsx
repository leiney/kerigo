import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button, BottomSheet, Input } from '@stackloop/ui';
import {
  ArrowLeft, Trash2, Minus, Plus, ShoppingBag, Truck, Percent, MapPin, ChevronRight, Home, User
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import BottomNav from '../../components/BottomNav';
import { selectCartCount, selectCartTotal, useCartStore } from '../../store/cartStore';
import { useAuth } from '../../context/AuthContext';
import { customerApi, productApi } from '../../../lib/api';
import type { LocationDetails } from '../../../lib/types';
import { UserProfile } from '@/src/types';
import { StatusModal } from '../../components/shared/StatusModal';

export const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, getStoredUser } = useAuth();

  const cartItems = useCartStore((state) => state.items);
  const pickupLocation = useCartStore((state) => state.pickupLocation);
  const increaseItem = useCartStore((state) => state.increaseItem);
  const decreaseItem = useCartStore((state) => state.decreaseItem);
  const removeItem = useCartStore((state) => state.removeItem);
  const clearCart = useCartStore((state) => state.clearCart);
  const vendorId = useCartStore((state) => state.vendorId);
  const vendorName = useCartStore((state) => state.vendorName);

  const [orderNotes, setOrderNotes] = useState('');
  const [checkoutFullName, setCheckoutFullName] = useState('');
  const [checkoutPhoneNo, setCheckoutPhoneNo] = useState('');
  const [showCheckoutDetailsSheet, setShowCheckoutDetailsSheet] = useState(false);
  const [contactNameError, setContactNameError] = useState('');
  const [contactPhoneError, setContactPhoneError] = useState('');
  const [dropoffLocation, setDropoffLocation] = useState<LocationDetails | null>(null);
  const [shippingInfo, setShippingInfo] = useState<{
    vehicleType: string;
    distanceKm: number;
    estimatedTime: string;
    deliveryFee: number;
    serviceCharge: number;
    charges: number;
  } | null>(null);
  const { login } = useAuth();
  const [shippingLoading, setShippingLoading] = useState(false);
  const [shippingError, setShippingError] = useState<string | null>(null);
  const [hasAttemptedCheckout, setHasAttemptedCheckout] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [statusSheet, setStatusSheet] = useState<{
    isOpen: boolean;
    type: 'success' | 'error' | 'info';
    title: string;
    message: string;
    onAction?: () => void;
  }>({
    isOpen: false,
    type: 'success',
    title: '',
    message: '',
  });

  const subtotal = selectCartTotal(cartItems);
  const cartCount = selectCartCount(cartItems);
  const currentFullName = checkoutFullName || (isAuthenticated ? (user?.fullName ?? (user as any)?.name ?? '') : '');
  const currentPhoneNo = checkoutPhoneNo || (isAuthenticated ? (user?.phoneNo ?? (user as any)?.phone ?? '') : '');
  const missingContactInfo = !currentFullName.trim() || !currentPhoneNo.trim();

  const dropoffLocationError = !dropoffLocation ? 'Delivery location is required.' : '';
  const deliveryFee = shippingInfo?.deliveryFee ?? 0;
  const serviceFee = shippingInfo?.serviceCharge ?? 0;
  const total = subtotal + (shippingInfo?.charges ?? 0);

  const getLocationFromUser = (userData: typeof user): LocationDetails | null => {
    if (!userData) return null;
    const rawLocation =
      (userData as any).extraData?.location ||
      (userData as any).location ||
      (userData as any).locationDetails ||
      (userData as any).otherData?.location ||
      null;

    if (!rawLocation || typeof rawLocation.latitude !== 'number' || typeof rawLocation.longitude !== 'number') {
      return null;
    }

    return {
      latitude: rawLocation.latitude,
      longitude: rawLocation.longitude,
      address: rawLocation.address ?? rawLocation.location ?? '',
      city: rawLocation.city ?? '',
      country: rawLocation.country ?? '',
      postalCode: rawLocation.postalCode ?? rawLocation.postcode ?? '',
    };
  };

  useEffect(() => {
    const state = location.state as { locationDetails?: LocationDetails } | null;
    if (state?.locationDetails) {
      setDropoffLocation(state.locationDetails);
      try {
        localStorage.setItem('checkout-dropoff-location', JSON.stringify(state.locationDetails));
      } catch {
        // nitaignore ignore localStorage errors
      }
      return;
    }

    const profileUser = isAuthenticated ? user ?? getStoredUser() : null;
    const profileLocation = profileUser ? getLocationFromUser(profileUser) : null;

    if (profileLocation) {
      setDropoffLocation(profileLocation);
      return;
    }

    try {
      const stored = localStorage.getItem('checkout-dropoff-location');
      if (stored) {
        const parsed = JSON.parse(stored) as LocationDetails;
        if (parsed?.latitude && parsed?.longitude) {
          setDropoffLocation(parsed);
        }
      }
    } catch {
      //nitaignore ignore invalid storage
    }
  }, [location.state, isAuthenticated, user, getStoredUser]);

  const calculateShipping = async () => {
    if (!pickupLocation || !dropoffLocation) {
      setShippingInfo(null);
      return;
    }

    setShippingLoading(true);
    setShippingError(null);

    try {
      const response = await customerApi.calculateShippingRate({
        pickupLocation: {
          latitude: pickupLocation.latitude,
          longitude: pickupLocation.longitude,
        },
        dropoffLocation: {
          latitude: dropoffLocation.latitude,
          longitude: dropoffLocation.longitude,
        },
        vehicleType: 'motorbike',
      });

      setShippingInfo(response);
    } catch (err: any) {
      setShippingError(err?.message ?? 'Unable to calculate shipping rates.');
      setShippingInfo(null);
    } finally {
      setShippingLoading(false);
    }
  };

  useEffect(() => {
    calculateShipping();
  }, [pickupLocation?.latitude, pickupLocation?.longitude, dropoffLocation?.latitude, dropoffLocation?.longitude]);

  
  const isCheckoutEnabled = !!subtotal && !!dropoffLocation && !!pickupLocation && !checkoutLoading;

  const handleCheckout = async () => {
    setHasAttemptedCheckout(true);

    if (!dropoffLocation) {
      return;
    }

    if (missingContactInfo) {
      setShowCheckoutDetailsSheet(true);
      return;
    }

    if (!pickupLocation || !shippingInfo) {
      return;
    }

    setCheckoutLoading(true);

    

    const payload = {
      fullName: currentFullName,
      phoneNo: currentPhoneNo,
      location: dropoffLocation,
      channel: 'sms',
      order: {
        orderNo: '',
        customer: {
          name: currentFullName,
        },
        orderDate: new Date().toISOString(),
        tax: 0,        
        subTotal: subtotal,
        total: subtotal + shippingInfo.charges,
        shippingCharges: shippingInfo.charges,
        orderItems: cartItems.map((item) => ({
          productID: item.productID ?? item.id,
          variantID: item.variantID ?? item.productID ?? item.id,
          quantity: item.quantity,
          taxes: [],
          itemTax: 0,
        })),
        paymentStatus: 'pending',
        paymentMethod: 'mpesa',
        orderStatus: 'new',
        extraData: {
          orderNotes,
          paymentInfo: {
            phoneNo: currentPhoneNo,
            receiptNo: '',
            accountReference: '',
          },
          vendor: {
            id: vendorId || cartItems[0]?.vendorId || 'id',
            name: vendorName || cartItems[0]?.vendorName || 'VENDOR_NAME',
          }
        },
      },
    };

    try {
      const response = await productApi.submitSignupOrder(payload);
       
      
     if (!user){
        const user: UserProfile = {
          id: response.user.id,
          fullName: response.user.fullName || "",
          email: response.user.email,
          phoneNo: response.user.phoneNo || "",
          userType: "customer",
          username: response.user.username || "",
          extraData: response.user.extraData || {},
        };
                
        login({ token: response?.user.token || '', user });            

     }
      
      setStatusSheet({
        isOpen: true,
        type: 'success',
        title: 'Order Placed!',
        message: 'Your order has been submitted successfully.',
        onAction: () => {
          setStatusSheet((prev) => ({ ...prev, isOpen: false }));
          clearCart();
          setOrderNotes('');
          setShippingInfo(null);
          navigate('/customer/');
        },
      });
    } catch (err: any) {
      console.error('Checkout error:', err);
    } finally {
      setCheckoutLoading(false);
    }
  };

  if (!cartItems.length) {
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
            <Button className="mt-5 w-full h-12 rounded-2xl font-bold" onClick={() => navigate('/')}>
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
                    <p className="text-sm text-primary font-semibold">KES {item.price.toLocaleString()} each</p>

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


          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white border border-border rounded-2xl p-4"
          >
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="w-10 h-10 bg-primary/5 rounded-full flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-primary font-semibold mb-0.5">Delivery location</p>
                    <p className="text-sm font-bold text-foreground truncate">
                      {dropoffLocation
                        ? dropoffLocation.address || `${dropoffLocation.city || ''}${dropoffLocation.city && dropoffLocation.country ? ', ' : ''}${dropoffLocation.country || ''}`
                        : 'No delivery location selected'}
                    </p>
                    <p className="text-xs text-foreground/60 mt-1 truncate">
                      {dropoffLocation
                        ? [dropoffLocation.city, dropoffLocation.country].filter(Boolean).join(', ')
                        : 'Select a dropoff location before checkout.'}
                    </p>
                  </div>
                </div>

                {dropoffLocation ? (
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate('/vendor/location-picker', { state: { returnTo: '/cart', locationDetails: dropoffLocation } })}
                    className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center hover:bg-primary/15 transition-colors"
                    aria-label="Change delivery location"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </motion.button>
                ) : null}
              </div>

              {!dropoffLocation ? (
                <Button
                  variant="outline"
                  className="w-full border-border hover:bg-secondary text-foreground font-bold py-3.5 text-sm gap-2"
                  onClick={() => navigate('/vendor/location-picker', { state: { returnTo: '/cart', locationDetails: dropoffLocation } })}
                >
                  <ChevronRight className="w-5 h-5" />
                  Pick Delivery Location
                </Button>
              ) : null}

              {hasAttemptedCheckout && !dropoffLocation ? (
                <p className="text-xs text-error">{dropoffLocationError}</p>
              ) : null}
            </div>
          </motion.div>


          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white border border-border rounded-2xl p-4 space-y-4"
          >
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

            <div className="flex items-center justify-between">
              <span className="text-sm text-foreground/70">Distance</span>
              <span className="text-sm font-semibold text-foreground">{shippingInfo ? `${shippingInfo.distanceKm.toFixed(1)} km` : '-'}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-foreground/70">ETA</span>
              <span className="text-sm font-semibold text-foreground">{shippingInfo?.estimatedTime ?? '-'}</span>
            </div>

            <div className="border-t border-border pt-3 mt-3">
              <div className="flex items-center justify-between">
                <span className="text-base font-bold text-foreground">Total</span>
                <span className="text-lg font-bold text-primary">KES {total.toLocaleString()}</span>
              </div>
            </div>

            {shippingLoading && (
              <p className="text-xs text-foreground/60">Calculating delivery charges...</p>
            )}

            {!shippingLoading && !shippingInfo && pickupLocation && dropoffLocation && (
              <p className="text-xs text-foreground/60">Unable to retrieve delivery charges at this time.</p>
            )}

            {shippingError && (
              <p className="text-xs text-error">{shippingError}</p>
            )}

            {!pickupLocation && (
              <p className="text-xs text-error">Pickup location is missing. Add items from a vendor first.</p>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
            className=""
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
              onClick={handleCheckout}
              loading={checkoutLoading}
              disabled={!isCheckoutEnabled}
              className="w-full h-14 bg-primary hover:bg-primary/90 text-white rounded-2xl text-lg font-bold shadow-lg shadow-primary/30 flex items-center justify-center gap-2"
            >
              Checkout • KES {total.toLocaleString()}
            </Button>
          </motion.div>
        </div>
      </main>



      <BottomSheet
        isOpen={showCheckoutDetailsSheet}
        onClose={() => {
          setShowCheckoutDetailsSheet(false);
          setContactNameError('');
          setContactPhoneError('');
        }}
        animate={false}
        title="Confirm your details"
        className="z-100 bottom-0"
        showCloseButton={false}
      >
        <div className="space-y-4 pb-6">
          <p className="text-sm text-foreground/60">
            Please enter your full name and phone number before checkout.
          </p>
          <Input
            label="Full Name"
            placeholder="Enter your full name"
            value={checkoutFullName}
            onChange={(value) => {
              setCheckoutFullName(String(value));
              setContactNameError('');
            }}
            error={contactNameError}
          />
          <Input
            label="Phone Number"
            placeholder="Enter phone number"
            type="tel"
            inputMode="tel"
            value={checkoutPhoneNo}
            onChange={(value) => {
              setCheckoutPhoneNo(String(value));
              setContactPhoneError('');
            }}
            error={contactPhoneError}
          />
          <div className="space-y-3 pt-2">
            <Button
              className="w-full bg-primary text-white font-bold py-3 rounded-2xl"
              onClick={() => {
                const name = checkoutFullName.trim();
                const phone = checkoutPhoneNo.trim();
                let invalid = false;
                if (!name) {
                  setContactNameError('Full name is required.');
                  invalid = true;
                }
                if (!phone) {
                  setContactPhoneError('Phone number is required.');
                  invalid = true;
                }
                if (invalid) {
                  return;
                }
                setShowCheckoutDetailsSheet(false);
                void handleCheckout();
              }}
            >
              Proceed to Checkout
            </Button>
            <Button
              variant="outline"
              className="w-full border-border text-foreground font-semibold py-3 rounded-2xl"
              onClick={() => setShowCheckoutDetailsSheet(false)}
            >
              Cancel
            </Button>
          </div>
        </div>
      </BottomSheet>

      <StatusModal
        isOpen={statusSheet.isOpen}
        onClose={() => {
          if (statusSheet.type === 'success' && statusSheet.onAction) {
            statusSheet.onAction();
          } else {
            setStatusSheet((prev) => ({ ...prev, isOpen: false }));
          }
        }}
        type={statusSheet.type}
        title={statusSheet.title}
        message={statusSheet.message}
        onAction={statusSheet.onAction}
      />


      {/* --- Bottom Navigation --- */}
      <BottomNav cartCount={cartCount} />

    </div>
  );
};