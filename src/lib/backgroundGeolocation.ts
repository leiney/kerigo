import { BackgroundGeolocation } from '@capgo/background-geolocation';
import { CapacitorHttp } from '@capacitor/core';
import { productApi } from '@/lib/api';
import { BASE_URL, TENANT_ID } from '@/config';

let isTrackingActive = false;
let currentOrderId: string | null = null;

export const TRACKING_DISTANCE_FILTER_METERS = 1000; // GPS triggers after moving 1000 meters

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
        const token = typeof localStorage !== 'undefined' ? localStorage.getItem('token') : null;
        const headers: Record<string, string> = {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'x-tenant-id': TENANT_ID,
        };
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await CapacitorHttp.patch({
          url: `${BASE_URL}/orders/${currentOrderId}/route`,
          headers,
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

    // Flush offline queue before nullifying currentOrderId
    if (orderId) {
      await flushOfflineQueueForOrder(orderId);
    }
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
  // Use the current order ID if available
  const orderId = currentOrderId;
  if (!orderId) {
    console.log('[BackgroundGeolocation] No active order ID, skipping flush');
    return;
  }
  await flushOfflineQueueForOrder(orderId);
};

const flushOfflineQueueForOrder = async (orderId: string): Promise<void> => {
  try {
    const queue = JSON.parse(localStorage.getItem('offline_locations') || '[]');
    if (queue.length === 0) return;

    console.log(`[BackgroundGeolocation] Flushing ${queue.length} offline locations for order: ${orderId}`);

    const token = typeof localStorage !== 'undefined' ? localStorage.getItem('token') : null;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'x-tenant-id': TENANT_ID,
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await CapacitorHttp.patch({
      url: `${BASE_URL}/orders/${orderId}/route/batch`,
      headers,
      data: { positions: queue },
    });

    if (response.status === 200) {
      localStorage.removeItem('offline_locations');
      console.log(`[BackgroundGeolocation] Offline queue flushed successfully for order: ${orderId}`);
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