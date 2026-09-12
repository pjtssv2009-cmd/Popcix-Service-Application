/**
 * POPCIX App Root - Multi-Platform Orchestrator
 * Supports:
 * 1. POPCIX ADMIN - Operations Web Dashboard
 * 2. POPCIX PRO - Professional Mobile Application
 * Automatically boots into POPCIX ADMIN or POPCIX PRO based on environment / URL / user toggle.
 */

import React, { useEffect, useState } from 'react';
import { ProAuthProvider } from './context/ProAuthContext';
import { ProGamificationProvider } from './context/ProGamificationContext';
import { ProMarketplaceProvider } from './context/ProMarketplaceContext';
import { AdminAuthProvider } from './admin/context/AdminAuthContext';
import { AdminDataProvider } from './admin/context/AdminDataContext';
import { AdminNavigator } from './admin/navigation/AdminNavigator';
import { DeviceFrame } from './components/common/DeviceFrame';
import { ProAppNavigator } from './navigation/ProAppNavigator';
import { SplashScreen } from './components/common/SplashScreen';
import { initializeNativeApp, isNative } from './services/nativeMobile';

export function App() {
  const [showSplash, setShowSplash] = useState<boolean>(true);
  const [platformMode, setPlatformMode] = useState<'ADMIN' | 'PRO'>(() => {
    // Check URL parameters for direct admin routing (e.g. ?admin=true or #admin)
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('admin') === 'true' || window.location.hash.includes('admin')) {
        return 'ADMIN';
      }
      const saved = localStorage.getItem('popcix_platform_mode');
      if (saved === 'ADMIN' || saved === 'PRO') return saved;
      // If running on desktop browser, default to ADMIN; if on mobile/native, default to PRO
      return isNative ? 'PRO' : 'ADMIN';
    }
    return 'ADMIN';
  });

  useEffect(() => {
    // Initialize native status bar, permissions, and capacitor services
    initializeNativeApp().catch(console.error);
  }, []);

  const handleSwitchMode = (mode: 'ADMIN' | 'PRO') => {
    setPlatformMode(mode);
    try {
      localStorage.setItem('popcix_platform_mode', mode);
    } catch {}
  };

  return (
    <AdminAuthProvider>
      <AdminDataProvider>
        <ProAuthProvider>
          <ProGamificationProvider>
            <ProMarketplaceProvider>
              {platformMode === 'ADMIN' ? (
                <AdminNavigator
                  onSwitchToProMobile={() => handleSwitchMode('PRO')}
                />
              ) : (
                <>
                  {showSplash && <SplashScreen onFinish={() => setShowSplash(false)} />}
                  <div className="flex flex-col h-full relative">
                    {/* Top Switcher Bar to jump back to Admin Dashboard */}
                    <div className="bg-[#000000] text-white px-3 py-1.5 text-[11px] font-bold flex items-center justify-between shrink-0 z-50">
                      <span>POPCIX PRO Mobile Preview</span>
                      <button
                        onClick={() => handleSwitchMode('ADMIN')}
                        className="bg-[#FFAA00] text-black px-2.5 py-0.5 rounded-md font-extrabold hover:bg-yellow-400 transition-colors"
                      >
                        ← Return to POPCIX ADMIN Dashboard
                      </button>
                    </div>
                    <div className="flex-1 flex flex-col overflow-hidden">
                      <DeviceFrame>
                        <ProAppNavigator />
                      </DeviceFrame>
                    </div>
                  </div>
                </>
              )}
            </ProMarketplaceProvider>
          </ProGamificationProvider>
        </ProAuthProvider>
      </AdminDataProvider>
    </AdminAuthProvider>
  );
}

export default App;
