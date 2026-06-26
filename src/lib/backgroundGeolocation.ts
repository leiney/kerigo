import BackgroundGeolocation from '@transistorsoft/capacitor-background-geolocation';
import { productApi } from '../../lib/api';

//  tracking distance filter in meters 5 kilometers
export const TRACKING_DISTANCE_FILTER_METERS = 5000;

const isProductionBuild = import.meta.env.PROD;

export const initBackgroundGeolocation = async () => {
  if (!isProductionBuild) {
    console.info('[BackgroundGeolocation] Skipping initialization in development build to avoid the debug-license prompt.');
    return;
  }

  //  Set up the onLocation listener
  BackgroundGeolocation.onLocation(async (location) => {
    console.log('[BackgroundGeolocation] onLocation event:', location);
    const activeOrderId = localStorage.getItem('active_tracking_order_id');
    if (!activeOrderId) {
      console.warn('[BackgroundGeolocation] No active tracking order ID in localStorage, skipping route update.');
      return;
    }

    try {
      const { latitude, longitude } = location.coords;
      await productApi.updateOrderRoute(activeOrderId, latitude, longitude);
      console.log(`[BackgroundGeolocation] Updated route coordinates for order ${activeOrderId}: ${latitude}, ${longitude}`);
    } catch (error) {
      console.error('[BackgroundGeolocation] Failed to update order route:', error);
    }
  });

  // 2. Ready the plugin
  try {
    const state = await BackgroundGeolocation.ready({
      geolocation: {
        desiredAccuracy: BackgroundGeolocation.DesiredAccuracy.High,
        distanceFilter: TRACKING_DISTANCE_FILTER_METERS,
        disableLocationAuthorizationAlert: true,
      },
      app: {
        stopOnTerminate: false,
        startOnBoot: true,
      },
      logger: {
        debug: false,
        logLevel: BackgroundGeolocation.LogLevel.Off,
      },
    });
    console.log('[BackgroundGeolocation] Plugin is ready:', state);
  } catch (error) {
    console.error('[BackgroundGeolocation] Failed to initialize plugin:', error);
  }
};

export const startTracking = async (orderId: string) => {
  if (!isProductionBuild) {
    console.info('[BackgroundGeolocation] Skipping tracking start in development build.');
    return;
  }

  console.log(`[BackgroundGeolocation] Starting tracking for order: ${orderId}`);
  localStorage.setItem('active_tracking_order_id', orderId);
  try {
    const state = await BackgroundGeolocation.start();
    console.log('[BackgroundGeolocation] Geolocation started successfully:', state);
  } catch (error) {
    console.error('[BackgroundGeolocation] Failed to start geolocation tracking:', error);
  }
};

export const stopTracking = async () => {
  if (!isProductionBuild) {
    console.info('[BackgroundGeolocation] Skipping tracking stop in development build.');
    return;
  }

  console.log('[BackgroundGeolocation] Stopping tracking');
  localStorage.removeItem('active_tracking_order_id');
  try {
    const state = await BackgroundGeolocation.stop();
    console.log('[BackgroundGeolocation] Geolocation stopped successfully:', state);
  } catch (error) {
    console.error('[BackgroundGeolocation] Failed to stop geolocation tracking:', error);
  }
};
