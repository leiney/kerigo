# Google Play Store Location Permission Descriptions

## App Purpose (500 characters max)
```
Kerigo is a multi-vendor e-commerce platform connecting customers with local stores and delivery riders. Customers browse products, place orders, and track deliveries in real-time. Vendors manage inventory and fulfill orders. Riders deliver orders and share their location for live tracking. The app streamlines the entire delivery process from purchase to doorstep.
```

**Character count: 498** ✓

---

## Location Access (500 characters max)
```
Real-time delivery tracking: When a rider accepts your order, the app continuously shares their location in the background so you can track their journey on the map. This feature shows the rider's current position, estimated arrival time, and complete route from the store to your delivery address. Location tracking stops automatically when the order is delivered or cancelled.
```

**Character count: 497** ✓

---

## Additional Notes

### Why Background Location is Needed:
- Riders need continuous location updates while delivering orders
- Customers view real-time rider position on the map even when the app is in the background
- The background geolocation plugin (`@transistorsoft/capacitor-background-geolocation`) is configured with:
  - `stopOnTerminate: false` - continues tracking if app is closed
  - `startOnBoot: true` - restarts tracking after device reboot
  - High accuracy mode for precise location updates

### Permissions Used:
1. `ACCESS_FINE_LOCATION` - Precise location for rider tracking and navigation
2. `ACCESS_COARSE_LOCATION` - Approximate location as fallback
3. `ACCESS_BACKGROUND_LOCATION` - Continuous tracking during active deliveries

### Key Features Using Location:
1. **Customer Order Tracking** (`TrackOrder.tsx`) - Real-time map showing rider location
2. **Rider Background Tracking** (`backgroundGeolocation.ts`) - Continuous location updates to backend
3. **Rider Navigation** (`RiderDashboard.tsx`) - Opening Google Maps with current location

### Recommendations:
1. Ensure your app's privacy policy clearly explains location data usage
2. Show prominent disclosure before requesting background location permission
3. Only request background location when a rider starts an active delivery
4. Provide clear in-app settings to disable location tracking
5. Consider adding a permission rationale dialog explaining why background location is needed