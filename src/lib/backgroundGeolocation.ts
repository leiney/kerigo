// Background geolocation feature has been removed
// The app now only uses foreground location access for rider navigation
// This file is kept as a placeholder to avoid breaking imports

export const TRACKING_DISTANCE_FILTER_METERS = 5000;

export const initBackgroundGeolocation = async () => {
  console.info('[BackgroundGeolocation] Feature has been removed. Only foreground location access is available.');
};

export const startTracking = async (orderId: string) => {
  console.info('[BackgroundGeolocation] Feature has been removed. Only foreground location access is available.');
};

export const stopTracking = async () => {
  console.info('[BackgroundGeolocation] Feature has been removed. Only foreground location access is available.');
};