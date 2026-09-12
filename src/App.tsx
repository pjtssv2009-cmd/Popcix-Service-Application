/**
 * POPCIX Unified App Root Component
 * Seamlessly integrates both POPCIX Customer App and POPCIX PRO Mobile App.
 * Handles native mobile initialization, animated brand splash launch sequence,
 * and high-speed role switching.
 */

import React, { useEffect, useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import { GamificationProvider } from './context/GamificationContext';
import { MarketplaceProvider } from './context/MarketplaceContext';
import { ProAuthProvider } from './context/ProAuthContext';
import { ProGamificationProvider } from './context/ProGamificationContext';
import { ProMarketplaceProvider } from './context/ProMarketplaceContext';
import { DeviceFrame } from './components/common/DeviceFrame';
import { AppNavigator } from './navigation/AppNavigator';
import { ProAppNavigator } from './navigation/ProAppNavigator';
import { SplashScreen } from './components/common/SplashScreen';
import { initializeNativeApp } from './services/nativeMobile';

export function App() {
  const [showSplash, setShowSplash] = useState<boolean>(true);
  const [appMode, setAppMode] = useState<'CUSTOMER' | 'PRO'>(() => {
    try {
      const saved = localStorage.getItem('popcix_app_mode');
      if (saved === 'PRO' || saved === 'CUSTOMER') return saved;
    } catch (e) {
      console.warn('Failed to read app mode', e);
    }
    return 'PRO'; // Default to POPCIX PRO for immediate demonstration
  });

  useEffect(() => {
    // Initialize native status bar, permissions, and capacitor services
    initializeNativeApp().catch(console.error);
  }, []);

  const handleSwitchMode = (mode: 'CUSTOMER' | 'PRO') => {
    setAppMode(mode);
    try {
      localStorage.setItem('popcix_app_mode', mode);
    } catch (e) {
      console.error('Failed to save app mode', e);
    }
  };

  return (
    <ProAuthProvider>
      <ProGamificationProvider>
        <ProMarketplaceProvider>
          <AuthProvider>
            <GamificationProvider>
              <MarketplaceProvider>
                {showSplash && <SplashScreen onFinish={() => setShowSplash(false)} />}
                <DeviceFrame>
                  {appMode === 'PRO' ? (
                    <ProAppNavigator
                      onSwitchToCustomerApp={() => handleSwitchMode('CUSTOMER')}
                    />
                  ) : (
                    <div className="flex flex-col h-full relative">
                      {/* Top Pro Switcher Pill in Customer App for easy testing */}
                      <div className="bg-[#000000] text-white px-3 py-1 text-[11px] font-bold flex items-center justify-between shrink-0 z-40">
                        <span>POPCIX Customer Mode</span>
                        <button
                          onClick={() => handleSwitchMode('PRO')}
                          className="bg-[#FFAA00] text-black px-2 py-0.5 rounded-md font-extrabold hover:bg-yellow-400"
                        >
                          Switch to POPCIX PRO ⚡
                        </button>
                      </div>
                      <div className="flex-1 flex flex-col overflow-hidden">
                        <AppNavigator />
                      </div>
                    </div>
                  )}
                </DeviceFrame>
              </MarketplaceProvider>
            </GamificationProvider>
          </AuthProvider>
        </ProMarketplaceProvider>
      </ProGamificationProvider>
    </ProAuthProvider>
  );
}

export default App;
