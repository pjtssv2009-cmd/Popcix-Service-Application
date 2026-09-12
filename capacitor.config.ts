import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'in.popcix.pro',
  appName: 'POPCIX PRO',
  webDir: 'dist',
  plugins: {
    SplashScreen: {
      launchShowDuration: 1200,
      launchAutoHide: true,
      launchFadeOutDuration: 300,
      backgroundColor: '#000000',
      androidSplashResourceName: 'splash',
      androidScaleType: 'CENTER_CROP',
      showSpinner: false,
      splashFullScreen: true,
      splashImmersive: true
    },
    StatusBar: {
      style: 'DARK',
      backgroundColor: '#FFFFFF',
      overlaysWebView: false
    },
    LocalNotifications: {
      smallIcon: 'ic_launcher_foreground',
      iconColor: '#000000',
      sound: 'beep.wav'
    }
  },
  android: {
    allowMixedContent: true,
    captureInput: true,
    webContentsDebuggingEnabled: false
  }
};

export default config;
