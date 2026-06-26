# Implementation Plan - Order Live Geolocation Tracking & Camera Proof-of-Delivery

Implement background geolocation tracking of the rider during order shipment and capture/upload proof-of-delivery pictures using Capacitor Camera. All API calls will interact directly with the backend via `axiosInstance`.

## Proposed Changes

### 1. API Endpoints
#### [MODIFY] [api.ts](file:///home/bonface/Desktop/Projects/Systems/kerigo/kerigoApp/lib/api.ts)
- Add `updateOrderRoute(orderID: string, latitude: number, longitude: number)` to hit `PATCH /orders/{id}/route` using `axiosInstance.patch`.
- Add `uploadOrderResource(orderID: string, uploadKey: string, file: Blob | File)` to hit `POST /orders/upload-resource/{id}` using `axiosInstance.post` with `multipart/form-data`.

### 2. Background Geolocation Service
#### [NEW] [backgroundGeolocation.ts](file:///home/bonface/Desktop/Projects/Systems/kerigo/kerigoApp/src/lib/backgroundGeolocation.ts)
- Initialize and configure `@transistorsoft/capacitor-background-geolocation` with a distance filter (set to 5000 meters for 5km by default, adjustable via a constant).
- Set up an `onLocation` listener that extracts the current active order ID from `localStorage` and posts coordinates to `updateOrderRoute`.
- Export `startTracking(orderId)` and `stopTracking()` helpers.

### 3. App Initialization
#### [MODIFY] [App.tsx](file:///home/bonface/Desktop/Projects/Systems/kerigo/kerigoApp/src/App.tsx)
- Call background geolocation setup/ready handler during app mount so it is active.

### 4. Rider Delivery Flows
#### [MODIFY] [MarkAsPickedUpPage.tsx](file:///home/bonface/Desktop/Projects/Systems/kerigo/kerigoApp/src/pages/rider/MarkAsPickedUpPage.tsx)
- Start background tracking when order is marked as `'on_the_way'`.

#### [MODIFY] [MarkAsDeliveredPage.tsx](file:///home/bonface/Desktop/Projects/Systems/kerigo/kerigoApp/src/pages/rider/MarkAsDeliveredPage.tsx)
- Stop background tracking when order is marked as `'delivered'`.
- Integrate `@capacitor/camera` to capture photo proof or select from gallery. Show a preview of the photo with a clear button.
- Upload captured photo via `uploadOrderResource` under the uploadKey `'proofOfDelivery'` before finalizing the delivery.

### 5. Customer Track Order
#### [MODIFY] [TrackOrder.tsx](file:///home/bonface/Desktop/Projects/Systems/kerigo/kerigoApp/src/pages/customer/TrackOrder.tsx)
- Dynamically extract rider, store, and destination coordinates from the order object supporting both legacy and nested properties, and draw the Leaflet tracking polyline correctly.

## Verification Plan

### Automated/Type Verification
- Run `npx tsc --noEmit` to ensure type safety.

### Manual Verification
- Simulate coordinate updates and ensure they appear on the customer track order page.
- Trigger camera capture and upload to confirm proof of delivery integration.
