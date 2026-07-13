in vendor payment paage include custom one when open custom it opens page for custom payments which only has textarea with payement instuctions like

Go to Safaricom Menu
Select M-PESA
Select Lipa na MPESA
Select Pay Bill
Enter Business No: 777222
Enter Account No: 4177108
Enter Amount (without commas): 1500
then Confirm
Enter the transaction code you received from 



on order details include rider details like name and phone like listing page include phone so customer can call rider


in rider mark as delivered you can include sending of image we will let the rider take a picture and send to backend


"plugins": {
  "BackgroundGeolocation": {
    "android": {
      "notificationTitle": "Delivery App",
      "notificationText": "Tracking active for delivery",
      "notificationIcon": "mipmap/ic_launcher",
      "serviceType": "location" 
    }
  }
}
import { BackgroundGeolocation } from '@capgo/background-geolocation';
import { CapacitorHttp } from '@capacitor/core';

// Internal tracking state
let isTrackingActive = true;

export const startDeliveryTracking = async (orderId) => {
  isTrackingActive = true;

  await BackgroundGeolocation.start({
    backgroundTitle: "Delivery Route Active",
    backgroundMessage: "Your coordinates are streaming live to the delivery system.",
    requestPermissions: true,
    stale: false,
    distanceFilter: 10 // GPS triggers only after moving 10 meters
  }, async (location, error) => {
    
    if (error || !location || !isTrackingActive) return;

    const payload = {
      orderId: orderId,
      latitude: location.latitude,
      longitude: location.longitude,
      timestamp: new Date().getTime()
    };

    try {
      // ⚡ CRITICAL: Use CapacitorHttp to bypass 5-minute background web throttling
      const response = await CapacitorHttp.post({
        url: 'https://yourdomain.com',
        headers: { 'Content-Type': 'application/json' },
        data: payload
      });

      if (response.status === 200) {
        // Successfully sent! Now flush any stored offline locations if they exist
        await flushOfflineQueue();
      } else {
        throw new Error("Server rejected data");
      }
    } catch (netError) {
      // Network failed or device is offline: save location locally
      await saveToOfflineQueue(payload);
    }
  });
};

// Stop tracking and clean up
export const stopDeliveryTracking = async () => {
  isTrackingActive = false;
  await BackgroundGeolocation.stop();
  await flushOfflineQueue(); // Final attempt to send remaining offline data
};

// --- Offline Storage Logic ---
const saveToOfflineQueue = async (data) => {
  const currentQueue = JSON.parse(localStorage.getItem('offline_locations') || '[]');
  currentQueue.push(data);
  localStorage.setItem('offline_locations', JSON.stringify(currentQueue));
};

const flushOfflineQueue = async () => {
  const queue = JSON.parse(localStorage.getItem('offline_locations') || '[]');
  if (queue.length === 0) return;

  try {
    const response = await CapacitorHttp.post({
      url: 'https://yourdomain.com',
      headers: { 'Content-Type': 'application/json' },
      data: { positions: queue }
    });

    if (response.status === 200) {
      localStorage.removeItem('offline_locations'); // Clear queue on success
    }
  } catch (e) {
    console.log("Still offline, keeping locations buffered.");
  }
};

