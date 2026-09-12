/**
 * POPCIX PRO - Standalone Mobile Application Entrypoint
 * Dedicated to Service Professionals, Technicians, and Contractors.
 */

import React, { useEffect, useState } from 'react';
import { ProAuthProvider } from './context/ProAuthContext';
import { ProGamificationProvider } from './context/ProGamificationContext';
import { ProMarketplaceProvider } from './context/ProMarketplaceContext';
import { DeviceFrame } from './components/common/DeviceFrame';
import { ProAppNavigator } from './navigation/ProAppNavigator';
import { SplashScreen } from './components/common/SplashScreen';
import { initializeNativeApp } from './services/nativeMobile';

export function App() {
  const [showSplash, setShowSplash] = useState<boolean>(true);

  useEffect(() => {
    // Initialize native status bar, permissions, and capacitor services
    initializeNativeApp().catch(console.error);
  }, []);

  return (
    <ProAuthProvider>
      <ProGamificationProvider>
        <ProMarketplaceProvider>
          {showSplash && <SplashScreen onFinish={() => setShowSplash(false)} />}
          <DeviceFrame>
            <ProAppNavigator />
          </DeviceFrame>
        </ProMarketplaceProvider>
      </ProGamificationProvider>
    </ProAuthProvider>
  );
}

export default App;
