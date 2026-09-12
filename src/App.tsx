/**
 * POPCIX App Root Component
 * Handles native mobile initialization, animated brand splash launch sequence,
 * and context orchestration.
 */

import React, { useEffect, useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import { GamificationProvider } from './context/GamificationContext';
import { MarketplaceProvider } from './context/MarketplaceContext';
import { DeviceFrame } from './components/common/DeviceFrame';
import { AppNavigator } from './navigation/AppNavigator';
import { SplashScreen } from './components/common/SplashScreen';
import { initializeNativeApp } from './services/nativeMobile';

export function App() {
  const [showSplash, setShowSplash] = useState<boolean>(true);

  useEffect(() => {
    // Initialize native status bar, permissions, and capacitor services
    initializeNativeApp().catch(console.error);
  }, []);

  return (
    <AuthProvider>
      <GamificationProvider>
        <MarketplaceProvider>
          {showSplash && <SplashScreen onFinish={() => setShowSplash(false)} />}
          <DeviceFrame>
            <AppNavigator />
          </DeviceFrame>
        </MarketplaceProvider>
      </GamificationProvider>
    </AuthProvider>
  );
}

export default App;
