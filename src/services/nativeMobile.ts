/**
 * POPCIX Native Mobile Bridge & Hardware Services
 * Provides direct integration with Capacitor Plugins (Splash, StatusBar, Haptics, Geolocation, Camera, Local Notifications, Hardware Back Button, Network).
 */

import { Capacitor } from '@capacitor/core';
import { SplashScreen } from '@capacitor/splash-screen';
import { StatusBar, Style } from '@capacitor/status-bar';
import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics';
import { Geolocation } from '@capacitor/geolocation';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { LocalNotifications } from '@capacitor/local-notifications';
import { App as CapApp } from '@capacitor/app';
import { Network } from '@capacitor/network';

export const isNative = Capacitor.isNativePlatform();

/**
 * Initialize native device capabilities on app startup
 */
export async function initializeNativeApp() {
  if (!isNative) return;

  try {
    // 1. Configure Status Bar
    await StatusBar.setStyle({ style: Style.Light });
    await StatusBar.setBackgroundColor({ color: '#FFFFFF' });
  } catch (err) {
    console.debug('StatusBar init error:', err);
  }

  try {
    // 2. Request Notification Permissions
    const notifStatus = await LocalNotifications.checkPermissions();
    if (notifStatus.display !== 'granted') {
      await LocalNotifications.requestPermissions();
    }
  } catch (err) {
    console.debug('Notification permission check:', err);
  }

  try {
    // 3. Hide Native Splash Screen after slight buffer for seamless transition
    setTimeout(async () => {
      try {
        await SplashScreen.hide({ fadeOutDuration: 400 });
      } catch {
        // Ignore if already hidden
      }
    }, 600);
  } catch (err) {
    console.debug('Splash screen hide error:', err);
  }
}

/**
 * Trigger native mobile haptics
 */
export async function nativeHaptic(
  type: 'light' | 'medium' | 'heavy' | 'success' | 'warning' | 'error' | 'selection' = 'light'
) {

  if (isNative) {
    try {
      switch (type) {
        case 'light':
          await Haptics.impact({ style: ImpactStyle.Light });
          break;
        case 'medium':
          await Haptics.impact({ style: ImpactStyle.Medium });
          break;
        case 'heavy':
          await Haptics.impact({ style: ImpactStyle.Heavy });
          break;
        case 'success':
          await Haptics.notification({ type: NotificationType.Success });
          break;
        case 'warning':
          await Haptics.notification({ type: NotificationType.Warning });
          break;
        case 'error':
          await Haptics.notification({ type: NotificationType.Error });
          break;
        case 'selection':
          await Haptics.selectionStart();
          break;
      }
      return;
    } catch {
      // Fall back to web vibration
    }
  }

  // Web Vibration API Fallback
  if (typeof window !== 'undefined' && 'vibrate' in navigator) {
    try {
      switch (type) {
        case 'light':
        case 'selection':
          navigator.vibrate(10);
          break;
        case 'medium':
          navigator.vibrate(22);
          break;
        case 'heavy':
          navigator.vibrate(35);
          break;
        case 'success':
          navigator.vibrate([20, 50, 25]);
          break;
        case 'warning':
          navigator.vibrate([30, 60, 30]);
          break;
        case 'error':
          navigator.vibrate([50, 50, 50, 50]);
          break;
      }
    } catch {
      // ignore
    }
  }
}

export const triggerHaptic = nativeHaptic;

/**
 * Get accurate current user location using GPS or Browser API
 */
export async function getCurrentUserLocation(): Promise<{
  address: string;
  latitude: number;
  longitude: number;
  city: string;
}> {
  let lat = 12.9716;
  let lng = 77.5946;

  try {
    if (isNative) {
      const perm = await Geolocation.checkPermissions();
      if (perm.location !== 'granted') {
        await Geolocation.requestPermissions();
      }
      const pos = await Geolocation.getCurrentPosition({ enableHighAccuracy: true, timeout: 8000 });
      lat = pos.coords.latitude;
      lng = pos.coords.longitude;
    } else if (navigator.geolocation) {
      const pos = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 6000 });
      });
      lat = pos.coords.latitude;
      lng = pos.coords.longitude;
    }
  } catch (e) {
    console.debug('Geolocation fallback used:', e);
  }

  // Reverse geocode via OpenStreetMap Nominatim with fast fallback
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
      { headers: { 'User-Agent': 'POPCIX-Mobile/1.0' } }
    );
    if (res.ok) {
      const data = await res.json();
      const addr = data.address || {};
      const neighbourhood = addr.suburb || addr.neighbourhood || addr.residential || addr.road || 'Downtown';
      const city = addr.city || addr.town || addr.state_district || 'Bangalore';
      const fullAddress = `${neighbourhood}, ${city}`;
      return { address: fullAddress, latitude: lat, longitude: lng, city };
    }
  } catch {
    // Fallback if offline
  }

  return {
    address: '42 Orchid Heights, 80 Feet Road, 4th Block, Koramangala',
    latitude: lat,
    longitude: lng,
    city: 'Bangalore'
  };
}

/**
 * Take a photo with Camera or pick from Gallery
 */
export async function takeServicePhoto(): Promise<string | null> {
  try {
    if (isNative) {
      const photo = await Camera.getPhoto({
        quality: 85,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Prompt,
        saveToGallery: false
      });
      return photo.dataUrl || null;
    }
  } catch (err) {
    console.debug('Native camera error or dismissed:', err);
  }

  // Web fallback file picker
  return new Promise((resolve) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.capture = 'environment';
    input.onchange = (e: Event) => {
      const target = e.target as HTMLInputElement;
      const file = target.files?.[0];
      if (!file) {
        resolve(null);
        return;
      }
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => resolve(null);
      reader.readAsDataURL(file);
    };
    input.click();
  });
}

/**
 * Schedule a native system notification
 */
export async function sendLocalNotification(title: string, body: string, id: number = Math.floor(Math.random() * 100000)) {
  if (isNative) {
    try {
      await LocalNotifications.schedule({
        notifications: [
          {
            title,
            body,
            id,
            schedule: { at: new Date(Date.now() + 500) },
            sound: 'beep.wav',
            smallIcon: 'ic_launcher_foreground',
            actionTypeId: '',
            extra: null
          }
        ]
      });
      return;
    } catch (err) {
      console.debug('Native notification error:', err);
    }
  }

  // Web Notification API fallback
  if (typeof window !== 'undefined' && 'Notification' in window) {
    try {
      if (Notification.permission === 'granted') {
        new Notification(title, { body, icon: '/favicon.ico' });
      } else if (Notification.permission !== 'denied') {
        const perm = await Notification.requestPermission();
        if (perm === 'granted') {
          new Notification(title, { body, icon: '/favicon.ico' });
        }
      }
    } catch {
      // ignore
    }
  }
}

/**
 * Listen for Android Hardware Back Button
 */
export function registerBackButtonHandler(onBack: () => boolean | void) {
  if (!isNative) return () => {};

  const listener = CapApp.addListener('backButton', () => {
    const handled = onBack();
    if (!handled) {
      CapApp.exitApp();
    }
  });

  return () => {
    listener.then(sub => sub.remove()).catch(() => {});
  };
}

/**
 * Monitor network status
 */
export function listenNetworkStatus(onChange: (isOnline: boolean) => void) {
  if (isNative) {
    Network.getStatus().then(s => onChange(s.connected));
    const listener = Network.addListener('networkStatusChange', status => {
      onChange(status.connected);
    });
    return () => {
      listener.then(sub => sub.remove()).catch(() => {});
    };
  } else {
    onChange(navigator.onLine);
    const onOnline = () => onChange(true);
    const onOffline = () => onChange(false);
    window.addEventListener('online', onOnline);
    window.addEventListener('offline', onOffline);
    return () => {
      window.removeEventListener('online', onOnline);
      window.removeEventListener('offline', onOffline);
    };
  }
}
