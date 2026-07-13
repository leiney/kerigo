import { BackgroundGeolocation } from '@capgo/background-geolocation';
import { CapacitorHttp } from '@capacitor/core';
import { productApi } from '@/lib/api';

let isTrackingActive = false;
let currentOrderId: string | null = null;

export const TRACKING_DISTANCE_FILTER_METERS = 100; // GPS triggers after moving 10 meters

export const startDeliveryTracking = async (orderId: string): Promise<void> => {
  try {
    if (isTrackingActive) {
      await stopDeliveryTracking();
    }

    currentOrderId = orderId;
    isTrackingActive = true;

    console.log(`[BackgroundGeolocation] Starting tracking for order: ${orderId}`);

    await BackgroundGeolocation.start({
      backgroundTitle: "Delivery Route Active",
      backgroundMessage: "Your coordinates are streaming live to the delivery system.",
      requestPermissions: true,
      stale: false,
      distanceFilter: TRACKING_DISTANCE_FILTER_METERS,
    }, async (location, error) => {
      if (error || !location || !isTrackingActive || !currentOrderId) {
        return;
      }

      const payload = {
        orderId: currentOrderId,
        latitude: location.latitude,
        longitude: location.longitude,
        timestamp: new Date().getTime(),
      };

      try {
        const response = await CapacitorHttp.post({
          url: `${process.env.VITE_API_BASE_URL || 'http://localhost:8000'}/orders/${currentOrderId}/route`,
          headers: { 'Content-Type': 'application/json' },
          data: payload,
        });

        if (response.status === 200) {
          console.log(`[BackgroundGeolocation] Location sent for order ${currentOrderId}`);
          await flushOfflineQueue();
        } else {
          throw new Error("Server rejected data");
        }
      } catch (netError) {
        console.log('[BackgroundGeolocation] Network error, saving to offline queue');
        await saveToOfflineQueue(payload);
      }
    });

    console.log(`[BackgroundGeolocation] Tracking started successfully for order: ${orderId}`);
  } catch (error) {
    console.error('[BackgroundGeolocation] Failed to start tracking:', error);
    isTrackingActive = false;
    currentOrderId = null;
    throw error;
  }
};

export const stopDeliveryTracking = async (): Promise<void> => {
  try {
    isTrackingActive = false;
    const orderId = currentOrderId;
    currentOrderId = null;

    await BackgroundGeolocation.stop();
    console.log(`[BackgroundGeolocation] Tracking stopped for order: ${orderId}`);

    await flushOfflineQueue();
  } catch (error) {
    console.error('[BackgroundGeolocation] Error stopping tracking:', error);
  }
};

export const isTracking = (): boolean => {
  return isTrackingActive;
};

export const getCurrentTrackingOrderId = (): string | null => {
  return currentOrderId;
};

const saveToOfflineQueue = async (data: Record<string, unknown>): Promise<void> => {
  try {
    const currentQueue = JSON.parse(localStorage.getItem('offline_locations') || '[]');
    currentQueue.push(data);
    localStorage.setItem('offline_locations', JSON.stringify(currentQueue));
    console.log(`[BackgroundGeolocation] Saved location to offline queue. Queue size: ${currentQueue.length}`);
  } catch (error) {
    console.error('[BackgroundGeolocation] Failed to save to offline queue:', error);
  }
};

const flushOfflineQueue = async (): Promise<void> => {
  try {
    const queue = JSON.parse(localStorage.getItem('offline_locations') || '[]');
    if (queue.length === 0) return;

    console.log(`[BackgroundGeolocation] Flushing ${queue.length} offline locations`);

    const response = await CapacitorHttp.post({
      url: `${process.env.VITE_API_BASE_URL || 'http://localhost:8000'}/orders/${currentOrderId || 'unknown'}/route/batch`,
      headers: { 'Content-Type': 'application/json' },
      data: { positions: queue },
    });

    if (response.status === 200) {
      localStorage.removeItem('offline_locations');
      console.log(`[BackgroundGeolocation] Offline queue flushed successfully`);
    }
  } catch (error) {
    console.log('[BackgroundGeolocation] Still offline, keeping locations buffered.');
  }
};

export const initBackgroundGeolocation = async (): Promise<void> => {
  try {
    console.log('[BackgroundGeolocation] Initializing...');
    const permissionStatus = await BackgroundGeolocation.checkPermissions();
    console.log('[BackgroundGeolocation] Permission status:', permissionStatus);
  } catch (error) {
    console.error('[BackgroundGeolocation] Initialization error:', error);
  }
};